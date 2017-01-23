(ns plasio-ui.widgets
  (:require [plasio-ui.util :as util]
            [om.core :as om]
            [om-tools.core :refer-macros [defcomponentk]]
            [om-tools.dom :as d]
            [om-bootstrap.random :as r]
            [plasio-ui.state :as plasio-state]))

(defn fa-icon [& parts]
  (d/i {:class (apply str
                      "fa "
                      (map #(str "fa-" (name %)) parts))}))


(defn- coerce-val [v]
  (let [v' (js->clj v)]
    (if (sequential? v')
      (mapv js/parseFloat v')
      (js/parseFloat v'))))

(defn- slider-val [node]
  (when-let [slider (.-noUiSlider node)]
    (let [v (coerce-val (.get slider))]
      ;; if the slider values are right on top of each other
      ;; make sure they never touch
      (if (and (sequential? v)
               (= (first v) (second v)))
        [(first v) (+ (first v) 0.01)]
        v))))


(defn- create-slider! [node start connect step min max f]
  (js/noUiSlider.create
    node
    (js-obj
      "start" start
      "connect" connect
      "step" step
      "range" (js-obj "min" min
                      "max" max)))
  (doto (.-noUiSlider node)
    (.on "slide" f)))

(defcomponentk slider-guides [[:data left right]]
  (render [_]
    (d/div {:class "slider-guides clearfix"}
           (d/div {:class "pull-left"} left)
           (d/div {:class "pull-right"} right))))


(defcomponentk slider [[:data min max start
                        {guides nil}
                        {step 1} {f nil}
                        {connect false}] state owner]
  (did-mount [_]
    (let [node (om/get-node owner "slider")
          start (clj->js start)]
      (create-slider! node start connect step min max
                      (fn []
                        (f (slider-val node))))))

  (did-update [_ pp _]
    (let [props (om/get-props owner)
          node (om/get-node owner "slider")]
      ;; if the range changed, we need to recreate the slider, otherwise
      ;; just update what needs to be

      (if (or (not= (:step props) (:step pp))
              (not= (:connect props) (:connect pp))
              (not= (:min props) (:min pp))
              (not= (:max props) (:max pp)))
        (let [slider (.-noUiSlider node)]
          (.destroy slider)
          (create-slider! node (clj->js (:start props))
                          (:connect props)
                          (:step props)
                          (:min props)
                          (:max props)
                          (fn [_] (f (slider-val node)))))
        (let [slider (.-noUiSlider node)]
          (when (not= (:start props)
                      (slider-val node))
            (.set slider (clj->js (:start props))))

          (when-not (= (:disabled? props) (:disabled? pp))
            (if (:disabled? props)
              (.setAttribute node "disabled" true)
              (.removeAttribute node "disabled")))))))


  (render [_]
    (d/div
      (d/div {:class "slider"
              :ref "slider"})
      (when guides
        (let [[a b] guides]
          (om/build slider-guides {:left a :right b}))))))


(defcomponentk labeled-slider [data owner]
  (render [_]
    (d/div {:class "slider-text"}
           (d/div {:class "text"} (:text data))
           (om/build slider data)
           )))

(defcomponentk toolbar-item [[:data id {title ""}
                              {icon nil} {f nil} {widget nil}]]
  (render [_]
    (let [user-ns (namespace id)
          sep? (= user-ns "separator")]
      (if sep?
        (d/div {:class "separator"})
        (d/button {:class    "btn"
                   ;; when we have a handler,
                   :on-click #(if f
                               (f)
                               (plasio-state/toggle-pane! id))}
                  (when icon
                    (fa-icon icon))

                  (when widget
                    (om/build widget {})))))))

(defcomponentk widget-item [[:data widget]]
  (render [_]
    (om/build widget {})))

(defcomponentk application-bar [[:data panes brand resource-name show-search? {widgets []}] state owner]
  (render [_]
    (d/div {:class "app-bar-container"}
           (d/div
             {:class "app-bar"}
             (d/div {:class "title"}
                    brand
                    (d/div {:class "resource"} resource-name))
             (d/div {:class "toolbar"}
                    ;; if we have any widgets to build, do that
                    (when-let [wds (seq widgets)]
                      (om/build-all widget-item wds {:key :id}))

                    ;; now any toolbar items
                    (when show-search?
                      (om/build-all toolbar-item
                                    (cons
                                      ;; make sure there's a sperator between the two things
                                      {:id :separator/toolbar}
                                      panes)
                                    {:key :id})))))))

(defn- px [v]
  (str v "px"))

(def ^:private histogram-width 200)
(def ^:private histogram-height 50)

(let [in-mem (.createElement js/document "canvas")]
  (defn render-histogram! [canvas histogram n x left right]
    (let [w (.-width canvas)
          h (.-height canvas)
          items (->> histogram
                     seq
                     (sort-by (comp js/parseInt first)))
          width-per-item (/ 200 (count items))
          max-val (js/Math.log (apply max (vals histogram)))
          l left
          r right]
      (set! (.-width in-mem) w)
      (set! (.-height in-mem) h)

      (let [ctx (.getContext in-mem "2d")]
        ;; clear base
        (.clearRect ctx 0 0 w h)

        ;; draw bars indicating how much we've scrolled
        (let [offset1 (util/mapr l n x 0 w)
              offset2 (util/mapr r n x 0 w)]
          (set! (.-fillStyle ctx) "#eee")
          ;; fancy bars closing in
          (.fillRect ctx 0 0 offset1 h)
          (.fillRect ctx offset2 0 (- w offset2) h)


          ;; draw all bars
          (doall
            (map-indexed
              (fn [index [k v]]
                (let [k (js/parseInt k)
                      x (* index width-per-item)
                      h (* 40 (/ (js/Math.log v) max-val))
                      y (- 50 h)]
                  (if (and (>= k l) (<= k r))
                    (set! (.-fillStyle ctx) "#00BBD7")
                    (set! (.-fillStyle ctx) "#ccc"))
                  (.fillRect ctx
                             x y width-per-item h)))
              items))

          ;; fancy lines closing in
          (let [y h]
            (set! (.-strokeStyle ctx) "#ccc")
            (doto ctx
              (.beginPath)
              (.moveTo 0 y)
              (.lineTo offset1 y)
              (.moveTo offset2 y)
              (.lineTo w y)
              (.stroke))

            (set! (.-strokeStyle ctx) "#00BBD7")
            (doto ctx
              (.beginPath)
              (.moveTo offset1 y)
              (.lineTo offset2 y)
              (.stroke)))))

      ;; once we're done rendering blit it
      (let [ctx (.getContext canvas "2d")]
        (.clearRect ctx 0 0 w h)
        (.drawImage ctx in-mem 0 0)))))

(defn- render-histogram-for-owner! [owner]
  (let [histogram (om/get-props owner :histogram)
        left (om/get-props owner :left)
        right (om/get-props owner :right)
        [n x] (om/get-props owner :range)]
    (render-histogram! (om/get-node owner) histogram n x left right)))

(defn base-histogram [{:keys [width height]} owner]
  (reify
    om/IDidMount
    (did-mount [_]
      (render-histogram-for-owner! owner))

    om/IRender
    (render [_]
      (d/canvas {:width width :height height}))

    om/IDidUpdate
    (did-update [_ _ _]
      (render-histogram-for-owner! owner))))

(defcomponentk value-present [[:data key value]]
  (render [_]
    (d/div {:class "value-present clearfix"}
           (d/div {:class "key pull-left"} key)
           (d/div {:class "value pull-right"} value))))


(defcomponentk z-histogram-slider [[:data text min max start histogram {f nil}] state owner]
  (render [_]
    (d/div
      {:class "z-histogram"}
      (d/div {:class "text"} text)
      (om/build base-histogram {:histogram histogram
                                :left (first start)
                                :right (second start)
                                :range [min max]
                                :width histogram-width
                                :height histogram-height})
      (om/build slider {:min     min
                        :max     max
                        :step    0.01
                        :start   start
                        :connect false
                        :guides [min max]
                        :f       f}))))


(defcomponentk docked-widget-toolbar-item [[:data id icon title active? activate-fn]]
  (render [_]
    (d/a {:class    (str "toolbar-item"
                         (when active?
                           " active"))
          :on-click activate-fn
          :href     "javascript:"
          :alt      title}
         (fa-icon icon)
         (r/tooltip {:placement         "right"
                     :position-left     35
                     :position-top      -5}
                    title))))

(defcomponentk docked-widget-toolbar [[:data items active activate-fn]]
  (render [_]
    (d/div {:class "toolbar"}
           (om/build-all docked-widget-toolbar-item
                         (map
                           (fn [{:keys [id] :as item}]
                             (assoc item :active? (= id active)
                                         :activate-fn #(activate-fn id)))
                           items) {:key :id}))))


(defcomponentk docked-widgets [[:data children] owner state]
  (render [_]
    (let [ui-options (om/observe owner plasio-state/ui-local-options)
          collapsed? (:docker-collapsed? @ui-options)
          active-panel (or (:active-panel @ui-options)
                           :rendering-options)]
      (d/div
        {:class (str "docker-widget"
                     (if collapsed? " off" " on"))}
        (d/a {:class    "toggle-docker"
              :href     "javascript:"
              :on-click #(plasio-state/toggle-docker!)}
             (fa-icon
               (if collapsed? :angle-double-right :angle-double-left)))

        ;; first draw the toolbar for all the icons
        (let [actions (mapv #(select-keys % [:id :title :icon]) children)
              activate-fn #(plasio-state/set-active-panel! %)]
          (om/build docked-widget-toolbar {:items       actions
                                           :active      active-panel
                                           :activate-fn activate-fn
                                           }))

        ;; now draw the active panel
        (d/div {:class "active-pane"}
               (when-let [active-child (first (filter #(= active-panel (:id %)) children))]
                 (om/build (:child active-child) {})))))))

(defn- mp [e]
  [(.-pageX e) (.-pageY e)])

(defn- element-pos [e]
  (let [r (.getBoundingClientRect e)]
    [(.-left r) (.-top r)]))

(defn- pos-diff [[a b] [c d]]
  [(- a c) (- b d)])

(defn- pos-add [[a b] [c d]]
  [(+ a c) (+ b d)])

(let [index (atom 0)]
  (defn- next-z-index []
    (swap! index inc)))

(defn- -drag-start! [id owner state e]
  (when (zero? (.-button e))
    (let [drag-move
          (fn [e]
            (let [pos (mp e)
                  off (:widget-offset @state)
                  [left top] (pos-add pos off)]
              (plasio-state/set-ui-location!
                id {:left left :top top})))

          drag-end
          (fn [e]
            (when-let [f (:mmh @state)]
              (.removeEventListener js/document "mousemove" f))
            (when-let [f (:muh @state)]
              (.removeEventListener js/document "mouseup" f))

            (swap! state
                   (fn [st]
                     (-> st
                         (dissoc :mmh :muh :dragging?)
                         (assoc :z-index (next-z-index))))))

          pos (mp e)
          elem (.. e -target -parentNode)
          elem-pos (element-pos elem)]

      (.addEventListener js/document "mousemove" drag-move)
      (.addEventListener js/document "mouseup" drag-end)

      (swap! state assoc
             :widget-offset (pos-diff elem-pos pos)
             :mmh drag-move
             :muh drag-end
             :dragging? true))))


(let [s (atom (plasio-state/window-placement-seq))]
  (defn- next-panel-position []
    (let [p (first @s)]
      (swap! s rest)
      p)))


(defcomponentk floating-panel [[:data id title icon {child nil}] state owner]
  (init-state [_]
    {:collapsed? false :dragging? false :pos (next-panel-position)})

  (render-state [_ {:keys [collapsed? dragging? z-index pos]}]
    (let [ui (om/observe owner plasio-state/ui)
          ui-locs (om/observe owner plasio-state/ui-locations)
          {:keys [left top]} (or (get @ui-locs id)
                                 pos)
          docked-panes (-> ui :docked-panes set)
          docked? (docked-panes id)]
      (d/div
        {:class (str "floating-panel"
                     (when collapsed? " collapsed")
                     (when dragging? " dragging"))
         :style {:left    (str left "px")
                 :top     (str top "px")
                 :z-index (if dragging? 1000000 (or z-index 0))}}
        (d/div {:class         "title"
                :on-mouse-down #(when-not docked?
                                 (-drag-start! id owner state %))}
               (fa-icon icon) " " title)

        ;; standard controls to handle windowing
        (d/a {:class "pin" :href "javascript:" :on-click #(plasio-state/dock-pane! id)} (fa-icon :lock))
        (d/a {:class "unpin" :href "javascript:" :on-click #(plasio-state/undock-pane! id)} (fa-icon :unlock))
        (d/a {:class "toggle" :href "javascript:" :on-click #(swap! state update :collapsed? not)}
             (fa-icon
               (if collapsed? :chevron-down :chevron-up)))
        (d/a {:class "close-button" :href "javascript:" :on-click #(plasio-state/toggle-pane! id)} (fa-icon :close))

        ;; finally render our widget
        (d/div {:class "floating-panel-body"} (om/build child {}))))))


(defcomponentk key-val-table [[:data {title nil} data] owner]
  (render [_]
    (d/div
      (when title
        (d/div {:class "text"} title))
      (d/table
        {:class "key-val"}
        (apply d/tbody
               (for [[k v] data]
                 (d/tr (d/td k) (d/td v))))))))

