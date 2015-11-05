(ns plasio-ui.util)

(defn mapr
  "maps v which is in range ins -> ine, to the range outs -> oute"
  [v ins ine outs oute]
  (let [f (/ (- v ins) (- ine ins))]
    (+ outs (* f (- oute outs)))))

(defn- zero-histogram [lower higher step]
  (let [how-many (inc (quot (- higher lower) step))]
    (println how-many)
    (zipmap
      (iterate #(+ % step) lower)
      (repeat how-many 0))))


(defn urlify [s]
  (if (re-find #"https?://" s)
    s
    (str "http://" s)))


(defn info-url [server resource]
  (urlify
    (str server "/resource/" resource "/info")))

(defn schema->point-size [schema]
  (apply + (map :size schema)))

(defn schema->color-info [schema]
  (let [dims (set (map :name schema))]
    {:color? (every? dims ["Red" "Green" "Blue"])
     :intensity? (dims "Intensity")}))

(defn identical-in-paths? [paths a b]
  (every? #(do
            (let [a-val (get-in a %)
                  b-val (get-in b %)
                  is-same? (or (identical? a-val b-val)
                               (= a-val b-val))]
              is-same?))
          paths))

(defn log4 [n]
  (/ (js/Math.log n)
     (js/Math.log 4)))


