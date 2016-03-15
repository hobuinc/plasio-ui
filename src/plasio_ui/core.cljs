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
   [:innundation-plane "Innundation Plane" :street-view aw/innundation-plane-pane]
   [:information "Information" :info-circle aw/information-pane]
   [:local-settings "Local Settings" :wrench aw/local-settings-pane]
   [:reorder-panes "Reorder Panes" :clone :fn plasio-state/rearrange-panels]
   [:search-location "Search for an Address" :search :fn plasio-state/toggle-search-box!]])


(def ^:private all-docked-panes
  [:rendering-options
   :channels
   :point-manipulation
   :innundation-plane
   :information
   :local-settings
   :switch-resource])

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

(defn resource-params [{:keys [server resource] :as init-state}]
  (when (or (s/blank? server)
            (s/blank? resource))
    (throw (js/Error. "Trying to fetch remote resource properties but no server or resource option is specified")))

  (go
    (let [info (-> (util/info-url server resource)
                   (http/get {:with-credentials? (true? (:allowGreyhoundCredentials init-state))})
                   <!
                   :body)

          ;; figure out remote properties
          bounds (:bounds info)
          num-points (:numPoints info)
          schema (:schema info)

          ;; if bounds are 4 in count, that means that we don't have z stuff
          ;; in which case we just give it a range
          bounds (if (= 4 (count bounds))
                   (apply conj (subvec bounds 0 2)
                          0
                          (conj (subvec bounds 2 4) 520))
                   bounds)]

      {:server server
       :resource resource
       :bounds bounds
       :schema schema
       :num-points num-points})))


(defn bind-system-key-handlers! []
  (.addEventListener js/document
                     "keydown"
                     (fn [e]
                       (let [code (or (.-which e)
                                      (.-keyCode e))]
                         (case code
                           9 (plasio-state/toggle-docker!)
                           nil)
                         ))))


(defn startup [div-element options]
  (go
    (let [url-state-settings (when (:useBrowserHistory options)
                               (or (history/current-state-from-query-string) {}))
          local-options (merge options
                               url-state-settings)
          settings (merge local-options
                          (<! (resource-params local-options)))]
      ;; merge-with will fail if some of the non-vec settings are available in both
      ;; app-state and settings, we do a simple check to make sure that app-state doesn't
      ;; have what we'd like it to have
      (when-not (:resource @plasio-state/app-state)
        (swap! plasio-state/app-state (fn [st] (merge-with conj st settings))))

      ;; put in initialization paramters
      (swap! plasio-state/app-state assoc :init-params settings)

      ;; make sure the Z bounds are initialized correctly
      (let [bounds (:bounds settings)
            zrange [(bounds 2) (bounds 5)]]
        (swap! plasio-state/app-state assoc-in [:ro :zrange] zrange))

      ;; if we don't have any channels, enable the first specified source
      (when-not (seq (get-in @plasio-state/app-state [:ro :channels]))
        (swap! plasio-state/app-state assoc-in [:ro :channels :channel0 :source]
               (first (nth (:colorSources options)
                           (:defaultColorChannelIndex options 0)))))

      ;; The frustom LOD stuff needs to be configured here
      ;;
      (let [point-count (:num-points settings)
            stop-split-depth (+ 1 (js/Math.ceil (util/log4 point-count)))]
        (println "-- -- stop-split-depth:" stop-split-depth)
        (set! (.-STOP_SPLIT_DEPTH js/PlasioLib.FrustumLODNodePolicy) stop-split-depth)
        (set! (.-HARD_STOP_DEPTH js/PlasioLib.FrustumLODNodePolicy) (* 2 stop-split-depth)))

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

(defn- assert-google-maps-key [{:keys [includeExternalDependencies googleMapsAPIKey]}]
  (when (and includeExternalDependencies
             (s/blank? googleMapsAPIKey))
    (throw (js/Error. "When includeExternalDependencies is turned on, googleMapsAPIKey needs to be specified."))))

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

(def ^:private dev-mode-worker-location "workers/decompress.js")
(def ^:private dev-mode-standard-includes
  ["js/plasio-renderer.js"
   "lib/dist/plasio-lib.js"])

(def ^:private prod-mode-worker-location "workers/decompress.js")
(def ^:private prod-mode-standard-includes
  ["js/plasio-renderer.js"
   "js/plasio-lib.js"])

(def ^:private css-includes
  ["css/style.css"])

(def ^:private third-party-scripts
  [[:jquery "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"]
   [:nouislider "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.2.1/nouislider.min.js"]
   [:bootstrap "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"]
   [:react ["https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js"
            "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js"]]])


(def ^:private third-party-styles
  [[:bootstrap "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"]
   [:font-awesome "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"]
   [:nouislider "https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.2.1/nouislider.min.css"]])

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

(defn- include-resources [{:keys [includeExternalDependencies ignoreDependencies googleMapsAPIKey]}]
  (let [dev-mode? (true? (aget js/window "DEV_MODE"))
        scripts (concat
                  ;; google maps api
                  [(str google-maps-base-url googleMapsAPIKey)]
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

    ;; set the worker path needed by plasio-lib
    (aset js/window "DECOMPRESS_WORKER_PATH"
          (if dev-mode?
            dev-mode-worker-location
            (make-production-absolute prod-mode-worker-location)))

    ;; set the lazperf path for production builds
    (aset js/window "LAZPERF_LOCATION"
          (if dev-mode?
            "lib/dist/laz-perf.js"
            (make-production-absolute "js/laz-perf.js")))

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
    (js-obj "destroy" (fn []
                        ;; destroy this player, unmount the component and clearout the app state
                        (om/detach-root divElement)
                        (plasio-state/reset-app-state!)))))

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
