(ns plasio-ui.util
  (:require [cljs.core.async :as async :refer [<!]]
            [clojure.string :as str]
            [cljs.pprint :as pprint])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(defn v [txt v]
  (println "-- v: " txt)
  (pprint/pprint v)
  v)

(defn mapr
  "maps v which is in range ins -> ine, to the range outs -> oute"
  ([v ins ine]
   (mapr v ins ine 0 1))

  ([v ins ine outs oute]
   (let [f (/ (- v ins) (- ine ins))]
     (+ outs (* f (- oute outs))))))

(defn- zero-histogram [lower higher step]
  (let [how-many (inc (quot (- higher lower) step))]
    (println how-many)
    (zipmap
      (iterate #(+ % step) lower)
      (repeat how-many 0))))


(defn- strip-trailing-slash [s]
  (if (= (last s) "/")
    (subs s 0 (dec (count s)))
    s))

(defn urlify [s]
  (if (re-find #"^https?://" s)
    s
    (str "http://" s)))

(defn- trim-slashes [s]
  (let [s1 (if (str/starts-with? s "/") (subs s 1) s)
        s2 (if (str/ends-with? s1 "/") (subs s1 0 (dec (count s1))) s1)]
    s2))

(defn join-url-parts [server & parts]
  (let [fixed-server (urlify server)]
    (str (trim-slashes fixed-server)
         "/"
         (str/join "/" (map (comp trim-slashes str) parts)))))

(defn random-id []
  (let [s (.toFixed (js/Math.random) 16)]
    (.substring s 2)))

(defn info-url [server resource]
  (str server "resource/" resource "/info"))

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

(defn throttle
  "Make sure that calls are throttled to at least 'to' interval, most recent passed value is passed
  to f"
  [to f]
  (let [last-count (atom 0)
        last-args (atom nil)]
    (fn [& args]
      (swap! last-count inc)
      (reset! last-args args)

      (let [cnt @last-count]
        (go
          (<! (async/timeout to))
          (when (= cnt @last-count)
            ;; the counter didn't change since its last call, which means that the property has
            ;; settled
            (apply f @last-args)))))))


(defn overlayed-imagery? [type]
  ;; any imagery identifier which starts with mapbox for now is overlayed
  ;;
  (zero?
   (.indexOf type "mapbox")))

(defn adjust-channels [channels]
  ;; figure if we have a solo channel, if we do, it means that all other channels
  ;; are automatically mute, unless they have a solo on too?
  (if (some (fn [[k v]] (:solo? v)) channels)
    ;; we have at least one channel with solo
    (into {} (for [i (range 4)
                   :let [c (keyword (str "channel" i))
                         v (get channels c)]]
               [c (if-not (:solo? v)
                    (assoc v :mute? true)
                    v)]))
    channels))


(defn binary-http-get< [url options]
  (let [c (async/chan)
        req (doto (js/XMLHttpRequest.)
              (.open "GET" url)
              (aset "withCredentials" (:with-credentials? options))
              (aset "responseType" "arraybuffer")
              (aset "onreadystatechange" (fn []
                                           (this-as this
                                             (when (= 4 (aget this "readyState"))
                                               (if (= 200 (aget this "status"))
                                                 (async/onto-chan c [(aget this "response")])
                                                 (async/close! c)))))))]
    (.send req)
    c))

(defn wait-promise< [p]
  (let [c (async/chan)]
    (doto p
      (.then #(async/onto-chan c [%]))
      (.catch #(async/close! c)))
    c))


(defn qs->params [p]
  (let [parts (str/split p #"&")]
    (into {}
          (for [p parts
                :let [[k v] (str/split p #"=")]]
            [(keyword (str/lower-case k)) (js/decodeURIComponent v)]))))


(declare deep-merge-item)

(defn deep-merge [& ms]
  (apply merge-with deep-merge-item ms))

(defn- deep-merge-item [a b]
  (if (and (map? a) (map? b))
    (deep-merge a b)
    b))


(defn resources-bounds [resources]
  ;; cumulative bounds of all resources
  (reduce (fn [[nx ny nz mx my mz] {:keys [:bounds]}]
            [(min nx (bounds 0)) (min ny (bounds 1)) (min nz (bounds 2))
             (max mx (bounds 3)) (max my (bounds 4)) (max mz (bounds 5))])
          (-> resources first :bounds)
          (rest resources)))
