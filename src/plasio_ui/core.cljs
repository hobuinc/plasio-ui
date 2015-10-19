(ns ^:figwheel-always plasio-ui.core
  (:require [plasio-ui.widgets :as w]
            [plasio-ui.app-widgets :as aw]
            [plasio-ui.math :as math]
            [plasio-ui.history :as history]
            [plasio-ui.state :as plasio-state]
            [om-tools.core :refer-macros [defcomponentk defcomponent]]
            [om-tools.dom :as d]
            [cljs.core.async :as async]
            [cljs-http.client :as http]
            [goog.string :as gs]
            [goog.string.format]
            cljsjs.gl-matrix
            [plasio-ui.config :as config]
            [om.core :as om])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(enable-console-print!)

;; when this value is true, everytime the app-state atom updates, a snapshot is
;; requested (history) when this is set to false, you may update the app-state
;; without causing a snapshot however the UI  state will still update
(def ^:dynamic ^:private *save-snapshot-on-ui-update* true)


#_(let [timer (clojure.core/atom nil)]
  (defn post-message
    ([msg]
     (post-message :message msg))

    ([type msg]
     ;; if there is a timer waiting kill it
     (when @timer
       (js/clearTimeout @timer)
       (reset! timer nil))

     (swap! app-state assoc :status-message {:type type
                                             :message msg})
     (let [t (js/setTimeout #(swap! app-state dissoc :status-message) 5000)]
       (reset! timer t)))))


#_(defn compass []
  ;; we keep track of two angles, one is where we're looking and the second one
  ;; matches our tilt
  ;;
  (let [angles (atom [0 0])
        zvec   (array 0 0 -1)]
    (reagent/create-class
     {:component-did-mount
      (fn []
        (if-let [renderer (get-in @app-state [:comps :renderer])]
          (.addPropertyListener
           renderer (array "view")
           (fn [view]
             (when view
               (let [eye (.-eye view)
                     target (.-target view)]
                 ;; such calculations, mostly project vectors to xz plane and
                 ;; compute the angle between the two vectors
                 (when (and eye target)
                   (let [plane (math/target-plane target)       ;; plane at target
                         peye (math/project-point plane eye)    ;; project eye
                         v (math/make-vec target peye)          ;; vector from target to eye
                         theta (math/angle-between zvec v)      ;; angle between target->eye and z
                         theta (math/->deg theta)               ;; in degrees

                         t->e (math/make-vec target eye)        ;; target->eye vector
                         t->pe (math/make-vec target peye)      ;; target->projected eye vector
                         incline (math/angle-between t->e t->pe)  ;; angle between t->e and t->pe
                         incline (math/->deg incline)]            ;; in degrees

                     ;; make sure the values are appropriately adjusted for them to make sense as
                     ;; css transforms
                     (reset! angles
                             [(if (< (aget v 0) 0)
                                theta
                                (- 360 theta))
                              (- 90 (max 20 incline))])))))))
          (throw (js/Error. "Renderer is not intialized, cannot have compass if renderer is not available"))))
      :reagent-render
      (fn []
        (let [[heading incline] @angles
              camera (get-in @app-state [:comps :camera])
              te (get-in @app-state [:comps :target-element])]
          [:a.compass {:style {:transform (str "rotateX(" incline "deg)")}
                       :href "javascript:"
                       :on-click #(do (when camera
                                        (.setHeading camera 0)))}
           [:div.arrow {:style {:transform (str "rotateZ(" heading "deg)")}}
            [:div.n]
            [:div.s]]
           [:div.circle]]))})))

#_(defn do-profile []
  (if-let [lines (-> @app-state-lines
                     seq)]
    (let [renderer (get-in @app-state [:comps :renderer])
          bounds (apply array (:bounds @app-state))
          pairs (->> lines
                     (map (fn [[_ start end _]] (array start end)))
                     (apply array))
          result (.profileLines (js/PlasioLib.Features.Profiler. renderer) pairs bounds 256)]
      (js/console.log result)

      (swap! app-state assoc :profile-series
             (mapv (fn [[id _ _ color] i]
                     [id color (aget result i)])
                   lines (range))))
    (post-message :error "Cannot create profile, no line segments available.")))

