(ns plasio-ui.state
  (:require [cljs.reader :as reader]))

(let [ls js/localStorage]
  (defn save-val! [key val]
    (let [v (pr-str val)]
      (.setItem js/localStorage (name key) v)))

  (defn get-val [key]
    (when-let [v (.getItem js/localStorage (name key))]
      (reader/read-string v))))


(defn- loc-key [title]
  (str "location."
       (clojure.string/lower-case title)))

(defn save-location! [title location]
  (save-val! (loc-key title) location))

(defn get-location [title]
  (get-val (loc-key title)))
