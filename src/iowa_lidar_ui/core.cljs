(ns ^:figwheel-always iowa-lidar-ui.core
    (:require [iowa-lidar-ui.widgets :as w]
              [reagent.core :as reagent :refer [atom]]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:left-hud-collapsed? false
                          :right-hud-collapsed? false}))

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

(declare initialize-for-pipeline)

(defn render-target []
  (let [this (reagent/current-component)]
    (reagent/create-class
      {:component-did-mount
       (fn []
         (let [comps (initialize-for-pipeline (reagent/dom-node this)
                                              {:server    "http://data.iowalidar.com"
                                               :pipeline  "ia-nineteen"
                                               :max-depth 19
                                               :compress? true
                                               :bbox      [-10796577.371225, 4902908.135781, 0,
                                                           -10015953.953824, 5375808.896799, 1000]
                                               :imagery?  true})]
           (swap! app-state assoc :comps comps)))

       :reagent-render
       (fn []
         [:div#render-target])})))

(defn hud []
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
       [w/slider 2 1 10
        (fn [val]
          (when-let [r (get-in @app-state [:comps :renderer])]
            (.setRenderOptions r (js-obj "pointSize" val))))]]

      ;; point attenuation factor
      [w/panel-section
       [w/desc "Attenuation factor, points closer to you are bloated more"]
       [w/slider 1 0 5
        (fn [val]
          (when-let [r (get-in @app-state [:comps :renderer])]
            (.setRenderOptions r (js-obj "pointSizeAttenuation" (array 1 val)))))]]]

     ;; split plane distance
     [w/panel "Point Loading"

      ;; How close the first splitting plane is
      [w/panel-section
       [w/desc "Distance for highest resolution data.  Farther it is, more points get loaded."]
       [w/slider 50 10 70
        (fn [val]
          (when-let [policy (get-in @app-state [:comps :policy])]
            (.setDistanceHint policy val)))]]])


   #_(hud-right
     (w/panel "Many Descriptions"
              [:div "Hi"]))])

(defn initialize-for-pipeline [e {:keys [server pipeline max-depth
                                         compress? color? intensity? bbox
                                         imagery?]}]
  (let [create-renderer (.. js/window -renderer -core -createRenderer)
        renderer (create-renderer e)
        loaders (merge
                  {:point     (js/PlasioLib.Loaders.GreyhoundPipelineLoader. server pipeline max-depth compress? color? intensity?)
                   :transform (js/PlasioLib.Loaders.TransformLoader.)}
                  (when imagery?
                    {:overlay (js/PlasioLib.Loaders.MapboxLoader.)}))
        policy (js/PlasioLib.FrustumLODNodePolicy. (clj->js loaders) renderer (apply js/Array bbox))
        camera (js/PlasioLib.Cameras.Orbital. e renderer
                                              (fn [eye target]
                                                (doto renderer
                                                  (.setEyePosition eye)
                                                  (.setTargetPosition target))))]

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
                            (println "resizing to:" w h)
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
               (print "setting hint:" x y z)
               (.setHint camera (js/Array x y z))
               (.updateCamera renderer 0 (js-obj "far" far-dist)))))

      (.on "view-changed"
           (fn []
             (println "view-changed!"))))

    ;; set some default render state
    ;;
    (.setRenderOptions renderer
                     (js-obj "pointSize" 1
                             "circularPoints" 1
                             "overlay_f" 1))
    (.setClearColor renderer 0.1 0 0)

    (.start policy)

    {:renderer renderer
     :policy policy}))

(reagent/render-component [hud]
                          (. js/document (getElementById "app")))


(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
) 

