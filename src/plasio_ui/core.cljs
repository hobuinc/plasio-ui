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
            [clojure.string :as str]
            [goog.object :as gobject])
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
   [:channels "Color Channels" :image aw/channels-pane]
   [:point-manipulation "Point Manipulation" :magic aw/point-manipulation-pane]
   [:inundation-plane "Inundation Plane" :street-view aw/inundation-plane-pane]
   [:information "Information" :info-circle aw/information-pane]
   [:local-settings "Local Settings" :wrench aw/local-settings-pane]
   [:point-info "Point Information" :eye aw/point-info-pane]
   [:animation "Animation Control" :video aw/animation-pane]
   [:filter "Filter" :filter aw/filter-pane]
   [:reorder-panes "Reorder Panes" :clone :fn plasio-state/rearrange-panels]
   [:search-location "Search for an Address" :search :fn plasio-state/toggle-search-box!]])


(def ^:private all-docked-panes
  [:switch-resource
   :channels
   :filter
   :rendering-options
   :inundation-plane
   :local-settings
   :point-manipulation
   :animation
   :point-info
   :information])

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
    ;; return keys panes in same order as requested IDs
    (reduce #(conj %1 (get as-map %2)) [] ids)))


#_(defcomponentk floating-panes [[:data panes] owner]
  (render [_]
    (when-let [ps (-> panes coerce-panes)]
      (d/div {:class "open-panes"}
             (om/build-all w/floating-panel ps {:key :id})))))

(defcomponentk docked-panes [[:data panes full-height?] owner]
  (render [_]
    (when-let [ps (coerce-panes panes)]
      (om/build w/docked-widgets {:children ps
                                  :full-height? full-height?}))))

