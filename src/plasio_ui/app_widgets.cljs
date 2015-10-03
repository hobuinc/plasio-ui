(ns plasio-ui.app-widgets
  (:require [om.core :as om]
            [om-tools.core :refer-macros [defcomponentk]]
            [om-tools.dom :as d]
            [om-bootstrap.input :as i]
            [om-bootstrap.button :as b]
            [plasio-ui.config :as config]
            [plasio-ui.state :as plasio-state]
            [plasio-ui.widgets :as w]
            [goog.string :as gs]
            [goog.string.format]
            [plasio-ui.math :as math]))

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

        (println "-- -- " left right)
        (println "-- -- " (:color-ramp ro))
        (println "-- -- " s e)

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
  (defcomponentk imagery-pane [owner]
    (render [_]
      (let [ro (om/observe owner plasio-state/ro)
            as (om/observe owner plasio-state/root)
            lo (om/observe owner plasio-state/ui-local-options)
            imagery-source (:imagery-source @ro)
            imagery-sources (:imagery-sources @as)
            as-map (into {} imagery-sources)

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
                     :start (or (:imagery-quality @lo) 1)
                     :f     (fn [nv]
                              (om/transact! plasio-state/ui-local-options
                                            #(assoc % :imagery-quality nv)))})
          (d/div {:class "clearfix slider-guides"}
                 (d/div {:class "pull-left"} "Low")
                 (d/div {:class "pull-right"} "High"))

          (d/p {:class "tip"} "Note: This setting only affects the newly fetched imagery.")


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
                     :start (or (:map_f @ro) 0)
                     :f     (fn [nv]
                              (om/transact! plasio-state/ro
                                            #(assoc %
                                              :map_f nv
                                              :rgb_f (- 1 nv))))})
          (d/div {:class "clearfix slider-guides"}
                 (d/div {:class "pull-left"} "All Imagery")
                 (d/div {:class "pull-right"} "All Ramp Color")))))))


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
        comma-regex (js/RegExp. "\\B(?=(\\d{3})+(?!\\d))" "g")
        commify (fn [n]
                  (let [regex (js/RegExp."\\B(?=(\\d{3})+(?!\\d))" "g")]
                    (.replace (.toString n) regex ",")))]
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
          n (:renderer-state (om/get-props owner))
          ro (:ro n)
          [ramp-sc ramp-ec] (get config/color-ramps (:color-ramp ro))
          [color-ramp-start color-ramp-end] (:color-ramp-range ro)
          p (get-in @plasio-state/root [:comps :policy])]

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
                             "zrange" (apply array (:zrange ro))
                             "rgb_f" (or (:rgb_f ro) 1)
                             "map_f" (or (:map_f ro) 0)
                             "rampColorStart" (apply array ramp-sc)
                             "rampColorEnd" (apply array ramp-ec)))
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
