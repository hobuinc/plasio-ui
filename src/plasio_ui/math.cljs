(ns iowa-lidar-ui.math
  (:require cljsjs.gl-matrix))


(def ^:private world-y-axis (array 0 1 0))

(defn- tap [v]
  (println "--math-tap:" v)
  v)

(defn target-plane
  "Given a point construct a target plane for it, a target plain is XZ planar surface with
  normal pointing straiht up"
  [point]
  (array 0 1 0 (- (js/vec3.dot world-y-axis point))))


(let [a (array 0 0 0)]
  (defn project-point
  "Given a point, project it onto the given plane"
  [plane point]
  (let [dist (+ (js/vec3.dot plane point)
                (aget plane 3))]
    (js/vec3.subtract (array 0 0 0)
                      point
                      (js/vec3.scale a plane dist)))))


(defn make-vec [start end]
  (js/vec3.subtract (array 0 0 0) end start))


(defn angle-between [a b]
  (js/vec3.angle a b))


(defn ->deg [rads]
  (* 180 (/ rads js/Math.PI)))
