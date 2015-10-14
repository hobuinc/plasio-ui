(ns plasio-ui.app-widgets
  (:require [om.core :as om]
            [om-tools.core :refer-macros [defcomponentk]]
            [om-tools.dom :as d]
            [om-bootstrap.input :as i]
            [om-bootstrap.button :as b]
            [om-bootstrap.random :as r]
            [plasio-ui.config :as config]
            [plasio-ui.state :as plasio-state]
            [plasio-ui.widgets :as w]
            [goog.string :as gs]
            [goog.string.format]
            [clojure.string :as s]
            [plasio-ui.math :as math]
            [cljs.core.async :refer [<!]]
            [plasio-ui.util :as util])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(let [id :rendering-options]
  (defcomponentk rendering-options-pane [owner]
    (render [_]
      (let [ro (om/observe owner plasio-state/ro)]
        (d/div
          ;; checkbox for circular points
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Circular Points?"
                      :checked   (:circular? @ro)
                      :on-change (fn [] (om/transact! plasio-state/ro #(update % :circular? not)))}))

          ;; slider for point size
          (om/build w/labeled-slider
                    {:text    "Point Size"
                     :min     1
                     :max 10
                     :start (get @ro :point-size 2) :step 1
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :point-size val)))})

          ;; slider for point size attentuation
          (om/build w/labeled-slider
                    {:text    "Point Size Attenuation"
                     :min     0.0
                     :max 2.0
                     :start (get @ro :point-size-attenuation 0.1) :step 0.1
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :point-size-attenuation val)))})

          ;; intensity blending
          (om/build w/labeled-slider
                    {:text    "Color/Intensity Blending"
                     :min     0.0
                     :max 1.0
                     :start (get @ro :intensity-blend 0) :step 0.01
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :intensity-blend val)))})

          ;; intensity blend ranging
          (om/build w/labeled-slider
                    {:text    "Intensity Values Scaling"
                     :min     0
                     :max 255
                     :start (get @ro :intensity-clamps 0) :step 1
                     :connect true
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :intensity-clamps val)))}))))))

(defn- css-color [[r g b]]
  (str "rgb("
       (js/Math.floor (* 255 r)) ","
       (js/Math.floor (* 255 g)) ","
       (js/Math.floor (* 255 b)) ")"))

(defn grad-svg
  ([s e]
    (grad-svg s e 16 10 nil nil))

  ([s e w h stop1 stop2]
   (let [id (gensym "grad")]
     (d/svg
       {:width w :height h}
       (d/defs
         (d/linearGradient
           {:id id :x1 0 :y1 0 :x2 1 :y2 0}
           (d/stop {:offset "0%" :stop-color (css-color s)})

           (when stop1
             (d/stop {:offset (str (* stop1 100) "%") :stop-color (css-color s)}))
           (when stop2
             (d/stop {:offset (str (* stop2 100) "%") :stop-color (css-color e)}))

           (d/stop {:offset "100%" :stop-color (css-color e)})))
       (d/rect {:x      0
                :y      0
                :width  w
                :height h
                :style  {:fill (str "url(#" id ")")}})))))



(defcomponentk ramp-button [[:data id s e f] owner]
  (render [_]
    (b/button
      {:bs-size "small"
       :on-click f}
      (grad-svg s e))))

(defcomponentk ramp-widget [[:data ro f fr] owner]
  (render [_]
    (d/div
      (d/div {:class "text"} "Height Ramp Color Source")
      (d/div
        {:class "ramps-container"}
        (apply
          b/button-group {}
          (om/build-all ramp-button
                        (map (fn [[id [s e]]]
                               {:id id :s s :e e
                                :f (partial f id)})
                             config/color-ramps)
                        {:key :id})))

      ;; finally draw the fancy svg with our current offsets
      (let [[left right] (:color-ramp-range ro)
            [s e] (get config/color-ramps
                       (or (:color-ramp ro) :red-to-green))]

        (d/div {:class "ramp-range"}
               (grad-svg s e 200 10 left right)

               ;; and the slider
               (om/build w/slider {:min     0
                                   :max     1
                                   :step    0.01
                                   :start   [left right]
                                   :connect true
                                   :f       fr}))))))


