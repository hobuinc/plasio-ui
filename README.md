# What is plasio-ui?

plasio-ui is a prefabricated, ready to use point cloud user interface which can be easily embedded in your own web apps.  It exposes certain configuration parameters which let you fine tune the UI.

# How to use?

plasio-ui relies on 2 files (available under the `dist` directory).

 - `plasio-ui.js` - The machinery that powers the UI.
-  `plasio-ui.css` - A CSS file needed to style UI components.

Once you have these two components included in your page.  Just add a `div` element somewhere, position and size it the way you want.  Make sure it has a non-static position (either relative, absolute or fixed).  Then just initialize the plasio user interface:

    plasio_ui.core.createUI(divElement);

And you should be good to go.  Note that with the code above we're not passing a second parameter which passes down the options that help you fine tune the UI.

# Configuring the UI
The createUI function accepts two paramters:

    plasio_ui.core.createUI(divElement, options);

The following options are accepted:

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

      plasio_ui.core.createUI(divElement,  {
          useBrowserHistory: true,
          showPanels: false,
          showApplicationBar: false
      });

Or to create a renderer to view a point cloud without messing around with the browser history:

      plasio_ui.core.createUI(divElement,  {
          server: "my.hostname.com",
          resource: "such-point-cloud",
          showPanels: false,
          showApplicationBar: false
      });

# Hosting multiple Renderers on a Single Page

This is work in progress and will be available soon.


# Destroying renderers.

This is work in progress and will be available soon.