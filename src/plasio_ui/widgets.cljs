(ns plasio-ui.widgets
  (:require [om.core :as om]
            [om-tools.core :refer-macros [defcomponentk]]
            [om-tools.dom :as d]
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


(defcomponentk slider [[:data min max start
                        {step 1} {f nil}
                        {connect false}] state owner]
  (did-mount [_]
    (let [node (om/get-node owner)
          start (clj->js start)
          emit #(when f
                 (f (slider-val node)))]
      (js/noUiSlider.create
        node
        (js-obj
          "start" start
          "connect" connect
          "step" step
          "range" (js-obj "min" min
                          "max" max)))

      (doto (.-noUiSlider node)
        (.on "slide" emit))))

  (did-update [_ _ _]
    (let [props (om/get-props owner)
          node (om/get-node owner)]
      (when (not= (:start props)
                  (slider-val node))
        (.set (.-noUiSlider node) (clj->js (:start props))))))


  (render [_]
    (d/div {:class "slider"})))


(defcomponentk labeled-slider [data owner]
  (render [_]
    (d/div {:class "slider-text"}
           (d/div {:class "text"} (:text data))
           (om/build slider data))))

(defcomponentk toolbar-item [[:data id {title ""} {icon nil} {f nil}]]
  (render [_]
    (let [user-ns (namespace id)
          sep? (= user-ns "separator")]
      (if sep?
        (d/div {:class "separator"})
        (d/button {:class    "btn"
                   :title    title
                   :on-click #(plasio-state/toggle-pane! id)}
                  (when icon
                    (fa-icon icon)))))))

(defcomponentk application-bar [[:data panes] owner]
  (render [_]
    (d/div
      {:class "app-bar"}
      (d/div {:class "title"} "plasio")
      (d/div {:class "toolbar"}
             (om/build-all toolbar-item panes {:key :id})))))


(defcomponentk docked-widgets [[:data children] owner state]
  (render-state [_ {:keys [collapsed?]}]
    (apply d/div
      {:class (str "docker-widget"
                   (if collapsed? " off" " on"))}
      (d/a {:class "toggle-docker"
            :href "javascript:"
            :on-click #(swap! state update :collapsed? not)}
           (fa-icon
             (if collapsed? :angle-double-right :angle-double-left)))
      children)))

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
    (println "starting drag!")
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


(defcomponentk floating-panel [[:data id title icon {child nil}] state owner]
  (init-state [_]
    {:collapsed? false :dragging? false})

  (render-state [_ {:keys [collapsed? dragging? z-index]}]
    (let [ui (om/observe owner plasio-state/ui)
          {:keys [left top]} (plasio-state/get-ui-location id)
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

