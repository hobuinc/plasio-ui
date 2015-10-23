(ns plasio-ui.history
  "URL and history stuff, most of the stuff here is HTML5 but will try not to fail"
  (:require [clojure.walk :as walk]
            [cljs.reader :refer [read-string]]
            [clojure.string :refer [join split]]))

;; define all paths from to compressed name mappings, this will be used to construct URLs and to
;; decode information back from these URLs
(def ^:private path-mappers
  [[[:server] "s"]
   [[:resource] "r"]
   [[:camera :azimuth] "ca"]
   [[:camera :elevation] "ce"]
   [[:camera :target] "ct"]
   [[:camera :distance] "cd"]
   [[:camera :max-distance] "cmd"]
   [[:ro :circular?] "cp"]
   [[:ro :point-size] "ps"]
   [[:ro :point-size-attenuation] "pa"]
   [[:ro :intensity-blend] "ib"]
   [[:ro :intensity-clamps] "ic"]
   [[:ro :imagery-source] "is"]
   [[:ro :color-ramp] "cr" keyword]
   [[:ro :color-ramp-range] "ccr"]
   [[:ro :map_f] "mapf"]
   [[:pm :z-exaggeration] "ze"]])

(defn all-url-keys []
  (mapv first path-mappers))

(defn- compress [obj]
  (let [pairs (for [[ks token t] path-mappers
                    :let [val (get-in obj ks)]
                    :when val]
                [token val])]
    (join "&"
          (map (fn [[token val]]
                 (str token "=" (-> val
                                    clj->js
                                    js/JSON.stringify
                                    js/encodeURIComponent)))
               pairs))))

(defn- decompress [s]
  (let [pairs (split s #"&")
        tokens (map #(split % #"=") pairs)
        reverse-map (into {}
                          (for [[k v t] path-mappers]
                            [v [k t]]))]
    (reduce
     (fn [acc [k v]]
       (if-let [[p t] (get reverse-map k)]
         (let [val (-> v
                       js/decodeURIComponent
                       js/JSON.parse
                       js->clj)]
           (assoc-in acc p
                     (if t (t val) val)))))
     {}
     tokens)))

(defn- prep-state [obj]
  (let [url (compress obj)
        url-qs (str "/?" url)
        to-store (reduce (fn [m path]
                           (assoc-in m path (get-in obj path)))
                         {}
                         (all-url-keys))
        store-state (pr-str to-store)]
    [(js-obj "state" store-state) url-qs]))

(defn push-state
  ([obj]
    (push-state obj "speck.ly"))

  ([obj title]
    (when-let [history (.. js/window -history)]
      (let [[to-store url-qs] (prep-state obj)]
        (.pushState history to-store title url-qs)))))


(defn replace-state
  ([obj]
    (replace-state obj "speck.ly"))
  ([obj title]
    (when-let [history (.. js/window -history)]
      (let [[to-store url-qs] (prep-state obj)]
        (.replaceState history to-store title url-qs)))))


(defn current-state-from-query-string
  ([]
    (current-state-from-query-string (.. js/window -location -search)))
  ([qs]
    (when-not (clojure.string/blank? qs)
      (decompress (subs qs 1)))))

(defn listen
  "bind to state pop event if its available, call f with the popped state"
  [f]
  (.addEventListener js/window "popstate"
                     (fn [e]
                       (f (-> (.. e -state -state)
                              read-string)))))

(defn resource-url [server resource]
  (let [origin (aget js/location "origin")]
    (str origin
         "/?s=\"" server "\"&r=\"" resource "\"")))

