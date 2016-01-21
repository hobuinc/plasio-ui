(ns plasio-ui.app-widgets
  (:require [om.core :as om]
            [om-tools.core :refer-macros [defcomponentk]]
            [om-tools.dom :as d]
            [om-bootstrap.input :as i]
            [om-bootstrap.button :as b]
            [om-bootstrap.random :as r]
            [plasio-ui.config :as config]
            [plasio-ui.state :as plasio-state]
            [plasio-ui.widgets :as w]
            [plasio-ui.history :as history]
            [goog.string :as gs]
            [goog.string.format]
            [clojure.string :as s]
            [plasio-ui.math :as math]
            [cljs.core.async :refer [<!]]
            [plasio-ui.util :as util])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(let [id :rendering-options]
  (defcomponentk rendering-options-pane [owner]
    (render [_]
      (let [ro (om/observe owner plasio-state/ro)]
        (d/div
          ;; checkbox for circular points
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Circular Points?"
                      :checked   (:circular? @ro)
                      :on-change (fn [] (om/transact! plasio-state/ro #(update % :circular? not)))}))

          ;; slider for point size
          (om/build w/labeled-slider
                    {:text    "Point Size"
                     :min     1
                     :max 10
                     :start (get @ro :point-size 2) :step 1
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :point-size val)))})

          ;; point density loading
          (om/build w/labeled-slider
                    {:text "Point Density"
                     :min 1
                     :max 5
                     :start (get @ro :point-density 3)
                     :step 1
                     :guides ["Low" "High"]
                     :f (fn [val]
                          (om/transact! plasio-state/ro #(assoc % :point-density val)))})

          (d/p {:class "tip-warn"}
               "WARNING: Setting this value to higher values may render your browser unusable. "
               "Changes will take effect next time you move your camera around.")

          ;; slider for point size attentuation
          #_(om/build w/labeled-slider
                    {:text    "Point Size Attenuation"
                     :min     0.0
                     :max 2.0
                     :start (get @ro :point-size-attenuation 0.1) :step 0.1
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :point-size-attenuation val)))})

          ;; intensity blending
          (om/build w/labeled-slider
                    {:text    "Color/Intensity Blending"
                     :min     0.0
                     :max 1.0
                     :start (get @ro :intensity-blend 0) :step 0.01
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :intensity-blend val)))})

          ;; intensity blend ranging
          (om/build w/labeled-slider
                    {:text    "Intensity Values Scaling"
                     :min     0
                     :max 255
                     :start (get @ro :intensity-clamps 0) :step 1
                     :connect true
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :intensity-clamps val)))}))))))

(defn- css-color [[r g b]]
  (str "rgb("
       (js/Math.floor (* 255 r)) ","
       (js/Math.floor (* 255 g)) ","
       (js/Math.floor (* 255 b)) ")"))

(defn grad-svg
  ([s e]
    (grad-svg s e 16 10 nil nil))

  ([s e w h stop1 stop2]
   (let [id (gensym "grad")]
     (d/svg
       {:width w :height h}
       (d/defs
         (d/linearGradient
           {:id id :x1 0 :y1 0 :x2 1 :y2 0}
           (d/stop {:offset "0%" :stop-color (css-color s)})

           (when stop1
             (d/stop {:offset (str (* stop1 100) "%") :stop-color (css-color s)}))
           (when stop2
             (d/stop {:offset (str (* stop2 100) "%") :stop-color (css-color e)}))

           (d/stop {:offset "100%" :stop-color (css-color e)})))
       (d/rect {:x      0
                :y      0
                :width  w
                :height h
                :style  {:fill (str "url(#" id ")")}})))))



(defcomponentk ramp-button [[:data id s e f] owner]
  (render [_]
    (b/button
      {:bs-size "small"
       :on-click f}
      (grad-svg s e))))

