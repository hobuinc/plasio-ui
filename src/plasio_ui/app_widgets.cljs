(ns plasio-ui.app-widgets
  (:require [plasio-ui.widgets :as w]
            [plasio-ui.config :as config]
            [goog.string :as gs]
            [goog.string.format]
            [reagent.core :as reagent]))

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

(defn labeled-slider [text state path min max]
  [:div.slider-text
   [:div.text text]
   [w/slider (get-in @state path) min max
    (fn [new-val]
      (swap! state assoc-in path new-val))]])

(defn labeled-select [text options]
  [:div.select-text
   [:div.text text]
   [:select.form-control
    (for [[k v] options]
      [:option {:value v}])]])

(defn labeled-radios [text option-name selected f & radios]
  (println "------------ selected:" selected)
  [:div.select-radios
   ^{:key "text"} [:div.text text]
   ^{:key "form"} [:form.form-inline
                   (into
                     [:div.form-group]
                     (for [[k v] radios]
                       ^{:key k}
                       [:div.radio
                        [:label
                         [:input {:type      "radio"
                                  :name      option-name
                                  :checked   (= selected k)
                                  :on-change (partial f k)}
                          v]]]))]])

(defn labeled-bool [text state path]
  [:div.bool-field
   [:label
    [:div.text text]
    [:div.value
     [:input.checkbox {:type      "checkbox"
                       :on-change #(swap! state update-in path not)
                       :checked   (get-in @state path)}]]
    [:div.clearfix]]])

(defn radio-button [text state path checked-on]
  [:div.radio-button
   [:label
    [:input {:type "radio"
             :on-change (swap! state assoc-in path checked-on)
             :checked (= (get-in @state path) checked-on)}]
    [:div.text text]]])

(defn state-updater [state f]
  (fn []
    (swap! state f)))

(defn closer [state key]
  (state-updater
    state
    (fn [st]
      (-> st
          (update-in [:open-panes] disj key)
          (update-in [:docked-panes] disj key)))))

(defn docker [state key]
  (state-updater
    state
    (fn [st]
      (-> st
          (update-in [:open-panes] disj key)
          (update-in [:docked-panes] conj key)))))

(defn undocker [state key]
  (state-updater
    state
    (fn [st]
      (-> st
          (update-in [:docked-panes] disj key)
          (update-in [:open-panes] conj key)))))

(defn render-options-pane [state]
  [w/floating-panel
   "Rendering Options"
   :cogs
   (closer state :rendering-options)
   (docker state :rendering-options)
   (undocker state :rendering-options)

   ^{:key :circular-points}
   [labeled-bool "Circular Points?" state
    [:ro :circular?]]

   ^{:key :point-size}
   [labeled-slider "Point Size" state
    [:ro :point-size] 1 10]

   ^{:key :point-size-attenuation}
   [labeled-slider "Point Size Attenuation" state
    [:ro :point-size-attenuation] 0 5]

   ^{:key :intensity-blend}
   [labeled-slider "Intensity" state
    [:ro :intensity-blend] 0 1]

   ^{:key :intensity-clamps}
   [labeled-slider "Intensity scaling, narrow down range of intensity values."
    state
    [:ro :intensity-clamps] 0 256]])


(defn information-pane [state]
  [w/floating-panel "Pipeline Information"
   :info-circle
   (closer state :information)
   (docker state :information)
   (undocker state :information)

   (let [[points size] (index-information @state)]
     [w/key-val-table
      ["Point Count" points]
      ["Uncompressed Index Size" size]
      ["Powered By" "entwine"]
      ["Caching" "Amazon CloudFront"]
      ["Backend" "Amazon EC2"]])])

(defn point-manipulation-pane [state]
  [w/floating-panel "Point Manipulation"
   :magic
   (closer state :point-manipulation)
   (docker state :point-manipulation)
   (undocker state :point-manipulation)

   [labeled-slider "Z-exaggeration.  Higher values stretch out elevation deltas more significantly"
    state
    [:pm :z-exaggeration] 1 12]])

(defn- css-color [[r g b]]
  (str "rgb("
       (js/Math.floor (* 255 r)) ","
       (js/Math.floor (* 255 g)) ","
       (js/Math.floor (* 255 b)) ")"))

