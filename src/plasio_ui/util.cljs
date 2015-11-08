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
     :intensity? (dims "Intensity")
     :origin? (dims "Origin")
     :classification? (dims "Classification")
     :point-source-id? (dims "PointSourceId")}))

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

(defn reflect-for-easting [bbox v]
  (let [minx (bbox 0)
        maxx (bbox 3)
        midx (+ minx (/ (- maxx minx) 2))]
    [(- (* 2 midx) (v 0))
     (v 1)
     (v 2)]))

(defn- center [bbox]
  (let [rx (- (bbox 3) (bbox 0))
        ry (- (bbox 4) (bbox 1))
        rz (- (bbox 5) (bbox 2))]
    [(+ (bbox 0) (/ rx 2))
     (+ (bbox 1) (/ ry 2))
     (+ (bbox 2) (/ rz 2))]))

(defn app->data-units [bbox v]
  (if (array? v)
    ;; if we got passed a JS array, just coerce it to
    ;; a vec and use the same function
    (let [[x y z] (app->data-units bbox [(aget v 0)
                                         (aget v 1)
                                         (aget v 2)])]
      (array x y z))
    (let [center (center bbox)
          dv [(v 0) (v 2) (v 1)]
          v' [(+ (center 0) (dv 0))
              (+ (center 1) (dv 1))
              (+ (center 2) (dv 2))]]
      (let [v'' (reflect-for-easting bbox v')]
        v''))))

(defn data-units->app [bbox v]
  (if (array? v)
    ;; if we got passed a JS array, just coerce it to
    ;; a vec and use the same function
    (let [[x y z] (data-units->app bbox [(aget v 0)
                                         (aget v 1)
                                         (aget v 2)])]
      (array x y z))
    (let [ve (reflect-for-easting bbox v)
          center (center bbox)
          v' [(- (ve 0) (center 0))
              (- (ve 2) (center 2))
              (- (ve 1) (center 1))]]
      v')))



