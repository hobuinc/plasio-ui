(ns ^:figwheel-always plasio-ui.core
  (:require [plasio-ui.widgets :as w]
            [plasio-ui.app-widgets :as aw]
            [plasio-ui.math :as math]
            [plasio-ui.history :as history]
            [reagent.core :as reagent :refer [atom]]
            [cljs.core.async :as async]
            [cljs-http.client :as http]
            [goog.string :as gs]
            [goog.string.format]
            cljsjs.gl-matrix
            [plasio-ui.config :as config]
            [plasio-ui.state :as plasio-state])
    (:require-macros [cljs.core.async.macros :refer [go]]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:left-hud-collapsed? false
                          :right-hud-collapsed? false
                          :secondary-mode-enabled? false
                          :active-primary-mode nil
                          :active-secondary-mode nil
                          :open-panes #{}
                          :docked-panes #{}
                          :window {:width 0
                                   :height 0}
                          :ro {:circular? false
                               :point-size 2
                               :point-size-attenuation 0.2
                               :intensity-blend 0
                               :intensity-clamps [0 255]
                               :color-ramp :red-to-green
                               :max-color-component 255
                               :colorClampHigher 1
                               :colorClampLower 0
                               :rgb_f 1
                               :map_f 0
                               :zrange [0 1]}
                          :widget-states {:address-lookup {:error "what"}}
                          :as {:image-quality 1}            ;; application settings
                          :po {:distance-hint 50
                               :max-depth-reduction-hint 5}
                          :pm {:z-exaggeration 1}}))


;; keep lines separate because we don't want to trigger the entire UI repaint
(defonce app-state-lines (atom nil))

;; when this value is true, everytime the app-state atom updates, a snapshot is
;; requested (history) when this is set to false, you may update the app-state
;; without causing a snapshot however the UI  state will still update
(def ^:dynamic ^:private *save-snapshot-on-ui-update* true)


