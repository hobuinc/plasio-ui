# What is plasio-ui?

plasio-ui is a prefabricated, ready to use point cloud user interface which can be easily embedded in your own web apps.  It exposes certain configuration parameters which let you fine tune the UI.

# How to use?

plasio-ui depends on a few external dependencies to work and look right.  It can automatically include all of these needed dependencies.  If its loading stuff that's conflicting with your libraries,
you can turn off external libraries loading and manually supply these dependencies.

The latest version of hosted plasio-ui is available at:
```
https://cdn.entwine.io/plasio-ui/0.3.1/plasio-ui.js
```

## Express Mode

In this mode plasio-ui sets up everything for you, just include the library from the CDN and create the UI.

        plasioUI = plasio_ui.core.createUI(document.getElementById("app"), {
            includeExternalDependencies: true,
            googleMapsAPIKey: "AIzaSyAUWT5-vsCeQb1vYYamCw-RFvKTzLlY9iU",
            useBrowserHistory: true,

            colorSources: [
             ["local://ramp?field=Z", "Elevation"],
             ["local://ramp?field=Z&start=#FF0000&end=#00FF00", "Elevation RED -> GREEN"],
             ["local://ramp?field=Z&start=#FFFFFF&end=#0000FF", "Elevation WHITE -> BLUE"],
             ["local://color", "Color"],
             ["local://field-color?field=Classification", "Classification"],
             ["local://ramp?field=Intensity", "Intensity"],
             ["local://field-color?field=OriginId", "Origin ID"],
             ["local://field-color?field=point-source-id", "Point Source ID"]
           ]
        });
        
Note the `includeExternalDependencies` option (`true` by default, mentioned for verbosity), this option turns on external dependencies inclusion.  This is all you need to get the UI up and running in express mode.


## Advanced Mode

