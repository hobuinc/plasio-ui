# plasio-ui
Generic hostable User Interface components powered by entwine and plasio.js, e.g. http://iowalidar.com

# How to play with this?

Have [Leiningen](http://leiningen.org/) installed and run

    lein figwheel

to start the development server.  Then, navigate to [http://localhost:3449/](http://localhost:3449) to see some nice data.

To build a production version, run the `scripts/deploy` script from the root directory.  This will stage the production version of this app in the `deploy` directory.  There is a `scripts/s3-push` file provided which you could use as a template to push the deploy version to S3.


# License

EPL v1.0, same as Clojure. [Full text](https://www.eclipse.org/legal/epl-v10.html).