(let [timer (clojure.core/atom nil)]
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


(defn compass []
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

(declare initialize-for-pipeline)

(defn- camera-state [cam]
  {:azimuth (.. cam -azimuth)
   :distance (.. cam -distance)
   :max-distance (.. cam -maxDistance)
   :target (into [] (.. cam -target))
   :elevation (.. cam -elevation)})

(defn- js-camera-props [{:keys [azimuth distance max-distance target elevation]}]
  (js-obj
   "azimuth" azimuth
   "distance" distance
   "maxDistance" max-distance
   "target" (apply array target)
   "elevation" elevation))

(defn- ui-state [st]
    (select-keys st [:ro :po :pm]))

(defn- params-state [st]
  (select-keys st [:server :pipeline]))

(defn- apply-state!
  "Given a state snapshot, apply it"
  [params]
  ;; apply camera state if any
  (when-let [cp (:camera params)]
    (let [camera (get-in @app-state [:comps :camera])
          cam-props (js-camera-props cp)]
      (println cam-props)
      (.applyState camera cam-props)))

  ;; apply UI state if any
  (binding [*save-snapshot-on-ui-update* false]
    (swap! app-state merge (select-keys params [:ro :po]))))

(defn- save-current-snapshot!
  "Take a snapshot from the camera and save it"
  []
  (if-let [camera (get-in @app-state [:comps :camera])]
    (history/push-state
     (merge
      {:camera (camera-state camera)}
      (ui-state @app-state)
      (params-state @app-state)))))

;; A simple way to throttle down changes to history, waits for 500ms
;; before applying a state, gives UI a chance to "settle down"
;;
(let [current-index (atom 0)]
  (defn do-save-current-snapshot []
    (go
      (let [index (swap! current-index inc)]
        (async/<! (async/timeout 500))
        (when (= index @current-index)
          ;; the index hasn't changed since we were queued for save
          (save-current-snapshot!))))))


(defn apply-ui-state!
  ([n]
   (let [r (get-in n [:comps :renderer])
         ro (:ro n)
         as (:as n)
         [ramp-sc ramp-ec] (get config/color-ramps (:color-ramp ro))
         p (get-in n [:comps :policy])]
     (println ro)
     (.setRenderOptions r (js-obj
                            "circularPoints" (if (true? (:circular? ro)) 1 0)
                            "pointSize" (:point-size ro)
                            "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
                            "xyzScale" (array 1 (get-in n [:pm :z-exaggeration]) 1)
                            "intensityBlend" (:intensity-blend ro)
                            "clampLower" (nth (:intensity-clamps ro) 0)
                            "clampHigher" (nth (:intensity-clamps ro) 1)
                            "colorClampHigher" (:colorClampHigher ro)
                            "colorClampLower" (:colorClampLower ro)
                            "maxColorComponent" (:max-color-component ro)
                            "zrange" (apply array (:zrange ro))
                            "rgb_f" (:rgb_f ro)
                            "map_f" (:map_f ro)
                            "intensity_f" 1
                            "rampColorStart" (apply array ramp-sc)
                            "rampColorEnd" (apply array ramp-ec)))
     (doto p
       (.setDistanceHint (get-in n [:po :distance-hint]))
       (.setMaxDepthReductionHint (->> (get-in n [:po :max-depth-reduction-hint])
                                       (- 5)
                                       js/Math.floor)))

     ;; application states
     (set! (.-IMAGE_QUALITY js/PlasioLib.Loaders.MapboxLoader)
           (get as :image-quality 1)))))

(defn initialize-modes
  "Instantiate all modes that we know of, we should be doing lazy instantiate here,
  but screw that"
  [{:keys [target-element renderer]}]
  {:line-picker (js/PlasioLib.Modes.LinePicker. target-element renderer)
   :line-of-sight-picker (js/PlasioLib.Modes.LineOfSightPicker. target-element renderer)})

(defn render-target []
  (let [this (reagent/current-component)]
    (reagent/create-class
      {:component-did-mount
       (fn []
         (let [init-state (history/current-state-from-query-string)
               comps (initialize-for-pipeline (reagent/dom-node this)
                                              {:server       (:server @app-state)
                                               :pipeline     (:pipeline @app-state)
                                               :max-depth    (:max-depth @app-state)
                                               :compress?    true
                                               :bbox         (:bounds @app-state)
                                               :color?       (:color? @app-state)
                                               :intensity?   (:intensity? @app-state)
                                               :ro           (:ro @app-state)
                                               :render-hints (:render-hints @app-state)
                                               :init-params  init-state})
               modes (initialize-modes comps)]
           (println "----- init-state:" init-state)
           (swap! app-state assoc
                  :comps comps
                  :modes modes
                  :active-primary-mode :point-rendering)

           ;; also expose these components to the user so they can directly manipulate it
           ;; if need be
           (let [{:keys [renderer camera policy]} comps
                 obj (js-obj "renderer" renderer
                             "camera" camera
                             "policy" policy)]
             (set! (.-plasio js/window) obj)))

         ;; listen to changes to history
         (history/listen (fn [st]
                           (println "apply" st)
                           (apply-state! st)))

         ;; once everything is initialized, just make sure we
         ;; flush our UI state
         (apply-ui-state! @app-state))

       :reagent-render
       (fn []
         [:div#render-target])})))

(defn do-profile []
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

(defn format-dist [[x1 y1 z1] [x2 y2 z2]]
  (let [dx (- x2 x1)
        dy (- y2 y1)
        dz (- z2 z1)]
    (-> (+ (* dx dx) (* dy dy) (* dz dz))
        js/Math.sqrt
        (.toFixed 4))))

(defn format-point [[x y z]]
  (str (.toFixed x 2) ", " (.toFixed y 2) ", " (.toFixed z 2)))


(defn relayout-windows []
  (let [current-windows (:open-panes @app-state)]
    (println current-windows)
    (swap! app-state assoc :open-panes #{})
    (go
      (async/<! (async/timeout 100))
      (w/reset-floating-panel-positions!)
      (swap! app-state assoc :open-panes current-windows))))


(defn toggler [state view]
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



(def ^:private panes
  [[:rendering-options "Rendering Options" :cogs aw/render-options-pane]
   [:imagery "Imagery Options" :picture-o aw/imagery-pane]
   [:point-manipulation "Point Manipulation" :magic aw/point-manipulation-pane]
   [:address-lookup "Address Lookup" :map-o aw/address-lookup-pane]
   [:information "Information" :info-circle aw/information-pane]])

(defn make-app-bar []
  (let [all-panes (-> (mapv (fn [[a b c d]] (vector c b (toggler app-state a))) panes)
                      (conj [:separator]
                            [:clone "Stack Windows" relayout-windows]))]
    (println "all-panes:" all-panes)
    (into [w/application-bar] all-panes)))

(defn hud []
  (reagent/create-class
    {:component-did-mount
     (fn []
       ;; subscribe to state changes, so that we can trigger appropriate render
       ;; options
       (add-watch app-state "__render-applicator"
                  (fn [_ _ o n]
                    (apply-ui-state! n)
                    (when *save-snapshot-on-ui-update*
                      (do-save-current-snapshot))))

       ;; watch application state and save things that need to be persisted
       (add-watch app-state "__save-app-state"
                  (fn [_ _ o n]
                    (when-not (identical? (:as o) (:as n))
                      (plasio-state/save-application-state! (:as n))))))

     :reagent-render
     (fn []
       ;; get the left and right hud's up
       ;; we need these to place our controls and other fancy things
       ;;
       (let [open-panes (:open-panes @app-state)
             docked-panes (:docked-panes @app-state)]
         [:div.app-container
          {:class (when-not (empty? docked-panes) "with-dock")}
          ;; the application app bar
          [:div
           (make-app-bar)]

          ;; This is going to be where we render stuff
          [render-target]

          ;; compass
          [compass]

          ;; powered by logo
          [aw/logo]

          ;; any panes which are enabled need to be rendered now
          ;;
          (when-not (empty? open-panes)
            [:div.open-panes
             (for [[id name icon widget] panes
                   :when (open-panes id)
                   :when widget]
               ^{:key id} [widget app-state])])

          ;; if we have any profile views to show, show them
          (when-let [series (:profile-series @app-state)]
            [w/profile-view series #(swap! app-state dissoc :profile-series)])

          ;; the element which shows us all the system messages
          ;;
          (when-let [status (:status-message @app-state)]
            [w/status (:type status) (:message status)])

          ;; show docked wigdets
          (when-not (empty? docked-panes)
            [w/docker-widget
             (for [[id name icon widget] panes
                   :when (docked-panes id)
                   :when widget]
               ^{:key id} [widget app-state])])]))}))

(defn initialize-for-pipeline [e {:keys [server pipeline max-depth
                                         compress? color? intensity? bbox ro
                                         render-hints
                                         init-params]}]
  (println "render-hints:" render-hints)
  (println "bbox:" bbox)
  (let [create-renderer (.. js/window -renderer -core -createRenderer)
        renderer (create-renderer e)
        bbox [(nth bbox 0) (nth bbox 2) (nth bbox 1)
              (nth bbox 3) (nth bbox 5) (nth bbox 4)]
        overlay (when (not color?)
                  (js/PlasioLib.Loaders.MapboxLoader.
                    (apply js/Array bbox)))
        loaders {:point     (doto (js/PlasioLib.Loaders.GreyhoundPipelineLoader.
                                    server (apply js/Array bbox)
                                    pipeline max-depth
                                    compress? color? intensity?
                                    overlay)
                              (.setColorSourceImagery (get-in init-params
                                                              [:ro :imagery-source])))
                 :transform (js/PlasioLib.Loaders.TransformLoader.)}
        policy (js/PlasioLib.FrustumLODNodePolicy.
                 (clj->js loaders)
                 renderer
                 (apply js/Array bbox)
                 nil
                 max-depth
                 (:imagery-source ro))
        camera (js/PlasioLib.Cameras.Orbital.
                e renderer
                (fn [eye target final? applying-state?]
                  ;; when the state is final and we're not applying a state, make a history
                  ;; record of this
                  ;;
                  (when (and final?
                             (not applying-state?))
                    (do-save-current-snapshot))

                  ;; go ahead and update the renderer
                  (.setEyeTargetPosition renderer
                                         eye target))
                ;; if there are any init-params to the camera, specify them here
                ;;
                (when (-> init-params :camera seq)
                  (println (:camera init-params))
                  (js-camera-props (:camera init-params))))]

    ;; add loaders to our renderer, the loader wants the actual classes and not the instances, so we use
    ;; Class.constructor here to add loaders, more like static functions in C++ classes, we want these functions
    ;; to depend on absolutely no instance state
    ;;
    (doseq [[type loader] loaders]
      (js/console.log loader)
      (.addLoader renderer (.-constructor loader)))

    ;; attach a resize handler
    (let [handle-resize (fn []
                          (let [w (.. js/window -innerWidth)
                                h (.. js/window -innerHeight)]
                            (.setRenderViewSize renderer w h)))]
      (set! (. js/window -onresize) handle-resize)
      (handle-resize))

    ;; listen to some properties
    (doto policy
      (.on "bbox"
           (fn [bb]
             (let [bn (.. bb -mins)
                   bx (.. bb -maxs)
                   x  (- (aget bx 0) (aget bn 0))
                   y  (- (aget bx 1) (aget bn 1))
                   z  (- (aget bx 2) (aget bn 2))
                   far-dist (* 2 (js/Math.sqrt (* x x) (* y y)))]

               ;; only set hints for distance etc. when no camera init parameters were specified
               (when-not (:camera init-params)
                 (.setHint camera (js/Array x y z)))

               (.updateCamera renderer 0 (js-obj "far" far-dist))))))

    ;; set some default render state
    (.setClearColor renderer 0 (/ 29 256) (/ 33 256))

    (.start policy)

    (when-let [dh (get-in init-params [:po :distance-hint])]
      (.setDistanceHint policy dh))

    (when-let [pmdr (get-in init-params [:po :max-depth-reduction-hint])]
      (.setMaxDepthReductionHint policy (js/Math.floor (- 5 pmdr))))

    ;; establish a listener for lines, just blindly accept lines and mutate our internal
    ;; state with list of lines
    (.addPropertyListener
     renderer (array "line-segments")
     (fn [segments]
       (reset! app-state-lines segments)))

    ;; return components we have here
    {:renderer renderer
     :target-element e
     :camera camera
     :overlay overlay
     :loaders loaders
     :policy policy}))

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

(defn enable-secondary-mode! []
  (when-not (:secondary-mode-enabled? @app-state)
    (swap! app-state assoc :secondary-mode-enabled? true)
    ;; when the secondar mode is applied, make sure we disable all camera interactions
    ;;
    (when-let [camera (get-in @app-state [:comps :camera])]
      (.enableControls camera false))

    (when-let [active-mode (:active-secondary-mode @app-state)]
      (when-let [mode (get-in @app-state [:modes active-mode])]
        (.activate mode)))))

(defn disable-secondary-mode! []
  (when (:secondary-mode-enabled? @app-state)
    (swap! app-state assoc :secondary-mode-enabled? false)

    ;; make sure camera controls are re-enabled
    (when-let [camera (get-in @app-state [:comps :camera])]
      (.enableControls camera true))

    (when-let [active-mode (:active-secondary-mode @app-state)]
      (if-let [mode (get-in @app-state [:modes active-mode])]
        (.deactivate mode)))))


(defn toggle-huds! []
  (swap! app-state
         #(-> %
              (update-in [:left-hud-collapsed?] not)
              (update-in [:right-hud-collapsed?] not))))

(defn attach-app-wide-shortcuts!
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


(defn attach-window-wide-events! []
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
                       <!
                       :body)
          override (or (history/current-state-from-query-string) {})
          local-settings (merge defaults override)
          remote-settings (<! (pipeline-params local-settings))

          settings (merge local-settings remote-settings)

          hard-blend? (get-in settings [:ro :intensity-blend])
          color? (:color? settings)
          intensity? (:intensity? settings)]

      (println "color? " color?)
      (println "intensity? " intensity?)

      (swap! app-state (fn [st] (merge-with conj st settings)))

      ;; if we don't yet have an intensity blend setting from the URL or
      ;; elsewhere, assign one based on whether we have color/intensity.
      (when (not hard-blend?)
        (swap! app-state assoc-in [:ro :intensity-blend]
               (if intensity? 0.2 0)))

      (if (not (get-in settings [:ro :imagery-source]))
        (swap! app-state assoc-in [:ro :imagery-source]
               (get-in (:imagery-sources defaults) [0 0])))

      ;; make sure the Z bounds are initialized correctly
      (let [bounds (:bounds remote-settings)
            zrange [(bounds 2) (bounds 5)]]
        (swap! app-state assoc-in [:ro :zrange] zrange))

      ;; merge any application state that may need to
      (when-let [as (plasio-state/get-application-settings)]
        (swap! app-state update :as merge as))

      (println "Startup state: " @app-state))

    (attach-app-wide-shortcuts!)
    (attach-window-wide-events!)
    (reagent/render-component [hud]
                              (. js/document (getElementById "app")))))


(startup)

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)

#_(fn []
    ;; get the left and right hud's up
    ;; we need these to place our controls and other fancy things
    ;;
    [:div.app-container
     ;; This is going to be where we render stuff
     [render-target]

     ;; hud elements
     (hud-left

       ;; show app brand
       [:div
        [:div#brand (or (:brand @app-state)
                        "Plasio-UI")
         [:div#sub-brand (or (:sub-brand @app-state)
                             "Dynamic Point Cloud Renderer")]]


        ;; Dataset info
        (let [[points size] (index-information)]
          [:div.dataset-info
           [:p.points points]
           #_[:p.index-size (str size " uncompressed")]])

        (let [primary-mode (:active-primary-mode @app-state)]
          [:div {:style {:margin "15px"}}
           [w/toolbar
            (fn [kind]
              (swap! app-state assoc :active-primary-mode kind)
              )
            [:point-rendering :cogs "Point Rendering Configuration" (and (= primary-mode :point-rendering) :active)]
            [:point-loading :tachometer "Point Loading" (and (= primary-mode :point-loading) :active)]
            [:point-manipulation :magic "Point Manipulation" (and (= primary-mode :point-manipulation) :active)]
            [:point-information :info-circle "Point Source Information" (and (= primary-mode :point-information) :active)]
            ]])]

       ;; Point appearance
       (let [mode (:active-primary-mode @app-state)]
         (with-meta
           (case mode
             :point-rendering
             [w/panel "Point Rendering"

              ;; imagery tile source
              [w/panel-section
               [w/desc "Imagery tile source"]
               [w/dropdown
                (get-in @app-state [:imagery-sources])
                (get-in @app-state [:ro :imagery-source])
                (not (:color? @app-state))
                #(let [source %
                       policy (get-in @app-state [:comps :policy])]
                  (swap! app-state assoc-in [:ro :imagery-source] source)
                  (.setImagerySource policy source))]]

              ;; point type
              [w/panel-section
               [w/desc "Circular or Square point rendering"]
               [:div.point-type {:style {:margin-left "5px"}}
                [:label
                 [:input.radio-inline
                  {:type    "radio"
                   :name    "pointType"
                   :checked (get-in @app-state [:ro :circular?])
                   :on-change #(swap! app-state assoc-in [:ro :circular?] true)
                   :value   "circular"}]
                 "Circular"]
                [:label
                 [:input.radio-inline
                  {:type    "radio"
                   :name    "pointType"
                   :checked (not (get-in @app-state [:ro :circular?]))
                   :on-change #(swap! app-state assoc-in [:ro :circular?] false)
                   :value   "square"}]
                 "Square"]
                ]]

              ;; base point size
              [w/panel-section
               [w/desc "Base point size"]
               [w/slider (get-in @app-state [:ro :point-size]) 1 10
                #(swap! app-state assoc-in [:ro :point-size] %)]]

              ;; point attenuation factor
              [w/panel-section
               [w/desc "Attenuation factor, points closer to you are bloated more"]
               [w/slider (get-in @app-state [:ro :point-size-attenuation]) 0 5
                #(swap! app-state assoc-in [:ro :point-size-attenuation] %)]]

              ;; intensity blending factor
              [w/panel-section
               [w/desc "Intensity blending, how much of intensity to blend with color"]
               [w/slider
                (get-in @app-state [:ro :intensity-blend])
                0
                1
                (:intensity? @app-state)
                #(swap! app-state assoc-in [:ro :intensity-blend] %)]]

              ;; intensity scaling clamp
              [w/panel-section
               [w/desc "Intensity scaling, narrow down range of intensity values"]
               [w/slider
                (get-in @app-state [:ro :intensity-clamps])
                0
                255
                (:intensity? @app-state)
                #(swap! app-state assoc-in [:ro :intensity-clamps] (vec (seq %)))]]]

             :point-loading
             [w/panel "Point Loading"

              ;; How close the first splitting plane is
              [w/panel-section
               [w/desc "Distance for highest resolution data.  Farther it is, more points get loaded."]
               [w/slider (get-in @app-state [:po :distance-hint]) 10 70
                #(swap! app-state assoc-in [:po :distance-hint] %)]]

              [w/panel-section
               [w/desc "Maximum resolution reduction.  Lower values means you see more of the lower density points."]
               [w/slider (get-in @app-state [:po :max-depth-reduction-hint]) 0 5
                #(swap! app-state assoc-in [:po :max-depth-reduction-hint] %)]]]

             :point-manipulation
             [w/panel "Point Manipulation"
              [w/panel-section
               [w/desc "Z-exaggeration.  Higher values stretch out elevation deltas more significantly."]
               [w/slider (get-in @app-state [:pm :z-exaggeration]) 1 12
                #(swap! app-state assoc-in [:pm :z-exaggeration] %)]]]

             :point-information
             (let [[points size] (index-information)]
               [w/panel "Point Source Information"
                [w/key-val-table
                 ["Point Count" points]
                 ["Uncompressed Index Size" size]
                 ["Powered By" "entwine"]
                 ["Caching" "Amazon CloudFront"]
                 ["Backend" "Amazon EC2"]]])

             nil)
           {:key mode})))

     [compass]

     (hud-right
       ;; display action buttons on the top
       #_[:div {:style {:height "40px"}}] ; just to push the toolbar down a little bt

       (let [current-mode (:active-secondary-mode @app-state)]
         [:div {}
          [w/toolbar
           (fn [kind]
             (swap! app-state update-in [:active-secondary-mode]
                    (fn [mode]
                      (println mode kind)
                      (when-not (= mode kind)
                        kind))))
           [:line-picker :map-marker "Line Picking"
            (and (= current-mode :line-picker) :active)]
           [:line-of-sight-picker :bullseye "Line of Sight"
            :disabled
            #_(and (= current-mode :line-of-sight-picker) :active)]
           [:follow-path :video-camera "Follow Path" :disabled]
           ; [:tag-regions :tags "Tag Regions" :disabled]
           [:bookmarks :bookmark-o "Bookmarks" :disabled]
           [:search :search "Search" :disabled]
           #_[:height-map :area-chart "Heightmap Coloring" (and (= current-mode :height-map) :active)]]

          (case current-mode
            :line-picker
            [w/panel "Line Picking"
             [w/desc "Hold shift and click to draw lines.  Release shift to finish"]
             [:div {:style {:margin "5px 0 0 5px"}}
              [:button.btn.btn-sm.btn-default
               {:on-click #(when-let [line-picker (get-in @app-state [:modes :line-picker])]
                            (.resetState line-picker))} "Clear All Lines"]]
             [w/panel "Elevation profile mapping"

              ;; wrap our tool bar into a div element so that we can push it right a bit
              [:div {:style {:margin-left "5px"}}
               [w/toolbar
                (fn [tool]
                  (case tool
                    :profile (do-profile)))
                [:profile :area-chart "Profile" (and (not (seq @app-state-lines))
                                                     :disabled)]]]]]

            :line-of-sight-picker
            [w/panel "Line of Sight"
             [w/desc "Shift-click to estimate line-of-sight"]
             [w/panel "Visibility Parameters"
              [w/panel-section
               [w/desc "Elevation of origin point"]
               [w/slider 2 1 50 #(do
                                  (when-let
                                    [los-picker (get-in
                                                  @app-state
                                                  [:modes
                                                   :line-of-sight-picker])]
                                    (.setHeight los-picker %)))]]
              [w/panel-section
               [w/desc "Traversal radius"]
               [w/slider 8 6 10 1 true #(do
                                         (when-let
                                           [los-picker (get-in
                                                         @app-state
                                                         [:modes
                                                          :line-of-sight-picker])]
                                           (.setRadius los-picker
                                                       (js/Math.pow 2 %))))]]]]

            [w/panel "Modal Tools"
             [w/panel-section
              [w/desc "Select a mode above to display additional tools"]]])])

       ;; if there are any line segments available, so the tools to play with them
       ;;
       (let [segments (some-> @app-state-lines
                              seq
                              js->clj
                              reverse)
             line-prefix "line"
             point-prefix "point"
             los-prefix "los"
             starts-with (fn [s prefix]
                           (and (>= (count s) (count prefix))
                                (= (subs s 0 (count prefix)) prefix)))]
         [:div
          (when-let [lines (seq (remove
                                  #(not (starts-with (nth % 0) line-prefix))
                                  segments))]
            [w/panel-with-close "Line Segments"
             ;; when the close button is hit on line-segments, we need to
             ;; reset the picker state the state will propagate down to making
             ;; sure that no lines exist in our app state
             #(do
               ;; reset line picker
               (when-let [line-picker (get-in @app-state [:modes :line-picker])]
                 (js/console.log line-picker)
                 (.resetState line-picker))

               ;; reset any profiles which are active
               (swap! app-state dissoc :profile-series))

             [w/panel-section
              [w/desc "All line segments in scene, lengths in data units."]
              (for [[id start end [r g b]] lines]
                ^{:key id} [:div.line-info
                            {:style {:color (str "rgb(" r "," g "," b ")")}}
                            (format-dist end start)])]])

          (when-let [los (seq (remove
                                #(not (starts-with (nth % 0) los-prefix))
                                segments))]
            [w/panel-with-close "Line of Sight Origin"
             ;; when the close button is hit on line-segments, we need to
             ;; reset the picker state the state will propagate down to making
             ;; sure that no lines exist in our app state
             #(do
               ;; reset line picker
               (when-let [los-picker (get-in @app-state
                                             [:modes :line-of-sight-picker])]
                 (.resetState los-picker)))

             [w/panel-section
              (for [[id start end [r g b]] los]
                ^{:key id} [:div.line-info
                            {:style {:color (str "rgb(200,200,200)")}}
                            (str (format-point start))])]])]))

     ;; if we have any profile views to show, show them
     (when-let [series (:profile-series @app-state)]
       [w/profile-view series #(swap! app-state dissoc :profile-series)])

     ;; the element which shows us all the system messages
     ;;
     (when-let [status (:status-message @app-state)]
       [w/status (:type status) (:message status)])])
