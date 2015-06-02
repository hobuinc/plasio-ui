(ns ^:figwheel-always iowa-lidar-ui.core
    (:require [iowa-lidar-ui.widgets :as w]
              [iowa-lidar-ui.math :as math]
              [iowa-lidar-ui.history :as history]
              [reagent.core :as reagent :refer [atom]]
              [cljs.core.async :as async]
              cljsjs.gl-matrix)
    (:require-macros [cljs.core.async.macros :refer [go]]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:left-hud-collapsed? false
                          :right-hud-collapsed? false
                          :ro {:point-size 2
                               :point-size-attenuation 1}
                          :po {:distance-hint 50
                               :max-depth-reduction-hint 5}}))

;; when this value is true, everytime the app-state atom updates, a snapshot is requested (history)
;; when this is set to false, you may update the app-state without causing a snapshot however the UI
;; state will still update
(def ^:dynamic ^:private *save-snapshot-on-ui-update* true)

;; Much code duplication here, but I don't want to over engineer this
;;
(defn hud-left [& children]
  (let [is-collapsed? (:left-hud-collapsed? @app-state)]
    [:div.hud-container.hud-left
     {:class (when is-collapsed? " hud-collapsed")}
     [:a.hud-collapse {:href     "javascript:"
                       :on-click #(swap! app-state update-in [:left-hud-collapsed?] not)}
      (if is-collapsed? "\u00BB" "\u00AB")]
     (into [:div.hud-contents] children)]))


(defn hud-right [& children]
  (let [is-collapsed? (:right-hud-collapsed? @app-state)]
    [:div.hud-container.hud-right
     {:class (when is-collapsed? " hud-collapsed")}
     [:a.hud-collapse {:href     "javascript:"
                       :on-click #(swap! app-state update-in [:right-hud-collapsed?] not)}
      (if is-collapsed? "\u00AB" "\u00BB")]
     (into [:div.hud-contents] children)]))



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
  (select-keys st [:ro :po]))

(defn- apply-state!
  "Given a state snapshot, apply it"
  [params]
  ;; apply camera state if any
  (when-let [cp (:camera params)]
    (let [camera (get-in @app-state [:comps :camera])]
      (.applyState camera (js-camera-props cp))))

  ;; apply UI state if any
  (swap! app-state merge (select-keys params [:ro :po])))

(defn- save-current-snapshot!
  "Take a snapshot from the camera and save it"
  []
  (if-let [camera (get-in @app-state [:comps :camera])]
    (history/push-state
     (merge 
      {:camera (camera-state camera)}
      (ui-state @app-state)))))

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
         p (get-in n [:comps :policy])]
     (.setRenderOptions r (js-obj
                           "pointSize" (get-in n [:ro :point-size])
                           "pointSizeAttenuation" (array 1 (get-in n [:ro :point-size-attenuation]))))

     (doto p
       (.setDistanceHint (get-in n [:po :distance-hint]))
       (.setMaxDepthReductionHint (->> (get-in n [:po :max-depth-reduction-hint])
                                       (- 5)
                                       js/Math.floor))))))


