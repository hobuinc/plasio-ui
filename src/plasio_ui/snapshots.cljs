(ns plasio-ui.snapshots
  "Keep track of snapshots from our user interaction so we could sail back in time")


(defprotocol ITimeMachine
  (start-time-machine! [this])
  (stop-time-machine! [this])
  (all-snapshots [this])
  (activate-snapshot! [this index]))


(def ^:private time-machine-state-applier-id
  "__plasio-ui-time-machine")

(defrecord TimeMachine [state renderer max-snapshots]
  ITimeMachine
  (start-time-machine! [_]
    (let [listener-id (.addPropertyListener
                       renderer (array)
                       (fn [st]
                         (let [applier-id (aget st "x-applier-id")]
                           (when-not (= applier-id time-machine-state-applier-id)
                             (swap! state (fn [{:keys [index snapshots] :as this-state}]
                                            (println "index is:" index)
                                            (let [current-snapshots (if (zero? index)
                                                                      snapshots
                                                                      (drop index snapshots))
                                                  ;; Also make sure we cap snapshots at max-snapshots
                                                  current-snapshots (if (> (count current-snapshots) max-snapshots)
                                                                      (drop-last current-snapshots)
                                                                      current-snapshots)
                                                  new-snapshots (conj current-snapshots st)]
                                              ;; finally return our updated value, resetting time to current time
                                              (assoc this-state
                                                     :snapshots new-snapshots
                                                     :index 0))))))))]
      (swap! state assoc :listener-id listener-id)))

  (stop-time-machine! [_]
    (let [{:keys [listener-id]} @state]
      (.removePropertyListener renderer listener-id)
      (swap! state dissoc :listener-id)))

  (all-snapshots [_]
    (:snapshots @state))

  (activate-snapshot! [_ index]
    (let [snapshots (:snapshots @state)
          total (count snapshots)
          backtrack-index (- total index 1)]
      ;; picking nth from a list could be slowyah, TODO it
      (when-not (neg? backtrack-index)
        (swap! state assoc :index index)
        (.applyState renderer (nth snapshots index) time-machine-state-applier-id)))))

(defn make-time-machine [state renderer max-snapshots]
  (TimeMachine. state
                renderer
                max-snapshots))