#_(defn do-line-of-sight []
  (if-let [lines (-> @app-state-lines seq)]
    (let [renderer (get-in @app-state [:comps :renderer])
          bounds (apply array (:bounds @app-state))
          origin (->> lines
                     (map (fn [[_ start end _]] (array start end)))
                     (apply array))
          result (.profileLines (js/PlasioLib.Features.Profiler. renderer) pairs bounds 256)]
      (js/console.log result)

      (swap! app-state assoc :profile-series
             (mapv (fn [[id _ _ color] i]
                     [id color (aget result i)])
                   lines (range))))
    (post-message :error "Cannot create profile, no line segments available.")))

#_(defn format-dist [[x1 y1 z1] [x2 y2 z2]]
  (let [dx (- x2 x1)
        dy (- y2 y1)
        dz (- z2 z1)]
    (-> (+ (* dx dx) (* dy dy) (* dz dz))
        js/Math.sqrt
        (.toFixed 4))))

#_(defn format-point [[x y z]]
  (str (.toFixed x 2) ", " (.toFixed y 2) ", " (.toFixed z 2)))


#_(defn relayout-windows []
  (let [current-windows (:open-panes @app-state)]
    (println current-windows)
    (swap! app-state assoc :open-panes #{})
    (go
      (async/<! (async/timeout 100))
      (w/reset-floating-panel-positions!)
      (swap! app-state assoc :open-panes current-windows))))


#_(defn toggler [state view]
  (aw/state-updater
    state
    (fn [st]
      (let [open-panes (:open-panes st)
            docked-panes (:docked-panes st)]
        (if (or (open-panes view)
                (docked-panes view))
          (-> st
              (update-in [:open-panes] disj view)
              (update-in [:docked-panes] disj view))
          (update-in st [:open-panes] conj view))))))


(defn pane-toggler [id]
  (fn [] (plasio-state/toggle-pane! id)))


(def ^:private panes
  [[:rendering-options "Rendering Options" :cogs aw/rendering-options-pane]
   [:imagery "Imagery Options" :picture-o aw/imagery-pane]
   [:point-manipulation "Point Manipulation" :magic aw/point-manipulation-pane]
   [:innundation-plane "Innundation Plane" :street-view aw/innundation-plane-pane]
   [:information "Information" :info-circle aw/information-pane]
   [:separator/two]
   [:local-settings "Local Settings" :wrench aw/local-settings-pane]
   [:reorder-panes "Reorder Panes" :clone :fn plasio-state/rearrange-panels]
   [:separator/one]
   [:search-location "Search for an Address" :search :fn plasio-state/toggle-search-box!]])

(defcomponent app-bar [owner]
  (render [_]
    (let [all-panes
          (->> panes
               (mapv
                 (fn [[id title icon w f]]
                   {:id id :title title :icon icon :f f})))]
      (om/build w/application-bar {:panes all-panes}))))

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
          (om/build app-bar {})

          (when (:search-box-visible? @ui-locals)
            (om/build aw/search-widget {})))))))