(let [image-cache (atom {})]
  (defn color-ramp-image [start end]
    (let [key [start end]]
      (or (get @image-cache key)
          (let [canvas (.createElement js/document "canvas")
                _ (set! (.-width canvas) 32)
                _ (set! (.-height canvas) 32)
                ctx (.getContext canvas "2d")
                grad (.createLinearGradient ctx 0 0 32 0)]
            (doto grad
              (.addColorStop 0 (css-color start))
              (.addColorStop 1 (css-color end)))

            (set! (.-fillStyle ctx) grad)

            (doto ctx
              (.rect 0 0 32 32)
              (.fill))

            (let [url (.toDataURL canvas)]
              (swap! image-cache assoc key url)
              url))))))

(defn ramp-color-button [start end f]
  (let [img (color-ramp-image start end)]
    [:button.btn.btn-sm.btn-default
     {:type "button"
      :on-click f}
     [:img {:width 16 :height 12 :src img}]]))

(def widget-width 200)

(defn color-ramp-widget [state color-ramp-path left-path right-path]
  (let [[s e] (config/color-ramps (get-in @state color-ramp-path))]
    [:svg {:height 10 :width widget-width}
     [:defs
      [:linearGradient
       {:id "grad-ramp"
        :x1 "0%" :y1 "0%"
        :x2 "100%" :y2 "0%"}
       [:stop {:offset "0%"
               :style  {:stop-color (css-color s)}}]
       [:stop {:offset (str (* 100
                               (get-in @state left-path)) "%")
               :style  {:stop-color (css-color s)}}]
       [:stop {:offset (str (* 100
                               (get-in @state right-path)) "%")
               :style  {:stop-color (css-color e)}}]
       [:stop {:offset "100%"
               :style  {:stop-color (css-color e)}}]]]
     [:rect
      {:width  widget-width
       :height 10
       :style  {:fill   "url(#grad-ramp)"
                :stroke "black"}}]]))

#_(defn color-ramp-widget [color left right]
  (let [this (reagent/current-component)]
    (reagent/create-class
      {:component-will-update
       (fn [_ [_ color left right]]
         (println "00000 +" color left right))

       :reagent-render
       (fn [color left right]
         (println "00000 " color left right)
         [:canvas {:width 200 :height 10}])})))

(defn ramp-range [state ramp-path path-lower path-upper]
  [:div.ramp-range
   [color-ramp-widget state ramp-path
    path-lower path-upper]
   [w/slider [0 1] 0 1 #(swap! state
                               (fn [st]
                                 (-> st
                                     (assoc-in path-lower (first %))
                                     (assoc-in path-upper (second %)))))]])


(defn imagery-pane [state]
  [w/floating-panel "Imagery"
   :picture-o
   (closer state :imagery)
   (docker state :imagery)
   (undocker state :imagery)

   [:div.imagery
    [:div
     [:div.text "Imagery source"]
     [w/dropdown
      (get-in @state [:imagery-sources])
      state [:ro :imagery-source]
      (fn [new-val]
        (println "It changed to this!" new-val)
        (when-let [o (get-in @state [:comps :loaders :point])]
          (when-let [p (get-in @state [:comps :policy])]
            (.hookedReload
              p
              (fn []
                (.setColorSourceImagery o new-val))))
          (println "changing imagery for:" o)))]
     [:p.tip
      [:strong "Note that: "]
      "The current view will be re-loaded with the new imagery."]]

    [:div
     [:div.text "Height Ramp Color Source"]
     [:div.ramps-container
      (into [:div.btn-group.ramps {:role "group"}]
            (for [[k [start end]] config/color-ramps]
              [ramp-color-button start end #(swap! state assoc-in [:ro :color-ramp] k)]))]
     [ramp-range state
      [:ro :color-ramp]
      [:ro :colorClampLower] [:ro :colorClampHigher]]]

    [:div.color-blend
     [:div.text "Imagery/Height Color Blending"]
     [w/slider (get-in @state [:ro :map_f] 0)
      0 1 #(swap! state
                  (fn [st]
                    (-> st
                        (assoc-in [:ro :rgb_f] (- 1 %))
                        (assoc-in [:ro :map_f] %))))]
     [:div.clearfix.ramp-guides
      [:div.pull-left "All Imagery"]
      [:div.pull-right "All Ramp Color"]]]]])


(defn logo []
  [:div.entwine {:style {:position "fixed"
                         :bottom "10px"
                         :left "10px"}}])