(defn- strip-http-prefix [s]
  (if-let [m (re-matches #"^https?://(.*)" s)]
    (m 1)
    s))

(defn- split-resouce-name [res-name]
  (let [parts (str/split res-name #"@")]
    (if (= 2 (count parts))
      [(parts 0) (strip-http-prefix (parts 1))]
      [res-name ""])))

(defn- join-multiple-resources [grouped-resources]
  (let [total-groups (count grouped-resources)
        resources (take 2 total-groups)
        left-resources (- total-groups 2)
        join-resource-list (fn [resource-names]
                             (let [total (count resource-names)
                                   to-show (take 2 resource-names)
                                   leftover (- total 3)]
                               (str
                                 (str/join "," to-show)
                                 (when (pos? leftover)
                                   (str " + " leftover " more")))))]
    (str
      (str/join ", "
                (map (fn [[server resources]]
                       (if (= 1 (count resources))
                         (if server
                           (str (-> resources first :name) "@" server)
                           (-> resources first :name))
                         (str "(" (join-resource-list (map :name resources)) ")@" server)))
                     grouped-resources))
      (when (pos? left-resources)
        (str " and " left-resources " more.")))))

(defn- determine-resource-name
  ;; if the resource is a vector, then it may have a server part
  [{:keys [:resource-info] :as settings}]
  (cond
    (and (some? (seq resource-info))
         (sequential? (:name resource-info)))
    (let [normalized-names (map (fn [n]
                                  (if (util/ept-resource? n)
                                    {:name (str (util/ept-url->name n) "[EPT]")}
                                    (let [[res-name res-server] (split-resouce-name n)]
                                      {:name   res-name
                                       :server (if (str/blank? res-server) (:server resource-info) res-server)})))
                                (:name resource-info))
          grouped (group-by :server normalized-names)]
      (join-multiple-resources grouped))

    (some? (seq resource-info))
    (if (util/ept-resource? (:name resource-info))
      (str (util/ept-url->name (:name resource-info)) " [EPT]")
      (str (:name resource-info) "@" (:server resource-info)))

    (and (string? (:resource settings))
         (string? (:server settings)))
    (str (:resource settings) "@" (strip-http-prefix (:server settings)))

    (and (vector? (:resource settings))
         (string? (:server settings)))
    (let [stripped-server (strip-http-prefix (:server settings))
          normalized-names (map (fn [n]
                                  (let [[res-name res-server] (split-resouce-name n)]
                                    {:name res-name
                                     :server (if (str/blank? res-server) stripped-server res-server)}))
                                (:resource settings))
          grouped (group-by :server normalized-names)]
      (join-multiple-resources grouped))

    :else "--"))

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

        (when (:timeline-widget-visible? @ui-locals)
          (om/build aw/timeline-animator-widget {}))

        ;; render all docked panes
        (when (:showPanels settings)
          (om/build docked-panes {:panes (vec (remove panes-to-hide all-docked-panes))
                                  :full-height? (not (:showApplicationBar settings))}))

        (om/build aw/logo {})

        ;; build the app bar
        (when (:showApplicationBar settings)
          (om/build app-bar {:brand (:brand settings "speck.ly")
                             :resource-name (determine-resource-name settings)
                             :show-search? (:showSearch settings)}))

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
    selection))


(defn startup [div-element options]
  (go
    (let [;; figure out what all resources we know of
          all-resources (<! (plasio-state/load-available-resources<! (:resources options)))
          _ (println "Available resources:" all-resources)

          ;; while we are at it load other async resources as well.
          _ (<! (plasio-state/load-available-filters<! (:filters options)))

          default-resource (first (filter :default all-resources))

          ;; compose parameters
          url-state-settings (when (:useBrowserHistory options)
                               (or (history/current-state-from-query-string) {}))
          local-options (merge options url-state-settings)


          ;; start building our settings map
          ;; if no server or resource parameters were supplied we need to fallback onto a default resource
          settings (if (or (str/blank? (:server local-options))
                           (str/blank? (:resource local-options)))
                     (if default-resource
                       (util/deep-merge
                         (util/v "local-options"
                                 (assoc local-options :server (:server-url default-resource)
                                                      :resource (:name default-resource)))
                         ;; Also merge in any params that the default resource may specify
                         (util/v "query-string"
                                 (history/current-state-from-query-string (str "?" (:queryString default-resource))))

                         ;; merge any default params
                         (util/v "params"
                                 (history/current-state-from-query-map (:params default-resource))))
                       (throw (js/Error. "No server or resource configuration available and no default resource was found.")))
                     local-options)

          _ (println "settings:" settings)

          selected-resource (some->> all-resources
                                     (filter #(and (= (:server settings) (:server-url %))
                                                   (= (:resource settings) (:name %))))
                                     first)

          _ (println "selected resource:" selected-resource)

          additional-color-sources (when selected-resource
                                     (:colorSources selected-resource))

          ;; Save the resource info, we would need it to show the resource info and any credits associated with it.
          settings (-> settings
                       (assoc :resource-info selected-resource)
                       (update :colorSources #(vec (concat additional-color-sources %))))]

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
        (let [chosen-color-channel (first (nth (:colorSources options)
                                               (or
                                                 ;; do we have any channel selection rules?
                                                 (when-let [rules (:colorChannelRules options)]
                                                   (determine-default-color-channel (:schema settings) rules))
                                                 ;; do we have any default color channels specified
                                                 (:defaultColorChannelIndex options 0))))]
          (swap! plasio-state/app-state assoc-in [:ro :channels :channel0 :source] chosen-color-channel)))

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
          (println "local state:" (plasio-state/load-local-state state-id))
          (swap! plasio-state/app-state merge
                 ;; certain properties should not be merged back
                 (-> (plasio-state/load-local-state state-id)
                     (update-in [:ui :local-options] select-keys [:point-density :flicker-fix])))

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
                (.deserialize camera (plasio-state/js-camera-props (:camera st))))))))

      (when (:bindKeyHandlers settings)
        (bind-system-key-handlers!))

      ;; set any other initialization params the default point cloud density
      (js/Plasio.Device.overrideProperty "nodeRejectionRatio"
                                         (get plasio-state/point-cloud-density-levels plasio-state/default-point-cloud-density-level))

      ;; finally enable HUD
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

(defn- assert-google-maps-key [{:keys [showSearch googleMapsAPIKey]}]
  (when (and showSearch
             (s/blank? googleMapsAPIKey))
    (throw (js/Error. "When showSearch is turned on(its on by default), googleMapsAPIKey needs to be specified."))))

(defn- assert-color-sources [{:keys [colorSources]}]
  (if-not (seq colorSources)
    (throw (js/Error. "No colorSources specified, you need at least one."))))


(defn validate-options [options]
  (let [validators [assert-google-maps-key assert-color-sources]
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

(def ^:private prod-mode-defines
  {"PLASIO_WEB_WORKER_PATH" "js/plasio.webworker.js"
   "PLASIO_COLOR_WORKER_PATH" "js/plasio.color.webworker.js"})

(def ^:private css-includes
  ["css/style.css"])

(def ^:private third-party-scripts
  [[:jquery "https://code.jquery.com/jquery-3.2.1.slim.min.js"]
   [:nouislider "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.0.2/nouislider.min.js"]
   [:bootstrap "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js"]
   [:react ["https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js"
            "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js"]]])


(def ^:private third-party-styles
  [[:bootstrap "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"]
   [:font-awesome ["https://use.fontawesome.com/releases/v5.2.0/css/solid.css"
                   "https://use.fontawesome.com/releases/v5.2.0/css/fontawesome.css"]]
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
        defines (when-not dev-mode?
                  (into {}
                        (for [[k v] prod-mode-defines]
                          [k (make-production-absolute v)])))

        head (.-head js/document)]

    ;; add all defines
    (doseq [[k v] defines]
      (gobject/set js/window k v))

    ;; add all styles
    (go
      (doseq [s (flatten styles)]
        (<! (load-css head s)))

      ;; add all scripts
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
      ;; include any page resources we may need
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
             (.deserialize camera (plasio-state/js-camera-props (:camera st))))))

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
  (om/transact! plasio-state/root #(update % :__figwheel_counter (fnil inc 0)))
)
