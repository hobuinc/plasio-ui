(ns plasio-ui.state
  (:require [om.core :as om]
            [cljs.reader :as reader]
            [plasio-ui.history :as history]
            [cljs.core.async :as async]
            [cljs-http.client :as http]
            [cljs.core.async :refer [<!]])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(defonce app-state (atom {:ui     {:open-panes   []
                                   :docked-panes []
                                   :locations {}
                                   :local-options {:flicker-fix false}}
                          :window {:width  0
                                   :height 0}
                          :ro     {:circular?              false
                                   :point-size             2
                                   :point-size-attenuation 0.1
                                   :intensity-blend        0
                                   :intensity-clamps       [0 255]
                                   :color-ramp             :red-to-green
                                   :color-ramp-range       [0 1]
                                   :zrange                 [0 1]}
                          :po     {:distance-hint            50
                                   :max-depth-reduction-hint 5}
                          :pm     {:z-exaggeration 1}
                          :comps  {}}))

(def root-state (om/root-cursor app-state))

(def root (om/ref-cursor root-state))
(def window (om/ref-cursor (:window root-state)))
(def ui (om/ref-cursor (:ui root-state)))
(def ui-locations (om/ref-cursor (:locations ui)))
(def ui-local-options (om/ref-cursor (:local-options ui)))
(def ro (om/ref-cursor (:ro root-state)))
(def po (om/ref-cursor (:po root-state)))
(def pm (om/ref-cursor (:pm root-state)))
(def comps (om/ref-cursor (:comps root-state)))


(defn toggle-pane! [id]
  (om/transact!
    ui
    (fn [ui]
      (let [op (-> ui :open-panes set)
            dp (-> ui :docked-panes set)]
        (if (or (op id) (dp id))
          (assoc ui
            :open-panes (vec (disj op id))
            :docked-panes (vec (disj dp id)))
          (assoc ui
            :open-panes (vec (conj op id))))))))

(defn dock-pane! [id]
  (om/transact!
    ui
    (fn [ui]
      (let [op (-> ui :open-panes set)
            dp (-> ui :docked-panes set)]
        (when (op id)
          (assoc ui :docked-panes (vec (conj dp id))
                    :open-panes (vec (disj op id))))))))

(defn undock-pane! [id]
  (om/transact!
    ui
    (fn [ui]
      (let [op (-> ui :open-panes set)
            dp (-> ui :docked-panes set)]
        (when (dp id)
          (assoc ui :docked-panes (vec (disj dp id))
                    :open-panes (vec (conj op id))))))))


(let [ls js/localStorage]
  (defn save-val! [key val]
    (let [v (pr-str val)]
      (.setItem js/localStorage (name key) v)))

  (defn get-val [key]
    (when-let [v (.getItem js/localStorage (name key))]
      (reader/read-string v))))


(defn set-ui-location! [id pos]
  (om/transact!
    ui-locations
    #(assoc % id pos)))

(defn save-local-state! [state]
  (save-val! "local-app-state" state))

(defn load-local-state []
  (get-val "local-app-state"))

(defn save-typed-address [val]
  (save-val! "saved-address" val))

(defn get-last-typed-address []
  (get-val "saved-address"))

(defn window-placement-seq []
  (iterate (fn [{l :left t :top}]
             {:left (+ l 20)
              :top  (+ t 20)})
           {:left 30 :top 50}))


(defn rearrange-panels []
  (om/transact! ui-locations
                (fn [_]
                  (into {}
                        (map (fn [id new-loc]
                               [id new-loc])
                             (:open-panes @ui)
                             (window-placement-seq))))))


(defn- js-camera-props [{:keys [azimuth distance max-distance target elevation]}]
  (js-obj
    "azimuth" azimuth
    "distance" distance
    "maxDistance" max-distance
    "target" (apply array target)
    "elevation" elevation))


(defn- camera-state [cam]
  {:azimuth (.. cam -azimuth)
   :distance (.. cam -distance)
   :max-distance (.. cam -maxDistance)
   :target (into [] (.. cam -target))
   :elevation (.. cam -elevation)})

(defn- ui-state [st]
  (select-keys st [:ro :po :pm]))

(defn- params-state [st]
  (select-keys st [:server :pipeline]))

(defn- save-current-snapshot!
  "Take a snapshot from the camera and save it"
  []
  (if-let [camera (:camera @comps)]
    (history/push-state
      (merge
        {:camera (camera-state camera)}
        (ui-state @root)
        (params-state @root)))))

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

                  ;; make renderer show our new view
                  (.setEyeTargetPosition renderer
                                         eye target))
                ;; if there are any init-params to the camera, specify them here
                ;;
                (when (-> init-params :camera seq)
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
    ;;
    (.setRenderOptions renderer
                       (js-obj "circularPoints" 0
                               "overlay_f" 0
                               "rgb_f" 1
                               "map_f" 0
                               "intensity_f" 1
                               "clampLower" (nth (:intensity-clamps ro) 0)
                               "clampHigher" (nth (:intensity-clamps ro) 1)
                               "maxColorComponent" (get render-hints :max-color-component 255)
                               "pointSize" (:point-size ro)
                               "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
                               "intensityBlend" (:intensity-blend ro)
                               "xyzScale" (array 1 1 (get-in init-params [:pm :z-exaggeration]))))
    (.setClearColor renderer 0 (/ 29 256) (/ 33 256))

    (.start policy)

    (when-let [dh (get-in init-params [:po :distance-hint])]
      (.setDistanceHint policy dh))

    (when-let [pmdr (get-in init-params [:po :max-depth-reduction-hint])]
      (.setMaxDepthReductionHint policy (js/Math.floor (- 5 pmdr))))

    ;; establish a listener for lines, just blindly accept lines and mutate our internal
    ;; state with list of lines
    #_(.addPropertyListener
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


(def mapbox-token "pk.eyJ1IjoiaG9idSIsImEiOiItRUhHLW9NIn0.RJvshvzdstRBtmuzSzmLZw")

(defn resolve-address [address]
  (let [escaped (js/encodeURIComponent address)
        url (str "https://api.mapbox.com/v4/geocode/mapbox.places/"
                 address ".json?access_token=" mapbox-token)]
    (go
      (when-let [res (some-> url
                             (http/get {:with-credentials? false})
                             <!
                             :body
                             js/JSON.parse
                             (js->clj :keywordize-keys true)
                             (get-in [:features 0]))]
        (println res)
        {:coordinates (:center res)
         :address (:place_name res)}))))

(defn- world-x-range [bounds]
  (let [sx (bounds 0)
        ex (bounds 3)
        center (+ sx (/ (- ex sx) 2))]
    [sx ex center]))

(defn- fix-easting [bounds x]
  (let [[minx maxx midx] (world-x-range bounds)]
    (println minx maxx)
    (println midx)
    (- (* midx 2) x)))

(defn data-range [bounds]
  [(- (bounds 3) (bounds 0))
   (- (bounds 4) (bounds 1))
   (- (bounds 5) (bounds 2))])

(defn mapr [v ins ine outs oute]
  (let [f (/ (- v ins) (- ine ins))]
    (+ outs (* f (- oute outs)))))


(defn transition-to [x y]
  (let [bounds (:bounds @root)
        [rx ry _] (data-range bounds)
        x' (mapr (fix-easting bounds x)
                 (bounds 0) (bounds 3)
                 (- (/ rx 2)) (/ rx 2))
        y' (mapr y (bounds 1) (bounds 4)
                 (- (/ ry 2)) (/ rx 2))
        camera (:camera @comps)]
    (println "-- -- incoming: " x y)
    (println "-- -- computed: " x' y')
    ;; may need to do something about easting
    (.transitionTo camera x' nil y')))
