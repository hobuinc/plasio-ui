(ns plasio-ui.widgets
  (:require [reagent.core :as reagent]
            [clojure.string :as string]))

(defn panel
  "A simple widget which shows a panel with title and children"
  [title & children]
  [:div.panel
   [:div.title title]
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
           (.noUiSlider slider
                        (js-obj
                          "start" start
                          "connect" (if single? "lower" true)
                          "range" (js-obj "min" min
                                          "max" max)))))

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

