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

var totalSaved = 0;
var decompressBuffer = function(schema, worldBoundsX, ab, numPoints) {
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
	/*
	console.log("Decompress points:", numPoints,
	            "bytes: ", ab.byteLength, "->", numPoints * pointSize, "saved:", totalSaved);
	 */

	var out = Module._malloc(numPoints * pointSize);

	for (var i = 0 ; i < numPoints ; i ++) {
		x.getPoint(out + i * pointSize);
	}

	var ret = new Uint8Array(numPoints * pointSize);
	ret.set(Module.HEAPU8.subarray(out, out + numPoints * pointSize));

	Module._free(out);
	Module._free(buf);

	var b = new Float32Array(ret.buffer);

	// if we got any points, swap them
	if (numPoints > 0)
		swapSpace(b, worldBoundsX, pointSize, numPoints);

	return b;
};

self.onmessage = function(e) {
	var data = e.data;
	
	var schema = data.schema;
	var ab = data.buffer;
	var numPoints = data.pointsCount;
	var worldBoundsX = data.worldBoundsX;

	var res = decompressBuffer(schema, worldBoundsX, ab, numPoints);
	postMessage({result: res}, [res.buffer]);
};