Advanced configuration is enabled when `includeExternalDependencies` is set to `false`.  In this mode, you include external dependencies yourself.  plasio-ui relies on a few libraries to work right:

 - [jQuery](https://jquery.com/). The app itself doesn't use jquery, it is needed by the noUiSlider control.
 - [Bootstrap 3](https://getbootstrap.com/)
 - [Font Awesome](https://fortawesome.github.io/Font-Awesome/)
 - [noUiSlider](http://refreshless.com/nouislider/)
 - [React](https://facebook.github.io/react/)
 - [Google Maps API](http://https://developers.google.com/maps/?hl=en)
 
You'd have to include the styles and javascript for each of these dependencies for plasio-ui to work right.  Here's how the CSS inclusions would look like
(they go in your HEAD tag):

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.2.1/nouislider.min.css" rel="stylesheet" type="text/css">
        
Scripts would look something like (it is recommended that these are placed at the bottom of the BODY tag):

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/8.2.1/nouislider.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.4/react.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.4/react-dom.min.js"></script>
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

# Resources
Plasio-ui will try to read a file named `resources.json` which should be placed right alongside the HTML page hosting plasio-ui.  This resource file is a list of servers/resources and some default parameters that go along with them (which brush to use etc.).  The file looks like this:

```
{
  "servers": {
    "items": [
      {
        "url": "c[0-7].greyhound.io",
        "name": "cache.greyhound.io"
      }
    ]
  },
  "resources": {
    "defaults": {
      "server": "cache.greyhound.io"
    },
    "items": [
      {
        "name": "autzen",
        "displayName": "Autzen",
        "params": {
          "c0s": "local://color"
        }
      }
  }
}
```

Here we are defining a list of `servers` (which are then referred to in the `resources` section).  Each resource then has the name of the resource, the display name and any initial query parameters you may wish to apply (here its setting `c0s` channel 0 source to local color).  The `resources.defaults` section are the defaults values which are copied into each item under `resources.items`.

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

|Option|Default|Description |
|---|---|---|
|`allowGreyhoundCredentials` | `false`| Requests binary data from greyhound service with `withCredentials` flag set to true.  Note that this will most likely only work when your UI and data are hosted on the same domain, or you have the appropriate CORS headers set on your greyhound server.|
|`availableResources` | Predefined default resources. | When the resource switcher panel is visible, this array of resources define what resources should be listed.|
|`bindKeyHandlers`  | `false`|  This options installs global keyboard hooks which control certain aspects of the UI.  This is not recommended when you're trying to embed plasio-ui in your own UI.  The hooks are installed on the bubble up phase of event handlers, so it would still be possible to override the offending keystrokes in your own control.|
|`brand`|speck.ly|The brand to show in the application bar. |
|`colorChannelRules`||The color channel rules to use to determine a good candidate for color source for the default color channel.  See discussion below on how this process works.|
|`colorSources`|| You need at least one color source.  You can specify any number of color sources.  These sources will become available as the color channels for user to choose from.  See details below.  The first color source is used as default when no default channel information is available (e.g. from the URL).|
|`credits`|No credits|The credits property should be an `object` which could optionally have three fields in it: `poweredBy`, `cachingProvider` and `backendProvider`, these properties appear in the Information pane after all the point cloud information.|
|`defaultColorChannelIndex`|`0`|When the color channel information is not available (e.g. from the URL), plasio-ui will choose a default color channel so that the point cloud doesn't look all black.  This option controls which color channel is used as default under this scenario.  This value is the index of a pair in the specified `colorSources` property.|
|`hiddenPanes`|All panes visible|Selectively hide one or more panes you don't want to display.  This field is an array of panes you want to **hide**.  Array elements could have values: `rendering-options`, `channels`, `point-manipulation`, `inundation-plane`, `information`, `local-settings` and `switch-resource`. Note that, hiding a pane doesn't disable the functionality a pane offers, it merely doesn't let the user interact with or change the properties associated with a pane. E.g. hiding the channels pane doesn't disable channel functionality|
|`includeExternalDependencies`|`true`|When set to `true`, plasio-ui will automatically include all needed 3rd party dependencies.  If this flag is `false`, you would need to specify all the required dependencies.|
|`rememberUIState`|`false`|When turned on, plasio-ui will employ web-browser local storage to store UI state (opened windows, certain preferences) per point cloud resource.  When the users return to the same pipeline, they see the UI as they left it.|
|`resource` | **Required** | When `useBrowserHistory` is `false`.  The resource load and show, should be available on the provided `server`.  If `useBrowserHistory` is `true` and this field is not specified, then plasio-ui assumes that this value will be provided from the browser URL.  If plasio-ui fails to get this value from the URL, an error will be thrown.|
| `showPanels`| `true` | Shows collapsible panels to the left.|
| `showCompass` | `true` | Shows the compass widget at bottom right corner of the render area.|
| `showApplicationBar` | `true`|  Shows the application bar on top of the render area.|
| `showSearch` | `true` |  Shows the little search icon on the right end of the application bar, which triggers a search dropdown for region local searches.  This value is only considered when the application bar is visible, i.e.  `showApplicationBar` is `true`.|
|`useBrowserHistory`|`false`|Manages browser history so that you can use the back and forward button to navigate through the renderer's state.   Please note that for now, plasio takes over the browser URL, so unless you're making a full screen viewer, stay away from this option.|

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

Color sources are specified as an array of pairs.  The first element of each pair is the brush description and the second element is a user friendly name for the source.

Several inbuilt configurable color brushes are provided.  There are two kinds of brushes:

  - `local` - The color information is generated locally using the point description available, These sources start with `local://` prefix.
  - `remote` - The color information is fetched remotely, usually from a tiling imagery source.  These sources start with `remote://` prefix.

## Local Brushes

Local brushes use the available point information to compute a color.  Some of the local sources available are:

|Brush Name|Description|Parameters|
|-|-|-|
|`ramp`|Computes a ramped color on the given field.|`field` **[REQUIRED]** - e.g. `field=Z` or `field=Intensity`<br>`start` - The start color e.g.`#FF0000`.<br>`end` - The ending color e.g. `#00FF00`.|
|`field-color`|Assigns a random color to each unique value.|`field` **[REQUIRED]** - e.g. `field=Classification`|
|`color`|Use the color from Red, Green and Blue color channels.|No arguments|

The user interface will provide appropriate controls to adjust the ramping stop points and histograms over Z values and Intensity values.

## Remote Sources

The remote color brushes use satellite imagery to paint points.  At this point only one remote brush is supported:

|Brush Name|Description|Parameters|
|-|-|-|
|`imagery`|Fetches remote imagery and overlays it on points.|`url` **[REQUIRED]** - e.g. `url=https://.../{x}/{y}/{z}` - The placeholders `{x}`, `{y}` and `{z}` are required and will be substituted when querying imagery. Remember to URL encode the URL.|

## Example

Here is an example of setting color sources:

```
colorSources: [
     ["remote://imagery?url=" + encodeURIComponent("http://suchurl.com/images/tiles/{{z}}/{{y}}/{{x}}.jpg"), "Satellite Imagery"],
     ["local://ramp?field=Z", "Elevation"],
     ["local://ramp?field=Z&start=#FF0000&end=#00FF00", "Elevation RED -> GREEN"],
     ["local://ramp?field=Z&start=#FFFFFF&end=#0000FF", "Elevation WHITE -> BLUE"],
     ["local://color", "Color"],
     ["local://field-color?field=Classification", "Classification"],
]
```

# Specifying Available Resources

When the `switch-resource` panel is available, you can specify the `availableResources` option to specify the list of resources to show.  Plasio-ui will list them as direct links on the `switch-resource` panel. E.g.

```
...
availableResources: [
    ["Resource Name To Show", "resource-name", "server-address"],
    ["Nepal", "nepal-h", "http://myserver.com/resources"]
],
...
```

# Hosting multiple Plasio UIs on a Single Page

This is work in progress and will be available soon.

# Listening for and applying UI Changes

The `plasio_ui.core.createUI` function returns an object which has three methods: `addChangeListener`, `removeChangeListener` and `apply`.

To subscribe to any UI changes (including changes to the camera) setup a listener like:

    let ui = plasio_ui.core.createUI(divElement);
    let listenerId = ui.addChangeListener((v) => console.log('UI state is now:', v));

Your callback function will be called every time a change to the UI is made.  The value passed to your function will carry the current state of the UI.

> Please Note: The structure of the value passed to you can change from one version to another, but mostly when the major version number changes.

You can remove the listener like:

    ui.removeChangeListener(listenerId);

You can apply a UI state object using the apply method:

    let v = ...;
    ui.apply(v);

This will update the current UI state to match the state specified by `v`. 


# Destroying Plasio UI

The `plasio_ui.core.createUI` function returns an object which has a destroy method.  Calling this method will destroy
the UI and empty out the `div` element it was hosted inside.

    let ui = plasio_ui.core.createUI(divElement);
    ui.destroy() // destroy the User Interface

