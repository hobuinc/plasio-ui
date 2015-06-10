(ns plasio-ui.widgets
  (:require [reagent.core :as reagent]))

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
               emit #(f (js/parseFloat (.val slider)))]
           (doto slider
             (.on "slide" emit)
             (.on "set" emit))
           (.noUiSlider slider
                        (js-obj
                          "start" start
                          "connect" "lower"
                          "range" (js-obj "min" min
                                          "max" max)))))

       :reagent-render
       (fn [start min max f]
         [:div.slider])})))
