(ns plasio-ui.app-widgets
  (:require [om.core :as om]
            [om-tools.core :refer-macros [defcomponentk]]
            [om-tools.dom :as d]
            [om-bootstrap.input :as i]
            [om-bootstrap.button :as b]
            [om-bootstrap.random :as r]
            [om-bootstrap.nav :as n]
            [plasio-ui.config :as config]
            [plasio-ui.state :as plasio-state]
            [plasio-ui.widgets :as w]
            [plasio-ui.history :as history]
            [goog.string :as gs]
            [goog.string.format]
            [clojure.string :as s]
            [plasio-ui.math :as math]
            [cljs.core.async :as async :refer [<!]]
            [plasio-ui.util :as util]
            [clojure.string :as str]
            org.visjs
            [clojure.set :as set])
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

          ;; slider for point size attentuation
          (om/build w/labeled-slider
                    {:text    "Point Size Attenuation.  Points closer to you are bloated up."
                     :min     0.0
                     :max 0.5
                     :start (get @ro :point-size-attenuation 0.1) :step 0.01
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :point-size-attenuation val)))})

          ;; point density loading
          

          


          ;; intensity blending
          #_(om/build w/labeled-slider
                    {:text    "Color/Intensity Blending"
                     :min     0.0
                     :max 1.0
                     :start (get @ro :intensity-blend 0) :step 0.01
                     :connect "lower"
                     :f       (fn [val]
                                (om/transact! plasio-state/ro #(assoc % :intensity-blend val)))})

          ;; intensity blend ranging
          #_(om/build w/labeled-slider
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
  (defcomponentk resource-item [[:data displayName url]]
    (render [_]
      (d/a {:href url} displayName)))

  (defcomponentk switch-resource-pane [owner]
    (render [_]
      (let [all-resources (om/observe owner plasio-state/available-resources)]
        (d/div
          {:class "switch-resource"}
          (om/build-all resource-item (->> @all-resources
                                           (sort-by :displayName)) {:key :id}))))))


(defn commify [n]
  (let [regex (js/RegExp."\\B(?=(\\d{3})+(?!\\d))" "g")]
                    (.replace (.toFixed n 0) regex ",")))

(defn- index-size [info]
  (let [num-points (:numPoints info)
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
      (let [root (om/observe owner plasio-state/root)]
        (d/div
          (for [resource-info (:resource-info @root)]
            (let [schema (:schema resource-info)
                  init-params (:init-params @root)
                  [points size] (index-size resource-info)
                  col-info (util/schema->color-info schema)]
              (d/div
                {:key (str (:resource resource-info) "@" (:server resource-info))}
                (d/h4 (:resource resource-info))
                (om/build w/key-val-table
                          {:data (->> [["Server" (:server resource-info)]
                                       ["Resource" (:resource resource-info)]
                                       ["Point Cloud Info"
                                        (d/a {:href   (util/join-url-parts
                                                        (js/Plasio.Util.pickOne (:server resource-info)) "resource" (:resource resource-info) "info")
                                              :target "_blank"}
                                             "Click here")]

                                       ["Points" points]
                                       ["Uncompressed Size" size]
                                       ["Point Size" (util/schema->point-size schema)]
                                       ["Intensity?" (if (:intensity? col-info) "Yes" "No")]
                                       ["Color?" (if (:color? col-info) "Yes" "No")]]
                                      (filterv some?))})
                (let [info (:additionalInformation init-params)]
                  (when-not (s/blank? info)
                    (d/div
                      {:class                   "additional-info"
                       :dangerouslySetInnerHTML {:__html info}})))))))))))


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
                 "enabling this options may work."))

          (let [all-keys (->> (keys plasio-state/point-cloud-density-levels)
                              sort)]
            (om/build w/labeled-slider
                      {:text "Point Density"
                       :min (first all-keys)
                       :max (last all-keys)
                       :start (get @local-options :point-density plasio-state/default-point-cloud-density-level)
                       :step 1
                       :guides ["Low" "High"]
                       :f (fn [val]
                            (om/update! plasio-state/ui-local-options :point-density val))}))
          (d/p {:class "tip-warn"}
               "WARNING: Setting this value to higher values may render your browser unusable. "
               "Changes will take effect next time you move your camera around."))))))