(defn- urlify [s]
  (if (re-find #"https?://" s)
    s
    (str "http://" s)))

(defn pipeline-params [init-state]
  (go
    (let [server (:server init-state)
          pipeline (:pipeline init-state)

          base-url (-> (str server "/resource/" pipeline)
                       urlify)
          ;; get the bounds for the given pipeline
          ;;
          info (-> base-url
                     (str "/info")
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
                   bounds)

          point-size 28 #_(reduce + (mapv :size schema))
          dim-names (set (mapv :name schema))
          colors '("Red" "Green" "Blue")]
      {:server (urlify server)
       :pipeline pipeline
       :bounds bounds
       :num-points num-points
       :point-size point-size
       :intensity? (contains? dim-names "Intensity")
       :color? (every? true? (map #(contains? dim-names %) colors))
       :max-depth (-> num-points
                      js/Math.log
                      (/ (js/Math.log 4))
                      (* 1.2)
                      js/Math.floor)})))

#_(defn attach-app-wide-shortcuts!
  "Interacting with keyboard does fancy things!"
  []
  (doto js/document
    ;; shift key handling is done on key press and release, we don't
    ;; want to wait for a keypress to happen to register that shift key is
    ;; down
    (aset "onkeydown"
          (fn [e]
            (case (or (.-keyCode e) (.-which e))
              16 (enable-secondary-mode!)
              9  (do
                   (.preventDefault e)
                   (toggle-huds!))
              nil)))

    (aset "onkeyup"
          (fn [e]
            (case (or (.-keyCode e) (.-which e))
              16 (disable-secondary-mode!)
              nil)))))


#_(defn attach-window-wide-events! []
  (doto js/window
    (.addEventListener "blur"
                       (fn []
                         (println "Main window losing focus")
                         (when (:secondary-mode-enabled? @app-state)
                           (disable-secondary-mode!))))))

(defn config-with-build-id []
  (if (clojure.string/blank? js/BuildID)
    "config.json"
    (str "config-" js/BuildID ".json")))

(defn startup []
  (go
    (let [defaults (-> (config-with-build-id)
                       (http/get {:with-credentials? false})
                       async/<!
                       :body)
          override (or (history/current-state-from-query-string) {})
          local-settings (merge defaults override)
          remote-settings (async/<! (pipeline-params local-settings))

          settings (merge local-settings remote-settings)

          hard-blend? (get-in settings [:ro :intensity-blend])
          color? (:color? settings)
          intensity? (:intensity? settings)]

      (println "color? " color?)
      (println "intensity? " intensity?)

      ;; merge-with will fail if some of the non-vec settings are available in both
      ;; app-state and settings, we do a simple check to make sure that app-state doesn't
      ;; have what we'd like it to have
      (when-not (:pipeline @plasio-state/app-state)
        (swap! plasio-state/app-state (fn [st] (merge-with conj st settings))))

      ;; put in initialization paramters
      (swap! plasio-state/app-state assoc :init-params local-settings)

      ;; if we don't yet have an intensity blend setting from the URL or
      ;; elsewhere, assign one based on whether we have color/intensity.
      (when (not hard-blend?)
        (swap! plasio-state/app-state assoc-in [:ro :intensity-blend]
               (if intensity? 0.2 0)))

      (if (not (get-in settings [:ro :imagery-source]))
        (swap! plasio-state/app-state assoc-in [:ro :imagery-source]
               (get-in (:imagery-sources defaults) [0 0])))

      ;; make sure the Z bounds are initialized correctly
      (let [bounds (:bounds remote-settings)
            zrange [(bounds 2) (bounds 5)]]
        (swap! plasio-state/app-state assoc-in [:ro :zrange] zrange))

      (println "Startup state: " @plasio-state/app-state))

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

    ;; some of the local state is persistant, keep it in sync
    (add-watch plasio-state/app-state "__ui-local-state-watcher"
               (fn [_ _ o n]
                 (let [o' (select-keys o [:ui])
                       n' (select-keys n [:ui])]
                   (when-not (= o' n')
                     (plasio-state/save-local-state! n')))))

    ;; also make sure the state is local state is loaded
    (swap! plasio-state/app-state merge (plasio-state/load-local-state))

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

    #_(attach-app-wide-shortcuts!)
    #_(attach-window-wide-events!)
    (om/root hud
             plasio-state/app-state
             {:target (. js/document (getElementById "app"))})))


(startup)

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
