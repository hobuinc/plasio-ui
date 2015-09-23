(ns plasio-ui.widgets
  (:require [plasio-ui.state :as plasio-state]
            [reagent.core :as reagent :refer [atom]]
            [clojure.string :as string]))

(defn panel
  "A simple widget which shows a panel with title and children"
  [title & children]
  [:div.app-panel
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
  ([start min max f] (slider start min max (/ (- max min) 1024) true f))
  ([start min max enable? f] (slider start min max (/ (- max min) 1024) enable? f))
  ([start min max step enable? f]
   (let [this (reagent/current-component)]
     (reagent/create-class
       {:component-did-mount
        (fn []
          (let [slider (js/jQuery (.getDOMNode this))
                single? (number? start)
                start (if single?
                        start
                        (apply array start))
                emit #(f (let [value (.val slider)]
                           (if single?
                             (js/parseFloat value)
                             (mapv js/parseFloat (string/split value #",")))))]
            (doto slider
              (.on "slide" emit)
              (.on "set" emit))
            (when (not enable?) (.attr slider "disabled" "disabled"))
            (.noUiSlider slider
                         (js-obj
                           "start" start
                           "connect" (if single? "lower" true)
                           "step" step
                           "range" (js-obj "min" min
                                           "max" max)))))

       :reagent-render
       (fn [start min max f]
         [:div.slider])}))))

(defn dropdown
  "A dropdown option list"
  ([choices start f] (dropdown choices start true f))
  ([choices start enable? f]
   (let [this (reagent/current-component)
         selected (reagent/atom (or start (get-in choices [0 0])))
         emit #(f (reset! selected (.. % -target -value)))]
     (reagent/create-class
       {:component-did-mount
        (fn []
          (let [node (js/jQuery (.getDOMNode this))]
            (when (not enable?) (.attr node "disabled" "disabled"))))
        :reagent-render
        (fn [choices start enable? f]
          [:select.dropdown {:value @selected :onChange emit}
           (for [[k v] choices]
             [:option {:value k :key k} v])])}))))

(defn key-val-table
  [& data]
  (let [this (reagent/current-component)]
    (reagent/create-class
      {:reagent-render
       (fn [& data]
         [:table.key-val
          [:tbody
           (for [[k v] data]
             ^{:key k} [:tr [:td k][:td v]])]])})))

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
                                  :on-mouse-over (when-not disabled?
                                                   #(reset! st title))
                                  :on-mouse-leave (when-not disabled?
                                                    #(reset! st ""))
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

(defn action [ic name f]
  [:button {:class "btn"
            :title name
            :on-click f}
   (icon ic)])

(defn app-toolbar [& icons]
  [:div.toolbar
   icons])

(defn application-bar [& options]
  [:div.app-bar
   [:div.title "plasio"]
   [app-toolbar
    (for [[icon name f] options]
      ^{:key name} [action icon name f])]])

(defn mouse-pos [e]
  [(.-pageX e) (.-pageY e)])

(defn element-pos [e]
  (let [r (.getBoundingClientRect e)]
    [(.-left r) (.-top r)]))

(defn pos-diff [[a b] [c d]]
  [(- a c) (- b d)])

(defn pos-add [[a b] [c d]]
  [(+ a c) (+ b d)])

(let [index (atom 0)]
  (defn next-z-index []
    (swap! index inc)))

(let [lst (cycle [{:left 10 :top 40}
                  {:left 30 :top 60}
                  {:left 50 :top 80}
                  {:left 70 :top 100}])
      st (atom lst)]
  (defn next-window-default-location []
    (let [v (first @st)]
      (swap! st rest)
      v)))


(defn floating-panel [title ico f-dismiss & children]
  (let [state (atom (merge (next-window-default-location)
                           (plasio-state/get-location title)))
        drag-start
        (fn [e]
          (println "starting drag!")
          ;; we need to determine our detach handlers
          ;; and trigger them when the mouse is released
          ;;
          (let [drag-move (fn [e]
                            (let [mp (mouse-pos e)
                                  off (:widget-offset @state)
                                  [left top] (pos-add mp off)]
                              (swap! state assoc
                                     :left left
                                     :top  top)))
                drag-end (fn [e]
                           (when-let [f (:mousemove-handler @state)]
                             (.removeEventListener js/document "mousemove" f))
                           (when-let [f (:mouseup-handler @state)]
                             (.removeEventListener js/document "mouseup" f))

                           (swap! state
                                  (fn [st]
                                    (-> st
                                        (dissoc :mouseup-handler
                                                :mousemove-handler
                                                :dragging?)
                                        (assoc :z-index (next-z-index)))))

                           ;; save the final location for this window
                           (let [mp (mouse-pos e)
                                 off (:widget-offset @state)
                                 [left top] (pos-add mp off)]
                             (plasio-state/save-location!
                               title {:left left :top top})))]
            (let [mp (mouse-pos e)
                  elem (.. e -target -parentNode)
                  elem-pos (element-pos elem)]
              (println elem-pos)
              (swap! state assoc
                     :widget-offset (pos-diff elem-pos mp)
                     :mousemove-handler drag-move
                     :mouseup-handler drag-end
                     :dragging? true)

              (js/console.log elem)
              (.addEventListener js/document "mousemove" drag-move)
              (.addEventListener js/document "mouseup" drag-end))))]
    (reagent/create-class
      {:reagent-render
       (fn []
         (println "icon is:" ico)
         [:div.floating-panel
          {:class (str (when (:collapsed? @state)
                         "collapsed")
                       " "
                       (when (:dragging? @state)
                         "dragging"))
           :style {:left    (:left @state)
                   :top     (:top @state)
                   :z-index (if (:dragging? @state)
                              1000000
                              (or (:z-index @state)
                                  0))}}
          [:div.title
           {:on-mouse-down drag-start}
           (icon ico)
           title]
          [:a.toggle {:href     "javascript:"
                      :on-click #(swap! state update :collapsed? not)}
           (icon (if (:collapsed? @state) :chevron-down :chevron-up))]
          [:a.close {:href     "javascript:"
                     :on-click f-dismiss}
           (icon :times)]
          [:div.floating-panel-body children]])})))
