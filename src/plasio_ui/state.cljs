(ns plasio-ui.state
  (:require [om.core :as om]
            [cljs.reader :as reader]
            [plasio-ui.history :as history]
            [plasio-ui.util :as util]
            [plasio-ui.components :as components]
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
                          :current-actions {}
                          :histogram {}
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
(def histogram (om/ref-cursor (:histogram root-state)))
(def current-actions (om/ref-cursor (:current-actions root-state)))


(def known-resources
  [["New York City" "nyc" "devdata.greyhound.io"]
   ["St. Paul, MN" "st-paul" "devdata.greyhound.io"]
   ["Delaware" "sandy" "devdata.greyhound.io"]
   ["Iowa" "iowa" "devdata.greyhound.io"]
   ["Lake Isabella" "isa" "devdata.greyhound.io"]
   ["Nepal" "nepal" "devdata.greyhound.io"]
   ["Autzen" "autzen" "devdata.greyhound.io"]
   ["Half Dome" "half-dome" "devdata.greyhound.io"]])


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

(defn toggle-docker! []
  (om/transact! ui-local-options :docker-collapsed? not))


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

(defn save-local-state! [id state]
  (save-val! (str "local-app-state." id) state))

(defn load-local-state [id ]
  (get-val (str "local-app-state." id)))

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


(defn set-active-panel! [panel]
  (om/transact! ui-local-options #(assoc % :active-panel panel)))


(defn- js-camera-props [bbox {:keys [azimuth distance max-distance target elevation]}]
  (js-obj
    "azimuth" azimuth
    "distance" distance
    "maxDistance" max-distance
    "target" (apply array (util/data-units->app bbox target))
    "elevation" elevation))


(defn- camera-state [bbox cam]
  {:azimuth      (aget cam "azimuth")
   :distance     (aget cam "distance")
   :max-distance (aget cam "maxDistance")
   :target       (into [] (util/app->data-units bbox (aget cam "target")))
   :elevation    (aget cam "elevation")})

(defn- ui-state [st]
  (select-keys st [:ro :po :pm :ui]))

(defn- params-state [st]
  (select-keys st [:server :resource]))

(defn- save-current-snapshot!
  "Take a snapshot from the camera and save it"
  []
  (if-let [camera (.-activeCamera (:mode-manager @comps))]
    (history/push-state
      (merge
        {:camera (camera-state (:bounds @root) camera)}
        (ui-state @root)
        (params-state @root)))))

(defn- wrap-dismiss-context-menu [f]
  (fn [& args]
    (om/update! current-actions {})
    (apply f args)))

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

(defn initialize-for-resource [e {:keys [server resource
                                         schema
                                         bounds ro
                                         render-hints
                                         init-params]}]
  (println "render-hints:" render-hints)
  (println "render-options:" ro)
  (println "init-params:" init-params)
  (println "bbox:" bounds)
  (let [create-renderer (aget js/window "renderer" "core" "createRenderer")
        renderer (create-renderer e)
        bbox [(nth bounds 0) (nth bounds 2) (nth bounds 1)
              (nth bounds 3) (nth bounds 5) (nth bounds 4)]
        loaders [(js/PlasioLib.Loaders.GreyhoundPipelineLoader.
                   server resource
                   (clj->js schema)
                   (or (:imagery-source ro) "mapbox.satellite"))
                 (js/PlasioLib.Loaders.TransformLoader.)]
        policy (js/PlasioLib.FrustumLODNodePolicy.
                 (apply array loaders)
                 renderer
                 (clj->js {:pointCloudBBox bbox
                           :normalize true}))
        mode-manager (js/PlasioLib.ModeManager.
                       e renderer
                       (clj->js
                         {:pointCloudBounds bounds})
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
                       (when (-> init-params :camera seq)
                         (js-camera-props bounds (:camera init-params))))]

    ;; mode manager will let us know about any context menu actions we
    ;; need to handle
    (.addActionListener mode-manager
                        (fn [actions info]
                          ;; if we were provided with actions then show them
                          ;; otherwise we show our own list
                          (let [acts (js->clj actions :keywordize-keys true)
                                info (js->clj info :keywordize-keys true)
                                actions-to-use (if (empty? acts)
                                                 ;; no actions from any of the modes, provide our
                                                 ;; own actions
                                                 {:camera ["Camera" #(set! (.-activeMode mode-manager) "camera")]
                                                  :lines  ["Pick Line Segments" #(set! (.-activeMode mode-manager) "line")]
                                                  :point  ["Pick Points" #(set! (.-activeMode mode-manager) "point")]}
                                                 acts)]

                            ;; make sure all actions can dismiss the popup
                            (om/update! current-actions
                                        {:actions (into {}
                                                        (for [[k [title f]] actions-to-use]
                                                          [k [title (wrap-dismiss-context-menu f)]]))
                                         :pos (:pos info)
                                         :screenPos (:screenPos info)}))))

    ;; add loaders to our renderer, the loader wants the actual classes and not the instances, so we use
    ;; Class.constructor here to add loaders, more like static functions in C++ classes, we want these functions
    ;; to depend on absolutely no instance state
    ;;
    (doseq [loader loaders]
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
             (let [bn (aget bb "mins")
                   bx (aget bb "maxs")
                   x  (- (aget bx 0) (aget bn 0))
                   y  (- (aget bx 1) (aget bn 1))
                   z  (- (aget bx 2) (aget bn 2))
                   far-dist (* 2 (js/Math.sqrt (* x x) (* y y)))]

               ;; only set hints for distance etc. when no camera init parameters were specified
               (when-not (:camera init-params)
                 (.propagateDataRangeHint mode-manager x y z))

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
                               "maxColorComponent" 8
                               "pointSize" (:point-size ro)
                               "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
                               "intensityBlend" (:intensity-blend ro)
                               "xyzScale" (array 1 1 (get-in init-params [:pm :z-exaggeration]))))
    (.setClearColor renderer 0 (/ 29 256) (/ 33 256))
    (.start policy)


    ;; TODO: This is TEMPORARY
    #_(components/set-active-autotool! :profile renderer {})

    ;; establish a listener for lines, just blindly accept lines and mutate our internal
    ;; state with list of lines
    #_(.addPropertyListener
     renderer (array "line-segments")
     (fn [segments]
       (reset! app-state-lines segments)))

    ;; return components we have here
    {:renderer renderer
     :target-element e
     :mode-manager mode-manager
     :point-loader (first loaders)
     :loaders loaders
     :policy policy}))


(defn show-search-box! []
  (om/transact! ui-local-options
                #(assoc % :search-box-visible? true)))

(defn toggle-search-box! []
  (om/transact! ui-local-options
                #(update % :search-box-visible? not)))

(defn hide-search-box! []
  (om/transact! ui-local-options
                #(assoc % :search-box-visible? false)))


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

(defn transition-to [x y]
  (let [bounds (:bounds @root)
        [rx ry _] (data-range bounds)
        x' (util/mapr (fix-easting bounds x)
                      (bounds 0) (bounds 3)
                      (- (/ rx 2)) (/ rx 2))
        y' (util/mapr y (bounds 1) (bounds 4)
                      (- (/ ry 2)) (/ rx 2))
        camera (.-activeCamera (:mode-manager @comps))]
    (println "-- -- incoming: " x y)
    (println "-- -- computed: " x' y')
    ;; may need to do something about easting
    (.transitionTo camera x' nil y')))