(let [id :imagery]
  (defcomponentk imagery-pane [state owner]
    (did-mount [_]
      (let [r (:renderer @plasio-state/comps)]
        (.addStatsListener r "z" "inun-z"
                           (fn [_ n]
                             (let [hist (js->clj n)]
                               (swap! state assoc
                                      :histogram hist))))))
    (will-unmount [_]
      (let [r (:renderer @plasio-state/comps)]
        (.removeStatsListener r "z" "inun-z")))

    (render-state [_ {:keys [histogram]}]
      (let [ro (om/observe owner plasio-state/ro)
            as (om/observe owner plasio-state/root)
            lo (om/observe owner plasio-state/ui-local-options)
            imagery-source (:imagery-source @ro)
            imagery-sources (:imagery-sources @as)
            as-map (into {} imagery-sources)

            override (:color-ramp-override @lo)

            bounds (:bounds @as)
            ss (max (or (nth override 0)) (bounds 2))
            se (min (or (nth override 1)) (bounds 5))

            imager-source-title (get as-map
                                     imagery-source
                                     "No Source")]

        (d/div
          {:class "imagery"}

          ;; imagery source
          (d/div {:class "imagery-source"}
                 (d/div {:class "text"} "Imagery Source")
                 (apply b/dropdown {:bs-size "small"
                                    :title   imager-source-title}
                        (for [[id name] imagery-sources]
                          (b/menu-item {:key       id
                                        :on-select (fn []
                                                     (om/transact! plasio-state/ro #(assoc % :imagery-source id)))}
                                       name)))
                 (d/p {:class "tip"} "Note: The current scene will be reloaded with new imagery."))

          ;; imagery quality
          (om/build w/labeled-slider
                    {:text  "Imagery Quality"
                     :min   0
                     :max   2
                     :step  1
                     :guides ["Low" "High"]
                     :start (or (:imagery-quality @lo) 1)
                     :f     (fn [nv]
                              (om/transact! plasio-state/ui-local-options
                                            #(assoc % :imagery-quality nv)))})

          (d/p {:class "tip"} "Note: This setting only affects the newly fetched imagery.")

          ;; z-range override
          ;;
          (let [hist (into {} (map (fn [[k v]]
                                     [(js/parseInt k) v])
                                   histogram))
                full-histogram (merge (util/zero-histogram
                                        (bounds 2)
                                        (bounds 5)
                                        10)
                                      hist)]
            (om/build w/z-histogram-slider
                      {:text  "Z Range Override"
                       :min   (bounds 2)
                       :max   (bounds 5)
                       :start [ss se]
                       :histogram full-histogram
                       :f #(om/update! plasio-state/ui-local-options
                                       :color-ramp-override %)}))


          ;; draw the widget for selecting ramps
          (om/build ramp-widget {:ro @ro
                                 :f  (fn [new-mode]
                                       (om/transact!
                                         plasio-state/ro
                                         #(assoc % :color-ramp new-mode)))
                                 :fr (fn [new-range]
                                       (om/transact!
                                         plasio-state/ro
                                         #(assoc % :color-ramp-range new-range)))})

          ;; blend factor between the color and ramp color
          (om/build w/labeled-slider
                    {:text  "Imagery/Ramp Color Blending"
                     :min   0
                     :max   1
                     :step  0.01
                     :guides ["All Imagery" "All Color Ramp"]
                     :start (or (:map_f @ro) 0)
                     :f     (fn [nv]
                              (om/transact! plasio-state/ro
                                            #(assoc %
                                              :map_f nv
                                              :rgb_f (- 1 nv))))}))))))


(let [id :point-manipulation]
  (defcomponentk point-manipulation-pane [owner]
    (render [_]
      (let [pm (om/observe owner plasio-state/pm)]
        (om/build w/labeled-slider
                  {:text "Z-exaggeration.  Higher values stretch out elevation deltas more significantly."
                   :start (:z-exaggeration @pm)
                   :min 1
                   :max 12
                   :step 0.01
                   :connect "lower"
                   :f (fn [nv]
                        (om/transact! plasio-state/pm #(assoc % :z-exaggeration nv)))})))))


(defn commify [n]
  (let [regex (js/RegExp."\\B(?=(\\d{3})+(?!\\d))" "g")]
                    (.replace (.toFixed n 3) regex ",")))

(defn- index-information [info]
  (let [num-points (:num-points info)
        size-bytes (* num-points (:point-size info))
        pow js/Math.pow
        scales {"KB" (pow 1024 1)
                "MB" (pow 1024 2)
                "GB" (pow 1024 3)
                "TB" (pow 1024 4)}
        check-scale #(> (/ size-bytes %) 1)
        mem-type (cond
                   (check-scale (get scales "TB")) "TB"
                   (check-scale (get scales "GB")) "GB"
                   (check-scale (get scales "MB")) "MB"
                   :else "KB")
        comma-regex (js/RegExp. "\\B(?=(\\d{3})+(?!\\d))" "g")]
    [(commify num-points) (gs/format "%.2f %s"
                                     (/ size-bytes (get scales mem-type))
                                     mem-type)]))


(let [id :information]
  (defcomponentk information-pane [owner]
    (render [_]
      (let [root (om/observe owner plasio-state/root)
            [points size] (index-information @root)]
        (om/build w/key-val-table
                  {:data [["Server" (:server @root)]
                          ["Pipeline" (:pipeline @root)]
                          ["Points" points]
                          ["Uncompressed Size" size]
                          ["Point Size" (:point-size @root)]
                          ["Intensity?" (if (:intensity? @root) "Yes" "No")]
                          ["Color?" (if (:color? @root) "Yes" "No")]
                          ["Powered By" "entwine"]
                          ["Caching" "Amazon CloudFront"]
                          ["Backend" "Amazon EC2"]]})))))


(let [id :local-settings]
  (defcomponentk local-settings-pane [owner]
    (render [_]
      (let [local-options (om/observe owner plasio-state/ui-local-options)]
        (d/div
          {:class "local-settings"}
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Enable Flicker Fix"
                      :checked   (:flicker-fix @local-options)
                      :on-change (fn []
                                   (om/transact!
                                     plasio-state/ui-local-options
                                     #(update % :flicker-fix not)))})
            (d/p {:class "tip"}
                 "If you're seeing visual artifacts like points appearing and disappearing, "
                 "enabling this options may work.")))))))

(defn z-range [bounds]
  (- (bounds 5) (bounds 2)))

(defn print-histo [n]
  (let [pairs (->> n
                   seq
                   (sort-by first))]
    (doall
      (map (partial println "-- --") pairs))))

(let [id :innundation-plane]
  (defcomponentk innundation-plane-pane [state owner]
    (did-mount [_]
      (let [r (:renderer @plasio-state/comps)]
        (.addStatsListener r "z" "inun-z"
                           (fn [_ n]
                             (let [hist (js->clj n)]
                               (swap! state assoc
                                      :histogram hist))))))

    (will-unmount [_]
      (let [r (:renderer @plasio-state/comps)]
        (.removeStatsListener r "z" "inun-z")))

    (render-state [_ {:keys [histogram]}]
      (let [root (om/observe owner plasio-state/root)
            bounds (:bounds @root)
            ui-locals (om/observe owner plasio-state/ui-local-options)
            zr   (z-range bounds)
            innun-override (:innundation-range-override @ui-locals)
            start-s (max (or (nth innun-override 0)) (bounds 2))
            start-e (min (or (nth innun-override 1)) (bounds 5))
            innun-height (:innudation-height @ui-locals)
            clamped-innun-height (min (max innun-height start-s) start-e)]
        (d/div
          {:class "innundation-plane"}
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Show Innundation Plane?"
                      :checked   (:innundation? @ui-locals)
                      :on-change (fn [] (om/transact!
                                          plasio-state/ui-local-options
                                          #(update % :innundation? not)))}))
          (om/build w/value-present {:key   "Current Height"
                                     :value (commify clamped-innun-height)})

          (let [hist (into {} (map (fn [[k v]]
                                     [(js/parseInt k) v])
                                   histogram))
                full-histogram (merge (util/zero-histogram
                                        (bounds 2)
                                        (bounds 5)
                                        10)
                                      hist)]
            (d/div
              (om/build w/z-histogram-slider {:text      "Z Range Override"
                                              :min       (bounds 2)
                                              :max       (bounds 5)
                                              :start     [start-s start-e]
                                              :histogram full-histogram
                                              :f         #(do
                                                           (om/update! plasio-state/ui-local-options
                                                                       :innundation-range-override
                                                                       %))})

              ;; build the slider that will help us change the position
              ;;
              (om/build w/labeled-slider {:text    "Adjust the current innundation plane height."
                                          :min     start-s
                                          :max     start-e
                                          :connect false
                                          :step    0.001
                                          :start   clamped-innun-height
                                          :f       (fn [val]
                                                     (om/transact! plasio-state/ui-local-options
                                                                   #(assoc % :innudation-height val)))})))

          ;; the innundation plane opacity slider
          (d/div
            (om/build w/labeled-slider {:text  "Innundation plane opacity"
                                        :min   0.1
                                        :step  0.01
                                        :max   1
                                        :start (or (:innundation-plane-opacity @ui-locals)
                                                   1.0)
                                        :guides ["Transparent" "Opaque"]
                                        :f (fn [val]
                                             (om/transact! plasio-state/ui-local-options
                                                           #(assoc % :innundation-plane-opacity
                                                                     val)))}))

          )))))


(defn- in-bounds? [[a b _ d e _] [g h]]
  (and (>= g a)
       (<= g d)
       (>= h b)
       (<= h e)))

(defn- format-coordinates [[x y]]
  (let [format-deg (fn [v]
                     (str (.toFixed (js/Math.abs v) 5) "°"))
        ns (if (neg? y) "S" "N")
        ew (if (neg? x) "W" "E")]
    (str (format-deg y) " " ns ", "
         (format-deg x) " " ew)))

(defn- trigger-search [owner text]
  (om/set-state! owner :loading? true)
  (go (let [r (<! (plasio-state/resolve-address text))]
        (om/set-state! owner :loading? false)
        (if r
          (let [[x y] (math/ll->webm (:coordinates r))]
            (om/set-state! owner :data r)
            (if (in-bounds? (:bounds @plasio-state/root)
                            [x y])
              (plasio-state/transition-to x y)
              (om/set-state! owner :error "Sorry, this address is out of bounds.")))
          (om/set-state! owner :error "Sorry, there was an error resolving this address.")))))

(defn world-in-ll []
  (let [bounds (:bounds @plasio-state/root)]
    (let [[west south] (math/webm->ll [(bounds 0) (bounds 1)])
          [east north] (math/webm->ll [(bounds 3) (bounds 4)])]
      [(js/google.maps.LatLng. north east)
       (js/google.maps.LatLng. south west)])))

(defcomponentk search-widget [state owner]
  (init-state [_]
    {:right "-400px"})

  (did-mount [_]
    (let [node (om/get-node owner "textbox")
          ac (js/google.maps.places.Autocomplete.
               node (js-obj "types" (array "geocode")))
          [ne sw] (world-in-ll)
          bounds (js/google.maps.LatLngBounds. sw ne)]

      (doto ac
        (.addListener "place_changed"
                      (fn []
                        (let [p (js->clj (.getPlace ac)
                                         :keywordize-keys true)]
                          (when-let [fa (:formatted_address p)]
                            (trigger-search owner fa)))))
        (.setBounds bounds))
      (.focus node)
      (swap! state assoc :right "0px")))
  (render-state [_ {:keys [right error data]}]
    (d/div
      {:class "search-widget"
       :style {:right right
               :background-color (when error
                                   "#900")}
       :on-submit #(.preventDefault %)}
      (d/form
        {:on-change #(swap! state dissoc :error :data)}
        (d/input {:class "search-box"
                  :placeholder "Search for an Address"
                  :ref "textbox"
                  :on-key-down (fn [e]
                                 (let [code (.-keyCode e)]
                                   (when (#{27 13} code)
                                     (.preventDefault e))
                                   (case code
                                     27 (plasio-state/hide-search-box!)
                                     13 (let [val (.. e -target -value)]
                                          (when-not (s/blank? val)
                                            (trigger-search owner val)))
                                     nil)))
                  :type "text"})
        (d/a {:class "cancel-button"
              :href "javascript:"
              :on-click #(plasio-state/hide-search-box!)}
             (w/fa-icon :times)))

      (when-let [a (:address data)]
        (d/div {:class "addr-info"}
               (d/p {:class "address"} (w/fa-icon :map-marker) " " a)
               (d/p {:class "coordinates"} (format-coordinates (:coordinates data)))))

      (when error
        (d/p {:class "error"} error)))))


(declare initialize-for-pipeline)

(defcomponentk render-target [[:data renderer-state] owner]
  (did-mount [_]
    ;; time to intialize the renderer and set it up
    (let [rs renderer-state
          comps (plasio-state/initialize-for-pipeline
                  (om/get-node owner)
                  {:server       (:server rs)
                   :pipeline     (:pipeline rs)
                   :max-depth    (:max-depth rs)
                   :compress?    true
                   :bbox         (:bounds rs)
                   :color?       (:color? rs)
                   :intensity?   (:intensity? rs)
                   :ro           (:ro rs)
                   :render-hints (:render-hints rs)
                   :init-params  (:init-params rs)})]

      ;; save intialized state
      (om/update! plasio-state/comps comps)))

  (did-update [_ prev-props prev-state]
    ;; apply any state that needs to be applied here
    (let [r (get-in @plasio-state/root [:comps :renderer])
          pn (:render-state prev-props)
          n (:renderer-state (om/get-props owner))
          ro (:ro n)
          lo (get-in n [:ui :local-options])
          [ramp-sc ramp-ec] (get config/color-ramps (:color-ramp ro))
          [color-ramp-start color-ramp-end] (:color-ramp-range ro)
          p (get-in @plasio-state/root [:comps :policy])
          zrange (:zrange ro)
          ramp-override (:color-ramp-override lo)
          zrange-lower (or (nth ramp-override 0) (nth zrange 0))
          zrange-upper (or (nth ramp-override 1) (nth zrange 1))
          rgb_f (if-let [m (:map_f ro)]
                  (- 1 m)
                  (or (:rgb_f ro) 1.0))
          map_f (get ro :map_f 0.0)]

      (println "-- -- " zrange-lower zrange-upper)

      (.setRenderOptions r (js-obj
                             "circularPoints" (if (true? (:circular? ro)) 1 0)
                             "pointSize" (:point-size ro)
                             "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
                             "xyzScale" (array 1 (get-in n [:pm :z-exaggeration]) 1)
                             "intensityBlend" (:intensity-blend ro)
                             "clampLower" (nth (:intensity-clamps ro) 0)
                             "clampHigher" (nth (:intensity-clamps ro) 1)
                             "colorClampHigher" color-ramp-end
                             "colorClampLower" color-ramp-start
                             "zrange" (array zrange-lower zrange-upper)
                             "rgb_f" rgb_f
                             "map_f" map_f
                             "rampColorStart" (apply array ramp-sc)
                             "rampColorEnd" (apply array ramp-ec)))
      (let [flicker-fix? (get-in n [:ui :local-options :flicker-fix])]
        (.setRenderHints r (js-obj
                             "flicker-fix" flicker-fix?)))

      ;; check for innundation plane stuff
      ;;
      (let [bounds (:bounds n)
            range (- (bounds 5) (bounds 2))
            size  (max (- (bounds 3) (bounds 0))
                       (- (bounds 4) (bounds 1)))
            lo (get-in n [:ui :local-options])
            half (/ range 2.0)
            [low high] (get lo :innundation-range-override [(bounds 5) (bounds 2)])
            planey (util/mapr
                     (min high
                          (max low (:innudation-height lo)))
                     (bounds 2) (bounds 5)
                     (- half) half)]
        (if (get-in n [:ui :local-options :innundation?])
          (.updatePlane r "innundation"
                        (array 0 1 0)
                        planey
                        (array 0 187 215)
                        (get-in n [:ui :local-options :innundation-plane-opacity] 1.0)
                        size)
          (.removePlane r "innundation")))

      (set! (.-IMAGE_QUALITY js/PlasioLib.Loaders.MapboxLoader)
            (get-in n [:ui :local-options :imagery-quality] 1))

      (doto p
        (.setDistanceHint (get-in n [:po :distance-hint]))
        (.setMaxDepthReductionHint (->> (get-in n [:po :max-depth-reduction-hint])
                                        (- 5)
                                        js/Math.floor)))))

  (render [_]
    (d/div {:id "render-target"})))

(def ^:private z-vec (array 0 0 -1))

(defcomponentk compass [owner state]
  (did-mount [_]
    (when-let [renderer (:renderer @plasio-state/comps)]
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
                         theta (math/angle-between z-vec v)     ;; angle between target->eye and z
                         theta (math/->deg theta)               ;; in degrees

                         t->e (math/make-vec target eye)        ;; target->eye vector
                         t->pe (math/make-vec target peye)      ;; target->projected eye vector
                         incline (math/angle-between t->e t->pe)  ;; angle between t->e and t->pe
                         incline (math/->deg incline)]            ;; in degrees

                     ;; make sure the values are appropriately adjusted for them to make sense as
                     ;; css transforms
                     (swap! state assoc
                            :heading (if (< (aget v 0) 0)
                                       theta
                                       (- 360 theta))
                            :incline (- 90 (max 20 incline)))))))))))
  (render-state [_ {:keys [incline heading]}]
    (let [comps (om/observe owner plasio-state/comps)
          camera (:camera @comps)]
      (d/a
        {:class    "compass"
         :style    {:transform (str "rotateX(" incline "deg)")}
         :href     "javascript:"
         :on-click #(when camera
                     (.setHeading camera 0))}
        (d/div {:class "arrow"
                :style {:transform (str "rotateZ(" heading "deg)")}}
               (d/div {:class "n"})
               (d/div {:class "s"}))
        (d/div {:class "circle"})))))


(defcomponentk logo []
  (render [_]
    (d/div {:class "entwine"
            :style {:position "fixed"
                    :bottom "10px"
                    :left "10px"}})))
