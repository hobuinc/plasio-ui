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


(defn -starts-with? [s p]
  (zero?
    (.indexOf s p)))

(defn clear-locations-cache! []
  (let [ls js/localStorage
        len (.-length js/localStorage)
        to-remove (vec (for [i (range len)
                             :let [k (.key ls i)]
                             :when (-starts-with? k "location.")]
                         k))]
    (doall
      (map #(.removeItem ls %) to-remove))))
