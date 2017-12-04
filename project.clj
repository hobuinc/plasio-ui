(defproject plasio-ui "0.1.5"
  :description "FIXME: write this!"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.293"]
                 [org.clojure/core.async "0.2.395"]
                 [prismatic/om-tools "0.3.12"]
                 [cljsjs/gl-matrix "2.3.0-jenanwise-0"]
                 [racehub/om-bootstrap "0.5.3"]
                 [cljs-http "0.1.31"]]

  :plugins [[lein-cljsbuild "1.1.2"]
            [lein-figwheel "0.5.0-6"]]

  :profiles {:dev {:dependencies [[com.cemerick/piggieback "0.2.1"]]
                   :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}}}

  :source-paths ["src" "vendor/src"]

  :clean-targets ^{:protect false} ["resources/public/js/compiled" "target"]

  :cljsbuild {
    :builds [{:id "dev"
              :source-paths ["src" "vendor/src"]

              :figwheel { :on-jsload "plasio-ui.core/on-js-reload" }

              :compiler {:main plasio-ui.core
                         :asset-path "js/compiled/out"
                         :output-to "resources/public/js/compiled/plasio_ui.js"
                         :output-dir "resources/public/js/compiled/out"
                         :source-map-timestamp true
                         :foreign-libs [{:file "vendor/js/vis.js"
                                         :provides ["org.visjs"]}]}}
             {:id "min"
              :source-paths ["src" "vendor/src"]
              :compiler {:output-to "resources/public/js/compiled/plasio_ui.js"
                         :main plasio-ui.core
                         :optimizations :advanced
                         :foreign-libs [{:file "vendor/js/vis.js"
                                         :provides ["org.visjs"]}]
                         :externs ["vendor/externs/nouislider.js"
                                   "vendor/externs/plasiolib.js"
                                   "vendor/externs/extras.js"
                                   "vendor/externs/react-dom.ext.js"
                                   "vendor/externs/react.ext.js"
                                   "vendor/externs/google_maps_api_v3_11.js"]
                         :pretty-print false}}]}

  :figwheel {:css-dirs ["resources/public/css"] ;; watch and update CSS
             :nrepl-port 7888
             :repl false})
