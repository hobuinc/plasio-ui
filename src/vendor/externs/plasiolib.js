
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

PlasioLib = {};
PlasioLib.Loaders = {};
PlasioLib.Loaders.GreyhoundPipelineLoader = {};
PlasioLib.Loaders.GreyhoundPipelineLoader.prototype.setColorChannel = function() {};

PlasioLib.Loaders.MapboxLoader = {};
PlasioLib.Loaders.MapboxLoader.IMAGE_QUALITY = {};

PlasioLib.Loaders.TransformLoader = {};

PlasioLib.ModeManager = {};
PlasioLib.ModeManager.activeCamera = {};
PlasioLib.ModeManager.activeMode = {};
PlasioLib.ModeManager.prototype.isSameEntity = function() {};
PlasioLib.ModeManager.prototype.addActionListener = function() {};
PlasioLib.ModeManager.prototype.propagateDataRangeHint = function() {};

PlasioLib.Features = {};
PlasioLib.Features.Profiler = {};
PlasioLib.Features.Profiler.prototype.extractProfile = function() {};


PlasioLib.Cameras = {};
PlasioLib.Cameras.Orbital = {};
PlasioLib.Cameras.Orbital.azimuth = {};
PlasioLib.Cameras.Orbital.distance = {};
PlasioLib.Cameras.Orbital.maxDistance = {};
PlasioLib.Cameras.Orbital.target = {};
PlasioLib.Cameras.Orbital.elevation = {};

PlasioLib.Cameras.Orbital.prototype.setHint = function() {};
PlasioLib.Cameras.Orbital.prototype.transitionTo = function() {};
PlasioLib.Cameras.Orbital.prototype.setHeading = function() {};
PlasioLib.Cameras.Orbital.prototype.serialize = function() {};
PlasioLib.Cameras.Orbital.prototype.deserialize = function() {};
PlasioLib.Cameras.Orbital.prototype.registerHandler = function() {};

PlasioLib.FrustumLODNodePolicy = {};
PlasioLib.FrustumLODNodePolicy.prototype.start = function() {};
PlasioLib.FrustumLODNodePolicy.prototype.hookedReload = function() {};
PlasioLib.FrustumLODNodePolicy.STOP_SPLIT_DEPTH = {};
PlasioLib.FrustumLODNodePolicy.HARD_STOP_DEPTH = {};
PlasioLib.FrustumLODNodePolicy.REJECT_ON_SCREEN_SIZE_RADIUS = {};