(defn z-range [bounds]
  (- (bounds 5) (bounds 2)))

(defn- transform-z-render->geo [geo-transform z]
  (let [in (array 0 z 0)
        out (.transform geo-transform in "render" "geo")]
    (aget out 2)))

(let [id :inundation-plane]
  (defcomponentk inundation-plane-pane [state owner]
    (render-state [_ {:keys [histogram]}]
      (let [root (om/observe owner plasio-state/root)
            ro (om/observe owner plasio-state/ro)
            ui-locals (om/observe owner plasio-state/ui-local-options)
            histogram (om/observe owner plasio-state/histogram)

            geo-transform (some-> @root :comps :point-cloud-viewer (.getGeoTransform))

            bounds  (util/resources-bounds (:resource-info @root))
            zbounds (or (:zrange @ro) [(bounds 2) (bounds 5)])

            inun-override (:inundation-range-override @ui-locals)
            [start-s start-e] (if inun-override
                                inun-override
                                zbounds)
            inun-height (get @ui-locals :innudation-height start-s)
            clamped-inun-height (min (max inun-height start-s) start-e)

            to-geo-fn #(transform-z-render->geo geo-transform %)]
        (d/div
          {:class "inundation-plane"}
          (d/form
            (i/input {:type      "checkbox"
                      :label     "Show Inundation Plane?"
                      :checked   (:inundation? @ui-locals)
                      :on-change (fn [] (om/transact!
                                          plasio-state/ui-local-options
                                          #(update % :inundation? not)))}))
          (om/build w/value-present {:key   "Current Height"
                                     :value (if geo-transform
                                              (->> clamped-inun-height
                                                   (transform-z-render->geo geo-transform)
                                                   commify)
                                              "--")})

          (om/build w/z-histogram-slider {:text        "Z Range Override"
                                          :min         (zbounds 0)
                                          :min-display (if geo-transform (transform-z-render->geo geo-transform (zbounds 0)) "--")
                                          :max         (zbounds 1)
                                          :max-display (if geo-transform (transform-z-render->geo geo-transform (zbounds 1)) "--")
                                          :start       [start-s start-e]
                                          :histogram   @histogram
                                          :f           #(do
                                                          (om/update! plasio-state/ui-local-options
                                                                      :inundation-range-override
                                                                      %))})

          ;; build the slider that will help us change the position
          ;;
          (om/build w/labeled-slider {:text    "Adjust the current inundation plane height."
                                      :min     start-s
                                      :max     start-e
                                      :connect false
                                      :step    0.001
                                      :start   clamped-inun-height
                                      :f       (fn [val]
                                                 (om/transact! plasio-state/ui-local-options
                                                               #(assoc % :innudation-height val)))})

          ;; the inundation plane opacity slider
          (d/div
            (om/build w/labeled-slider {:text  "Inundation plane opacity"
                                        :min   0.1
                                        :step  0.01
                                        :max   1
                                        :start (or (:inundation-plane-opacity @ui-locals)
                                                   1.0)
                                        :guides ["Transparent" "Opaque"]
                                        :f (fn [val]
                                             (om/transact! plasio-state/ui-local-options
                                                           #(assoc % :inundation-plane-opacity
                                                                     val)))})))))))

(let [id :filter]
  (defcomponentk filters-dropdown [[:data all f-changed]]
    (render [_]
      (let [all-options (->> all
                             seq
                             (cons {:name "None"
                                    :spec nil}))]
        (apply b/dropdown {:bs-size "small"
                           ;; the selected may come down as an un-encoded url
                           :title   "Load a pre-defined filter"}
               (for [{:keys [:name :spec]} all-options]
                 (b/menu-item {:key       name
                               :on-select (fn []
                                            (f-changed spec))}
                              name))))))

  (defcomponentk filter-pane [owner state]
    (render [_]
      (let [filters (om/observe owner plasio-state/available-filters)
            render-options (om/observe owner plasio-state/ro)

            active-filter (or (:filter @state)
                              (:filter @render-options)
                              "")

            direct-set-filter (fn []
                                (let [value active-filter]
                                  (try
                                    ;; if string is not empty, try parsing the JSON
                                    (when-not (str/blank? value)
                                      (js/JSON.parse value))
                                    ;; if no text, clear filter
                                    (plasio-state/apply-filter! (if (str/blank? value) nil value))
                                    (swap! state dissoc :syntax-error)
                                    (catch js/SyntaxError e
                                      (swap! state assoc :syntax-error (.-message e))))))]
        (d/div
          {:class "filter"}
          (d/p "Enter filter description below and click the "
               (d/strong "Apply Filter")
               " button to apply filter to the current point cloud view.")

          (om/build filters-dropdown {:all       @filters
                                      :f-changed #(swap! state assoc :filter (if %
                                                                               (-> % clj->js (js/JSON.stringify nil 2))
                                                                               ""))})

          (d/textarea {:class "textarea"
                       :ref "filter-text"
                       :value active-filter
                       :on-change #(swap! state assoc :filter (.. % -target -value))
                       :rows  20})

          (when-not (str/blank? (:syntax-error @state))
            (d/p {:class "text-danger"} "Could not apply filter: " (:syntax-error @state)))

          (b/button
            {:bs-style "default"
             :bs-size  "medium"
             :title    "Apply Filter"
             :on-click #(direct-set-filter)}
            "Apply Filter"))))))

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
            (if (in-bounds? (util/resources-bounds @plasio-state/resource-info)
                            [x y])
              (plasio-state/transition-to x y)
              (om/set-state! owner :error "Sorry, this address is out of bounds.")))
          (om/set-state! owner :error "Sorry, there was an error resolving this address.")))))

(defn world-in-ll []
  (let [bounds (util/resources-bounds @plasio-state/resource-info)]
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


(defn- sources-changed? [old-chans new-chans]
  (some (fn [i]
          (let [c (keyword (str "channel" i))
                old-source (get-in old-chans [c :source])
                new-source (get-in new-chans [c :source])]
            (not= old-source new-source)))
        (range 4)))

(defn- default-ramp-for-source [source-name root-state renderer-state]
  (let [lcase (str/lower-case source-name)
        bounds (util/resources-bounds (:resource-info root-state))]
    (if (zero? (.indexOf lcase "local://ramp"))
      (cond
        (pos? (.indexOf lcase "field=z"))
        (get-in renderer-state [:ro :zrange] [(bounds 2) (bounds 5)])

        (pos? (.indexOf lcase "field=intensity"))
        (get-in renderer-state [:ro :irange] [0 255])

        :else
        [0 255])
      [0 255])))

(defcomponentk render-target [[:data renderer-state] state owner]
  (did-mount [_]
    ;; time to intialize the renderer and set it up
    (go
      (let [rs renderer-state
            comps (<! (plasio-state/initialize-for-resource<! (om/get-node owner) rs))]
        ;; add stats listener for Z, update the histogram and z-range for the renderer
        ;;
        (when-let [r (:renderer comps)]
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
          (.addStatsListener r "intensity" "intensity-collector"
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
                                     (om/update! plasio-state/ro :irange [nn xx])
                                     (om/update! plasio-state/intensity-histogram hist))))))
          (swap! state assoc :cleanup-fn
                 (fn []
                   (.removeStatsListener r "z" "z-collector")
                   (.removeStatsListener r "intensity" "intensity-collector"))))

        ;; save intialized state
        (om/update! plasio-state/comps comps))))

  (will-unmount [_]
    (when-let [cfn (:cleanup-fn @state)]
      (cfn)))


  (did-update [_ prev-props prev-state]
    ;; apply any state that needs to be applied here
    (let [root @plasio-state/root
          resource-info (:resource-info root)
          r (get-in root [:comps :renderer])
          pn (:renderer-state prev-props)
          n (:renderer-state (om/get-props owner))
          ro (:ro n)
          lo (get-in n [:ui :local-options])
          p (get-in root [:comps :policy])

          bounds (:bounds root)
          zbounds (or (:zrange ro) [(bounds 2) (bounds 5)])

          adjusted-chans (util/adjust-channels (get-in ro [:channels]))

          ;; get channels
          chans (->> (range 4)
                     (map #(keyword (str "channel" %)))
                     (keep (fn [channel]
                             (let [data (get adjusted-chans channel)]
                               (when-not (str/blank? (:source data))
                                 data)))))

          available-chans (count chans)

          ;; blending contributions
          blending-contributions (apply array (for [i (range 4)]
                                                (if (< i available-chans)
                                                  (let [c (nth chans i)]
                                                    (cond
                                                      (:mute? c) 0
                                                      :else (/ (or (:contribution c)
                                                                   50) 100)))
                                                  0)))

          ramps (for [i (range 4)]
                  (if (< i available-chans)
                    (let [c (nth chans i)]
                      (:range-clamps c (default-ramp-for-source (:source c) root n)))
                    [0 0]))

          ramp-lows (apply array (map first ramps))
          ramp-highs (apply array (map second ramps))]

      ;; standard render options
      ;;
      (.setRenderOptions r (js-obj
                             "circularPoints" (if (true? (:circular? ro)) 1 0)
                             "colorBlendWeights" blending-contributions
                             "clampsLow" ramp-lows
                             "clampsHigh" ramp-highs
                             "pointSize" (:point-size ro)
                             "pointSizeAttenuation" (array 1 (:point-size-attenuation ro))
                             "xyzScale" (array 1 (get-in n [:pm :z-exaggeration]) 1)))
     
      ;; apply any screen rejection values
      (let [density (get lo :point-density plasio-state/default-point-cloud-density-level)
            ratio (get plasio-state/point-cloud-density-levels density)]
        (js/Plasio.Device.overrideProperty "nodeRejectionRatio" ratio))

      ;; do we need a flicker fix?
      (let [flicker-fix? (get-in n [:ui :local-options :flicker-fix])]
        (.setRenderHints r (js-obj
                             "flicker-fix" flicker-fix?)))

      ;; check for inundation plane stuff
      ;;
      (let [bounds (util/resources-bounds resource-info)
            zbounds (or (:zrange ro) [(bounds 2) (bounds 5)])
            range (- (zbounds 1) (zbounds 0))
            size  (max (- (bounds 3) (bounds 0))
                       (- (bounds 4) (bounds 1)))
            lo (get-in n [:ui :local-options])
            half (/ range 2.0)
            [low high] (get lo :inundation-range-override zbounds)
            planey (util/mapr
                     (min high
                          (max low (get lo :innudation-height low)))
                     (zbounds 0) (zbounds 1)
                     (- half) half)]
        (if (get-in n [:ui :local-options :inundation?])
          (.updatePlane r "inundation"
                        (array 0 1 0)
                        planey
                        (array 0 187 215)
                        (get-in n [:ui :local-options :inundation-plane-opacity] 1.0)
                        size)
          (.removePlane r "inundation")))

      ;; if the color channels have changed, update
      ;;
      (let [current-chans (:channels ro)
            old-chans (get-in pn [:ro :channels])]
        (when (sources-changed? current-chans old-chans)
          (let [point-cloud-viewer (:point-cloud-viewer @plasio-state/comps)
                ;; all this hackery because the channels cannot be out of order
                all-chans (->> current-chans
                               seq
                               (sort-by first)
                               (map (comp :source second)))]
            (.setColorChannelBrushes point-cloud-viewer (apply array all-chans)))))

      ;; do we need to apply filter
      (let [current-filter (:filter ro)
            old-filter (get-in pn [:ro :filter])]
        (when-not (= current-filter old-filter)
          (if (str/blank? current-filter)
            (.setFilter (-> @plasio-state/comps :point-cloud-viewer) nil)
            (if-let [filter (try (js/JSON.parse current-filter)
                                 (catch js/Error _ nil))]
              (.setFilter (-> @plasio-state/comps :point-cloud-viewer) filter)
              (js/console.warn "The filter could not be applied because it couldn't be parsed")))))))

  (render [_]
    (d/div {:class "render-target"})))

(def ^:private z-vec (array 0 0 -1))

(defcomponentk target-location [owner]
  (render [_]
    (let [location @(om/observe owner plasio-state/target-location)]
      (when (seq location)
        (d/p {:class "target-location"}
             (w/fa-icon :map-marker)
             (.toFixed (location 0) 2) ", "
             (.toFixed (location 1) 2) ", "
             (.toFixed (location 2) 2))))))

(defcomponentk compass [owner]
  (render [_]
    (let [comps (om/observe owner plasio-state/comps)
          compass (om/observe owner plasio-state/compass)
          camera (some-> @comps :point-cloud-viewer (.getModeManager) (.-activeCamera))]
      (d/a
        {:class    "compass"
         :style    {:transform (str "rotateX(" (:incline @compass) "deg)")}
         :href     "javascript:"
         :on-click #(when camera
                      (.setHeading camera 0))}
        (d/div {:class "arrow"
                :style {:transform (str "rotateZ(" (:heading @compass) "deg)")}}
               (d/div {:class "n"})
               (d/div {:class "s"}))
        (d/div {:class "circle"})))))


