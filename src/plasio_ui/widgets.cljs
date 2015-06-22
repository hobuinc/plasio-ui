(ns plasio-ui.widgets
  (:require [reagent.core :as reagent :refer [atom]]
            [clojure.string :as string]))

(defn panel
  "A simple widget which shows a panel with title and children"
  [title & children]
  [:div.panel
   [:div.title title]
   (into [:div.contents] children)])

(defn panel-with-close
  [title f & children]
  [:div.panel
   [:div.title title]
   [:div.close-button [:a {:href "javascript:"
                           :on-click f} [:i.fa.fa-times]]]
   (into [:div.contents] children)])

(defn panel-section
  "A section inside a panel"
  [& children]
  (into [:div.panel-section] children))

(defn desc
  "Styled description text"
  [& children]
  (into [:div.desc] children))

(defn slider
  "An abstracted jQuery slider control"
  [start min max f]
  (let [this (reagent/current-component)
        mounted-slider (atom nil)
        coerce-val (fn [v]
                     (if (number? v)
                       v (apply array v)))
        build-slider (fn [start min max f]
                       (let [slider (js/jQuery (.getDOMNode this))
                             single? (number? start)
                             start (coerce-val start)
                             emit #(f (let [value (.val slider)]
                                        (println "EMITING!" value)
                                        (if single?
                                          (js/parseFloat value)
                                          (mapv js/parseFloat (string/split value #",")))))]
                         (reset! mounted-slider slider)
                         (doto slider
                           (.on "slide" emit)
                           (.on "set" emit)
                           (.on "change" emit)
                           (.noUiSlider 
                            (js-obj
                             "start" start
                             "connect" (if single? "lower" true)
                             "range" (js-obj "min" min
                                             "max" max))))))]
    (reagent/create-class
     {:component-did-mount
      (fn []
        (build-slider start min max f))

      :component-will-receive-props
      (fn [_ [_ s n x nf]]
        ;; we only really have to do work here if the mins and the maxes changed, other than tha
        ;; we cannot really detect changes in handler function, nor do we need to directly set
        ;; slider value since slider does that on its own or during creation
        (when (or (not= n min) (not= x max))
          (println "setting slider to:" n x s)
          (when-let [slider @mounted-slider]
            (doto slider
              (.noUiSlider (js-obj "start" s
                                   "step" 1
                                   "min" n
                                   "max" x)
                           true)
              #_(.val (coerce-val s))))))

      :reagent-render
      (fn [start min max f]
        [:div.slider])})))

(defn dropdown
  "A dropdown option list"
  [f choices start]
  (let [this (reagent/current-component)
        selected (reagent/atom (or start (get-in choices [0 0])))
        emit #(f (reset! selected (.. % -target -value)))]
    (reagent/create-class
      {:reagent-render
       (fn [f choices start]
         [:select.dropdown {:value @selected :onChange emit}
          (for [[k v] choices]
            [:option {:value k :key k} v])])})))


(defn icon [& parts] [:i {:class (str "fa " (string/join " "
                                      (map #(str "fa-" (name %)) parts)))}])


(defn toolbar
  "A toolbar control"
  [f & buttons]
  (let [st (atom "")]
    (fn [f & buttons]
      [:div.toolbar
       (into [:div.icons]
             (map (fn [[id i title state]]
                    (let [disabled? (and (keyword? state) (= state :disabled))]
                      [:a.button {:class (when (keyword? state) (name state))
                                  :href "javascript:"
                                  :on-mouse-over (when-not disabled? #(reset! st title))
                                  :on-mouse-leave (when-not disabled? #(reset! st ""))
                                  :on-click (when-not disabled?
                                              (fn [e]
                                                (.preventDefault e)
                                                (f id)))}
                       (icon i)]))
                  buttons))
       [:p.tip @st]])))


(defn prepend [name series]
  (.concat (array name) series))

(defn filter-zeros [items]
  (->> items
       vec
       (map (fn [e]
              (if (zero? e) js/NaN
                  e)))
       (apply array)))

(defn make-color [[r g b]]
  (str "rgba(" r "," g "," b ", 1.0)"))

(defn prefix-nans [buffer count]
  (if (zero? count)
    buffer
    (let [b (apply array (repeat count js/NaN))]
      (.concat b buffer))))


(defn generate-plottable-data [series]
  (let [offsets (reductions (fn [acc [_ _ a]] (+ acc (.-length a))) 0 series)
        data-points (->> series
                         (map (fn [index off [_ color series]]
                                (let [profile-name (str "Profile " index)]
                                  [[profile-name (make-color color)]
                                   (prepend profile-name (-> series
                                                             filter-zeros
                                                             (prefix-nans off)))]))
                              (range)
                              offsets))
        colors (->> data-points
                    (map first)
                    (mapcat identity)
                    (apply js-obj))
        data-points (->> data-points
                         (map second)
                         (apply array))]
    [data-points colors]))


(defn profile-series [series]
  (let [state (atom {})]
    (reagent/create-class
     {:component-did-mount
      (fn [this]
        (let [[data-points colors] (generate-plottable-data series)
              node (reagent/dom-node this)]
          (js/console.log "series:" data-points "colors:" colors)
          (js/console.log node)

          (let [width (.-offsetWidth node)
                chart (.generate js/c3
                                 (js-obj "bindto" node
                                         "size" (js-obj "height" 180
                                                        "width" width)
                                         "legend" (js-obj "show" false)
                                         "axis" (js-obj "x" (js-obj "show" false)
                                                        "y" (js-obj "color" "#ffffff"))
                                         "data" (js-obj "columns" data-points
                                                        "colors" colors)))
                resizer (fn []
                          (println "resizing!")
                          (let [width (.-offsetWidth node)]
                            (js/console.log "resizing chart" chart "to" width)
                            (.resize chart (js-obj "width" width))))
                remove-resizer (fn []
                                 (.removeEventListener js/window "resize" resizer))]
            ;; make sure resizer is triggered whenever the document is resized
            (.addEventListener js/window "resize" resizer)
            (swap! state assoc
                   :chart chart
                   :remove-resizer remove-resizer))))

      :component-will-receive-props
      (fn [this [_ series]]
        (println "GOT NEW DATAS!")
        (when-let [chart (:chart @state)]
          (let [[data-points colors] (generate-plottable-data series)
                to-load (js-obj "columns" data-points
                                "colors" colors
                                "unload" (.-columns chart))]
            (println "chart is valid!!!!")
            (js/console.log to-load)
            (.load chart to-load))))

      :component-will-unmount
      (fn [this]
        ;; make sure we unhook the resizer
        (when-let [rs (:remove-resizer @state)]
          (rs)))

      :reagent-render
      (fn [[id color series]]
        [:div.profile-series])})))

(defn profile-view [series f]
  [:div.profile-view
   [profile-series (reverse series)]
   [:div.close
    [:a.fa.fa-times {:href "javascript:"
                     :on-click f}]]])


(defn status [type text]
  [:div.status-message {:class (name type)} text])

