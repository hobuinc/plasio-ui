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
            cljsjs.gl-matrix)

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
   [:separator/three]
   [:rendering-options "Rendering Options" :cogs aw/rendering-options-pane]
   [:imagery "Imagery Options" :picture-o aw/imagery-pane]
   [:point-manipulation "Point Manipulation" :magic aw/point-manipulation-pane]
   [:innundation-plane "Innundation Plane" :street-view aw/innundation-plane-pane]
   [:information "Information" :info-circle aw/information-pane]
   [:separator/two]
   [:local-settings "Local Settings" :wrench aw/local-settings-pane]
   [:reorder-panes "Reorder Panes" :clone :fn plasio-state/rearrange-panels]
   [:separator/one]
   [:search-location "Search for an Address" :search :fn plasio-state/toggle-search-box!]])

(defcomponentk app-bar [[:data resource-name] owner]
  (render [_]
    (let [all-panes
          (->> panes
               (mapv
                 (fn [[id title icon w f]]
                   {:id id :title title :icon icon :f f})))]
      (om/build w/application-bar {:panes all-panes
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
                {:children (om/build-all w/floating-panel ps {:key :id})}))))

(defcomponentk hud [owner]
  (render [_]
    (let [root (om/observe owner plasio-state/root)
          ui (om/observe owner plasio-state/ui)
          ui-locals (om/observe owner plasio-state/ui-local-options)
          op (-> @ui :open-panes set)
          dp (-> @ui :docked-panes set)]
      (d/div
        ;; setup render target
        (om/build aw/render-target {:renderer-state @root})
        (d/div
          {:class (str "app-container"
                       (when-not (empty? dp) " with-dock"))}

          ;; compass
          (om/build aw/compass {})

          ;; render all open panes
          (om/build floating-panes {:panes (vec op)})

          ;; render all docked panes
          (when-not (empty? dp)
            (om/build docked-panes {:panes (vec dp)}))

          (om/build aw/logo {})

          ;; build the app bar
          (let [res-name (str (:resource @root) "@" (:server @root))]
            (om/build app-bar {:resource-name res-name}))

          (when (:search-box-visible? @ui-locals)
            (om/build aw/search-widget {})))))))

(defn resource-params [init-state]
  (go
    (let [server (:server init-state)
          resource (:resource init-state)
          ;; get the bounds for the given pipeline
          ;;
          info (-> (util/info-url server resource)
                   (http/get {:with-credentials? false})
                   <!
                   :body)

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


(defn config-with-build-id []
  (if (clojure.string/blank? js/BuildID)
    "config.json"
    (str "config-" js/BuildID ".json")))

(defn startup []
  (go
    (let [defaults (-> (config-with-build-id)
                       (http/get {:with-credentials? false})
                       <! :body)

          override (or (history/current-state-from-query-string) {})
          local-settings (merge defaults override)
          remote-settings (<! (resource-params local-settings))

          settings (merge local-settings remote-settings)]

      ;; merge-with will fail if some of the non-vec settings are available in both
      ;; app-state and settings, we do a simple check to make sure that app-state doesn't
      ;; have what we'd like it to have
      (when-not (:resource @plasio-state/app-state)
        (swap! plasio-state/app-state (fn [st] (merge-with conj st settings))))

      ;; put in initialization paramters
      (swap! plasio-state/app-state assoc :init-params local-settings)

      (if (not (get-in settings [:ro :imagery-source]))
        (swap! plasio-state/app-state assoc-in [:ro :imagery-source]
               (get-in (:imagery-sources defaults) [0 0])))

      ;; make sure the Z bounds are initialized correctly
      (let [bounds (:bounds remote-settings)
            zrange [(bounds 2) (bounds 5)]]
        (swap! plasio-state/app-state assoc-in [:ro :zrange] zrange))

      (println "Startup state: " @plasio-state/app-state)

      ;; whenever UI changes are made, we need to save a snapshot
      (add-watch plasio-state/app-state "__ui-state-watcher"
                 (fn [_ _ o n]
                   ;; camera causes its own snapshot saving etc.
                   ;; we only concern ourselves with app state here
                   (let [o' (select-keys o [:ro :po :pm])
                         n' (select-keys n [:ro :po :pm])]
                     (when (and *save-snapshot-on-ui-update*
                                (not= o' n'))
                       (plasio-state/do-save-current-snapshot)))))

      (let [state-id (str (:resource settings) "@" (:server settings))]
        ;; some of the local state is persistant, keep it in sync
        (add-watch plasio-state/app-state "__ui-local-state-watcher"
                   (fn [_ _ o n]
                     (let [o' (select-keys o [:ui])
                           n' (select-keys n [:ui])]
                       (when-not (= o' n')
                         (plasio-state/save-local-state! state-id n')))))

        ;; also make sure the state is local state is loaded
        (swap! plasio-state/app-state merge (plasio-state/load-local-state state-id))))

    ;; history stuff, on pops, we want to merge back the stuff
    (history/listen
      (fn [st]
        ;; when poping for history we need to make sure that the update to
        ;; root doesn't cause another state to be pushed onto our history stack
        (binding [*save-snapshot-on-ui-update* false]
          (om/transact! plasio-state/root
                        #(merge % (select-keys st [:ro :po :pm])))

          ;; there needs to be a better way of restoring camera props
          (when-let [camera (:camera @plasio-state/comps)]
            (.applyState camera (plasio-state/js-camera-props (:camera st)))))))

    (om/root hud
             plasio-state/app-state
             {:target (. js/document (getElementById "app"))})))


(startup)

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