(defcomponentk logo []
  (render [_]
    (d/a {:class "entwine"
          :target "_blank"
          :href "https://entwine.io"
          :style {:position "absolute"
                  :bottom "50px"
                  :left "-25px"
                  :transform "rotateZ(-90deg)"}})))


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
              (d/a {:class    "item"
                    :style    {:left posx :top posy :opacity opacity}
                    :href     "javascript:"
                    :on-click #(do
                                (.preventDefault %)
                                (f))}
                   (let [icon (get menu-item-mapping id :fa-exclamation-triangle)]
                     (->icon icon))
                   (d/div {:class "item-tip"} title)))))))))

(defcomponentk sources-dropdown [[:data selected all f-changed]]
  (render [_]
    (let [all-options (->> all
                           seq
                           (cons [nil "None"]))
          all-as-map (into {} (for [[k v] all]
                                [(js/decodeURIComponent k) v]))]

      (apply b/dropdown {:bs-size "small"
                         ;; the selected may come down as an un-encoded url
                         :title   (if (nil? selected) "None" (or (get all-as-map (js/decodeURIComponent selected))))}
             (for [[id name] all-options]
               (b/menu-item {:key       id
                             :on-select (fn []
                                          (f-changed id))}
                            name))))))


(defn- source->needed-tools [source]
  (if (zero? (.indexOf source "local://ramp"))
    (let [lcase (str/lower-case source)]
      (cond
        (pos? (.indexOf lcase "field=z"))
        #{:zrange}

        (pos? (.indexOf lcase "field=intensity"))
        #{:irange}

        :else
        #{}))
    #{}))

(defn parse-query-string-params [source]
  (let [qindex (.indexOf source "?")]
    (when-not (neg? qindex)
      (util/qs->params (subs source (inc qindex))))))

(defn parse-color [c]
  (when (and (not (str/blank? c))
             (re-matches #"(?i)^#[0-9a-f]{6}$" c))
    [(/ (js/parseInt (subs c 1 3) 16) 255)
     (/ (js/parseInt (subs c 3 5) 16) 255)
     (/ (js/parseInt (subs c 5 7) 16) 255)]))

(defn parse-colors-for-ramp [source]
  (let [params (parse-query-string-params source)
        start (:start params)
        end (:end params)]
    (when (or start end)
      [(or (parse-color start) [0 0 0])
       (or (parse-color end) [0 0 0])])))

(defcomponentk ramp-view [[:data data range value]]
  (render [_]
    (when-let [[start end] (parse-colors-for-ramp (:source data))]
      (let [[m n] range
            [s e] value]
        (d/div
         (grad-svg start end
                   200 15
                   (util/mapr s m n)
                   (util/mapr e m n)))))))


(defcomponentk channel-control [[:data name data channel all-sources
                                 zbounds histogram
                                 ibounds intensity-histogram]]
  (render [_]
    (d/div
     {:class "channel"}
     (d/div
      {:class "clearfix"})
     (d/div {:class "name pull-left"} name)
     (d/div {:class "controls pull-right"}
            (d/a {:class (str "mute" (when (:mute? data) " enabled"))
                  :href "javascript:"
                  :on-click #(plasio-state/mute-channel! channel (not (:mute? data)))} "Mute")
            (d/a {:class (str "solo" (when (:solo? data) " enabled"))
                  :href "javascript:"
                  on-click #(plasio-state/solo-channel! channel (not (:solo? data)))} "Solo"))
     (d/div {:class "source"}
            (om/build sources-dropdown {:selected (:source data)
                                        :f-changed #(plasio-state/set-channel-source! channel %)
                                        :all all-sources}))
     (when-not (str/blank? (:source data))
       (let [needed-tools (source->needed-tools (:source data))]
         (d/div
          (d/div {:class "channel-options"}
                 ;; channel contribution
                 (let [{:keys [mute? solo? contribution]} data]
                   (om/build w/labeled-slider
                             {:min     1
                              :max     100
                              :start   (cond
                                         mute? 0
                                         :else (or contribution 50))
                              :step 1
                              :connect "lower"
                              :disabled? mute?
                              :f       (fn [val]
                                         (when-not mute?
                                           (plasio-state/set-channel-contribution! channel val)))})))

          (when (needed-tools :zrange)
            (let [[ss se] (get data :range-clamps zbounds)]
              (d/div {:class "ramp-control"}
                     (om/build ramp-view
                               {:range zbounds
                                :value [ss se]
                                :data  data})
                     (om/build w/z-histogram-slider
                               {:text      ""
                                :min       (zbounds 0)
                                :max       (zbounds 1)
                                :start     [ss se]
                                :histogram histogram
                                :f         #(plasio-state/set-channel-ramp! channel %)}))))


          (when (needed-tools :irange)
            (let [[ss se] (get data :range-clamps ibounds)]
              (d/div {:class "intensity-control"}
                     (om/build ramp-view
                               {:range zbounds
                                :value [ss se]
                                :data  data})
                     (om/build w/z-histogram-slider
                               {:text      ""
                                :min       (ibounds 0)
                                :max       (ibounds 1)
                                :start     [ss se]
                                :histogram intensity-histogram
                                :f         #(plasio-state/set-channel-ramp! channel %)}))))))))))

(let [id :channels]
  (defcomponentk channels-pane [state owner]
    (render-state [_ _]
      (let [ro (om/observe owner plasio-state/ro)
            as (om/observe owner plasio-state/root)
            lo (om/observe owner plasio-state/ui-local-options)

            histogram (om/observe owner plasio-state/histogram)
            intensity-histogram (om/observe owner plasio-state/intensity-histogram)

            bounds (:bounds @as)
            zbounds (or (:zrange @ro) [(bounds 2) (bounds 5)])
            ibounds (or (:irange @ro) [0 255])

            schema-info (util/schema->color-info (:schema @as))
            color-sources (get-in @as [:init-params :colorSources])]

        (d/div
         {:class "channels"}
         (let [ac (util/adjust-channels (get @ro :channels))]
           (for [i (range 4)
                 :let [channel (keyword (str "channel" i))]]
             (om/build channel-control {:name (str "Channel " (inc i))
                                        :data (get ac channel)
                                        :channel channel
                                        :zbounds zbounds
                                        :ibounds ibounds

                                        :histogram @histogram
                                        :intensity-histogram @intensity-histogram

                                        :all-sources color-sources}))))))))

(let [id :point-info]
  (defcomponentk point-info-pane [owner]
    (render [_]
      (let [root (om/observe owner plasio-state/root)
            points (om/observe owner plasio-state/clicked-point-info)]
        (d/div
         {:class "point-info-container"}
         (d/h4 "Point Information")
         (when (:clicked-point-load-in-progress? @root)
           (d/i {:class "fa fa-spinner fa-pulse"}))
         (if-not (seq @points)
           (d/div {:class "no-items"} "Click on a point to see its information here.")
           (d/div
             (d/h5 "Following resources responded to point info query:")
             (for [point @points
                   :when (seq point)]
               (d/div
                 (d/h5 {:class "resource"} (:resource point) "@" (:server point))
                 (om/build w/key-val-table
                           {:data (->> point
                                       (sort-by (comp :index second))
                                       (keep (fn [[_ {:keys [:displayName :val]}]]
                                               (when-not (str/blank? displayName)
                                                 [displayName val])))
                                       (util/v "xx")
                                       vec)}
                           {:key point})

                 ;; Link to origin id
                 (when-let [{:keys [:path :numPoints :inserts :href]} (get point :x-point-metadata)]
                   (d/div
                     {:class "metadata"}
                     (d/h5 "Source Tile Metadata")
                     (om/build w/key-val-table
                               {:data [["Path" path]
                                       ["Total Points" numPoints]
                                       ["Points Inserted" (str inserts " (" (.toFixed (* 100 (/ inserts numPoints)) 1) "%)")]]})
                     (d/a {:href   href
                           :class  "source-metadata-link"
                           :target "_blank"} "Additional Metadata Details"))

                   #_(d/a {:href   (:href metadata)
                           :class  "source-metadata-link"
                           :target "_blank"} "Source Tile Metadata")))))))))))


(defn have-frames-for-timeline? [loaded-resources frames]
  (let [loaded-resources-set (->> (map #(-> % :config :resource str/lower-case) loaded-resources) set)
        ts-available-for-resources-set (->> (map #(-> % :resource str/lower-case) frames) set)
        missing-ts (set/difference loaded-resources-set ts-available-for-resources-set)]
    (and (seq frames)
         (not (seq missing-ts)))))

(let [id :animation]
  (defcomponentk loaded-resource-info [[:data visible key playing? scrubbing? set-visibility-fn config] owner]
    (render [_]
      (d/div {:class (str "animation-frames--item"
                          (when (and (or playing? scrubbing?)
                                     visible)
                            " animated-active"))}
             (d/div {:class "info"}
                    (d/div {:class "name"} (:resource config))
                    (d/div {:class "details"} (:server config)))
             (d/div {:class "controls"}
                    (d/a {:href     "javascript:void(0)"
                          :class    (str (when visible "active")
                                         (when playing? " playing"))
                          :on-click #(when-not playing?
                                       (set-visibility-fn key (not visible)))} "Visible")))))

  (defcomponentk animation-frames [[:data animation-settings loaded-resources]]
    (render [_]
      (d/div {:class "animation-frames"}
             (om/build-all loaded-resource-info
                           (->> loaded-resources
                                (map (fn [r]
                                       (assoc r
                                         :playing? (:playing? animation-settings)
                                         :scrubbing? (:scrubbing? animation-settings)
                                         :set-visibility-fn plasio-state/set-resource-visibility))))))))

  (defcomponentk step-animator [[:data animation-settings loaded-resources]]
    (render [_]
      (let [frame-count (count loaded-resources)
            frame-rate (get-in animation-settings [:params :frame-rate] 5)]
        (d/div
          {:class "step-anim-container"}
          (d/div
            {:class "animation-controls"}
            (b/button {:bs-size  "small"
                       :on-click #(if (:playing? animation-settings)
                                    (plasio-state/anim-stop)
                                    (plasio-state/anim-play))}
                      (w/fa-icon (if (:playing? animation-settings)
                                   :stop
                                   :play)))
            (om/build w/slider {:min   1
                                :max   30
                                :start frame-rate
                                :f     (fn [v]
                                         (plasio-state/anim-set-param! :frame-rate v))})

            (when (pos? frame-count)
              (let [min-val 0
                    max-val (dec frame-count)]
                (om/build w/slider {:min   min-val
                                    :max   max-val
                                    :step  1
                                    :start (* (get animation-settings :scrub-offset 0) max-val)
                                    :f     (fn [v]
                                             (plasio-state/anim-set-current-scrub-offset! (/ (- v min-val)
                                                                                             (- max-val min-val))))}))))


          (d/div
            {:class "animation-props"}
            (om/build w/key-val-table
                      {:data
                       [["Framerate" (str frame-rate "fps")]]}))))))

  (defcomponentk timeline-animator [[:data animation-settings loaded-resources current-resource-init-info]]
    (render [_]
      (let [frames (-> current-resource-init-info :frames)
            loaded-resources-set (->> (map #(-> % :config :resource str/lower-case) loaded-resources) set)
            ts-available-for-resources-set (->> (map #(-> % :resource str/lower-case) frames) set)
            missing-ts (set/difference loaded-resources-set ts-available-for-resources-set)
            have-ts-for-all? (not (seq missing-ts))]
        (d/div
          {:class "timeline-anim-container"}
          (if have-ts-for-all?
            (d/div
              {:class "text-success timestamps-msg"}
              "All resources have timestamps.  Timeline controls have been enabled.")

            ;; We don't have timestamps for all resources
            (d/div
              {:class "text-danger timestamps-msg"}
              "Some resources are missing frame timestamps, timeline controls will therefore not be available:"
              (d/ul
                (for [r missing-ts]
                  (d/li {:key r} r)))))))))


  (defcomponentk animation-pane [owner state]
    (did-mount [_]
      (plasio-state/anim-set-default-controller!))

    (render [_]
      (let [root (om/observe owner plasio-state/root)
            animation-settings (om/observe owner plasio-state/animation-settings)
            loaded-resources (om/observe owner plasio-state/loaded-resources)

            current-resource-init-info (-> @root :init-params :resource-info)

            current-pane (or (:controller @animation-settings) :step)]
        (d/div {:class "animation-container"}
               (n/nav
                 {:bs-style   "tabs"
                  :active-key current-pane
                  :on-select  (fn [pane]
                                (plasio-state/anim-set-controller! pane)
                                (if (= pane :timeline)
                                  (when (have-frames-for-timeline? loaded-resources
                                                                   (-> current-resource-init-info
                                                                       :frames))
                                    (plasio-state/set-timeline-widget-visibility! true))
                                  (plasio-state/set-timeline-widget-visibility! false)))}
                 (n/nav-item {:key :step :href "javascript:void(0)"}
                             "Step Animator")
                 (n/nav-item {:key :timeline :href "javascript:void(0)"}
                             "Timeline Animator"))

               (if (= current-pane :step)
                 (om/build step-animator
                           {:animation-settings @animation-settings
                            :loaded-resources   @loaded-resources})
                 (om/build timeline-animator
                           {:animation-settings @animation-settings
                            :loaded-resources @loaded-resources
                            :current-resource-init-info current-resource-init-info}))

               (d/h4 "Loaded Frames")
               (om/build animation-frames
                         {:animation-settings @animation-settings
                          :loaded-resources @loaded-resources}))))))

(defcomponentk timeline-widget [[:data frames] owner state]
  (did-mount [_]
    (let [data-set (js/vis.DataSet.
                     (clj->js frames))
          options (js-obj
                    "stack" false
                    "min" (-> frames first :start)
                    "max" (-> frames last :end))
          timeline (doto (js/vis.Timeline. (om/get-node owner) data-set
                                           options)
                     (.addCustomTime (-> frames first :start)
                                     "scrubber")
                     (.on "timechange" (fn [id time event]
                                         (js/console.log "scrub:" id time event))))]
      (swap! state assoc ::timeline timeline)))
  (render [_]
    (d/div {:style {:width "100%"
                    :height "100%"}})))


(defn frames->timeline [frames]
  (let [frames-with-dates (map (fn [frame]
                                 (update frame :ts #(js/Date. (js/Date.parse %))))
                               frames)
        sorted-frames (sort-by #(.getTime (:ts %)) frames-with-dates)

        add-a-day (fn [d]
                    (let [dt (.getTime d)]
                      (js/Date. (+ dt (* 24 60 60 1000)))))
        dec-second (fn [d]
                     (let [dt (.getTime d)]
                       (js/Date. (- dt 60000))))]
    (vec
          ;; arrange frames right next to each other so that we can arrange them
          ;; abutting each other
          (for [[a b] (partition-all 2 1 sorted-frames)]
            {:content (:resource a)
             :start   (:ts a)
             :end     (if b (:ts b) (add-a-day (:ts a)))
             :type    "range"
             :style   "background-color: #0FBCD4; border-color: #85CAD4; color: white; border-radius: 0; z-index: 0;"
             }))))

(defcomponentk timeline-animator-widget [owner state]
  (did-mount [_]
    (swap! state assoc :left "-1000px")
    (go (<! (async/timeout 200))
        (swap! state dissoc :left)))
  (render [_]
    (let [root (om/observe owner plasio-state/root)

          ui-options (om/observe owner plasio-state/ui-local-options)
          docker-collapsed? (:docker-collapsed? @ui-options)
          self-collapsed? (:timeline-widget-collapsed? @ui-options)

          current-resource-frames (-> @root :init-params :resource-info :frames)]
      (d/div
        (merge
          {:class (str "timeline-animator-widget"
                       (when-not docker-collapsed?
                         " docker-expanded")
                       (if self-collapsed?
                         " collapsed"
                         " uncollapsed"))}
          (when-let [left (:left @state)]
            {:style {:left left}}))

        (d/a {:class "timeline-widget-toggle"
              :href "javascript:void(0)"
              :on-click #(plasio-state/toggle-timeline-widget!)}
             (w/fa-icon
               (if self-collapsed? :angle-double-right :angle-double-left)))

        (om/build timeline-widget {:frames (frames->timeline current-resource-frames) })))))
