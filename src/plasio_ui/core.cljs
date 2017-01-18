(ns ^:figwheel-always plasio-ui.core
  (:require [plasio-ui.widgets :as w]
            [plasio-ui.app-widgets :as aw]
            [plasio-ui.history :as history]
            [plasio-ui.state :as plasio-state]
            [om-tools.core :refer-macros [defcomponentk defcomponent]]
            [om-tools.dom :as d]
            [cljs.core.async :as async :refer [<!]]
            [cljs-http.client :as http]
            [goog.string.format]
            [om.core :as om]
            [om.dom :as dom]
            [plasio-ui.util :as util]
            cljsjs.gl-matrix
            [clojure.string :as s]
            [clojure.string :as str])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(enable-console-print!)

;; when this value is true, everytime the app-state atom updates, a snapshot is
;; requested (history) when this is set to false, you may update the app-state
;; without causing a snapshot however the UI  state will still update
(def ^:dynamic ^:private *save-snapshot-on-ui-update* true)

(defn pane-toggler [id]
  (fn [] (plasio-state/toggle-pane! id)))


(def ^:private panes
  [[:switch-resource "Switch Resource" :database aw/switch-resource-pane]
   [:rendering-options "Rendering Options" :cogs aw/rendering-options-pane]
   [:channels "Color Channels" :picture-o aw/channels-pane]
   [:imagery "Imagery Options" :picture-o aw/imagery-pane]
   [:point-manipulation "Point Manipulation" :magic aw/point-manipulation-pane]
   [:inundation-plane "Inundation Plane" :street-view aw/inundation-plane-pane]
   [:information "Information" :info-circle aw/information-pane]
   [:local-settings "Local Settings" :wrench aw/local-settings-pane]
   [:point-info "Point Information" :eye aw/point-info-pane]
   [:reorder-panes "Reorder Panes" :clone :fn plasio-state/rearrange-panels]
   [:search-location "Search for an Address" :search :fn plasio-state/toggle-search-box!]])


(def ^:private all-docked-panes
  [:switch-resource
   :rendering-options
   :channels
   :point-manipulation
   :inundation-plane
   :information
   :point-info
   :local-settings])

(def ^:private top-bar-panes
  #{:search-location})

(defcomponentk app-bar [[:data brand resource-name show-search?] owner]
  (render [_]
    (let [all-panes
          (->> panes
               (keep
                 (fn [[id title icon w f]]
                   (when (top-bar-panes id)
                     {:id id :title title :icon icon :f f})))
               vec)]
      (om/build w/application-bar {:panes         all-panes
                                   :widgets       [{:id "target-location"
                                                    :widget aw/target-location}]
                                   :brand brand
                                   :show-search? show-search?
                                   :resource-name resource-name}))))

(defn coerce-panes [ids]
  (let [as-map (into {}
                     (keep (fn [[id title icon w]]
                             (when (and w
                                        (not= w :fn))
                               [id {:id    id
                                    :title title
                                    :icon  icon
                                    :child w}]))
                          panes))]
    (select-keys as-map ids)))


(defcomponentk floating-panes [[:data panes] owner]
  (render [_]
    (when-let [ps (-> panes coerce-panes vals seq)]
      (d/div {:class "open-panes"}
             (om/build-all w/floating-panel ps {:key :id})))))

(defcomponentk docked-panes [[:data panes] owner]
  (render [_]
    (when-let [ps (-> panes coerce-panes vals seq)]
      (om/build w/docked-widgets
                {:children ps}))))

(defcomponentk hud [owner]
  (render [_]
    (let [root (om/observe owner plasio-state/root)
          settings (:init-params @root)
          ui (om/observe owner plasio-state/ui)
          ui-locals (om/observe owner plasio-state/ui-local-options)
          actions (om/observe owner plasio-state/current-actions)
          op (-> @ui :open-panes set)
          dp (-> @ui :docked-panes set)

          panes-to-hide (set (map keyword (:hiddenPanes settings)))]
      (d/div
        {:class     "plasio-ui"}
        ;; setup render target
        (om/build aw/render-target {:renderer-state @root})

        ;; target location
        #_(om/build aw/target-location {})

        ;; compass
        (when (:showCompass settings)
          (om/build aw/compass {}))

        ;; render all open panes
        #_(om/build floating-panes {:panes (vec op)})

        ;; render all docked panes
        (when (:showPanels settings)
          (println "panes-to-hide:" panes-to-hide)
          (om/build docked-panes {:panes (remove panes-to-hide all-docked-panes)}))

        (om/build aw/logo {})

        ;; build the app bar
        (when (:showApplicationBar settings)
          (let [res-name (or (:resourceName settings)
                             (str (:resource @root) "@" (:server @root)))]
            (om/build app-bar {:brand (:brand settings "speck.ly")
                               :resource-name res-name
                               :show-search? (:showSearch settings)})))

        (when (:search-box-visible? @ui-locals)
          (om/build aw/search-widget {}))

        #_(when-not (empty? @actions)
            (om/build aw/context-menu @actions {:react-key @actions}))))))

(defn bind-system-key-handlers! []
  (.addEventListener js/document
                     "keydown"
                     (fn [e]
                       (let [code (or (.-which e)
                                      (.-keyCode e))]
                         (case code
                           9 (plasio-state/toggle-docker!)
                           nil)))))

(defn determine-default-color-channel [schema rules]
  (let [schema-attrs (->> schema
                          (sequence (comp (map :name)
                                          (map str/lower-case)))
                          set)
        selection (first
                   (keep (fn [[name index]]
                           (when (schema-attrs (str/lower-case name))
                             index))
                         rules))]
    (println "-- ii" schema-attrs selection)
    selection))


(defn startup [div-element options]
  (go
    (let [url-state-settings (when (:useBrowserHistory options)
                               (or (history/current-state-from-query-string) {}))
          local-options (merge options
                               url-state-settings)
          settings local-options]
      ;; merge-with will fail if some of the non-vec settings are available in both
      ;; app-state and settings, we do a simple check to make sure that app-state doesn't
      ;; have what we'd like it to have
      (when-not (:resource @plasio-state/app-state)
        (swap! plasio-state/app-state (fn [st] (merge-with conj st settings))))

      ;; put in initialization paramters
      (swap! plasio-state/app-state assoc :init-params settings)

      ;; make sure the Z bounds are initialized correctly
      #_(let [bounds (:bounds settings)
            zrange [(bounds 2) (bounds 5)]]
        (swap! plasio-state/app-state assoc-in [:ro :zrange] zrange))

      ;; if we don't have any channels, enable the first specified source
      (when-not (seq (get-in @plasio-state/app-state [:ro :channels]))
        (swap! plasio-state/app-state assoc-in [:ro :channels :channel0 :source]
               (first (nth (:colorSources options)
                           (or
                            ;; do we have any channel selection rules?
                            (when-let [rules (:colorChannelRules options)]
                              (determine-default-color-channel (:schema settings) rules))
                            ;; do we have any default color channels specified
                            (:defaultColorChannelIndex options 0))))))

      (println "Startup state: " @plasio-state/app-state)

      ;; if we're supposed to play around with the browser history, start the needed
      ;; watcher
      (when (:useBrowserHistory settings)
        (add-watch plasio-state/app-state "__ui-state-watcher"
                   (fn [_ _ o n]
                     ;; camera causes its own snapshot saving etc.
                     ;; we only concern ourselves with app state here
                     (when (and *save-snapshot-on-ui-update*)
                       (let [all-same? (util/identical-in-paths? (history/all-url-keys) o n)]
                         (when-not all-same?
                           (plasio-state/do-save-current-snapshot)))))))

      (when (:rememberUIState settings)
        (let [state-id (str (:resource settings) "@" (:server settings))]
          ;; some of the local state is persistant, keep it in sync
          (add-watch plasio-state/app-state "__ui-local-state-watcher"
                     (fn [_ _ o n]
                       (let [o' (select-keys o [:ui])
                             n' (select-keys n [:ui])]
                         (when-not (= o' n')
                           (plasio-state/save-local-state! state-id n')))))

          ;; also make sure the state is local state is loaded, but only when
          ;; we're saving state
          (swap! plasio-state/app-state merge (plasio-state/load-local-state state-id))

          ;; certain UI properties are saved off in the URL and for now overrides the default
          ;; state that the user may have locally, we override such properties all over again
          ;; so that our initial state reflects the correct overriden value
          (let [override-keys #{[:ui]}]
            (swap! plasio-state/app-state
                   merge (select-keys url-state-settings override-keys)))))

      ;; history stuff, on pops, we want to merge back the stuff
      (when (:useBrowserHistory settings)
        (history/listen
          (fn [st]
            ;; when poping for history we need to make sure that the update to
            ;; root doesn't cause another state to be pushed onto our history stack
            (binding [*save-snapshot-on-ui-update* false]
              ;; since this is a history pop just update the paths we're interested in
              (om/transact! plasio-state/root
                            #(reduce
                              (fn [s path]
                                (assoc-in s path (get-in st path)))
                              % (history/all-url-keys)))

              ;; there needs to be a better way of restoring camera props
              (when-let [camera (.-activeCamera (:mode-manager @plasio-state/comps))]
                (let [bbox (:bounds @plasio-state/root)]
                  (.deserialize camera (plasio-state/js-camera-props bbox (:camera st)))))))))

      (when (:bindKeyHandlers settings)
        (bind-system-key-handlers!))

      (om/root hud
               plasio-state/app-state
               {:target div-element}))))


(def ^:private default-options
  {:includeExternalDependencies true
   :showPanels true
   :showCompass true
   :showApplicationBar true
   :showSearch true
   :brand "speck.ly"})

(defn- assert-pipeline [{:keys [useBrowserHistory server resource]}]
  ;; when the browser takeover is turned off, we need to make sure
  ;; the user provided us with the pipeline and resource
  ;;
  (when (and (not useBrowserHistory)
             (or (s/blank? server)
                 (s/blank? resource)))
    (throw (js/Error. "When useBrowserHistory is turned off, properties server and resource need to be specified."))))

(defn- assert-google-maps-key [{:keys [showSearch googleMapsAPIKey]}]
  (when (and showSearch
             (s/blank? googleMapsAPIKey))
    (throw (js/Error. "When showSearch is turned on(its on by default), googleMapsAPIKey needs to be specified."))))

(defn- assert-color-sources [{:keys [colorSources]}]
  (if-not (seq colorSources)
    (throw (js/Error. "No colorSources specified, you need at least one."))))


(defn validate-options [options]
  (let [validators [assert-pipeline assert-google-maps-key assert-color-sources]
        new-options (reduce (fn [opts v]
                              ;; each validator can pass mutate the options object
                              ;; but if it returns nil, we ignore it
                              (if-let [r (v opts)] r opts))
                            options
                            validators)]
    new-options))

(def ^:private dev-mode-standard-includes
  ["js/plasio-renderer.cljs.js"
   "lib/dist/plasio.js"])

(def ^:private prod-mode-standard-includes
  ["js/plasio-renderer.cljs.js"
   "js/plasio.js"])

(def ^:private css-includes
  ["css/style.css"])

(def ^:private third-party-scripts
  [[:jquery "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"]
   [:nouislider "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.0.2/nouislider.min.js"]
   [:bootstrap "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"]
   [:react ["https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js"
            "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js"]]])


(def ^:private third-party-styles
  [[:bootstrap "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"]
   [:font-awesome "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"]
   [:nouislider "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.0.2/nouislider.min.css"]])

(def ^:private google-maps-base-url
  "https://maps.googleapis.com/maps/api/js?libraries=places&key=")

(defn load-css [head src]
  (let [c (async/chan)
        tag (doto (.createElement js/document "link")
              (.setAttribute "rel" "stylesheet")
              (.setAttribute "type" "text/css")
              (.setAttribute "href" src)
              (aset "onload" #(async/close! c)))]
    (.appendChild head tag)
    c))


(defn load-script [head src]
  (let [c (async/chan)
        tag (doto (.createElement js/document "script")
              (.setAttribute "type" "text/javascript")
              (.setAttribute "src" src)
              (aset "onload" #(async/close! c)))]
    (.appendChild head tag)
    c))

(defn filtered-with-ignore [ignore deps]
  (let [s (set (map s/lower-case ignore))]
    (keep #(when-not (s (name (first %)))
            (second %))
          deps)))

(defn- make-production-absolute [file]
  (if-let [prod-path (aget js/window "PRODUCTION_PLASIO_UI_BASE_PATH")]
    (str prod-path file)
    (throw (js/Error. "PRODUCTION_PLASIO_UI_BASE_PATH is not set for production build, cannot deduce resource path."))))

(defn- include-resources [{:keys [includeExternalDependencies ignoreDependencies googleMapsAPIKey showSearch]}]
  (let [dev-mode? (true? (aget js/window "DEV_MODE"))
        scripts (concat
                 ;; google maps api
                 (when showSearch
                   [(str google-maps-base-url googleMapsAPIKey)])

                 ;; external dependencies if needed
                 (when includeExternalDependencies
                   (filtered-with-ignore ignoreDependencies third-party-scripts))

                 ;; standard includes
                 (if dev-mode?
                   dev-mode-standard-includes
                   (map make-production-absolute prod-mode-standard-includes)))
        styles (concat
                ;; external dependencies if needed
                (when includeExternalDependencies
                  (filtered-with-ignore ignoreDependencies third-party-styles))
                ;; standard css includes
                (if dev-mode?
                  css-includes
                  (map make-production-absolute css-includes)))
        head (.-head js/document)]

    ;; add all styles
    (go
      (doseq [s (flatten styles)]
        (<! (load-css head s)))

      ;; add all scripts
      (println "scripts!" scripts)
      (doseq [s (flatten scripts)]
        (<! (load-script head s))))))

(defn script-path []
  (let [cs (aget js/document "currentScript")]
    (if cs
      (.-src cs)
      (let [scripts (.-scripts js/document)
            current (.item scripts (dec (.-length scripts)))]
        (.-src current)))))

(defn ^:export createUI [divElement options]
  ;; Use the default options overriden by the options passed down
  ;; by the user.
  ;;
  (let [opts (merge default-options
                    (js->clj (or options (js-obj)) :keywordize-keys true))
        opts (validate-options opts)]

    (println "-- input options:" opts)
    (go
      ;; include any resources we may need
      (<! (include-resources opts))

      ;; as a side effect of loading react lazily, we need to explicitly tell react dom to initialize
      (dom/initialize)

      ;; startup
      (startup divElement opts))

    ;; return a JS object which can be used to interact with the UI
    (let [prop-listeners (atom {})
          last-dispatch (atom nil)
          ;; dispatch a value to the given function, make a new copy of the
          ;; value being dispatched
          dispatch-val (fn [f]
                         (let [v (clj->js (or @last-dispatch
                                              {}))]
                           (js/requestAnimationFrame #(f v))))

          ;; add a new listener
          add-listener (fn [f]
                         (let [id (util/random-id)]
                           (swap! prop-listeners assoc id f)
                           ;; always dispatch the current value to the newly added method
                           (dispatch-val f)
                           ;; return the ID the caller can use to de-register this
                           id))

          ;; remove a listener
          remove-listener (fn [id]
                            (swap! prop-listeners dissoc id))

          ;; the standard property dispatcher
          prop-dispatcher (fn []
                            (let [current (plasio-state/current-state-snapshot)]
                              (when-not (= @last-dispatch current)
                                ;; snapshot has changed, save changes and dispatch our handlers
                                (reset! last-dispatch current)
                                ;; snapshot has changed, invoke
                                (doseq [[k f] @prop-listeners]
                                  (dispatch-val f)))))

          ;; don't queue more than one per frame
          framed-pd-flag (atom false)
          framed-pd (fn []
                     (when-not @framed-pd-flag
                       (reset! framed-pd-flag true)
                       (js/requestAnimationFrame (fn []
                                                   (prop-dispatcher)
                                                   (reset! framed-pd-flag false)))))]

      ;; we may not have access to renderer components till its initialized, so wait for that to happen
      ;; before we even start listening for things
      (add-watch plasio-state/app-state "__wait-for-comps"
                 (fn [_ _ _ n]
                   (when (seq (:comps n))
                     (let [r (:renderer @plasio-state/comps)]
                       (.addPropertyListener r "__prop-dispatch" framed-pd))
                     (add-watch plasio-state/app-state "__prop-dispatch" framed-pd)

                     ;; there may be subscribers already waiting for us to update them
                     (framed-pd)

                     ;; our work is done, we don't need to keep waiting for comps
                     (remove-watch plasio-state/app-state "__wait-for-comps"))))

      (js-obj
       "addChangeListener"
       add-listener

       "removeChangeListener"
       remove-listener

       "apply"
       (fn [v] 
         (let [st (js->clj v :keywordize-keys true)]
           ;; apply the given value to our internal state
           (println "-- -- apply:" st)
           (om/transact! plasio-state/root
                         #(reduce
                           (fn [s path]
                             (assoc-in s path (get-in st path)))
                           % (history/all-url-keys)))

           ;; there needs to be a better way of restoring camera props
           (when-let [camera (.-activeCamera (:mode-manager @plasio-state/comps))]
             (let [bbox (:bounds @plasio-state/root)]
               (.deserialize camera (plasio-state/js-camera-props bbox (:camera st)))))))

       "destroy"
       (fn []
         ;; destroy this player, unmount the component and clearout the app state
         (let [r (:renderer @plasio-state/comps)]
           (.removePropertyListener r "__prop-dispatch"))
         (remove-watch plasio-state/app-state "__prop-dispatch")

         (om/detach-root divElement)
         (plasio-state/reset-app-state!))))))

;; when this script is being loaded, we need to capture the path and figure out
;; the path to other resources
(let [path (script-path)
      plasio? (re-find #"plasio-ui\.js$" path)]
  (when plasio?
    (let [base-path (s/replace path #"plasio-ui\.js$" "")]
      (aset js/window "PRODUCTION_PLASIO_UI_BASE_PATH" base-path))))


(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
