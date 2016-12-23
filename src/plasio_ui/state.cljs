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


(def ^:private default-init-state
  {:ui     {:open-panes   []
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
   :intensity-histogram {}
   :comps  {}
   :clicked-point-info {}})

(defonce app-state (atom default-init-state))

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
(def intensity-histogram (om/ref-cursor (:intensity-histogram root-state)))
(def current-actions (om/ref-cursor (:current-actions root-state)))
(def clicked-point-info (om/ref-cursor (:clicked-point-info root-state)))


(def default-resources
  [["Autzen", "autzen-h", "http://cache.greyhound.io/"]
   ["Half Dome", "half-dome-h", "http://cache.greyhound.io/"]
   ["Iowa", "iowa-h", "http://cache.greyhound.io/"]
   ["Iowa Bridge", "iowa-bridge-h", "http://cache.greyhound.io/"]
   ["Lake Isabella", "isa-h", "http://cache.greyhound.io/"]
   ["Lone Star Geyser", "lone-star-h", "http://cache.greyhound.io/"]
   ["Minnesota", "mn-h", "http://cache.greyhound.io/"]
   ["Nepal", "nepal-h", "http://cache.greyhound.io/"]
   ["New York City", "nyc-h", "http://cache.greyhound.io/"]
   ["Red Rock Amphitheatre", "redrock-h", "http://cache.greyhound.io/"]
   ["Space Shuttle", "shuttle-h", "http://cache.greyhound.io/"]])


(defn reset-app-state! []
  (om/update! root default-init-state))


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

(defn current-state-snapshot []
  (if-let [camera (.-activeCamera (:mode-manager @comps))]
    (merge
     {:camera (camera-state (:bounds @root) camera)}
     (ui-state @root)
     (params-state @root))))

(defn- save-current-snapshot!
  "Take a snapshot from the camera and save it"
  []
  (when-let [snapshot (current-state-snapshot)]
    (history/push-state snapshot)))

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

(defn- sources-array [channels]
  (apply array
         (for [i (range 4)
               :let [c (keyword (str "channel" i))]]
           (get-in channels [c :source]))))

(declare update-current-point-info)

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

        color-info (util/schema->color-info schema)

        bbox [(nth bounds 0) (nth bounds 2) (nth bounds 1)
              (nth bounds 3) (nth bounds 5) (nth bounds 4)]

        ;; if there are any sources that are specified in the render options, set them up
        sources (sources-array (:channels ro))

        allow-greyhound-creds? (true? (:allowGreyhoundCredentials init-params))

        loaders [(js/PlasioLib.Loaders.GreyhoundPipelineLoader.
                   server resource
                   (clj->js schema)
                   (js-obj
                     ;; load whichever sources were were asked to
                    "imagerySources" (sources-array (:channels ro))

                    ;; should we send down withCredentials = true for greyhound requests?
                    "allowGreyhoundCredentials" allow-greyhound-creds?))
                 (js/PlasioLib.Loaders.TransformLoader.)]
        policy (js/PlasioLib.FrustumLODNodePolicy.
                 "plasio-ui"
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
                                    (not applying-state?)
                                    (:useBrowserHistory init-params))
                           (do-save-current-snapshot))

                         ;; make renderer show our new view
                         (.setEyeTargetPosition renderer
                                                eye target))
                       (when (-> init-params :camera seq)
                         (js-camera-props bounds (:camera init-params))))
        camera (aget mode-manager "camera")]

    ;; list to any synthetic point clicks, on the camera mode
    (.registerHandler camera
                      "synthetic-click-on-point"
                      (fn [obj]
                        (update-current-point-info server resource
                                                   schema
                                                   allow-greyhound-creds?
                                                   bounds (js->clj (aget obj "pointPos")))))

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
                          (let [r (.getBoundingClientRect e)
                                w (.. r -width)
                                h (.. r -height)]
                            (println "-- -- renderer size is:" w h)
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
                               "pointSize" (:point-size ro)
                               "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
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


(defn set-channel-source! [channel source]
  ;; setting a new source on a channel will wipe out all settings
  (om/transact! ro #(assoc-in % [:channels channel] {:source source})))

(defn set-channel-contribution! [channel source]
  (om/transact! ro #(assoc-in % [:channels channel :contribution] source)))

(defn mute-channel! [channel mute?]
  (om/transact! ro #(-> %
                        (assoc-in [:channels channel :mute?] mute?)
                        (assoc-in [:channels channel :solo?] false))))

(defn solo-channel! [channel solo?]
  (om/transact! ro #(-> %
                        (assoc-in [:channels channel :solo?] solo?)
                        (assoc-in [:channels channel :mute?] false))))

(defn set-channel-ramp! [channel ramp]
  (om/transact! ro #(assoc-in % [:channels channel :range-clamps] ramp)))

(defn mkjson [v]
  (js/JSON.stringify (clj->js v)))

(defn- ru32 [buff offset]
  (let [b (js/DataView. buff offset)]
    (aget b 0)))

(defn- point-count [arraybuffer]
  (let [dv (js/DataView. arraybuffer (- (.-byteLength arraybuffer) 4))]
    (.getUint32 dv 0 true)))

(let [fn-types {"signed" "Int", "unsigned" "Uint", "floating" "Float"}]
  (defn- decode-val [type size dv offset]
    (let [fn-name (str "get"
                       (fn-types type)
                       (* size 8))
          f (aget dv fn-name)]
      (.call f dv offset true))))

(defn- decode-point [dv schema]
  (loop [offset 0
         point []
         s schema]
    (if (seq s)
      (let [{:keys [name size type]} (first s)]
        (recur
         (+ offset size)
         (conj point [name size (decode-val type size dv offset)])
         (rest s)))
      point)))

(defn- decode-points [schema arraybuffer]
  (let [pc (point-count arraybuffer)
        schema-size (util/schema->point-size schema)
        points (into []
                     (for [i (range pc)
                           :let [offset (* i schema-size)
                                 dv (js/DataView. arraybuffer offset schema-size)]]
                       (decode-point dv schema)))]
    points))

(defn update-current-point-info [server resource schema creds? bounds loc]
  (let [ploc (util/app->data-units bounds loc)]
    (om/update! root :clicked-point-load-in-progress? true)
    (go
      (let [delta 0.001 ; this probably needs to be something based on the data range
            bounds [(- (ploc 0) delta) (- (ploc 1) delta) (- (ploc 2) delta)
                    (+ (ploc 0) delta) (+ (ploc 1) delta) (+ (ploc 2) delta)]
            url (str server "resource/" resource "/read?"
                     (str "bounds=" (mkjson bounds)) "&"
                     (str "schema=" (mkjson schema)) "&"
                     "depthBegin=0&depthEnd=30" "&"
                     "compress=false&"
                     "offset=[0,0,0]")
            res (<! (util/binary-http-get< url {:with-credentials? creds?}))
            points (when res (decode-points schema res))]

        (om/update! root :clicked-point-load-in-progress? false)
        (when (seq points)
          (om/update! clicked-point-info points))))))

