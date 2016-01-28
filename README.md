# What is plasio-ui?

plasio-ui is a prefabricated, ready to use point cloud user interface which can be easily embedded in your own web apps.  It exposes certain configuration parameters which let you fine tune the UI.

# How to use?

plasio-ui depends on a few external dependencies to work and look right.  It can automatically include all of these needed dependencies.  If its loading stuff that's conflicting with your libraries,
you can turn off external libraries loading and manually supply these dependencies.

## Express Mode

In this mode plasio-ui sets up everything for you, just include the library from the CDN and create the UI.

        plasioUI = plasio_ui.core.createUI(document.getElementById("app"), {
            includeExternalDependencies: true,
            googleMapsAPIKey: "AIzaSyAUWT5-vsCeQb1vYYamCw-RFvKTzLlY9iU",
            useBrowserHistory: true,
            // in case the browser url is empty, use the following resource as fallback
            server: "devdata.greyhound.io",
            resource: "nyc",
        });
        
Note the `includeExternalDependencies` option (`true` by default, mentioned for verbosity), this option turns on external dependencies inclusion.  This is all you need to get the UI up and running in express mode.


## Advanced Mode

In this mode, you include external dependencies yourself.  plasio-ui relies on a few libraries to work right:

 - [jQuery](https://jquery.com/). The app itself doesn't use jquery, it is needed by the noUiSlider control.
 - [Bootstrap 3](https://getbootstrap.com/)
 - [Font Awesome](https://fortawesome.github.io/Font-Awesome/)
 - [noUiSlider](http://refreshless.com/nouislider/)
 - [Google Maps API](http://https://developers.google.com/maps/?hl=en)
 
You'd have to include the styles and javascript for each of these dependencies for plasio-ui to work right.  Here's how the CSS inclusions would look like
(they go in your HEAD tag):

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.2.1/nouislider.min.css" rel="stylesheet" type="text/css">
        
Scripts would look something like (it is recommended that these are placed at the bottom of the BODY tag):

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.2.1/nouislider.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={{YOUR GOOGLE MAPS KEY}}&libraries=places"></script>
    <script src="https://cdn.entwine.io/plasio-ui/latest/plasio-ui.js"></script>
    
Remember to substitute in your [Google Maps API](https://developers.google.com/maps/?hl=en) key.  You should then be good to go:

        plasioUI = plasio_ui.core.createUI(document.getElementById("app"), {
            includeExternalDependencies: false,
            useBrowserHistory: true,
            // in case the browser url is empty, use the following resource as fallback
            server: "devdata.greyhound.io",
            resource: "nyc",
        });
        
The `includeExternalDependencies` value is `false` here.

# Configuring the UI
The createUI function accepts two parameters:

    let ui = plasio_ui.core.createUI(divElement, options);

The following options are accepted:

### UI Loading
 - `includeExternalDependencies` - Default: `true`.  plasio-ui creates style/script tags to include needed dependent libraries, this option will also make it include external 3rd party dependencies like bootstrap, font-awesome etc.
 - `ignoreDependencies` - You may specify the 3rd libraries you don't want plasio-ui to load. This value must be an array with the libraries to ignore.  You can use one or more of the following values: `bootstrap`, `noUiSlider`, `jquery` or `font-awesome`.
 - `googleMapsAPIKey` - When `includeExternalDependencies` is `true`, this value is used to query Google Maps API results.
 
### UI/Renderer configuration

 - `useBrowserHistory` - Default: `false`. Manages browser history so that you can use the back and forward button to navigate through the renderer's state.   Please note that for now, plasio takes over the browser URL, so unless you're making a full screen viewer, stay away from this option.
 - `rememberUIState` - Default: `false`.  When turned on, plasio-ui will employ web-browser local storage to store UI state (opened windows, certain preferences) per point cloud resource.  When the users return to the same pipeline, they see the UI as they left it.
 - `server` - **Required** when `useBrowserHistory` is `false`. The address of the server where the resource is located.  A hostname or an IP address.  If `useBrowserHistory` is `true` and this field is not specified, then plasio-ui assumes that this value will be provided from the browser URL.  If plasio-ui fails to get this value from the URL, an error will be thrown.
 - `resource` - **Required** when `useBrowserHistory` is `false`.  The resource load and show, should be available on the provided `server`.  If `useBrowserHistory` is `true` and this field is not specified, then plasio-ui assumes that this value will be provided from the browser URL.  If plasio-ui fails to get this value from the URL, an error will be thrown.
 - `bindKeyHandlers`  - Default: `false`.  This options installs global keyboard hooks which control certain aspects of the UI.  This is not recommended when you're trying to embed plasio-ui in your own UI.  The hooks are installed on the bubble up phase of event handlers, so it would still be possible to override the offending keystrokes in your own control.
 - `showPanels`- Default `true`. Shows collapsible panels to the left.
 - `showCompass` - Default `true`. Shows the compass widget at bottom right corner of the render area.
 - `showApplicationBar` - Default `true`.  Shows the application bar on top of the render area.
 - `showSearch` - Default `true`.  Shows the little search icon on the right end of the application bar, which triggers a search dropdown for region local searches.  This value is only considered when the application bar is visible, i.e.  `showApplicationBar` is `true`.
 - `brand` - The brand to show in the application bar. Defaults to **speck.ly**.
 - `resourceName` - The resource name to show in the application bar.  Defaults to `resource@server`. Specifying an empty string for this value will result in no resource name showing up.

E.g. to create a bare bone viewer without any of the UI components you could create a renderer like:

      let ui = plasio_ui.core.createUI(divElement,  {
          useBrowserHistory: true,
          showPanels: false,
          showApplicationBar: false
      });

Or to create a renderer to view a point cloud without messing around with the browser history:

      let ui = plasio_ui.core.createUI(divElement,  {
          server: "my.hostname.com",
          resource: "such-point-cloud",
          showPanels: false,
          showApplicationBar: false
      });

# Hosting multiple Plasio UIs on a Single Page

This is work in progress and will be available soon.


# Destroying Plasio UI

The `plasio_ui.core.createUI` function returns an object which has a destroy method.  Calling this method will destroy
the UI and empty out the `div` element it was hosted inside.

    let ui = plasio_ui.core.createUI(divElement);
    ui.destroy() // destroy the User Interface

