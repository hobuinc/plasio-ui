// decompress.js
// webworker for decompressing stuff
//

importScripts("../lib/dist/laz-perf.js");


function swapSpace(buffer, worldBoundsX, pointSize, numPoints, normalize) {
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
		if (normalize) {
			x = -x;
		}
		else {
			x = worldBoundsX[1] - x + worldBoundsX[0];
		}

		buffer[off] = x;   // negate x
		buffer[off + 1] = z;   // y is actually z from point cloud
		buffer[off + 2] = y;   // z is actually y from point cloud

		off += step;
	}
}

function collectStats(buffer, pointSize, numPoints, collectFor) {
	// We collect stats here, collectFor is a list of 3-tuples, where
	// each element specifies the stats to collect, first item being the
	// key and the second one being its offset in floating point in the point representation
	// and the third item being the clamp step
	//
	//
	// E.g. to collect Z-stats you'd say
	// collectFor = [["z" 1]];
	//
	var bins = {};

	var binIt = function(type, step, val) {
		var key = Math.floor(val / step) * step;
		var bin = bins[type] || {};
		bin[key] = ((!bin[key]) ? 0 : bin[key]) + 1;

		bins[type] = bin;
	};

	var offset = 0;
	var psInFloats = pointSize / 4;
	for (var i = 0 ; i < numPoints ; i ++) {
		for (var j = 0 ; j < collectFor.length ; j ++) {
			var type = collectFor[j][0],
				off  = collectFor[j][1],
				step = collectFor[j][2];

			var val = buffer[offset + off];
			binIt(type, step, val);
		}

		offset += psInFloats;
	}

	return bins;
}

var unpackBuffer = function(buffer, totalPoints, pointSize, schema) {
	var view = new DataView(buffer);
	var woff = 0;
	var roff = 0;

	// convert our schema into a bunch of function calls
	//
	var fields = [];
	var computedPointSize = 0;
	for (var i = 0 ; i < schema.length ; i ++) {
		var s = schema[i];

		if (s.type === "floating" && s.size === 4)
			fields.push([4, DataView.prototype.getFloat32]);
		else if (s.type === "unsigned" && s.size === 4)
			fields.push([4, DataView.prototype.getUint32]);
		else if (s.type === "unsigned" && s.size === 2)
			fields.push([2, DataView.prototype.getUint16]);
		else if (s.type === "unsigned" && s.size === 1)
			fields.push([1, DataView.prototype.getUint8]);
		else
			throw Error("Unrecognized schema field: " + JSON.stringify(s));

		computedPointSize += s.size;
	}

	if (computedPointSize !== pointSize) {
		throw new Error("Point size validation failed, the schema size doesn't match computed point size");
	}

	// from this point on, everything is stored as 32-bit floats
	var outBuffer = new Float32Array(totalPoints * schema.length);

	for (var i = 0 ; i < totalPoints ; i ++) {
		for (var j = 0, jl = fields.length ; j < jl ; j ++) {
			var f = fields[j];

			var size = f[0];
			var fn = f[1];

			outBuffer[woff] = fn.call(view, roff, true);

			woff ++;
			roff += size;
		}
	}

	return outBuffer;
};

var getColorChannelOffsets = function(schema) {
	var red = null, green = null, blue = null;

	schema.forEach(function(s, i) {
		if (s.name === "Red") red = i;
		else if (s.name === "Green") green = i;
		else if (s.name === "Blue") blue = i;
	});

	if (red !== null && green !== null && blue !== null)
		return [red, green, blue];

	return null;
};

var totalSaved = 0;
var decompressBuffer = function(schema, worldBoundsX, ab, numPoints, normalize) {
	var x = new Module.DynamicLASZip();

	var abInt = new Uint8Array(ab);
	var buf = Module._malloc(ab.byteLength);

	Module.HEAPU8.set(abInt, buf);
	x.open(buf, ab.byteLength);

	var pointSize = 0;
	var needUnpack = false;

	schema.forEach(function(f) {
		pointSize += f.size;
		if (f.type === "floating")
			x.addFieldFloating(f.size);
		else if (f.type === "unsigned") {
			x.addFieldUnsigned(f.size);
			needUnpack = true;
		}
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

	// we only need to unpack buffer if we have any non-floating point items in schema
	//
	var b = needUnpack ?
		unpackBuffer(ret.buffer, numPoints, pointSize, schema) :
		new Float32Array(ret.buffer);

	// the point size beyond this point has probably been updated, if the unpack happened we
	// our point size is now different than what it was before, its always going to be
	// 4 bytes per components since everything is converted to floats.
	//
	pointSize = schema.length * 4;

	// if we got any points, swap them
	if (numPoints > 0)
		swapSpace(b, worldBoundsX, pointSize, numPoints, normalize);

	// stats collection, if we have color, collect color stats
	//
	var statsToCollect = [
		["z", 1, 10]
	];

	var colorOffsets = getColorChannelOffsets(schema);

	if (colorOffsets !== null) {
		statsToCollect.push(["red", colorOffsets[0], 10]);
		statsToCollect.push(["green", colorOffsets[1], 10]);
		statsToCollect.push(["blue", colorOffsets[2], 10]);
	}

	var stats = collectStats(b, pointSize, numPoints, statsToCollect);

	return [b, stats];
};

self.onmessage = function(e) {
	var data = e.data;

	var schema = data.schema;
	var ab = data.buffer;
	var numPoints = data.pointsCount;
	var worldBoundsX = data.worldBoundsX;
	var normalize = data.normalize;

	var w = decompressBuffer(schema, worldBoundsX, ab, numPoints, normalize);

	var res = w[0],
		stats = w[1];

	postMessage({result: res, stats: stats}, [res.buffer]);
};
