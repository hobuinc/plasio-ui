
Renderer = {};
Renderer.prototype.addLoader = function() {};
Renderer.prototype.setRenderViewSize = function() {};
Renderer.prototype.updateCamera = function() {};
Renderer.prototype.setRenderOptions = function() {};
Renderer.prototype.setClearColor = function() {};
Renderer.prototype.addStatsListener = function() {};
Renderer.prototype.removeStatsListener = function() {};
Renderer.prototype.setRenderOptions = function() {};
Renderer.prototype.setRenderHints = function() {};
Renderer.prototype.updatePlane = function() {};
Renderer.prototype.removePlane = function() {};
Renderer.prototype.addPropertyListener = function() {};
Renderer.prototype.removePropertyListener = function() {};
Renderer.prototype.setEyeTargetPosition = function() {};
Renderer.prototype.addHighlightSegment = function() {};
Renderer.prototype.removeHighlightSegment = function() {};

Plasio = {};

Plasio.PointCloudViewer = {};
Plasio.PointCloudViewer.prototype.start = function() {};
Plasio.PointCloudViewer.prototype.getRenderer = function() {};
Plasio.PointCloudViewer.prototype.getModeManager = function() {};
Plasio.PointCloudViewer.prototype.getGeoTransform = function() {};
Plasio.PointCloudViewer.prototype.setFilter = function(filter) {};
Plasio.PointCloudViewer.prototype.setColorChannelBrushes = function(brushes) {};
Plasio.PointCloudViewer.prototype.setResourceVisibility = function(key, visible) {};
Plasio.PointCloudViewer.prototype.getLoadedResources = function(key, visible) {};


Plasio.Loaders = {};
Plasio.Loaders.GreyhoundPipelineLoader = {};
Plasio.Loaders.GreyhoundPipelineLoader.prototype.setColorChannel = function() {};

Plasio.Loaders.TransformLoader = {};

Plasio.ModeManager = {};
Plasio.ModeManager.activeCamera = {};
Plasio.ModeManager.activeMode = {};
Plasio.ModeManager.prototype.isSameEntity = function() {};
Plasio.ModeManager.prototype.addActionListener = function() {};
Plasio.ModeManager.prototype.propagateDataRangeHint = function() {};

Plasio.Features = {};
Plasio.Features.Profiler = {};
Plasio.Features.Profiler.prototype.extractProfile = function() {};

Plasio.Cameras = {};
Plasio.Cameras.Orbital = {};
Plasio.Cameras.Orbital.azimuth = {};
Plasio.Cameras.Orbital.distance = {};
Plasio.Cameras.Orbital.maxDistance = {};
Plasio.Cameras.Orbital.target = {};
Plasio.Cameras.Orbital.elevation = {};

Plasio.Cameras.Orbital.prototype.setHint = function() {};
Plasio.Cameras.Orbital.prototype.transitionTo = function() {};
Plasio.Cameras.Orbital.prototype.setHeading = function() {};
Plasio.Cameras.Orbital.prototype.serialize = function() {};
Plasio.Cameras.Orbital.prototype.deserialize = function() {};
Plasio.Cameras.Orbital.prototype.registerHandler = function() {};

Plasio.FrustumLODNodePolicy = {};
Plasio.FrustumLODNodePolicy.prototype.start = function() {};
Plasio.FrustumLODNodePolicy.prototype.hookedReload = function() {};

Plasio.GeoTransform = {};
Plasio.GeoTransform.prototype.transform = function() {};
Plasio.GeoTransform.prototype.coordinateSpaceRange = function() {};
Plasio.GeoTransform.prototype.coordinateSpaceCenter = function() {};
Plasio.GeoTransform.prototype.coordinateSpaceBounds = function() {};

Plasio.Device.overrideProperty = function() {};

Plasio.Util = {};
Plasio.Util.pickOne = function(s) {};

