(ns iowa-lidar-ui.history
  "URL and history stuff, most of the stuff here is HTML5 but will try not to fail"
  (:require [clojure.walk :as walk]))


(defn- make-query-string [obj]
  (clojure.string/join
    "&"
    (for [[k v] obj]
      (str (name k) "=" (-> v
                            clj->js
                            js/JSON.stringify
                            js/encodeURIComponent)))))

(defn- parse-qs [s]
  (let [parts (clojure.string/split s #"&")]
    (->> parts
         (map #(clojure.string/split % #"="))
         (map (fn [[k v]]
                [k (-> v
                       js/decodeURIComponent
                       js/JSON.parse
                       js->clj)]))
         (into {})
         (walk/keywordize-keys))))

(defn push-state
  ([obj]
    (push-state obj "Iowa Lidar"))

  ([obj title]
    (when-let [history (.. js/window -history)]
      (when (aget history "pushState")
        (let [jsobj (clj->js obj)
              url-qs (str "/?" (make-query-string obj))]
          (js/console.log "pushing-state:" jsobj url-qs)
          (.pushState history jsobj title url-qs))))))

(defn current-state-from-query-string
  ([]
    (current-state-from-query-string (.. js/window -location -search)))
  ([qs]
    (when-not (clojure.string/blank? qs)
      (parse-qs (subs qs 1)))))

(defn listen
  "bind to state pop event if its available, call f with the popped state"
  [f]
  (.addEventListener js/window "popstate"
                     (fn [e]
                       (f (-> (.-state e)
                              (js->clj :keywordize-keys true))))))

