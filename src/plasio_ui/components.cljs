(ns plasio-ui.components
  (:require [plasio-ui.math :as math]
            [plasio-ui.util :as util]
            [cljs.core.async :as async :refer [<!]])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(defprotocol ViewBasedAutoTool
  (start! [_])
  (stop! [_])
  (set-params! [_ params]))

(defn- compute-profile [renderer segment width]
  (let [p (js/PlasioLib.Features.Profiler.
            renderer
            (array segment)
            width)
        c (async/chan)]
    (.extractProfile
      p true
      (fn [err data]
        ;; if we errored, just close the channel otherwise return the data and close the
        ;; channel
        (if err
          (async/close! c)
          (async/onto-chan c [(aget data 0)]))))
    c))

(defrecord AutoProfiler [state]
  ViewBasedAutoTool
  (start! [_]
    ;; start the auto tool, basically means we need to setup the needed hooks
    (let [renderer (:renderer @state)
          ch (:chan @state)
          prop-listener (.addPropertyListener
                          renderer
                          (array "view")
                          (util/throttle
                            200
                            (fn [view]
                              (let [eye (aget view "eye")
                                    target (aget view "target")]
                                (when (and eye target)
                                  ;; do our profiling stuff
                                  (let [scale (get-in @state [:params :scale] 1500)
                                        width (get-in @state [:params :width] 50)
                                        [seg1 seg2] (math/orthogonal-axis-for-eye-target eye target scale)
                                        [s1 e1] seg1
                                        [s2 e2] seg2]

                                    (.addHighlightSegment renderer "autoprofile-seg1" s1 e1 width)
                                    (.addHighlightSegment renderer "autoprofile-seg2" s2 e2 width)

                                    (go
                                      ;; compute the profiles and only if both of them succeed
                                      ;; we return a pair of profiles to the user
                                      (js/console.time "profile")
                                      (let [profile1 (<! (compute-profile renderer seg1 width))
                                            profile2 (<! (compute-profile renderer seg2 width))]
                                        (js/console.timeEnd "profile")
                                        (when (and profile1
                                                   profile2)
                                          (async/put! ch [profile1 profile2]))))))))))]
      (swap! state assoc :prop-listener prop-listener)))

  (stop! [_]
    ;; stop the tool, remove subscription to events
    (let [renderer (:renderer @state)
          prop-listener (:prop-listener @state)]
      (.removeHighlightSegment renderer "autoprofile-seg1")
      (.removeHighlightSegment renderer "autoprofile-seg2")

      (when prop-listener
        (.removePropertyListener renderer prop-listener)
        (swap! state dissoc :prop-listener))))

  (set-params! [_ params]
    (swap! state update :params merge params)))


(defn make-auto-profiler [renderer chan params]
  (AutoProfiler. (atom {:renderer renderer
                        :chan chan
                        :params params})))

(let [canvases (atom nil)]
  (defn get-canvases []
    (if-let [c @canvases]
      c
      (let [ons (.createElement js/document "canvas")
            mem (.createElement js/document "canvas")]
        (set! (.-width ons) 600)
        (set! (.-height ons) 300)

        (set! (.-width mem) 600)
        (set! (.-height mem) 300)

        (set! (.-id ons) "profile-view")
        (.appendChild (.-body js/document) ons)
        (reset! canvases [ons mem]))))

  (defn mapr [a sa ea so eo]
    (+ so
       (* (- eo so)
          (/ (- a sa) (- ea sa)))))

  (defn draw-profile [ctx left right top bottom profile]
    (let [b (aget profile "buffer")
          points (aget profile "totalPoints")
          floats-per-point (/ (.-length b) points)
          mins [(aget profile "mins" 0)
                (aget profile "mins" 1)
                (aget profile "mins" 2)]
          maxs [(aget profile "maxs" 0)
                (aget profile "maxs" 1)
                (aget profile "maxs" 2)]]
      (println "-- -- " points floats-per-point)
      (loop [n 0
             offset 0]
        (when (< n points)
          (let [x (aget b offset)
                y (aget b (+ offset 1))
                r (aget b (+ offset 3))
                g (aget b (+ offset 4))
                b (aget b (+ offset 5))]
            (set! (.-fillStyle ctx) (str "rgb(" r "," g "," b ")"))
            (.fillRect ctx
                       (mapr x (mins 0) (maxs 0) left right)
                       (mapr y (mins 1) (maxs 1) bottom top)
                       2 2))
          (recur (inc n) (+ offset floats-per-point))))))

  (defn push-profile-to-dom! [profiles]
    (let [[ons mem] (get-canvases)]
      (println "-- -- canvases:" ons mem)
      ;; draw profiles to the the render area
      (let [ctx (.getContext mem "2d")]
        (set! (.-fillStyle ctx) "black")
        (.fillRect ctx 0 0 600 300)
        (doall
          (map #(draw-profile
                 ctx
                 10 590
                 (+ (* %2 150) 10)
                 (- (* (inc %2) 150) 10)
                 %1) profiles (range))))

      ;; finally blit it onscreen
      (let [ctx (.getContext ons "2d")]
        (.drawImage ctx mem 0 0))

      (println "done drawing!"))))


(let [active-tool (atom nil)
      last-chan (atom nil)
      ;; the tools we understand, sending down a tool which we don't know about
      ;; basically means that there won't be any active tool mapping
      ;;
      tools-mapping {:profile make-auto-profiler}]
  (defn set-active-autotool!
    "Set the active tool that is triggered on view changes"
    [tool renderer params]
    ;; if there is an active tool, release it
    (when-let [current-tool @active-tool]
      (stop! @active-tool)
      (reset! active-tool nil)
      ;; close the delivery chan
      (when-let [ch @last-chan]
        (async/close! ch)
        (reset! last-chan nil)))

    (when-let [new-tool (get tools-mapping tool)]
      ;; we have a new tool, call the function and start doing stuff to it
      (let [ch (async/chan)
            tool-inst (new-tool renderer ch params)]
        (reset! active-tool tool-inst)
        (reset! last-chan ch)

        ;; start it up
        (start! tool-inst)

        (go (loop [m (<! ch)]
              (when m
                (push-profile-to-dom! m)
                (recur (<! ch)))))

        ;; return the delivery chan
        ch))))
