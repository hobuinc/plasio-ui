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
            [plasio-ui.util :as util]
            cljsjs.gl-matrix
            [clojure.string :as s])

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
   [:imagery "Imagery Options" :picture-o aw/imagery-pane]
   [:point-manipulation "Point Manipulation" :magic aw/point-manipulation-pane]
   [:innundation-plane "Innundation Plane" :street-view aw/innundation-plane-pane]
   [:information "Information" :info-circle aw/information-pane]
   [:local-settings "Local Settings" :wrench aw/local-settings-pane]
   [:reorder-panes "Reorder Panes" :clone :fn plasio-state/rearrange-panels]
   [:search-location "Search for an Address" :search :fn plasio-state/toggle-search-box!]])


(def ^:private all-docked-panes
  [:rendering-options
   :imagery
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
          dp (-> @ui :docked-panes set)]
      (d/div
        {:class "main-container"}
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
          (om/build docked-panes {:panes all-docked-panes}))

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
                   (http/get {:with-credentials? false})
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


(defn startup [div-element, options]
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
                     (println "going to push stae!")
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
  {:showPanels true
   :showCompass true
   :showApplicationBar true
   :showSearchWidget true
   :brand "speck.ly"})

(defn- assert-pipeline [{:keys [useBrowserHistory server resource]}]
  ;; when the browser takeover is turned off, we need to make sure
  ;; the user provided us with the pipeline and resource
  ;;
  (when (and (not useBrowserHistory)
             (or (s/blank? server)
                 (s/blank? resource)))
    (throw (js/Error. "When useBrowserHistory is turned off, properties server and resource need to be specified."))))


(defn validate-options [options]
  (let [validators [assert-pipeline]
        new-options (reduce (fn [opts v]
                              ;; each validator can pass mutate the options object
                              ;; but if it returns nil, we ignore it
                              (if-let [r (v opts)] r opts))
                            options
                            validators)]
    new-options))

(defn ^:export createUI [divElement options]
  ;; Use the default options overriden by the options passed down
  ;; by the user.
  ;;
  (let [opts (merge default-options
                    (js->clj (or options (js-obj)) :keywordize-keys true))
        _ (println "-- -- passed in opts:" opts)
        opts (validate-options opts)]
    (println "-- -- using options:" opts)
    (startup divElement, opts)))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
