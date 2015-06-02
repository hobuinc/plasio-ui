(ns iowa-lidar-ui.history
  "URL and history stuff, most of the stuff here is HTML5 but will try not to fail"
  (:require [clojure.walk :as walk]
            [clojure.string :refer [join split]]))

;; define all paths from to compressed name mappings, this will be used to construct URLs and to
;; decode information back from these URLs
(def ^:private path-mappers
  [[[:server] "s"]
   [[:pipeline] "p"]
   [[:camera :azimuth] "ca"]
   [[:camera :elevation] "ce"]
   [[:camera :target] "ct"]
   [[:camera :distance] "cd"]
   [[:camera :max-distance] "cmd"]
   [[:ro :point-size] "ps"]
   [[:ro :point-size-attenuation] "pa"]
   [[:po :distance-hint] "dh"]
   [[:po :max-depth-reduction-hint] "mdr"]])


(defn- compress [obj]
  (let [pairs (for [[ks token] path-mappers
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
                          (for [[k v] path-mappers]
                            [v k]))]
    (reduce
     (fn [acc [k v]]
       (if-let [p (get reverse-map k)]
         (assoc-in acc p (-> v
                             js/decodeURIComponent
                             js/JSON.parse
                             js->clj))))
     {}
     tokens)))

(defn push-state
  ([obj]
    (push-state obj "Iowa Lidar"))

  ([obj title]
    (when-let [history (.. js/window -history)]
      (when (aget history "pushState")
        (let [url (compress obj)
              url-qs (str "/?" url)]
          (.pushState history (clj->js obj) title url-qs))))))


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
                       (f (-> (.-state e)
                              (js->clj :keywordize-keys true))))))

