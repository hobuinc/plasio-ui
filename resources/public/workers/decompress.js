// decompress.js
// webworker for decompressing stuff
//

importScripts("../lib/dist/laz-perf.js");


function swapSpace(buffer, worldBoundsX, pointSize, numPoints) {
	// we assume we have x, y and z as the first three floats per point
	// we are useless without points anyway
	var step = pointSize / 4; // every field is 4 byte floating point

	var x, y, z;
	var off = 0;
	for(var i = 0 ; i < numPoints ; i++) {
		x = buffer[off];
		y = buffer[off + 1];
		z = buffer[off + 2];

		// x needs to be reflected
		x = worldBoundsX[1] - x + worldBoundsX[0];

		buffer[off] = x;   // negate x
		buffer[off + 1] = z;   // y is actually z from point cloud
		buffer[off + 2] = y;   // z is actually y from point cloud

		off += step;
	}
}

function collectStats(buffer, pointSize, numPoints) {
	// whatever stats we collect go here
	//
	var bin = {};
	var binIt = function(val) {
		var key = Math.floor(val / 10) * 10;
		bin[key] = ((!bin[key]) ? 0 : bin[key]) + 1;
	};

	var offset = 0;
	var psInFloats = pointSize / 4;
	for (var i = 0 ; i < numPoints ; i ++) {
		var z = buffer[offset + 1];
		binIt(z);
		offset += psInFloats;
	}

	return {z: bin};
}

var hasColor = function(schema) {
	var hasr = false, hasg = false, hasb = false;
	for (var i = 0, il = schema.length ; i < il ; i ++) {
		hasr = hasr || schema[i].name === "Red";
		hasg = hasg || schema[i].name === "Green";
		hasb = hasb || schema[i].name === "Blue";
	}

	return hasr && hasb && hasg;
};

var addColor = function(input, numPoints, pointSize) {
	// if we're adding color the point size is going to be 3 floats more
	//
	var newPointSize = pointSize + 12;
	var newBuffer = new Float32Array(numPoints * newPointSize / 4);

	var off = 0,
		woff = 0;
	var leftOver = pointSize - 12,
		instride = pointSize / 4,
		outstride = newPointSize / 4;

	for (var i = 0 ; i < numPoints ; i ++) {
		newBuffer[woff + 0] = input[off + 0];
		newBuffer[woff + 1] = input[off + 1];
		newBuffer[woff + 2] = input[off + 2];

		// color
		newBuffer[woff + 3] = 0;
		newBuffer[woff + 4] = 0;
		newBuffer[woff + 5] = 0;

		// whatever else
		for (var j = 0, jl = leftOver / 4 ; j < jl ; j ++) {
			newBuffer[woff + 6 + j] = input[off + 3 + j];
		}

		off += instride;
		woff += outstride;
	}

	return newBuffer;
};

var totalSaved = 0;
var decompressBuffer = function(schema, worldBoundsX, ab, numPoints, checkAddColor) {
	var x = new Module.DynamicLASZip();

	var abInt = new Uint8Array(ab);
	var buf = Module._malloc(ab.byteLength);

	Module.HEAPU8.set(abInt, buf);
	x.open(buf, ab.byteLength);

	var pointSize = 0;

	schema.forEach(function(f) {
		pointSize += f.size;
		if (f.type === "floating")
			x.addFieldFloating(f.size);
		else if (f.type === "unsigned")
			x.addFieldUnsigned(f.size);
		else
			throw new Error("Unrecognized field desc:", f);
	});

	totalSaved += (numPoints * pointSize) - ab.byteLength;
	var out = Module._malloc(numPoints * pointSize);

	for (var i = 0 ; i < numPoints ; i ++) {
		x.getPoint(out + i * pointSize);
	}

	var ret = new Uint8Array(numPoints * pointSize);
	ret.set(Module.HEAPU8.subarray(out, out + numPoints * pointSize));

	Module._free(out);
	Module._free(buf);

	var b = new Float32Array(ret.buffer);

	if (checkAddColor && numPoints > 0 && !hasColor(schema)) {
		b = addColor(b, numPoints, pointSize);
	}

	// if we got any points, swap them
	if (numPoints > 0)
		swapSpace(b, worldBoundsX, pointSize, numPoints);

	var stats = collectStats(b, pointSize, numPoints);

	return [b, stats];
};

self.onmessage = function(e) {
	var data = e.data;
	
	var schema = data.schema;
	var ab = data.buffer;
	var numPoints = data.pointsCount;
	var worldBoundsX = data.worldBoundsX;
	var addColor = data.addColor;

	var w = decompressBuffer(schema, worldBoundsX, ab, numPoints, addColor);

	var res = w[0],
		stats = w[1];


	postMessage({result: res, stats: stats}, [res.buffer]);
};