(defn render-target []
  (let [this (reagent/current-component)]
    (reagent/create-class
      {:component-did-mount
       (fn []
         (let [init-state (history/current-state-from-query-string)
               comps (initialize-for-pipeline (reagent/dom-node this)
                                              {:server    "http://data.iowalidar.com"
                                               :pipeline  "ia-nineteen"
                                               :max-depth 19
                                               :compress? true
                                               :bbox      [-10796577.371225, 4902908.135781, 0,
                                                           -10015953.953824, 5375808.896799, 1000]
                                               :imagery?  true
                                               :init-params init-state})]
           (swap! app-state assoc :comps comps))

         ;; listen to changes to history
         (history/listen (fn [st]
                          (apply-state! st))))

       :reagent-render
       (fn []
         [:div#render-target])})))



(defn hud []
  (reagent/create-class
   {:component-did-mount
    (fn []
      ;; subscribe to state changes, so that we can trigger approprate render options
      ;;
      (add-watch app-state "__render-applicator"
                 (fn [_ _ o n]
                   (apply-ui-state! n)
                   (when *save-snapshot-on-ui-update*
                     (do-save-current-snapshot)))))
    
    :reagent-render 
    (fn []
      ;; get the left and right hud's up
      ;; we need these to place our controls and other fancy things
      ;;
      [:div.container
       ;; This is going to be where we render stuff
       [render-target]

       ;; hud elements
       (hud-left
        ;; show app brand
        [:div#brand "Iowa-Lidar"
         [:div#sub-brand "Statewide Point Cloud Renderer"]]

        ;; Point size
        [w/panel "Point Rendering"

         ;; base point size
         [w/panel-section
          [w/desc "Base point size"]
          [w/slider (get-in @app-state [:ro :point-size]) 1 10
           #(swap! app-state assoc-in [:ro :point-size] %)]]

         ;; point attenuation factor
         [w/panel-section
          [w/desc "Attenuation factor, points closer to you are bloated more"]
          [w/slider (get-in @app-state [:ro :point-size-attenuation]) 0 5
           #(swap! app-state assoc-in [:ro :point-size-attenuation] %)]]]

        ;; split plane distance
        [w/panel "Point Loading"

         ;; How close the first splitting plane is
         [w/panel-section
          [w/desc "Distance for highest resolution data.  Farther it is, more points get loaded."]
          [w/slider (get-in @app-state [:po :distance-hint]) 10 70
           #(swap! app-state assoc-in [:po :distance-hint] %)]]

         [w/panel-section
          [w/desc "Maximum resolution reduction.  Lower values means you see more of the lower density points."]
          [w/slider (get-in @app-state [:po :max-depth-reduction-hint]) 0 5
           #(swap! app-state assoc-in [:po :max-depth-reduction-hint] %)]]])

       [compass]


       #_(hud-right
          (w/panel "Many Descriptions"
                   [:div "Hi"]))])}))

(defn initialize-for-pipeline [e {:keys [server pipeline max-depth
                                         compress? color? intensity? bbox
                                         imagery?
                                         init-params]}]
  (let [create-renderer (.. js/window -renderer -core -createRenderer)
        renderer (create-renderer e)
        loaders (merge
                 {:point     (js/PlasioLib.Loaders.GreyhoundPipelineLoader. server pipeline max-depth compress? color? intensity?)
                  :transform (js/PlasioLib.Loaders.TransformLoader.)}
                 (when imagery?
                   {:overlay (js/PlasioLib.Loaders.MapboxLoader.)}))
        policy (js/PlasioLib.FrustumLODNodePolicy. (clj->js loaders) renderer (apply js/Array bbox))
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
                  (doto renderer
                    (.setEyePosition eye)
                    (.setTargetPosition target)))
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

    ;; listen to some properties properties
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
    ;;
    (.setRenderOptions renderer
                       (js-obj "pointSize" 1
                               "circularPoints" 1
                               "overlay_f" 1
                               "pointSize" (get-in init-params [:ro :point-size] 2)
                               "pointSizeAttenuation" (array 1 (get-in init-params [:ro :point-size-attenuation] 2))))
    (.setClearColor renderer 0.1 0 0)

    (.start policy)

    (when-let [dh (get-in init-params [:po :distance-hint])]
      (.setDistanceHint policy dh))

    (when-let [pmdr (get-in init-params [:po :max-depth-reduction-hint])]
      (.setMaxDepthReductionHint policy (js/Math.floor (- 5 pmdr))))

    ;; also make sure that initial state is applied
    ;;
    {:renderer renderer
     :target-element e
     :camera camera
     :policy policy}))

(defn startup []
  (when-let [init-state (history/current-state-from-query-string)]
    ;; just apply the UI state here, the camera state will be passed down as params to the
    ;; renderer initializer
    ;;
    (println init-state)
    (swap! app-state merge (select-keys init-state [:ro :po])))

  (reagent/render-component [hud]
                            (. js/document (getElementById "app"))))


(startup)

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
) 