(defcomponentk ramp-widget [[:data ro f fr] owner]
  (render [_]
    (d/div
      (d/div {:class "text"} "Height Ramp Color Source")
      (d/div
        {:class "ramps-container"}
        (apply
          b/button-group {}
          (om/build-all ramp-button
                        (map (fn [[id [s e]]]
                               {:id id :s s :e e
                                :f (partial f id)})
                             config/color-ramps)
                        {:key :id})))

      ;; finally draw the fancy svg with our current offsets
      (let [[left right] (:color-ramp-range ro)
            [s e] (get config/color-ramps
                       (or (:color-ramp ro) :red-to-green))]

        (d/div {:class "ramp-range"}
               (grad-svg s e 200 10 left right)

               ;; and the slider
               (om/build w/slider {:min     0
                                   :max     1
                                   :step    0.01
                                   :start   [left right]
                                   :connect true
                                   :f       fr}))))))

(let [id :imagery
      preknown-imagery-sources [["none" "None"]
                                [:divider/two :divider]
                                ["mapbox.satellite" "Satellite"]
                                ["mapbox.comic" "Comic"]
                                ["mapbox.wheatpaste" "Wheatpaste"]
                                ["mapbox.emerald" "Emerald"]
                                ["mapbox.pencil" "Pencil"]
                                [:divider/one :divider]
                                ["local.elevation" "Elevation"]]]
  (defcomponentk imagery-pane [state owner]
    (render-state [_ _]
      (let [ro (om/observe owner plasio-state/ro)
            as (om/observe owner plasio-state/root)
            lo (om/observe owner plasio-state/ui-local-options)
            histogram (om/observe owner plasio-state/histogram)

            schema-info (util/schema->color-info (:schema @as))

            known-imagery-sources (conj preknown-imagery-sources
                                        (when (:origin? schema-info)
                                          ["local.origin" "Origin"])
                                        (when (:classification? schema-info)
                                          ["local.classification" "Classification"])
                                        (when (:point-source-id? schema-info)
                                          ["local.pointSourceId" "Point Source ID"]))
            imagery-source (or (:imagery-source @ro) "mapbox.satellite")
            as-map (into {} known-imagery-sources)


            override (:color-ramp-override @lo)

            bounds (:bounds @as)
            zbounds (or (:zrange @ro) [(bounds 2) (bounds 5)])
            [ss se] (if override
                      override
                      zbounds)
            imager-source-title (get as-map
                                     imagery-source
                                     "No Source")
            color? (:color? schema-info)]

        (d/div
          {:class "imagery"}

          ;; imagery source
          (d/div
           (d/div {:class "imagery-source"}
                  (d/div {:class "text"} "Imagery Source")
                  (apply b/dropdown {:bs-size "small"
                                     :title   imager-source-title}
                         (for [[id name] known-imagery-sources]
                           (if (keyword? id)
                             (b/menu-item {:divider? true})
                             (b/menu-item {:key       id
                                           :on-select (fn []
                                                        (om/transact! plasio-state/ro
                                                                      #(assoc % :imagery-source id)))}
                                          name))))
                  (d/p {:class "tip"} "Note: The current scene will be reloaded with new imagery.")

                  (when (and (= "none" imagery-source)
                             (not color?))
                    (d/p {:class "tip-warn"}
                         "You have chosen to not apply any imagery color to this point cloud which has no color information.  Point cloud visibility may be low."))

                  (when (and (util/overlayed-imagery? imagery-source)
                             color?)
                    (d/p {:class "tip-warn"}
                         "You have chosen overlay imagery for coloring point cloud while the source has color. "
                         "Image overlay may not match point cloud unless point cloud is projected with Web Mercator.")))

           ;; imagery quality
           (om/build w/labeled-slider
                     {:text   "Imagery Quality"
                      :min    0
                      :max    2
                      :step   1
                      :guides ["Low" "High"]
                      :start  (or (:imagery-quality @lo) 1)
                      :f      (fn [nv]
                                (om/transact! plasio-state/ui-local-options
                                              #(assoc % :imagery-quality nv)))})

           (d/p {:class "tip"} "Note: This setting only affects the newly fetched imagery."))

          ;; z-range override
          ;;
          (om/build w/z-histogram-slider
                    {:text      "Z Range Override"
                     :min       (zbounds 0)
                     :max       (zbounds 1)
                     :start     [ss se]
                     :histogram @histogram
                     :f         #(om/update! plasio-state/ui-local-options
                                             :color-ramp-override %)})


          ;; draw the widget for selecting ramps
          (om/build ramp-widget {:ro @ro
                                 :f  (fn [new-mode]
                                       (om/transact!
                                         plasio-state/ro
                                         #(assoc % :color-ramp new-mode)))
                                 :fr (fn [new-range]
                                       (om/transact!
                                         plasio-state/ro
                                         #(assoc % :color-ramp-range new-range)))})

          ;; blend factor between the color and ramp color
          (om/build w/labeled-slider
                    {:text  "Imagery/Ramp Color Blending"
                     :min   0
                     :max   1
                     :step  0.01
                     :guides ["All Imagery" "All Color Ramp"]
                     :start (or (:map_f @ro) 0)
                     :f     (fn [nv]
                              (om/transact! plasio-state/ro
                                            #(assoc %
                                              :map_f nv
                                              :rgb_f (- 1 nv))))}))))))


(let [id :point-manipulation]
  (defcomponentk point-manipulation-pane [owner]
    (render [_]
      (let [pm (om/observe owner plasio-state/pm)]
        (om/build w/labeled-slider
                  {:text "Z-exaggeration.  Higher values stretch out elevation deltas more significantly."
                   :start (:z-exaggeration @pm)
                   :min 1
                   :max 12
                   :step 0.01
                   :connect "lower"
                   :f (fn [nv]
                        (om/transact! plasio-state/pm #(assoc % :z-exaggeration nv)))})))))


(let [id :switch-resource]
  (defcomponentk resource-item [[:data title resource server]]
    (render [_]
      (d/a {:href (history/resource-url server resource)} title)))
  (defcomponentk switch-resource-pane [owner]
    (render [_]
      (let [resources (map (fn [[title resource server]]
                             {:title title
                              :resource resource
                              :server server
                              :id (str resource "@" server)})
                           plasio-state/known-resources)]
        (d/div
          {:class "switch-resource"}
          (om/build-all resource-item resources {:key :id}))))))


(defn commify [n]
  (let [regex (js/RegExp."\\B(?=(\\d{3})+(?!\\d))" "g")]
                    (.replace (.toFixed n 0) regex ",")))

(defn- index-size [info]
  (let [num-points (:num-points info)
        schema (:schema info)
        size-bytes (* (util/schema->point-size schema) num-points)
        pow js/Math.pow
        scales {"KB" (pow 1024 1)
                "MB" (pow 1024 2)
                "GB" (pow 1024 3)
                "TB" (pow 1024 4)}
        check-scale #(> (/ size-bytes %) 1)
        mem-type (cond
                   (check-scale (get scales "TB")) "TB"
                   (check-scale (get scales "GB")) "GB"
                   (check-scale (get scales "MB")) "MB"
                   :else "KB")
        comma-regex (js/RegExp. "\\B(?=(\\d{3})+(?!\\d))" "g")]
    [(commify num-points) (gs/format "%.2f %s"
                                     (/ size-bytes (get scales mem-type))
                                     mem-type)]))


(let [id :information]
  (defcomponentk information-pane [owner]
    (render [_]
      (let [root (om/observe owner plasio-state/root)
            schema (:schema @root)
            [points size] (index-size @root)
            col-info (util/schema->color-info schema)]
        (om/build w/key-val-table
                  {:data [["Server" (:server @root)]
                          ["Resource" (:resource @root)]
                          ["Points" points]
                          ["Uncompressed Size" size]
                          ["Point Size" (util/schema->point-size schema )]
                          ["Intensity?" (if (:intensity? col-info) "Yes" "No")]
                          ["Color?" (if (:color? col-info) "Yes" "No")]
                          ["Powered By" "entwine"]
                          ["Caching" "Amazon CloudFront"]
                          ["Backend" "Amazon EC2"]]})))))


(let [id :local-settings]
  (defcomponentk local-settings-pane [owner]
    (render [_]
      (let [local-options (om/observe owner plasio-state/ui-local-options)]
        (d/div
          {:class "local-settings"}
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Enable Flicker Fix"
                      :checked   (:flicker-fix @local-options)
                      :on-change (fn []
                                   (om/transact!
                                     plasio-state/ui-local-options
                                     #(update % :flicker-fix not)))})
            (d/p {:class "tip"}
                 "If you're seeing visual artifacts like points appearing and disappearing, "
                 "enabling this options may work.")))))))

(defn z-range [bounds]
  (- (bounds 5) (bounds 2)))

(defn print-histo [n]
  (let [pairs (->> n
                   seq
                   (sort-by first))]
    (doall
      (map (partial println "-- --") pairs))))

(let [id :innundation-plane]
  (defcomponentk innundation-plane-pane [state owner]
    (render-state [_ {:keys [histogram]}]
      (let [root (om/observe owner plasio-state/root)
            ro (om/observe owner plasio-state/ro)
            ui-locals (om/observe owner plasio-state/ui-local-options)
            histogram (om/observe owner plasio-state/histogram)

            bounds (:bounds @root)
            zbounds (or (:zrange @ro) [(bounds 2) (bounds 5)])

            innun-override (:innundation-range-override @ui-locals)
            [start-s start-e] (if innun-override
                                innun-override
                                zbounds)
            innun-height (get @ui-locals :innudation-height start-s)
            clamped-innun-height (min (max innun-height start-s) start-e)]
        (d/div
          {:class "innundation-plane"}
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Show Innundation Plane?"
                      :checked   (:innundation? @ui-locals)
                      :on-change (fn [] (om/transact!
                                          plasio-state/ui-local-options
                                          #(update % :innundation? not)))}))
          (om/build w/value-present {:key   "Current Height"
                                     :value (commify clamped-innun-height)})

          (om/build w/z-histogram-slider {:text      "Z Range Override"
                                          :min       (zbounds 0)
                                          :max       (zbounds 1)
                                          :start     [start-s start-e]
                                          :histogram @histogram
                                          :f         #(do
                                                       (om/update! plasio-state/ui-local-options
                                                                   :innundation-range-override
                                                                   %))})

          ;; build the slider that will help us change the position
          ;;
          (om/build w/labeled-slider {:text    "Adjust the current innundation plane height."
                                      :min     start-s
                                      :max     start-e
                                      :connect false
                                      :step    0.001
                                      :start   clamped-innun-height
                                      :f       (fn [val]
                                                 (om/transact! plasio-state/ui-local-options
                                                               #(assoc % :innudation-height val)))})

          ;; the innundation plane opacity slider
          (d/div
            (om/build w/labeled-slider {:text  "Innundation plane opacity"
                                        :min   0.1
                                        :step  0.01
                                        :max   1
                                        :start (or (:innundation-plane-opacity @ui-locals)
                                                   1.0)
                                        :guides ["Transparent" "Opaque"]
                                        :f (fn [val]
                                             (om/transact! plasio-state/ui-local-options
                                                           #(assoc % :innundation-plane-opacity
                                                                     val)))})))))))


(defn- in-bounds? [[a b _ d e _] [g h]]
  (and (>= g a)
       (<= g d)
       (>= h b)
       (<= h e)))

(defn- format-coordinates [[x y]]
  (let [format-deg (fn [v]
                     (str (.toFixed (js/Math.abs v) 5) "°"))
        ns (if (neg? y) "S" "N")
        ew (if (neg? x) "W" "E")]
    (str (format-deg y) " " ns ", "
         (format-deg x) " " ew)))

(defn- trigger-search [owner text]
  (om/set-state! owner :loading? true)
  (go (let [r (<! (plasio-state/resolve-address text))]
        (om/set-state! owner :loading? false)
        (if r
          (let [[x y] (math/ll->webm (:coordinates r))]
            (om/set-state! owner :data r)
            (if (in-bounds? (:bounds @plasio-state/root)
                            [x y])
              (plasio-state/transition-to x y)
              (om/set-state! owner :error "Sorry, this address is out of bounds.")))
          (om/set-state! owner :error "Sorry, there was an error resolving this address.")))))

(defn world-in-ll []
  (let [bounds (:bounds @plasio-state/root)]
    (let [[west south] (math/webm->ll [(bounds 0) (bounds 1)])
          [east north] (math/webm->ll [(bounds 3) (bounds 4)])]
      [(js/google.maps.LatLng. north east)
       (js/google.maps.LatLng. south west)])))

(defcomponentk search-widget [state owner]
  (init-state [_]
    {:top "-10px"})

  (did-mount [_]
    (let [node (om/get-node owner "textbox")
          ac (js/google.maps.places.Autocomplete.
               node (js-obj "types" (array "geocode")))
          [ne sw] (world-in-ll)
          bounds (js/google.maps.LatLngBounds. sw ne)]

      (doto ac
        (.addListener "place_changed"
                      (fn []
                        (let [p (js->clj (.getPlace ac)
                                         :keywordize-keys true)]
                          (when-let [fa (:formatted_address p)]
                            (trigger-search owner fa)))))
        (.setBounds bounds))
      (.focus node)
      (swap! state assoc :top "30px")))
  (render-state [_ {:keys [top error data]}]
    (d/div
      {:class "search-widget"
       :style {:top top
               :background-color (when error
                                   "#900")}
       :on-submit #(.preventDefault %)}
      (d/form
        {:on-change #(swap! state dissoc :error :data)}
        (d/input {:class "search-box"
                  :placeholder "Search for an Address"
                  :ref "textbox"
                  :on-key-down (fn [e]
                                 (let [code (.-keyCode e)]
                                   (when (#{27 13} code)
                                     (.preventDefault e))
                                   (case code
                                     27 (plasio-state/hide-search-box!)
                                     13 (let [val (.. e -target -value)]
                                          (when-not (s/blank? val)
                                            (trigger-search owner val)))
                                     nil)))
                  :type "text"})
        (d/a {:class "cancel-button"
              :href "javascript:"
              :on-click #(plasio-state/hide-search-box!)}
             (w/fa-icon :times)))

      (when-let [a (:address data)]
        (d/div {:class "addr-info"}
               (d/p {:class "address"} (w/fa-icon :map-marker) " " a)
               (d/p {:class "coordinates"} (format-coordinates (:coordinates data)))))

      (when error
        (d/p {:class "error"} error)))))


(defcomponentk render-target [[:data renderer-state] state owner]
  (did-mount [_]
    ;; time to intialize the renderer and set it up
    (let [rs renderer-state
          comps (plasio-state/initialize-for-resource
                  (om/get-node owner) rs)]

      ;; add stats listener for Z, update the histogram and z-range for the renderer
      ;;
      (let [r (:renderer comps)]
        (.addStatsListener r "z" "z-collector"
                           (fn [_ n]
                             (let [hist (js->clj n)]
                               (when-not (empty? hist)
                                 (let [hist (into {} (for [[k v] hist]
                                                       [(js/parseInt k) v]))
                                       nn (apply min (keys hist))
                                       xx (apply max (keys hist))
                                       hist (merge (util/zero-histogram nn xx 10)
                                                   hist)]
                                   ;; update the state of our renderer based on what we get from the histogram
                                   (om/update! plasio-state/ro :zrange [nn xx])
                                   (om/update! plasio-state/histogram hist))))))
        (swap! state assoc :cleanup-fn
               (fn []
                 (.removeStatsListener r "z" "z-collector")))

        ;; to determine the correct range for the colors, we need to wait for a color range to arrive
        ;; and then based on that we determine whether colors are 16bit or 32bit.
        ;;
        (.addStatsListener r "red" "red-collector"
                           (fn [_ n]
                             (when n
                               (let [hist (js->clj n)
                                     red-comp (->> hist
                                                   keys
                                                   (map js/parseInt)
                                                   (filter #(> % 255))
                                                   first)]
                                 (.removeStatsListener r "red" "red-collector")
                                 (om/transact! plasio-state/ro
                                               #(assoc % :max-color-component (if red-comp 65535 255))))))))

      ;; save intialized state
      (om/update! plasio-state/comps comps)))

  (will-unmount [_]
    (when-let [cfn (:cleanup-fn @state)]
      (cfn)))

  (did-update [_ prev-props prev-state]
    ;; apply any state that needs to be applied here
    (let [r (get-in @plasio-state/root [:comps :renderer])
          pn (:renderer-state prev-props)
          n (:renderer-state (om/get-props owner))
          ro (:ro n)
          lo (get-in n [:ui :local-options])
          [ramp-sc ramp-ec] (get config/color-ramps (:color-ramp ro))
          [color-ramp-start color-ramp-end] (:color-ramp-range ro)
          p (get-in @plasio-state/root [:comps :policy])
          zrange (or (:zrange ro) (:bounds n))
          ramp-override (:color-ramp-override lo)
          zrange-lower (or (nth ramp-override 0) (nth zrange 0))
          zrange-upper (or (nth ramp-override 1) (nth zrange 1))
          map_f (get ro :map_f 0.0)
          rgb_f (- 1 map_f)

          ;; setting max color component is slightly more involved.  If we're using
          ;; color as sent down by the source, we use whatever the current max-color-component
          ;; is, if we have an imagery set, the color always needs to be 256
          ;;
          max-color-component (if (or (s/blank? (:imagery-source ro))
                                      (= (:imagery-source ro) "none"))
                                ;; no imagery source set, so set it to whatever the point source has set it to
                                ;; make sure its not zero though
                                (max 1 (get ro :max-color-component 256))
                                ;; otherwise its always 256
                                256)]

      (println "-- -- max-color-component:" max-color-component ro)
      ;; standard render options
      ;;
      (.setRenderOptions r (js-obj
                             "circularPoints" (if (true? (:circular? ro)) 1 0)
                             "pointSize" (:point-size ro)
                             "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
                             "xyzScale" (array 1 (get-in n [:pm :z-exaggeration]) 1)
                             "intensityBlend" (:intensity-blend ro)
                             "clampLower" (nth (:intensity-clamps ro) 0)
                             "clampHigher" (nth (:intensity-clamps ro) 1)
                             "colorClampHigher" color-ramp-end
                             "colorClampLower" color-ramp-start
                             "maxColorComponent" max-color-component
                             "zrange" (array zrange-lower zrange-upper)
                             "rgb_f" rgb_f
                             "map_f" map_f
                             "rampColorStart" (apply array ramp-sc)
                             "rampColorEnd" (apply array ramp-ec)))
      ;; apply any screen rejection values
      (let [density (get ro :point-density 2)
            factor (+ 100 (- 500 (* density 100)))]
        (set! (.-REJECT_ON_SCREEN_SIZE_RADIUS js/PlasioLib.FrustumLODNodePolicy) factor))

      ;; do we need a flicker fix?
      (let [flicker-fix? (get-in n [:ui :local-options :flicker-fix])]
        (.setRenderHints r (js-obj
                             "flicker-fix" flicker-fix?)))

      ;; check for innundation plane stuff
      ;;
      (let [bounds (:bounds n)
            zbounds (or (:zrange ro) [(bounds 2) (bounds 5)])
            range (- (zbounds 1) (zbounds 0))
            size  (max (- (bounds 3) (bounds 0))
                       (- (bounds 4) (bounds 1)))
            lo (get-in n [:ui :local-options])
            half (/ range 2.0)
            [low high] (get lo :innundation-range-override zbounds)
            planey (util/mapr
                     (min high
                          (max low (get lo :innudation-height low)))
                     (zbounds 0) (zbounds 1)
                     (- half) half)]
        (if (get-in n [:ui :local-options :innundation?])
          (.updatePlane r "innundation"
                        (array 0 1 0)
                        planey
                        (array 0 187 215)
                        (get-in n [:ui :local-options :innundation-plane-opacity] 1.0)
                        size)
          (.removePlane r "innundation")))

      ;; if the imagery source has changed we need to update that
      ;;
      (let [is (:imagery-source ro)
            pis (get-in pn [:ro :imagery-source])]
        (when-not (= is pis)
          (println "-- -- imagery source has changed:" is pis)
          (let [policy (:policy @plasio-state/comps)
                loader (get @plasio-state/comps :point-loader)]
            (.hookedReload policy
                           #(.setColorSourceImagery loader is)))))

      (set! (.-IMAGE_QUALITY js/PlasioLib.Loaders.MapboxLoader)
            (get-in n [:ui :local-options :imagery-quality] 1))))

  (render [_]
    (d/div {:id "render-target"})))

(def ^:private z-vec (array 0 0 -1))

(defcomponentk target-location [owner state]
  (did-mount [_]
    (when-let [renderer (:renderer @plasio-state/comps)]
      (.addPropertyListener
        renderer (array "view")
        (fn [view]
             (when view
               (when-let [target (aget view "target")]
                 (swap! state assoc :target [(aget target 0)
                                             (aget target 1)
                                             (aget target 2)])))))))
  (render-state [_ {:keys [target]}]
    (let [rs (om/observe owner plasio-state/root)
          bbox (:bounds @rs)]
      (when target
        (let [loc (util/app->data-units bbox target)]
          (d/p {:class "target-location"}
               (w/fa-icon :map-marker)
               (.toFixed (loc 0) 2) ", "
               (.toFixed (loc 1) 2) ", "
               (.toFixed (loc 2) 2)))))))

(defcomponentk compass [owner state]
  (did-mount [_]
    (when-let [renderer (:renderer @plasio-state/comps)]
      (.addPropertyListener
        renderer (array "view")
        (fn [view]
             (when view
               (let [eye (aget view "eye")
                     target (aget view "target")]
                 ;; such calculations, mostly project vectors to xz plane and
                 ;; compute the angle between the two vectors
                 (when (and eye target)
                   (let [plane (math/target-plane target)       ;; plane at target
                         peye (math/project-point plane eye)    ;; project eye
                         v (math/make-vec target peye)          ;; vector from target to eye
                         theta (math/angle-between z-vec v)     ;; angle between target->eye and z
                         theta (math/->deg theta)               ;; in degrees

                         t->e (math/make-vec target eye)        ;; target->eye vector
                         t->pe (math/make-vec target peye)      ;; target->projected eye vector
                         incline (math/angle-between t->e t->pe)  ;; angle between t->e and t->pe
                         incline (math/->deg incline)]            ;; in degrees

                     ;; make sure the values are appropriately adjusted for them to make sense as
                     ;; css transforms
                     (swap! state assoc
                            :heading (if (< (aget v 0) 0)
                                       theta
                                       (- 360 theta))
                            :incline (- 90 (max 20 incline)))))))))))
  (render-state [_ {:keys [incline heading]}]
    (let [comps (om/observe owner plasio-state/comps)
          camera (:camera @comps)]
      (d/a
        {:class    "compass"
         :style    {:transform (str "rotateX(" incline "deg)")}
         :href     "javascript:"
         :on-click #(when camera
                     (.setHeading camera 0))}
        (d/div {:class "arrow"
                :style {:transform (str "rotateZ(" heading "deg)")}}
               (d/div {:class "n"})
               (d/div {:class "s"}))
        (d/div {:class "circle"})))))


(defcomponentk logo []
  (render [_]
    (d/div {:class "entwine"
            :style {:position "fixed"
                    :bottom "10px"
                    :left "10px"}})))


(def ^:private menu-item-mapping
  "Menu items we know about and have associated icons with"
  {:delete     :fa-times
   :point      :fa-map-marker
   :los        :fa-eye
   :remove-los [:fa-eye [:fa-ban :text-danger]]
   :profile    :fa-line-chart
   :pan        :fa-hand-paper-o
   :camera     :fa-video-camera
   :circles    :fa-square-o})

(defn- ->icon [icon]
  (if (sequential? icon)
    ;; stacked icon
    (d/span {:class "fa-stack"}
            (map (fn [icon index]
                   (d/i {:class (str "fa fa-stack-" index "x "
                                     (if (sequential? icon)
                                       (clojure.string/join " " (map name icon))
                                       (name icon)))}))
                 icon (repeat 1)))
    (d/i {:class (str "fa " (name icon))})))


(defn- in-heirarchy?
  "Does the element which have parent in its heirarchy?"
  [parent which]
  (loop [w which]
    (println "-- -- CHECK:" parent w)
    (when w
      (if (= w parent)
        true
        (recur (.-parentElement w))))))

(defcomponentk context-menu [[:data actions {screenPos [0 0]}] state owner]
  (init-state [_]
    {:multiplier 2 :opacity 0})

  (did-mount [_]
    ;; when mounted attach a system wide click handler so that we can dismiss the
    ;; the popup menu
    ;;
    (let [node (om/get-node owner)
          handler (fn [e]
                    (when-not (in-heirarchy? node (.-target e))
                      (.stopPropagation e)
                      (.preventDefault e)
                      (om/update! plasio-state/current-actions {})))
          rhandler (fn []
                     (.removeEventListener js/document "mousedown" handler true))]
      (.addEventListener js/document "mousedown" handler true)
      (.addEventListener node "contextmenu" #(.preventDefault %))
      ;; save the handler and also set the multiplier to 1 for much animation
      (swap! state assoc
             :rhandler rhandler))

    (js/setTimeout #(swap! state assoc
                           :multiplier 1
                           :opacity 1) 0))


  (will-unmount [_]
    (when-let [rhandler (:rhandler @state)]
      (rhandler)
      (swap! state dissoc :rhandler)))

  (render-state [_ {:keys [multiplier opacity]}]
    (let [total-items (count actions)
          angle-per-item (/ (* 2 js/Math.PI) total-items)
          width 128
          height 128
          [x y] screenPos
          d (cond
              (> total-items 4) 2
              (> total-items 2) 3
              :else 4)
          radius (/ width d)
          center [(/ width 2) (/ height 2)]
          indexed (map-indexed #(conj %2 %1) actions)]
      (d/div
        {:style {:position "absolute"
                 :width    0
                 :height   0
                 :left     (- x (/ width 2))
                 :top      (- y (/ height 2))}}
        (d/div
          {:class "context-menu"
           :style {:width "100%" :height "100%"}}
          (for [[id [title f] index] indexed
                :let [angle (* index angle-per-item)
                      posx (+ (center 0) (* multiplier radius (js/Math.cos angle)))
                      posy (+ (center 1) (* multiplier radius (js/Math.sin angle)))]]
            (do
              (println "-- -- ID:" id)
              (d/a {:class    "item"
                    :style    {:left posx :top posy :opacity opacity}
                    :href     "javascript:"
                    :on-click #(do
                                (.preventDefault %)
                                (f))}
                   (let [icon (get menu-item-mapping id :fa-exclamation-triangle)]
                     (->icon icon))
                   (d/div {:class "item-tip"} title)))))))))
