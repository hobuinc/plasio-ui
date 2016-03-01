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
            server: "http://devdata.greyhound.io/",
            resource: "nyc",
            colorSources: {"local://elevation": "Elevation",
                           "local://intensity": "Intensity",
                           "local://elevation?start=#FF0000&end=#00FF00": "Elevation RED to GREEN"
                           "https://imageryserver.com/{{z}}/{{x}}/{{y}}.jpg": "Some Imagery Server"}
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
            server: "http://devdata.greyhound.io/",
            resource: "nyc",
        });
        
The `includeExternalDependencies` value is `false` here.

# Self-hosting plasio-ui

It is recommended that you refer to plasio-ui on the provided CDN location.  If that wouldn't work for you, pick the latest version from under the `dist/` directory and extract it somewhere your web-page can access it.  You would still just need to directly include `plasio-ui.js`.  It will find all needed dependencies as long as you don't mess with the directory structure from the zip archive.

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
 - `server` - **Required** when `useBrowserHistory` is `false`. The address of the server where the resource is located.  A hostname or an IP address.  If `useBrowserHistory` is `true` and this field is not specified, then plasio-ui assumes that this value will be provided from the browser URL.  If plasio-ui fails to get this value from the URL, an error will be thrown.  Note that the server is used as specified, you would need to make sure that the URLs generated are correct but appropriately adjusting this value (e.g. with trailing slashes etc.).
 - `resource` - **Required** when `useBrowserHistory` is `false`.  The resource load and show, should be available on the provided `server`.  If `useBrowserHistory` is `true` and this field is not specified, then plasio-ui assumes that this value will be provided from the browser URL.  If plasio-ui fails to get this value from the URL, an error will be thrown.
 - `allowGreyhoundCredentials` - Default: `false`.  Requests binary data from greyhound service with `withCredentials` flag set to true.  Note that this will most likely only work when your UI and data are hosted on the same domain, or you have the appropriate CORS headers set on your greyhound server.
 - `bindKeyHandlers`  - Default: `false`.  This options installs global keyboard hooks which control certain aspects of the UI.  This is not recommended when you're trying to embed plasio-ui in your own UI.  The hooks are installed on the bubble up phase of event handlers, so it would still be possible to override the offending keystrokes in your own control.
 - `showPanels`- Default `true`. Shows collapsible panels to the left.
 - `showCompass` - Default `true`. Shows the compass widget at bottom right corner of the render area.
 - `showApplicationBar` - Default `true`.  Shows the application bar on top of the render area.
 - `showSearch` - Default `true`.  Shows the little search icon on the right end of the application bar, which triggers a search dropdown for region local searches.  This value is only considered when the application bar is visible, i.e.  `showApplicationBar` is `true`.
 - `brand` - The brand to show in the application bar. Defaults to **speck.ly**.
 - `resourceName` - The resource name to show in the application bar.  Defaults to `resource@server`. Specifying an empty string for this value will result in no resource name showing up.
 - `colorSources` - You need at least one color source.  You can specify any number of color sources.  These sources will become available as the color channels for user to choose from.  See details below.  The first color source is used as default when no default channel information is available (e.g. from the URL).

E.g. to create a bare bone viewer without any of the UI components you could create a renderer like:

      let ui = plasio_ui.core.createUI(divElement,  {
          useBrowserHistory: true,
          showPanels: false,
          showApplicationBar: false,
          colorSources: [ ... ]
      });

Or to create a renderer to view a point cloud without messing around with the browser history:

      let ui = plasio_ui.core.createUI(divElement,  {
          server: "my.hostname.com",
          resource: "such-point-cloud",
          showPanels: false,
          showApplicationBar: false,
          colorSources: [ ... ]
      });

# Configuring Color Sources

Color sources are specified as an array of pairs.  The first element of each pair is the color source description and the second element is a user friendly name for the source.

Several inbuilt configurable color sources are provided.  There are two kinds of sources:

  - `local` - The color information is generated locally using the point description available, These sources start with `local://` prefix.
  - `remote` - The color information is fetched remotely, usually from a tiling imagery source.  These sources start with `http(s)://` prefix.

## Local Sources

Local sources use the available point description (from schema) to compute a color.  Some of the local sources available are:

  - `elevation` - Compute a color based on points Z value.  Can be ramped using a start and end color like: `http://elevation?start=#FF0000&end=#00FF00` will use elevation to generate a red to green color ramp.
  - `intensity` - Compute a color based on points intensity if available, black otherwise.  Can be ramped.
  - `color` - Use the point color information if available, black otherwise.
  - `origin` - Use the origin of the point to generate point color.
  - `point-source-id` - Use the point source ID of the point to generate color information.

The user interface will provide appropriate controls to adjust the ramping stop points and histograms over Z values and Intensity values.

## Remote Sources

For now, remote sources are imagery services which provide tiles in either TMS or Google style layout.  A remote source can be configured using the service's URL.  The user would need to make sure that the 3 placeholders are available in the specified URL.  These are the `{{x}}`, `{{y}}` and `{{z}}`, which stand for the X, Y and Zomm values for TMS/Google tiling scheme.

E.g. you can specify a mapbox tiling source like: `http://api.tiles.mapbox.com/v4/mapbox.satellite/{{z}}/{{x}}/{{y}}.jpg70?access_token=...`.

## Example

Here is an example of setting color sources:

```
colorSources: [
    ["http://api.tiles.mapbox.com/v4/mapbox.satellite/{{z}}/{{x}}/{{y}}.jpg70?access_token=...", "Mapbox Satellite Imagery"],
    ["http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{{z}}/{{y}}/{{x}}.jpg", "ArcGIS Satellite Imagery"],
    ["local://elevation", "Elevation"],
    ["local://elevation?start=#FF0000&end=#00FF00", "Elevation RED -> GREEN"],
    ["local://elevation?start=#FFFFFF&end=#0000FF", "Elevation WHITE -> BLUE"],
    ["local://color", "Color"],
    ["local://intensity", "Intensity"],
    ["local://origin", "Origin"],
    ["local://point-source-id", "Point Source ID"]
]
```

# Hosting multiple Plasio UIs on a Single Page

This is work in progress and will be available soon.


# Destroying Plasio UI

The `plasio_ui.core.createUI` function returns an object which has a destroy method.  Calling this method will destroy
the UI and empty out the `div` element it was hosted inside.

    let ui = plasio_ui.core.createUI(divElement);
    ui.destroy() // destroy the User Interface

