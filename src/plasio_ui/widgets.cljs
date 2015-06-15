(ns plasio-ui.widgets
  (:require [reagent.core :as reagent :refer [atom]]
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
       (remove zero?)
       (apply array)))

(defn make-color [[r g b]]
  (str "rgba(" r "," g "," b ", 1.0)"))


(defn profile-series [[id color series]]
  (reagent/create-class
   {:component-did-mount
    (fn [this]
      (js/console.log "parent element is:" (reagent/dom-node this))
      (.generate js/c3
                 (js-obj "bindto" (reagent/dom-node this)
                         "size" (js-obj "height" 180
                                        "width" 1000)
                         "legend" (js-obj "show" false)
                         "axis" (js-obj "x" (js-obj "show" false)
                                        "y" (js-obj "color" "#ffffff"))
                         "data" (js-obj "columns" (array (prepend "Profile" (filter-zeros series)))
                                        "colors" (js-obj "Profile" (make-color color))))))

    :reagent-render
    (fn [[id color series]]
      [:div.profile-series])}))

(defn profile-view [series]
  [:div.profile-view
   [profile-series (first series)]
   [:div.close
    [:a.fa.fa-times {:href "javascript:"
                     :on-click #(println "dismiss!")}]]])
