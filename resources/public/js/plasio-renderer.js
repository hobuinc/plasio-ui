// File:src/Three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var THREE = { REVISION: '69' };

// browserify support

if ( typeof module === 'object' ) {

	module.exports = THREE;

}

// polyfills

if ( Math.sign === undefined ) {

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : 0;

	};

}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

THREE.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

// GL STATE CONSTANTS

THREE.CullFaceNone = 0;
THREE.CullFaceBack = 1;
THREE.CullFaceFront = 2;
THREE.CullFaceFrontBack = 3;

THREE.FrontFaceDirectionCW = 0;
THREE.FrontFaceDirectionCCW = 1;

// SHADOWING TYPES

THREE.BasicShadowMap = 0;
THREE.PCFShadowMap = 1;
THREE.PCFSoftShadowMap = 2;

// MATERIAL CONSTANTS

// side

THREE.FrontSide = 0;
THREE.BackSide = 1;
THREE.DoubleSide = 2;

// shading

THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;

// colors

THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;

// blending modes

THREE.NoBlending = 0;
THREE.NormalBlending = 1;
THREE.AdditiveBlending = 2;
THREE.SubtractiveBlending = 3;
THREE.MultiplyBlending = 4;
THREE.CustomBlending = 5;

// custom blending equations
// (numbers start from 100 not to clash with other
//  mappings to OpenGL constants defined in Texture.js)

THREE.AddEquation = 100;
THREE.SubtractEquation = 101;
THREE.ReverseSubtractEquation = 102;
THREE.MinEquation = 103;
THREE.MaxEquation = 104;

// custom blending destination factors

THREE.ZeroFactor = 200;
THREE.OneFactor = 201;
THREE.SrcColorFactor = 202;
THREE.OneMinusSrcColorFactor = 203;
THREE.SrcAlphaFactor = 204;
THREE.OneMinusSrcAlphaFactor = 205;
THREE.DstAlphaFactor = 206;
THREE.OneMinusDstAlphaFactor = 207;

// custom blending source factors

//THREE.ZeroFactor = 200;
//THREE.OneFactor = 201;
//THREE.SrcAlphaFactor = 204;
//THREE.OneMinusSrcAlphaFactor = 205;
//THREE.DstAlphaFactor = 206;
//THREE.OneMinusDstAlphaFactor = 207;
THREE.DstColorFactor = 208;
THREE.OneMinusDstColorFactor = 209;
THREE.SrcAlphaSaturateFactor = 210;


// TEXTURE CONSTANTS

THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;
THREE.AddOperation = 2;

// Mapping modes

THREE.UVMapping = function () {};

THREE.CubeReflectionMapping = function () {};
THREE.CubeRefractionMapping = function () {};

THREE.SphericalReflectionMapping = function () {};
THREE.SphericalRefractionMapping = function () {};

// Wrapping modes

THREE.RepeatWrapping = 1000;
THREE.ClampToEdgeWrapping = 1001;
THREE.MirroredRepeatWrapping = 1002;

// Filters

THREE.NearestFilter = 1003;
THREE.NearestMipMapNearestFilter = 1004;
THREE.NearestMipMapLinearFilter = 1005;
THREE.LinearFilter = 1006;
THREE.LinearMipMapNearestFilter = 1007;
THREE.LinearMipMapLinearFilter = 1008;

// Data types

THREE.UnsignedByteType = 1009;
THREE.ByteType = 1010;
THREE.ShortType = 1011;
THREE.UnsignedShortType = 1012;
THREE.IntType = 1013;
THREE.UnsignedIntType = 1014;
THREE.FloatType = 1015;

// Pixel types

//THREE.UnsignedByteType = 1009;
THREE.UnsignedShort4444Type = 1016;
THREE.UnsignedShort5551Type = 1017;
THREE.UnsignedShort565Type = 1018;

// Pixel formats

THREE.AlphaFormat = 1019;
THREE.RGBFormat = 1020;
THREE.RGBAFormat = 1021;
THREE.LuminanceFormat = 1022;
THREE.LuminanceAlphaFormat = 1023;

// DDS / ST3C Compressed texture formats

THREE.RGB_S3TC_DXT1_Format = 2001;
THREE.RGBA_S3TC_DXT1_Format = 2002;
THREE.RGBA_S3TC_DXT3_Format = 2003;
THREE.RGBA_S3TC_DXT5_Format = 2004;


// PVRTC compressed texture formats

THREE.RGB_PVRTC_4BPPV1_Format = 2100;
THREE.RGB_PVRTC_2BPPV1_Format = 2101;
THREE.RGBA_PVRTC_4BPPV1_Format = 2102;
THREE.RGBA_PVRTC_2BPPV1_Format = 2103;


// File:src/math/Color.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Color = function ( color ) {

	if ( arguments.length === 3 ) {

		return this.setRGB( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ] );

	}

	return this.set( color )

};

THREE.Color.prototype = {

	constructor: THREE.Color,

	r: 1, g: 1, b: 1,

	set: function ( value ) {

		if ( value instanceof THREE.Color ) {

			this.copy( value );

		} else if ( typeof value === 'number' ) {

			this.setHex( value );

		} else if ( typeof value === 'string' ) {

			this.setStyle( value );

		}

		return this;

	},

	setHex: function ( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	},

	setRGB: function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		return this;

	},

	setHSL: function ( h, s, l ) {

		// h,s,l ranges are in 0.0 - 1.0

		if ( s === 0 ) {

			this.r = this.g = this.b = l;

		} else {

			var hue2rgb = function ( p, q, t ) {

				if ( t < 0 ) t += 1;
				if ( t > 1 ) t -= 1;
				if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
				if ( t < 1 / 2 ) return q;
				if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
				return p;

			};

			var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
			var q = ( 2 * l ) - p;

			this.r = hue2rgb( q, p, h + 1 / 3 );
			this.g = hue2rgb( q, p, h );
			this.b = hue2rgb( q, p, h - 1 / 3 );

		}

		return this;

	},

	setStyle: function ( style ) {

		// rgb(255,0,0)

		if ( /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test( style ) ) {

			var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec( style );

			this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
			this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
			this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

			return this;

		}

		// rgb(100%,0%,0%)

		if ( /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test( style ) ) {

			var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec( style );

			this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
			this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
			this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

			return this;

		}

		// #ff0000

		if ( /^\#([0-9a-f]{6})$/i.test( style ) ) {

			var color = /^\#([0-9a-f]{6})$/i.exec( style );

			this.setHex( parseInt( color[ 1 ], 16 ) );

			return this;

		}

		// #f00

		if ( /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test( style ) ) {

			var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec( style );

			this.setHex( parseInt( color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ] + color[ 3 ] + color[ 3 ], 16 ) );

			return this;

		}

		// red

		if ( /^(\w+)$/i.test( style ) ) {

			this.setHex( THREE.ColorKeywords[ style ] );

			return this;

		}


	},

	copy: function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;

		return this;

	},

	copyGammaToLinear: function ( color ) {

		this.r = color.r * color.r;
		this.g = color.g * color.g;
		this.b = color.b * color.b;

		return this;

	},

	copyLinearToGamma: function ( color ) {

		this.r = Math.sqrt( color.r );
		this.g = Math.sqrt( color.g );
		this.b = Math.sqrt( color.b );

		return this;

	},

	convertGammaToLinear: function () {

		var r = this.r, g = this.g, b = this.b;

		this.r = r * r;
		this.g = g * g;
		this.b = b * b;

		return this;

	},

	convertLinearToGamma: function () {

		this.r = Math.sqrt( this.r );
		this.g = Math.sqrt( this.g );
		this.b = Math.sqrt( this.b );

		return this;

	},

	getHex: function () {

		return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

	},

	getHexString: function () {

		return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

	},

	getHSL: function ( optionalTarget ) {

		// h,s,l ranges are in 0.0 - 1.0

		var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

		var r = this.r, g = this.g, b = this.b;

		var max = Math.max( r, g, b );
		var min = Math.min( r, g, b );

		var hue, saturation;
		var lightness = ( min + max ) / 2.0;

		if ( min === max ) {

			hue = 0;
			saturation = 0;

		} else {

			var delta = max - min;

			saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

			switch ( max ) {

				case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
				case g: hue = ( b - r ) / delta + 2; break;
				case b: hue = ( r - g ) / delta + 4; break;

			}

			hue /= 6;

		}

		hsl.h = hue;
		hsl.s = saturation;
		hsl.l = lightness;

		return hsl;

	},

	getStyle: function () {

		return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

	},

	offsetHSL: function ( h, s, l ) {

		var hsl = this.getHSL();

		hsl.h += h; hsl.s += s; hsl.l += l;

		this.setHSL( hsl.h, hsl.s, hsl.l );

		return this;

	},

	add: function ( color ) {

		this.r += color.r;
		this.g += color.g;
		this.b += color.b;

		return this;

	},

	addColors: function ( color1, color2 ) {

		this.r = color1.r + color2.r;
		this.g = color1.g + color2.g;
		this.b = color1.b + color2.b;

		return this;

	},

	addScalar: function ( s ) {

		this.r += s;
		this.g += s;
		this.b += s;

		return this;

	},

	multiply: function ( color ) {

		this.r *= color.r;
		this.g *= color.g;
		this.b *= color.b;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.r *= s;
		this.g *= s;
		this.b *= s;

		return this;

	},

	lerp: function ( color, alpha ) {

		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;

		return this;

	},

	equals: function ( c ) {

		return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

	},

	fromArray: function ( array ) {

		this.r = array[ 0 ];
		this.g = array[ 1 ];
		this.b = array[ 2 ];

		return this;

	},

	toArray: function () {

		return [ this.r, this.g, this.b ];

	},

	clone: function () {

		return new THREE.Color().setRGB( this.r, this.g, this.b );

	}

};

THREE.ColorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

// File:src/math/Quaternion.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Quaternion = function ( x, y, z, w ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

	constructor: THREE.Quaternion,

	_x: 0,_y: 0, _z: 0, _w: 0,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get w () {

		return this._w;

	},

	set w ( value ) {

		this._w = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this.onChangeCallback();

		return this;

	},

	copy: function ( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this.onChangeCallback();

		return this;

	},

	setFromEuler: function ( euler, update ) {

		if ( euler instanceof THREE.Euler === false ) {

			throw new Error( 'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
		}

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		var c1 = Math.cos( euler._x / 2 );
		var c2 = Math.cos( euler._y / 2 );
		var c3 = Math.cos( euler._z / 2 );
		var s1 = Math.sin( euler._x / 2 );
		var s2 = Math.sin( euler._y / 2 );
		var s3 = Math.sin( euler._z / 2 );

		if ( euler.order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;

	},

	setFromUnitVectors: function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1, r;

		var EPS = 0.000001;

		return function ( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			this.normalize();

			return this;

		}

	}(),

	inverse: function () {

		this.conjugate().normalize();

		return this;

	},

	conjugate: function () {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this.onChangeCallback();

		return this;

	},

	dot: function ( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	},

	lengthSq: function () {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	},

	length: function () {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	},

	normalize: function () {

		var l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		this.onChangeCallback();

		return this;

	},

	multiply: function ( q, p ) {

		if ( p !== undefined ) {

			console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	},

	multiplyQuaternions: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
		return vector.applyQuaternion( this );

	},

	slerp: function ( qb, t ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		var x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		var halfTheta = Math.acos( cosHalfTheta );
		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

			this._w = 0.5 * ( w + this._w );
			this._x = 0.5 * ( x + this._x );
			this._y = 0.5 * ( y + this._y );
			this._z = 0.5 * ( z + this._z );

			return this;

		}

		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		this.onChangeCallback();

		return this;

	},

	equals: function ( quaternion ) {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREE.Quaternion( this._x, this._y, this._z, this._w );

	}

};

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

	return qm.copy( qa ).slerp( qb, t );

}

// File:src/math/Vector2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREE.Vector2.prototype = {

	constructor: THREE.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		return this;
	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector2();
				max = new THREE.Vector2();

			}

			min.set( minVal, minVal );
			max.set( maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	},

	clone: function () {

		return new THREE.Vector2( this.x, this.y );

	}

};

// File:src/math/Vector3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	multiply: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;

	},

	multiplyVectors: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	applyEuler: function () {

		var quaternion;

		return function ( euler ) {

			if ( euler instanceof THREE.Euler === false ) {

				console.error( 'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			this.applyQuaternion( quaternion.setFromEuler( euler ) );

			return this;

		};

	}(),

	applyAxisAngle: function () {

		var quaternion;

		return function ( axis, angle ) {

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

			return this;

		};

	}(),

	applyMatrix3: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	},

	applyMatrix4: function ( m ) {

		// input: THREE.Matrix4 affine matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

		return this;

	},

	applyProjection: function ( m ) {

		// input: THREE.Matrix4 projection matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;
		var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

		return this;

	},

	applyQuaternion: function ( q ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	},

	project: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
			return this.applyProjection( matrix );

		};

	}(),

	unproject: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
			return this.applyProjection( matrix );

		};

	}(),

	transformDirection: function ( m ) {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		this.normalize();

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector3();
				max = new THREE.Vector3();

			}

			min.set( minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength  ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	cross: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	crossVectors: function ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	},

	projectOnVector: function () {

		var v1, dot;

		return function ( vector ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( vector ).normalize();

			dot = this.dot( v1 );

			return this.copy( v1 ).multiplyScalar( dot );

		};

	}(),

	projectOnPlane: function () {

		var v1;

		return function ( planeNormal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( this ).projectOnVector( planeNormal );

			return this.sub( v1 );

		}

	}(),

	reflect: function () {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		var v1;

		return function ( normal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

	}(),

	angleTo: function ( v ) {

		var theta = this.dot( v ) / ( this.length() * v.length() );

		// clamp, to handle numerical problems

		return Math.acos( THREE.Math.clamp( theta, - 1, 1 ) );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	setEulerFromRotationMatrix: function ( m, order ) {

		console.error( 'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );

	},

	setEulerFromQuaternion: function ( q, order ) {

		console.error( 'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );

	},

	getPositionFromMatrix: function ( m ) {

		console.warn( 'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );

		return this.setFromMatrixPosition( m );

	},

	getScaleFromMatrix: function ( m ) {

		console.warn( 'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );

		return this.setFromMatrixScale( m );
	},

	getColumnFromMatrix: function ( index, matrix ) {

		console.warn( 'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );

		return this.setFromMatrixColumn( index, matrix );

	},

	setFromMatrixPosition: function ( m ) {

		this.x = m.elements[ 12 ];
		this.y = m.elements[ 13 ];
		this.z = m.elements[ 14 ];

		return this;

	},

	setFromMatrixScale: function ( m ) {

		var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ] ).length();
		var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ] ).length();
		var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	},

	setFromMatrixColumn: function ( index, matrix ) {

		var offset = index * 4;

		var me = matrix.elements;

		this.x = me[ offset ];
		this.y = me[ offset + 1 ];
		this.z = me[ offset + 2 ];

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	},

	clone: function () {

		return new THREE.Vector3( this.x, this.y, this.z );

	}

};

// File:src/math/Vector4.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

	constructor: THREE.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setW: function ( w ) {

		this.w = w;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			case 3: this.w = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;
		this.w += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;

		return this;

	},

	applyMatrix4: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;
		var w = this.w;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;
			this.w *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		}

		return this;

	},

	setAxisAngleFromQuaternion: function ( q ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

		// q is assumed to be normalized

		this.w = 2 * Math.acos( q.w );

		var s = Math.sqrt( 1 - q.w * q.w );

		if ( s < 0.0001 ) {

			 this.x = 1;
			 this.y = 0;
			 this.z = 0;

		} else {

			 this.x = q.x / s;
			 this.y = q.y / s;
			 this.z = q.z / s;

		}

		return this;

	},

	setAxisAngleFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var angle, x, y, z,		// variables for result
			epsilon = 0.01,		// margin to allow for rounding errors
			epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

			te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		if ( ( Math.abs( m12 - m21 ) < epsilon )
		   && ( Math.abs( m13 - m31 ) < epsilon )
		   && ( Math.abs( m23 - m32 ) < epsilon ) ) {

			// singularity found
			// first check for identity matrix which must have +1 for all terms
			// in leading diagonal and zero in other terms

			if ( ( Math.abs( m12 + m21 ) < epsilon2 )
			   && ( Math.abs( m13 + m31 ) < epsilon2 )
			   && ( Math.abs( m23 + m32 ) < epsilon2 )
			   && ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

				// this singularity is identity matrix so angle = 0

				this.set( 1, 0, 0, 0 );

				return this; // zero angle, arbitrary axis

			}

			// otherwise this singularity is angle = 180

			angle = Math.PI;

			var xx = ( m11 + 1 ) / 2;
			var yy = ( m22 + 1 ) / 2;
			var zz = ( m33 + 1 ) / 2;
			var xy = ( m12 + m21 ) / 4;
			var xz = ( m13 + m31 ) / 4;
			var yz = ( m23 + m32 ) / 4;

			if ( ( xx > yy ) && ( xx > zz ) ) { // m11 is the largest diagonal term

				if ( xx < epsilon ) {

					x = 0;
					y = 0.707106781;
					z = 0.707106781;

				} else {

					x = Math.sqrt( xx );
					y = xy / x;
					z = xz / x;

				}

			} else if ( yy > zz ) { // m22 is the largest diagonal term

				if ( yy < epsilon ) {

					x = 0.707106781;
					y = 0;
					z = 0.707106781;

				} else {

					y = Math.sqrt( yy );
					x = xy / y;
					z = yz / y;

				}

			} else { // m33 is the largest diagonal term so base result on this

				if ( zz < epsilon ) {

					x = 0.707106781;
					y = 0.707106781;
					z = 0;

				} else {

					z = Math.sqrt( zz );
					x = xz / z;
					y = yz / z;

				}

			}

			this.set( x, y, z, angle );

			return this; // return 180 deg rotation

		}

		// as we have reached here there are no singularities so we can handle normally

		var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 )
						  + ( m13 - m31 ) * ( m13 - m31 )
						  + ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

		if ( Math.abs( s ) < 0.001 ) s = 1;

		// prevent divide by zero, should not happen if matrix is orthogonal and should be
		// caught by singularity test above, but I've left it in just in case

		this.x = ( m32 - m23 ) / s;
		this.y = ( m13 - m31 ) / s;
		this.z = ( m21 - m12 ) / s;
		this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		if ( this.w > v.w ) {

			this.w = v.w;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		if ( this.w < v.w ) {

			this.w = v.w;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		if ( this.w < min.w ) {

			this.w = min.w;

		} else if ( this.w > max.w ) {

			this.w = max.w;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector4();
				max = new THREE.Vector4();

			}

			min.set( minVal, minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );
        this.w = Math.floor( this.w );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );
        this.w = Math.ceil( this.w );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );
        this.w = Math.round( this.w );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
        this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

        return this;

    },

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		this.w = - this.w;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );

		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];
		this.w = array[ offset + 3 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;
		array[ offset + 3 ] = this.w;

		return array;

	},

	clone: function () {

		return new THREE.Vector4( this.x, this.y, this.z, this.w );

	}

};

// File:src/math/Euler.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Euler = function ( x, y, z, order ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._order = order || THREE.Euler.DefaultOrder;

};

THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

	constructor: THREE.Euler,

	_x: 0, _y: 0, _z: 0, _order: THREE.Euler.DefaultOrder,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get order () {

		return this._order;

	},

	set order ( value ) {

		this._order = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order || this._order;

		this.onChangeCallback();

		return this;

	},

	copy: function ( euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m, order ) {

		var clamp = THREE.Math.clamp;

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m33 );
				this._z = Math.atan2( - m12, m11 );

			} else {

				this._x = Math.atan2( m32, m22 );
				this._z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this._x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this._y = Math.atan2( m13, m33 );
				this._z = Math.atan2( m21, m22 );

			} else {

				this._y = Math.atan2( - m31, m11 );
				this._z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this._y = Math.atan2( - m31, m33 );
				this._z = Math.atan2( - m12, m22 );

			} else {

				this._y = 0;
				this._z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this._y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m33 );
				this._z = Math.atan2( m21, m11 );

			} else {

				this._x = 0;
				this._z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this._z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m22 );
				this._y = Math.atan2( - m31, m11 );

			} else {

				this._x = 0;
				this._y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this._z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m22 );
				this._y = Math.atan2( m13, m11 );

			} else {

				this._x = Math.atan2( - m23, m33 );
				this._y = 0;

			}

		} else {

			console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

		}

		this._order = order;

		this.onChangeCallback();

		return this;

	},

	setFromQuaternion: function ( q, order, update ) {

		var clamp = THREE.Math.clamp;

		// q is assumed to be normalized

		// http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var sqw = q.w * q.w;

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( sqw - sqx - sqy + sqz ) );
			this._y = Math.asin(  clamp( 2 * ( q.x * q.z + q.y * q.w ), - 1, 1 ) );
			this._z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw + sqx - sqy - sqz ) );

		} else if ( order ===  'YXZ' ) {

			this._x = Math.asin(  clamp( 2 * ( q.x * q.w - q.y * q.z ), - 1, 1 ) );
			this._y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw - sqx - sqy + sqz ) );
			this._z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw - sqx + sqy - sqz ) );

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin(  clamp( 2 * ( q.x * q.w + q.y * q.z ), - 1, 1 ) );
			this._y = Math.atan2( 2 * ( q.y * q.w - q.z * q.x ), ( sqw - sqx - sqy + sqz ) );
			this._z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw - sqx + sqy - sqz ) );

		} else if ( order === 'ZYX' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w + q.z * q.y ), ( sqw - sqx - sqy + sqz ) );
			this._y = Math.asin(  clamp( 2 * ( q.y * q.w - q.x * q.z ), - 1, 1 ) );
			this._z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw + sqx - sqy - sqz ) );

		} else if ( order === 'YZX' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w - q.z * q.y ), ( sqw - sqx + sqy - sqz ) );
			this._y = Math.atan2( 2 * ( q.y * q.w - q.x * q.z ), ( sqw + sqx - sqy - sqz ) );
			this._z = Math.asin(  clamp( 2 * ( q.x * q.y + q.z * q.w ), - 1, 1 ) );

		} else if ( order === 'XZY' ) {

			this._x = Math.atan2( 2 * ( q.x * q.w + q.y * q.z ), ( sqw - sqx + sqy - sqz ) );
			this._y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw + sqx - sqy - sqz ) );
			this._z = Math.asin(  clamp( 2 * ( q.z * q.w - q.x * q.y ), - 1, 1 ) );

		} else {

			console.warn( 'THREE.Euler: .setFromQuaternion() given unsupported order: ' + order )

		}

		this._order = order;

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	reorder: function () {

		// WARNING: this discards revolution information -bhouston

		var q = new THREE.Quaternion();

		return function ( newOrder ) {

			q.setFromEuler( this );
			this.setFromQuaternion( q, newOrder );

		};


	}(),

	equals: function ( euler ) {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	},

	fromArray: function ( array ) {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function () {

		return [ this._x, this._y, this._z, this._order ];

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREE.Euler( this._x, this._y, this._z, this._order );

	}

};

// File:src/math/Line3.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Line3 = function ( start, end ) {

	this.start = ( start !== undefined ) ? start : new THREE.Vector3();
	this.end = ( end !== undefined ) ? end : new THREE.Vector3();

};

THREE.Line3.prototype = {

	constructor: THREE.Line3,

	set: function ( start, end ) {

		this.start.copy( start );
		this.end.copy( end );

		return this;

	},

	copy: function ( line ) {

		this.start.copy( line.start );
		this.end.copy( line.end );

		return this;

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

	},

	delta: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.end, this.start );

	},

	distanceSq: function () {

		return this.start.distanceToSquared( this.end );

	},

	distance: function () {

		return this.start.distanceTo( this.end );

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	closestPointToPointParameter: function () {

		var startP = new THREE.Vector3();
		var startEnd = new THREE.Vector3();

		return function ( point, clampToLine ) {

			startP.subVectors( point, this.start );
			startEnd.subVectors( this.end, this.start );

			var startEnd2 = startEnd.dot( startEnd );
			var startEnd_startP = startEnd.dot( startP );

			var t = startEnd_startP / startEnd2;

			if ( clampToLine ) {

				t = THREE.Math.clamp( t, 0, 1 );

			}

			return t;

		};

	}(),

	closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

		var t = this.closestPointToPointParameter( point, clampToLine );

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	applyMatrix4: function ( matrix ) {

		this.start.applyMatrix4( matrix );
		this.end.applyMatrix4( matrix );

		return this;

	},

	equals: function ( line ) {

		return line.start.equals( this.start ) && line.end.equals( this.end );

	},

	clone: function () {

		return new THREE.Line3().copy( this );

	}

};

// File:src/math/Box2.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Box2 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector2( Infinity, Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector2( - Infinity, - Infinity );

};

THREE.Box2.prototype = {

	constructor: THREE.Box2,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] )

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector2();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );
			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = Infinity;
		this.max.x = this.max.y = - Infinity;

		return this;

	},

	empty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;
	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;
	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;
	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
		     ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector2();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y )
		);

	},

	isIntersectionBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector2();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new THREE.Box2().copy( this );

	}

};

// File:src/math/Box3.js

/**
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Box3 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector3( Infinity, Infinity, Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector3( - Infinity, - Infinity, - Infinity );

};

THREE.Box3.prototype = {

	constructor: THREE.Box3,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] )

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector3();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );

			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	setFromObject: function () {

		// Computes the world-axis-aligned bounding box of an object (including its children),
		// accounting for both the object's, and childrens', world transforms

		var v1 = new THREE.Vector3();

		return function ( object ) {

			var scope = this;

			object.updateMatrixWorld( true );

			this.makeEmpty();

			object.traverse( function ( node ) {

				var geometry = node.geometry;

				if ( geometry !== undefined ) {

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;

						for ( var i = 0, il = vertices.length; i < il; i ++ ) {

							v1.copy( vertices[ i ] );

							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					} else if ( geometry instanceof THREE.BufferGeometry && geometry.attributes[ 'position' ] !== undefined ) {

						var positions = geometry.attributes[ 'position' ].array;

						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							v1.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					}

				}

			} );

			return this;

		};

	}(),

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = this.min.z = Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;

		return this;

	},

	empty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ||
		     point.z < this.min.z || point.z > this.max.z ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
			 ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) &&
			 ( this.min.z <= box.min.z ) && ( box.max.z <= this.max.z ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector3();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y ),
			( point.z - this.min.z ) / ( this.max.z - this.min.z )
		);

	},

	isIntersectionBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ||
		     box.max.z < this.min.z || box.min.z > this.max.z ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	getBoundingSphere: function () {

		var v1 = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Sphere();

			result.center = this.center();
			result.radius = this.size( v1 ).length() * 0.5;

			return result;

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	applyMatrix4: function () {

		var points = [
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3()
		];

		return function ( matrix ) {

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
			points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
			points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
			points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
			points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
			points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
			points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
			points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix );  // 111

			this.makeEmpty();
			this.setFromPoints( points );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new THREE.Box3().copy( this );

	}

};

// File:src/math/Matrix3.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Matrix3 = function () {

	this.elements = new Float32Array( [

		1, 0, 0,
		0, 1, 0,
		0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix3.prototype = {

	constructor: THREE.Matrix3,

	set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
		te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
		te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ],
			me[ 1 ], me[ 4 ], me[ 7 ],
			me[ 2 ], me[ 5 ], me[ 8 ]

		);

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
		return vector.applyMatrix3( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1 = new THREE.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix3( this );

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;

		};

	}(),

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
		te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
		te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

		return this;

	},

	determinant: function () {

		var te = this.elements;

		var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

	},

	getInverse: function ( matrix, throwOnInvertible ) {

		// input: THREE.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
		te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
		te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
		te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
		te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
		te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
		te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
		te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
		te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

		var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

		// no inverse

		if ( det === 0 ) {

			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;

		}

		this.multiplyScalar( 1.0 / det );

		return this;

	},

	transpose: function () {

		var tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];

		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];

		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ]  = te[ 8 ];

		return array;

	},

	getNormalMatrix: function ( m ) {

		// input: THREE.Matrix4

		this.getInverse( m ).transpose();

		return this;

	},

	transposeIntoArray: function ( r ) {

		var m = this.elements;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ],
			te[ 3 ], te[ 4 ], te[ 5 ],
			te[ 6 ], te[ 7 ], te[ 8 ]
		];

	},

	clone: function () {

		return new THREE.Matrix3().fromArray( this.elements );

	}

};

// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Matrix4 = function () {

	this.elements = new Float32Array( [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		this.elements.set( m.elements );

		return this;

	},

	extractPosition: function ( m ) {

		console.warn( 'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
		return this.copyPosition( m );

	},

	copyPosition: function ( m ) {

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	},

	extractRotation: function () {

		var v1 = new THREE.Vector3();

		return function ( m ) {

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
			var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
			var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;

			return this;

		};

	}(),

	makeRotationFromEuler: function ( euler ) {

		if ( euler instanceof THREE.Euler === false ) {

			console.error( 'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	setRotationFromQuaternion: function ( q ) {

		console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );

		return this.makeRotationFromQuaternion( q );

	},

	makeRotationFromQuaternion: function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	lookAt: function () {

		var x = new THREE.Vector3();
		var y = new THREE.Vector3();
		var z = new THREE.Vector3();

		return function ( eye, target, up ) {

			var te = this.elements;

			z.subVectors( eye, target ).normalize();

			if ( z.length() === 0 ) {

				z.z = 1;

			}

			x.crossVectors( up, z ).normalize();

			if ( x.length() === 0 ) {

				z.x += 0.0001;
				x.crossVectors( up, z ).normalize();

			}

			y.crossVectors( z, x );


			te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
			te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
			te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

			return this;

		};

	}(),

	multiply: function ( m, n ) {

		if ( n !== undefined ) {

			console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );

		}

		return this.multiplyMatrices( this, m );

	},

	multiplyMatrices: function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplyToArray: function ( a, b, r ) {

		var te = this.elements;

		this.multiplyMatrices( a, b );

		r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
		r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

		return this;

	},

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
		return vector.applyProjection( this );

	},

	multiplyVector4: function ( vector ) {

		console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1 = new THREE.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix4( this );

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;

		};

	}(),

	rotateAxis: function ( v ) {

		console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );

		v.transformDirection( this );

	},

	crossVector: function ( vector ) {

		console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	determinant: function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);

	},

	transpose: function () {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ]  = te[ 8 ];
		array[ offset + 9 ]  = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	},

	getPosition: function () {

		var v1 = new THREE.Vector3();

		return function () {

			console.warn( 'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

			var te = this.elements;
			return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );

		};

	}(),

	setPosition: function ( v ) {

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;

	},

	getInverse: function ( m, throwOnInvertible ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

		if ( det == 0 ) {

			var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;
		}

		this.multiplyScalar( 1 / det );

		return this;

	},

	translate: function ( v ) {

		console.warn( 'THREE.Matrix4: .translate() has been removed.' );

	},

	rotateX: function ( angle ) {

		console.warn( 'THREE.Matrix4: .rotateX() has been removed.' );

	},

	rotateY: function ( angle ) {

		console.warn( 'THREE.Matrix4: .rotateY() has been removed.' );

	},

	rotateZ: function ( angle ) {

		console.warn( 'THREE.Matrix4: .rotateZ() has been removed.' );

	},

	rotateByAxis: function ( axis, angle ) {

		console.warn( 'THREE.Matrix4: .rotateByAxis() has been removed.' );

	},

	scale: function ( v ) {

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;

	},

	getMaxScaleOnAxis: function () {

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq, scaleZSq ) ) );

	},

	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	compose: function ( position, quaternion, scale ) {

		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );

		return this;

	},

	decompose: function () {

		var vector = new THREE.Vector3();
		var matrix = new THREE.Matrix4();

		return function ( position, quaternion, scale ) {

			var te = this.elements;

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			var det = this.determinant();
			if ( det < 0 ) {
				sx = - sx;
			}

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part

			matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( matrix );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		};

	}(),

	makeFrustum: function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	},

	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

	},

	makeOrthographic: function ( left, right, top, bottom, near, far ) {

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 / h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 / p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
			te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
			te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
			te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
		];

	},

	clone: function () {

		return new THREE.Matrix4().fromArray( this.elements );

	}

};

// File:src/math/Ray.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ? origin : new THREE.Vector3();
	this.direction = ( direction !== undefined ) ? direction : new THREE.Vector3();

};

THREE.Ray.prototype = {

	constructor: THREE.Ray,

	set: function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

	},

	copy: function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return result.copy( this.direction ).multiplyScalar( t ).add( this.origin );

	},

	recast: function () {

		var v1 = new THREE.Vector3();

		return function ( t ) {

			this.origin.copy( this.at( t, v1 ) );

			return this;

		};

	}(),

	closestPointToPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		result.subVectors( point, this.origin );
		var directionDistance = result.dot( this.direction );

		if ( directionDistance < 0 ) {

			return result.copy( this.origin );

		}

		return result.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var directionDistance = v1.subVectors( point, this.origin ).dot( this.direction );

			// point behind the ray

			if ( directionDistance < 0 ) {

				return this.origin.distanceTo( point );

			}

			v1.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

			return v1.distanceTo( point );

		};

	}(),

	distanceSqToSegment: function ( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

		// from http://www.geometrictools.com/LibMathematics/Distance/Wm5DistRay3Segment3.cpp
		// It returns the min distance between the ray and the segment
		// defined by v0 and v1
		// It can also set two optional targets :
		// - The closest point on the ray
		// - The closest point on the segment

		var segCenter = v0.clone().add( v1 ).multiplyScalar( 0.5 );
		var segDir = v1.clone().sub( v0 ).normalize();
		var segExtent = v0.distanceTo( v1 ) * 0.5;
		var diff = this.origin.clone().sub( segCenter );
		var a01 = - this.direction.dot( segDir );
		var b0 = diff.dot( this.direction );
		var b1 = - diff.dot( segDir );
		var c = diff.lengthSq();
		var det = Math.abs( 1 - a01 * a01 );
		var s0, s1, sqrDist, extDet;

		if ( det >= 0 ) {

			// The ray and segment are not parallel.

			s0 = a01 * b1 - b0;
			s1 = a01 * b0 - b1;
			extDet = segExtent * det;

			if ( s0 >= 0 ) {

				if ( s1 >= - extDet ) {

					if ( s1 <= extDet ) {

						// region 0
						// Minimum at interior points of ray and segment.

						var invDet = 1 / det;
						s0 *= invDet;
						s1 *= invDet;
						sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

					} else {

						// region 1

						s1 = segExtent;
						s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				} else {

					// region 5

					s1 = - segExtent;
					s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				}

			} else {

				if ( s1 <= - extDet ) {

					// region 4

					s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
					s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				} else if ( s1 <= extDet ) {

					// region 3

					s0 = 0;
					s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
					sqrDist = s1 * ( s1 + 2 * b1 ) + c;

				} else {

					// region 2

					s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
					s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				}

			}

		} else {

			// Ray and segment are parallel.

			s1 = ( a01 > 0 ) ? - segExtent : segExtent;
			s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
			sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

		}

		if ( optionalPointOnRay ) {

			optionalPointOnRay.copy( this.direction.clone().multiplyScalar( s0 ).add( this.origin ) );

		}

		if ( optionalPointOnSegment ) {

			optionalPointOnSegment.copy( segDir.clone().multiplyScalar( s1 ).add( segCenter ) );

		}

		return sqrDist;

	},

	isIntersectionSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) <= sphere.radius;

	},

	intersectSphere: function () {

		// from http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-sphere-intersection/

		var v1 = new THREE.Vector3();

		return function ( sphere, optionalTarget ) {

			v1.subVectors( sphere.center, this.origin );

			var tca = v1.dot( this.direction );

			var d2 = v1.dot( v1 ) - tca * tca;

			var radius2 = sphere.radius * sphere.radius;

			if ( d2 > radius2 ) return null;

			var thc = Math.sqrt( radius2 - d2 );

			// t0 = first intersect point - entrance on front of sphere
			var t0 = tca - thc;

			// t1 = second intersect point - exit point on back of sphere
			var t1 = tca + thc;

			// test to see if both t0 and t1 are behind the ray - if so, return null
			if ( t0 < 0 && t1 < 0 ) return null;

			// test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.
			if ( t0 < 0 ) return this.at( t1, optionalTarget );

			// else t0 is in front of the ray, so return the first collision point scaled by t0 
			return this.at( t0, optionalTarget );

		}

	}(),

	isIntersectionPlane: function ( plane ) {

		// check if the ray lies on the plane first

		var distToPoint = plane.distanceToPoint( this.origin );

		if ( distToPoint === 0 ) {

			return true;

		}

		var denominator = plane.normal.dot( this.direction );

		if ( denominator * distToPoint < 0 ) {

			return true;

		}

		// ray origin is behind the plane (and is pointing behind it)

		return false;

	},

	distanceToPlane: function ( plane ) {

		var denominator = plane.normal.dot( this.direction );
		if ( denominator == 0 ) {

			// line is coplanar, return origin
			if ( plane.distanceToPoint( this.origin ) == 0 ) {

				return 0;

			}

			// Null is preferable to undefined since undefined means.... it is undefined

			return null;

		}

		var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

		// Return if the ray never intersects the plane

		return t >= 0 ? t :  null;

	},

	intersectPlane: function ( plane, optionalTarget ) {

		var t = this.distanceToPlane( plane );

		if ( t === null ) {

			return null;
		}

		return this.at( t, optionalTarget );

	},

	isIntersectionBox: function () {

		var v = new THREE.Vector3();

		return function ( box ) {

			return this.intersectBox( box, v ) !== null;

		};

	}(),

	intersectBox: function ( box , optionalTarget ) {

		// http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-box-intersection/

		var tmin,tmax,tymin,tymax,tzmin,tzmax;

		var invdirx = 1 / this.direction.x,
			invdiry = 1 / this.direction.y,
			invdirz = 1 / this.direction.z;

		var origin = this.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;
		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;
		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

		if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;
		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) return null;

		return this.at( tmin >= 0 ? tmin : tmax, optionalTarget );

	},

	intersectTriangle: function () {

		// Compute the offset origin, edges, and normal.
		var diff = new THREE.Vector3();
		var edge1 = new THREE.Vector3();
		var edge2 = new THREE.Vector3();
		var normal = new THREE.Vector3();

		return function ( a, b, c, backfaceCulling, optionalTarget ) {

			// from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

			edge1.subVectors( b, a );
			edge2.subVectors( c, a );
			normal.crossVectors( edge1, edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			var DdN = this.direction.dot( normal );
			var sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			diff.subVectors( this.origin, a );
			var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			var QdN = - sign * diff.dot( normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, optionalTarget );

		};

	}(),

	applyMatrix4: function ( matrix4 ) {

		this.direction.add( this.origin ).applyMatrix4( matrix4 );
		this.origin.applyMatrix4( matrix4 );
		this.direction.sub( this.origin );
		this.direction.normalize();

		return this;
	},

	equals: function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

	},

	clone: function () {

		return new THREE.Ray().copy( this );

	}

};

// File:src/math/Sphere.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Sphere = function ( center, radius ) {

	this.center = ( center !== undefined ) ? center : new THREE.Vector3();
	this.radius = ( radius !== undefined ) ? radius : 0;

};

THREE.Sphere.prototype = {

	constructor: THREE.Sphere,

	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;
	},

	setFromPoints: function () {

		var box = new THREE.Box3();

		return function ( points, optionalCenter )  {

			var center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				box.setFromPoints( points ).center( center );

			}

			var maxRadiusSq = 0;

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

 		};

	}(),

	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},

	empty: function () {

		return ( this.radius <= 0 );

	},

	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},

	clampPoint: function ( point, optionalTarget ) {

		var deltaLengthSq = this.center.distanceToSquared( point );

		var result = optionalTarget || new THREE.Vector3();
		result.copy( point );

		if ( deltaLengthSq > ( this.radius * this.radius ) ) {

			result.sub( this.center ).normalize();
			result.multiplyScalar( this.radius ).add( this.center );

		}

		return result;

	},

	getBoundingBox: function ( optionalTarget ) {

		var box = optionalTarget || new THREE.Box3();

		box.set( this.center, this.center );
		box.expandByScalar( this.radius );

		return box;

	},

	applyMatrix4: function ( matrix ) {

		this.center.applyMatrix4( matrix );
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;

	},

	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},

	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	},

	clone: function () {

		return new THREE.Sphere().copy( this );

	}

};

// File:src/math/Frustum.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://exocortex.com
 */

THREE.Frustum = function ( p0, p1, p2, p3, p4, p5 ) {

	this.planes = [

		( p0 !== undefined ) ? p0 : new THREE.Plane(),
		( p1 !== undefined ) ? p1 : new THREE.Plane(),
		( p2 !== undefined ) ? p2 : new THREE.Plane(),
		( p3 !== undefined ) ? p3 : new THREE.Plane(),
		( p4 !== undefined ) ? p4 : new THREE.Plane(),
		( p5 !== undefined ) ? p5 : new THREE.Plane()

	];

};

THREE.Frustum.prototype = {

	constructor: THREE.Frustum,

	set: function ( p0, p1, p2, p3, p4, p5 ) {

		var planes = this.planes;

		planes[ 0 ].copy( p0 );
		planes[ 1 ].copy( p1 );
		planes[ 2 ].copy( p2 );
		planes[ 3 ].copy( p3 );
		planes[ 4 ].copy( p4 );
		planes[ 5 ].copy( p5 );

		return this;

	},

	copy: function ( frustum ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			planes[ i ].copy( frustum.planes[ i ] );

		}

		return this;

	},

	setFromMatrix: function ( m ) {

		var planes = this.planes;
		var me = m.elements;
		var me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		var me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		var me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		var me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalize();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalize();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalize();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalize();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalize();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalize();

		return this;

	},

	intersectsObject: function () {

		var sphere = new THREE.Sphere();

		return function ( object ) {

			var geometry = object.geometry;

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( object.matrixWorld );

			return this.intersectsSphere( sphere );

		};

	}(),

	intersectsSphere: function ( sphere ) {

		var planes = this.planes;
		var center = sphere.center;
		var negRadius = - sphere.radius;

		for ( var i = 0; i < 6; i ++ ) {

			var distance = planes[ i ].distanceToPoint( center );

			if ( distance < negRadius ) {

				return false;

			}

		}

		return true;

	},

	intersectsBox: function () {

		var p1 = new THREE.Vector3(),
			p2 = new THREE.Vector3();

		return function ( box ) {

			var planes = this.planes;

			for ( var i = 0; i < 6 ; i ++ ) {

				var plane = planes[ i ];

				p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
				p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
				p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
				p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
				p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
				p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

				var d1 = plane.distanceToPoint( p1 );
				var d2 = plane.distanceToPoint( p2 );

				// if both outside plane, no intersection

				if ( d1 < 0 && d2 < 0 ) {

					return false;

				}
			}

			return true;
		};

	}(),


	containsPoint: function ( point ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			if ( planes[ i ].distanceToPoint( point ) < 0 ) {

				return false;

			}

		}

		return true;

	},

	clone: function () {

		return new THREE.Frustum().copy( this );

	}

};

// File:src/math/Plane.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Plane = function ( normal, constant ) {

	this.normal = ( normal !== undefined ) ? normal : new THREE.Vector3( 1, 0, 0 );
	this.constant = ( constant !== undefined ) ? constant : 0;

};

THREE.Plane.prototype = {

	constructor: THREE.Plane,

	set: function ( normal, constant ) {

		this.normal.copy( normal );
		this.constant = constant;

		return this;

	},

	setComponents: function ( x, y, z, w ) {

		this.normal.set( x, y, z );
		this.constant = w;

		return this;

	},

	setFromNormalAndCoplanarPoint: function ( normal, point ) {

		this.normal.copy( normal );
		this.constant = - point.dot( this.normal );	// must be this.normal, not normal, as this.normal is normalized

		return this;

	},

	setFromCoplanarPoints: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function ( a, b, c ) {

			var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

			// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

			this.setFromNormalAndCoplanarPoint( normal, a );

			return this;

		};

	}(),


	copy: function ( plane ) {

		this.normal.copy( plane.normal );
		this.constant = plane.constant;

		return this;

	},

	normalize: function () {

		// Note: will lead to a divide by zero if the plane is invalid.

		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar( inverseNormalLength );
		this.constant *= inverseNormalLength;

		return this;

	},

	negate: function () {

		this.constant *= - 1;
		this.normal.negate();

		return this;

	},

	distanceToPoint: function ( point ) {

		return this.normal.dot( point ) + this.constant;

	},

	distanceToSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) - sphere.radius;

	},

	projectPoint: function ( point, optionalTarget ) {

		return this.orthoPoint( point, optionalTarget ).sub( point ).negate();

	},

	orthoPoint: function ( point, optionalTarget ) {

		var perpendicularMagnitude = this.distanceToPoint( point );

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( perpendicularMagnitude );

	},

	isIntersectionLine: function ( line ) {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		var startSign = this.distanceToPoint( line.start );
		var endSign = this.distanceToPoint( line.end );

		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

	},

	intersectLine: function () {

		var v1 = new THREE.Vector3();

		return function ( line, optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			var direction = line.delta( v1 );

			var denominator = this.normal.dot( direction );

			if ( denominator == 0 ) {

				// line is coplanar, return origin
				if ( this.distanceToPoint( line.start ) == 0 ) {

					return result.copy( line.start );

				}

				// Unsure if this is the correct method to handle this case.
				return undefined;

			}

			var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

			if ( t < 0 || t > 1 ) {

				return undefined;

			}

			return result.copy( direction ).multiplyScalar( t ).add( line.start );

		};

	}(),


	coplanarPoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( - this.constant );

	},

	applyMatrix4: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();
		var m1 = new THREE.Matrix3();

		return function ( matrix, optionalNormalMatrix ) {

			// compute new normal based on theory here:
			// http://www.songho.ca/opengl/gl_normaltransform.html
			var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );
			var newNormal = v1.copy( this.normal ).applyMatrix3( normalMatrix );

			var newCoplanarPoint = this.coplanarPoint( v2 );
			newCoplanarPoint.applyMatrix4( matrix );

			this.setFromNormalAndCoplanarPoint( newNormal, newCoplanarPoint );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.constant = this.constant - offset.dot( this.normal );

		return this;

	},

	equals: function ( plane ) {

		return plane.normal.equals( this.normal ) && ( plane.constant == this.constant );

	},

	clone: function () {

		return new THREE.Plane().copy( this );

	}

};

// File:src/math/Math.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Math = {

	generateUUID: function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i == 8 || i == 13 || i == 18 || i == 23 ) {

					uuid[ i ] = '-';

				} else if ( i == 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i == 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}
			}

			return uuid.join( '' );

		};

	}(),

	// Clamp value to range <a, b>

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	// Clamp value to range <a, inf)

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * ( 3 - 2 * x );

	},

	smootherstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

	},

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function () {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return low + Math.floor( Math.random() * ( high - low + 1 ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + Math.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - Math.random() );

	},

	degToRad: function () {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	radToDeg: function () {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}(),

	isPowerOfTwo: function ( value ) {

		return ( value & ( value - 1 ) ) === 0 && value !== 0;

	}

};

// File:src/math/Spline.js

/**
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Spline = function ( points ) {

	this.points = points;

	var c = [], v3 = { x: 0, y: 0, z: 0 },
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	this.initFromArray = function ( a ) {

		this.points = [];

		for ( var i = 0; i < a.length; i ++ ) {

			this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

		}

	};

	this.getPoint = function ( k ) {

		point = ( this.points.length - 1 ) * k;
		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint  > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
		c[ 3 ] = intPoint  > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

		pa = this.points[ c[ 0 ] ];
		pb = this.points[ c[ 1 ] ];
		pc = this.points[ c[ 2 ] ];
		pd = this.points[ c[ 3 ] ];

		w2 = weight * weight;
		w3 = weight * w2;

		v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
		v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
		v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

		return v3;

	};

	this.getControlPointsArray = function () {

		var i, p, l = this.points.length,
			coords = [];

		for ( i = 0; i < l; i ++ ) {

			p = this.points[ i ];
			coords[ i ] = [ p.x, p.y, p.z ];

		}

		return coords;

	};

	// approximate length by summing linear segments

	this.getLength = function ( nSubDivisions ) {

		var i, index, nSamples, position,
			point = 0, intPoint = 0, oldIntPoint = 0,
			oldPosition = new THREE.Vector3(),
			tmpVec = new THREE.Vector3(),
			chunkLengths = [],
			totalLength = 0;

		// first point has 0 length

		chunkLengths[ 0 ] = 0;

		if ( ! nSubDivisions ) nSubDivisions = 100;

		nSamples = this.points.length * nSubDivisions;

		oldPosition.copy( this.points[ 0 ] );

		for ( i = 1; i < nSamples; i ++ ) {

			index = i / nSamples;

			position = this.getPoint( index );
			tmpVec.copy( position );

			totalLength += tmpVec.distanceTo( oldPosition );

			oldPosition.copy( position );

			point = ( this.points.length - 1 ) * index;
			intPoint = Math.floor( point );

			if ( intPoint != oldIntPoint ) {

				chunkLengths[ intPoint ] = totalLength;
				oldIntPoint = intPoint;

			}

		}

		// last point ends with total length

		chunkLengths[ chunkLengths.length ] = totalLength;

		return { chunks: chunkLengths, total: totalLength };

	};

	this.reparametrizeByArcLength = function ( samplingCoef ) {

		var i, j,
			index, indexCurrent, indexNext,
			linearDistance, realDistance,
			sampling, position,
			newpoints = [],
			tmpVec = new THREE.Vector3(),
			sl = this.getLength();

		newpoints.push( tmpVec.copy( this.points[ 0 ] ).clone() );

		for ( i = 1; i < this.points.length; i ++ ) {

			//tmpVec.copy( this.points[ i - 1 ] );
			//linearDistance = tmpVec.distanceTo( this.points[ i ] );

			realDistance = sl.chunks[ i ] - sl.chunks[ i - 1 ];

			sampling = Math.ceil( samplingCoef * realDistance / sl.total );

			indexCurrent = ( i - 1 ) / ( this.points.length - 1 );
			indexNext = i / ( this.points.length - 1 );

			for ( j = 1; j < sampling - 1; j ++ ) {

				index = indexCurrent + j * ( 1 / sampling ) * ( indexNext - indexCurrent );

				position = this.getPoint( index );
				newpoints.push( tmpVec.copy( position ).clone() );

			}

			newpoints.push( tmpVec.copy( this.points[ i ] ).clone() );

		}

		this.points = newpoints;

	};

	// Catmull-Rom

	function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

		var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	};

};

// File:src/math/Triangle.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Triangle = function ( a, b, c ) {

	this.a = ( a !== undefined ) ? a : new THREE.Vector3();
	this.b = ( b !== undefined ) ? b : new THREE.Vector3();
	this.c = ( c !== undefined ) ? c : new THREE.Vector3();

};

THREE.Triangle.normal = function () {

	var v0 = new THREE.Vector3();

	return function ( a, b, c, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		result.subVectors( c, b );
		v0.subVectors( a, b );
		result.cross( v0 );

		var resultLengthSq = result.lengthSq();
		if ( resultLengthSq > 0 ) {

			return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

		}

		return result.set( 0, 0, 0 );

	};

}();

// static/instance method to calculate barycoordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
THREE.Triangle.barycoordFromPoint = function () {

	var v0 = new THREE.Vector3();
	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( point, a, b, c, optionalTarget ) {

		v0.subVectors( c, a );
		v1.subVectors( b, a );
		v2.subVectors( point, a );

		var dot00 = v0.dot( v0 );
		var dot01 = v0.dot( v1 );
		var dot02 = v0.dot( v2 );
		var dot11 = v1.dot( v1 );
		var dot12 = v1.dot( v2 );

		var denom = ( dot00 * dot11 - dot01 * dot01 );

		var result = optionalTarget || new THREE.Vector3();

		// colinear or singular triangle
		if ( denom == 0 ) {
			// arbitrary location outside of triangle?
			// not sure if this is the best idea, maybe should be returning undefined
			return result.set( - 2, - 1, - 1 );
		}

		var invDenom = 1 / denom;
		var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		// barycoordinates must always sum to 1
		return result.set( 1 - u - v, v, u );

	};

}();

THREE.Triangle.containsPoint = function () {

	var v1 = new THREE.Vector3();

	return function ( point, a, b, c ) {

		var result = THREE.Triangle.barycoordFromPoint( point, a, b, c, v1 );

		return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

	};

}();

THREE.Triangle.prototype = {

	constructor: THREE.Triangle,

	set: function ( a, b, c ) {

		this.a.copy( a );
		this.b.copy( b );
		this.c.copy( c );

		return this;

	},

	setFromPointsAndIndices: function ( points, i0, i1, i2 ) {

		this.a.copy( points[ i0 ] );
		this.b.copy( points[ i1 ] );
		this.c.copy( points[ i2 ] );

		return this;

	},

	copy: function ( triangle ) {

		this.a.copy( triangle.a );
		this.b.copy( triangle.b );
		this.c.copy( triangle.c );

		return this;

	},

	area: function () {

		var v0 = new THREE.Vector3();
		var v1 = new THREE.Vector3();

		return function () {

			v0.subVectors( this.c, this.b );
			v1.subVectors( this.a, this.b );

			return v0.cross( v1 ).length() * 0.5;

		};

	}(),

	midpoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

	},

	normal: function ( optionalTarget ) {

		return THREE.Triangle.normal( this.a, this.b, this.c, optionalTarget );

	},

	plane: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Plane();

		return result.setFromCoplanarPoints( this.a, this.b, this.c );

	},

	barycoordFromPoint: function ( point, optionalTarget ) {

		return THREE.Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

	},

	containsPoint: function ( point ) {

		return THREE.Triangle.containsPoint( point, this.a, this.b, this.c );

	},

	equals: function ( triangle ) {

		return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

	},

	clone: function () {

		return new THREE.Triangle().copy( this );

	}

};

// File:src/core/Clock.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Clock = function ( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

};

THREE.Clock.prototype = {

	constructor: THREE.Clock,

	start: function () {

		this.startTime = self.performance !== undefined && self.performance.now !== undefined
					 ? self.performance.now()
					 : Date.now();

		this.oldTime = this.startTime;
		this.running = true;
	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getDelta: function () {

		var diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {

			var newTime = self.performance !== undefined && self.performance.now !== undefined
					 ? self.performance.now()
					 : Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

};

// File:src/core/EventDispatcher.js

/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

THREE.EventDispatcher = function () {}

THREE.EventDispatcher.prototype = {

	constructor: THREE.EventDispatcher,

	apply: function ( object ) {

		object.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
		object.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;

	},

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

};

// File:src/core/Raycaster.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://exocortex.com/
 * @author stephomi / http://stephaneginier.com/
 */

( function ( THREE ) {

	THREE.Raycaster = function ( origin, direction, near, far ) {

		this.ray = new THREE.Ray( origin, direction );
		// direction is assumed to be normalized (for accurate distance calculations)

		this.near = near || 0;
		this.far = far || Infinity;

		this.params = {
			Sprite: {},
			Mesh: {},
			PointCloud: { threshold: 1 },
			LOD: {},
			Line: {}
		};

	};

	var descSort = function ( a, b ) {

		return a.distance - b.distance;

	};

	var intersectObject = function ( object, raycaster, intersects, recursive ) {

		object.raycast( raycaster, intersects );

		if ( recursive === true ) {

			var children = object.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				intersectObject( children[ i ], raycaster, intersects, true );

			}

		}

	};

	//

	THREE.Raycaster.prototype = {

		constructor: THREE.Raycaster,

		precision: 0.0001,
		linePrecision: 1,

		set: function ( origin, direction ) {

			this.ray.set( origin, direction );
			// direction is assumed to be normalized (for accurate distance calculations)

		},

		intersectObject: function ( object, recursive ) {

			var intersects = [];

			intersectObject( object, this, intersects, recursive );

			intersects.sort( descSort );

			return intersects;

		},

		intersectObjects: function ( objects, recursive ) {

			var intersects = [];

			if ( objects instanceof Array === false ) {

				console.log( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
				return intersects;

			}

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				intersectObject( objects[ i ], this, intersects, recursive );

			}

			intersects.sort( descSort );

			return intersects;

		}

	};

}( THREE ) );

// File:src/core/Object3D.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Object3D = function () {

	Object.defineProperty( this, 'id', { value: THREE.Object3DIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Object3D';

	this.parent = undefined;
	this.children = [];

	this.up = THREE.Object3D.DefaultUp.clone();

	var scope = this;

	var position = new THREE.Vector3();
	var rotation = new THREE.Euler();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3( 1, 1, 1 );

	var onRotationChange = function () {
		quaternion.setFromEuler( rotation, false );
	};

	var onQuaternionChange = function () {
		rotation.setFromQuaternion( quaternion, undefined, false );
	};

	rotation.onChange( onRotationChange );
	quaternion.onChange( onQuaternionChange );

	Object.defineProperties( this, {
		position: {
			enumerable: true,
			value: position
		},
		rotation: {
			enumerable: true,
			value: rotation
		},
		quaternion: {
			enumerable: true,
			value: quaternion
		},
		scale: {
			enumerable: true,
			value: scale
		},
	} );

	this.renderDepth = null;

	this.rotationAutoUpdate = true;

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = false;

	this.visible = true;

	this.castShadow = false;
	this.receiveShadow = false;

	this.frustumCulled = true;

	this.userData = {};

};

THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );

THREE.Object3D.prototype = {

	constructor: THREE.Object3D,

	get eulerOrder () {

		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );

		return this.rotation.order;

	},

	set eulerOrder ( value ) {

		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );

		this.rotation.order = value;

	},

	get useQuaternion () {

		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	set useQuaternion ( value ) {

		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	applyMatrix: function ( matrix ) {

		this.matrix.multiplyMatrices( matrix, this.matrix );

		this.matrix.decompose( this.position, this.quaternion, this.scale );

	},

	setRotationFromAxisAngle: function ( axis, angle ) {

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle( axis, angle );

	},

	setRotationFromEuler: function ( euler ) {

		this.quaternion.setFromEuler( euler, true );

	},

	setRotationFromMatrix: function ( m ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix( m );

	},

	setRotationFromQuaternion: function ( q ) {

		// assumes q is normalized

		this.quaternion.copy( q );

	},

	rotateOnAxis: function () {

		// rotate object on axis in object space
		// axis is assumed to be normalized

		var q1 = new THREE.Quaternion();

		return function ( axis, angle ) {

			q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( q1 );

			return this;

		}

	}(),

	rotateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	translateOnAxis: function () {

		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		var v1 = new THREE.Vector3();

		return function ( axis, distance ) {

			v1.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( v1.multiplyScalar( distance ) );

			return this;

		}

	}(),

	translate: function ( distance, axis ) {

		console.warn( 'THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.' );
		return this.translateOnAxis( axis, distance );

	},

	translateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	localToWorld: function ( vector ) {

		return vector.applyMatrix4( this.matrixWorld );

	},

	worldToLocal: function () {

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

		};

	}(),

	lookAt: function () {

		// This routine does not support objects with rotated and/or translated parent(s)

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			m1.lookAt( vector, this.position, this.up );

			this.quaternion.setFromRotationMatrix( m1 );

		};

	}(),

	add: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i++ ) {

				this.add( arguments[ i ] );

			}

			return this;

		};

		if ( object === this ) {

			console.error( "THREE.Object3D.add:", object, "can't be added as a child of itself." );
			return this;

		}

		if ( object instanceof THREE.Object3D ) {

			if ( object.parent !== undefined ) {

				object.parent.remove( object );

			}

			object.parent = this;
			object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

		} else {

			console.error( "THREE.Object3D.add:", object, "is not an instance of THREE.Object3D." );

		}

		return this;

	},

	remove: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i++ ) {

				this.remove( arguments[ i ] );

			}

		};

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = undefined;

			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

		}

	},

	getChildByName: function ( name, recursive ) {

		console.warn( 'THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().' );
		return this.getObjectByName( name, recursive );

	},

	getObjectById: function ( id, recursive ) {

		if ( this.id === id ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectById( id, recursive );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	getObjectByName: function ( name, recursive ) {

		if ( this.name === name ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectByName( name, recursive );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	getWorldPosition: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.updateMatrixWorld( true );

		return result.setFromMatrixPosition( this.matrixWorld );

	},

	getWorldQuaternion: function () {

		var position = new THREE.Vector3();
		var scale = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Quaternion();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, result, scale );

			return result;

		}

	}(),

	getWorldRotation: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Euler();

			this.getWorldQuaternion( quaternion );

			return result.setFromQuaternion( quaternion, this.rotation.order, false );

		}

	}(),

	getWorldScale: function () {

		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, quaternion, result );

			return result;

		}

	}(),

	getWorldDirection: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.getWorldQuaternion( quaternion );

			return result.set( 0, 0, 1 ).applyQuaternion( quaternion );

		}

	}(),

	raycast: function () {},

	traverse: function ( callback ) {

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].traverse( callback );

		}

	},

	traverseVisible: function ( callback ) {

		if ( this.visible === false ) return;

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].traverseVisible( callback );

		}

	},

	updateMatrix: function () {

		this.matrix.compose( this.position, this.quaternion, this.scale );

		this.matrixWorldNeedsUpdate = true;

	},

	updateMatrixWorld: function ( force ) {

		if ( this.matrixAutoUpdate === true ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate === true || force === true ) {

			if ( this.parent === undefined ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.3,
				type: 'Object',
				generator: 'ObjectExporter'
			}
		};

		//

		var geometries = {};

		var parseGeometry = function ( geometry ) {

			if ( output.geometries === undefined ) {

				output.geometries = [];

			}

			if ( geometries[ geometry.uuid ] === undefined ) {

				var json = geometry.toJSON();

				delete json.metadata;

				geometries[ geometry.uuid ] = json;

				output.geometries.push( json );

			}

			return geometry.uuid;

		};

		//

		var materials = {};

		var parseMaterial = function ( material ) {

			if ( output.materials === undefined ) {

				output.materials = [];

			}

			if ( materials[ material.uuid ] === undefined ) {

				var json = material.toJSON();

				delete json.metadata;

				materials[ material.uuid ] = json;

				output.materials.push( json );

			}

			return material.uuid;

		};

		//

		var parseObject = function ( object ) {

			var data = {};

			data.uuid = object.uuid;
			data.type = object.type;

			if ( object.name !== '' ) data.name = object.name;
			if ( JSON.stringify( object.userData ) !== '{}' ) data.userData = object.userData;
			if ( object.visible !== true ) data.visible = object.visible;

			if ( object instanceof THREE.PerspectiveCamera ) {

				data.fov = object.fov;
				data.aspect = object.aspect;
				data.near = object.near;
				data.far = object.far;

			} else if ( object instanceof THREE.OrthographicCamera ) {

				data.left = object.left;
				data.right = object.right;
				data.top = object.top;
				data.bottom = object.bottom;
				data.near = object.near;
				data.far = object.far;

			} else if ( object instanceof THREE.AmbientLight ) {

				data.color = object.color.getHex();

			} else if ( object instanceof THREE.DirectionalLight ) {

				data.color = object.color.getHex();
				data.intensity = object.intensity;

			} else if ( object instanceof THREE.PointLight ) {

				data.color = object.color.getHex();
				data.intensity = object.intensity;
				data.distance = object.distance;

			} else if ( object instanceof THREE.SpotLight ) {

				data.color = object.color.getHex();
				data.intensity = object.intensity;
				data.distance = object.distance;
				data.angle = object.angle;
				data.exponent = object.exponent;

			} else if ( object instanceof THREE.HemisphereLight ) {

				data.color = object.color.getHex();
				data.groundColor = object.groundColor.getHex();

			} else if ( object instanceof THREE.Mesh ) {

				data.geometry = parseGeometry( object.geometry );
				data.material = parseMaterial( object.material );

			} else if ( object instanceof THREE.Line ) {

				data.geometry = parseGeometry( object.geometry );
				data.material = parseMaterial( object.material );

			} else if ( object instanceof THREE.Sprite ) {

				data.material = parseMaterial( object.material );

			}

			data.matrix = object.matrix.toArray();

			if ( object.children.length > 0 ) {

				data.children = [];

				for ( var i = 0; i < object.children.length; i ++ ) {

					data.children.push( parseObject( object.children[ i ] ) );

				}

			}

			return data;

		}

		output.object = parseObject( this );

		return output;

	},

	clone: function ( object, recursive ) {

		if ( object === undefined ) object = new THREE.Object3D();
		if ( recursive === undefined ) recursive = true;

		object.name = this.name;

		object.up.copy( this.up );

		object.position.copy( this.position );
		object.quaternion.copy( this.quaternion );
		object.scale.copy( this.scale );

		object.renderDepth = this.renderDepth;

		object.rotationAutoUpdate = this.rotationAutoUpdate;

		object.matrix.copy( this.matrix );
		object.matrixWorld.copy( this.matrixWorld );

		object.matrixAutoUpdate = this.matrixAutoUpdate;
		object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;

		object.visible = this.visible;

		object.castShadow = this.castShadow;
		object.receiveShadow = this.receiveShadow;

		object.frustumCulled = this.frustumCulled;

		object.userData = JSON.parse( JSON.stringify( this.userData ) );

		if ( recursive === true ) {

			for ( var i = 0; i < this.children.length; i ++ ) {

				var child = this.children[ i ];
				object.add( child.clone() );

			}

		}

		return object;

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Object3D.prototype );

THREE.Object3DIdCount = 0;

// File:src/core/Projector.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Projector = function () {

	console.warn( 'THREE.Projector has been moved to /examples/renderers/Projector.js.' );

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() has been removed.' );

	};

};

// File:src/core/Face3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

};

THREE.Face3.prototype = {

	constructor: THREE.Face3,

	clone: function () {

		var face = new THREE.Face3( this.a, this.b, this.c );

		face.normal.copy( this.normal );
		face.color.copy( this.color );

		face.materialIndex = this.materialIndex;

		for ( var i = 0, il = this.vertexNormals.length; i < il; i ++ ) {

			face.vertexNormals[ i ] = this.vertexNormals[ i ].clone();

		}

		for ( var i = 0, il = this.vertexColors.length; i < il; i ++ ) {

			face.vertexColors[ i ] = this.vertexColors[ i ].clone();

		}

		for ( var i = 0, il = this.vertexTangents.length; i < il; i ++ ) {

			face.vertexTangents[ i ] = this.vertexTangents[ i ].clone();

		}

		return face;

	}

};

// File:src/core/Face4.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Face4 = function ( a, b, c, d, normal, color, materialIndex ) {

	console.warn( 'THREE.Face4 has been removed. A THREE.Face3 will be created instead.' )
	return new THREE.Face3( a, b, c, normal, color, materialIndex );

};

// File:src/core/BufferAttribute.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferAttribute = function ( array, itemSize ) {

	this.array = array;
	this.itemSize = itemSize;

	this.needsUpdate = false;

};

THREE.BufferAttribute.prototype = {

	constructor: THREE.BufferAttribute,

	get length () {

		return this.array.length;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

	},

	set: function ( value ) {

		this.array.set( value );

		return this;

	},

	setX: function ( index, x ) {

		this.array[ index * this.itemSize ] = x;

		return this;

	},

	setY: function ( index, y ) {

		this.array[ index * this.itemSize + 1 ] = y;

		return this;

	},

	setZ: function ( index, z ) {

		this.array[ index * this.itemSize + 2 ] = z;

		return this;

	},

	setXY: function ( index, x, y ) {

		index *= this.itemSize;

		this.array[ index     ] = x;
		this.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index *= this.itemSize;

		this.array[ index     ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index *= this.itemSize;

		this.array[ index     ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;

	},

	clone: function () {

		return new THREE.BufferAttribute( new this.array.constructor( this.array ), this.itemSize );

	}

};

//

THREE.Int8Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Int8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint8Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint8Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint8ClampedAttribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint8ClampedAttribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );


};

THREE.Int16Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Int16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint16Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint16Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Int32Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Int32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Uint32Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Uint32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Float32Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Float32Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

THREE.Float64Attribute = function ( data, itemSize ) {

	console.warn( 'THREE.Float64Attribute has been removed. Use THREE.BufferAttribute( array, itemSize ) instead.' );
	return new THREE.BufferAttribute( data, itemSize );

};

// File:src/core/BufferGeometry.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'BufferGeometry';

	this.attributes = {};
	this.attributesKeys = [];

	this.drawcalls = [];
	this.offsets = this.drawcalls; // backwards compatibility

	this.boundingBox = null;
	this.boundingSphere = null;

};

THREE.BufferGeometry.prototype = {

	constructor: THREE.BufferGeometry,

	addAttribute: function ( name, attribute ) {

		if ( attribute instanceof THREE.BufferAttribute === false ) {

			console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

			this.attributes[ name ] = { array: arguments[ 1 ], itemSize: arguments[ 2 ] };

			return;

		}

		this.attributes[ name ] = attribute;
		this.attributesKeys = Object.keys( this.attributes );

	},

	getAttribute: function ( name ) {

		return this.attributes[ name ];

	},

	addDrawCall: function ( start, count, indexOffset ) {

		this.drawcalls.push( {

			start: start,
			count: count,
			index: indexOffset !== undefined ? indexOffset : 0

		} );

	},

	applyMatrix: function ( matrix ) {

		var position = this.attributes.position;

		if ( position !== undefined ) {

			matrix.applyToVector3Array( position.array );
			position.needsUpdate = true;

		}

		var normal = this.attributes.normal;

		if ( normal !== undefined ) {

			var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

			normalMatrix.applyToVector3Array( normal.array );
			normal.needsUpdate = true;

		}

	},

	center: function () {

		// TODO

	},

	fromGeometry: function ( geometry, settings ) {

		settings = settings || { 'vertexColors': THREE.NoColors };

		var vertices = geometry.vertices;
		var faces = geometry.faces;
		var faceVertexUvs = geometry.faceVertexUvs;
		var vertexColors = settings.vertexColors;
		var hasFaceVertexUv = faceVertexUvs[ 0 ].length > 0;
		var hasFaceVertexNormals = faces[ 0 ].vertexNormals.length == 3;

		var positions = new Float32Array( faces.length * 3 * 3 );
		this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		var normals = new Float32Array( faces.length * 3 * 3 );
		this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		if ( vertexColors !== THREE.NoColors ) {

			var colors = new Float32Array( faces.length * 3 * 3 );
			this.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		}

		if ( hasFaceVertexUv === true ) {

			var uvs = new Float32Array( faces.length * 3 * 2 );
			this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

		}

		for ( var i = 0, i2 = 0, i3 = 0; i < faces.length; i ++, i2 += 6, i3 += 9 ) {

			var face = faces[ i ];

			var a = vertices[ face.a ];
			var b = vertices[ face.b ];
			var c = vertices[ face.c ];

			positions[ i3     ] = a.x;
			positions[ i3 + 1 ] = a.y;
			positions[ i3 + 2 ] = a.z;

			positions[ i3 + 3 ] = b.x;
			positions[ i3 + 4 ] = b.y;
			positions[ i3 + 5 ] = b.z;

			positions[ i3 + 6 ] = c.x;
			positions[ i3 + 7 ] = c.y;
			positions[ i3 + 8 ] = c.z;

			if ( hasFaceVertexNormals === true ) {

				var na = face.vertexNormals[ 0 ];
				var nb = face.vertexNormals[ 1 ];
				var nc = face.vertexNormals[ 2 ];

				normals[ i3     ] = na.x;
				normals[ i3 + 1 ] = na.y;
				normals[ i3 + 2 ] = na.z;

				normals[ i3 + 3 ] = nb.x;
				normals[ i3 + 4 ] = nb.y;
				normals[ i3 + 5 ] = nb.z;

				normals[ i3 + 6 ] = nc.x;
				normals[ i3 + 7 ] = nc.y;
				normals[ i3 + 8 ] = nc.z;

			} else {

				var n = face.normal;

				normals[ i3     ] = n.x;
				normals[ i3 + 1 ] = n.y;
				normals[ i3 + 2 ] = n.z;

				normals[ i3 + 3 ] = n.x;
				normals[ i3 + 4 ] = n.y;
				normals[ i3 + 5 ] = n.z;

				normals[ i3 + 6 ] = n.x;
				normals[ i3 + 7 ] = n.y;
				normals[ i3 + 8 ] = n.z;

			}

			if ( vertexColors === THREE.FaceColors ) {

				var fc = face.color;

				colors[ i3     ] = fc.r;
				colors[ i3 + 1 ] = fc.g;
				colors[ i3 + 2 ] = fc.b;

				colors[ i3 + 3 ] = fc.r;
				colors[ i3 + 4 ] = fc.g;
				colors[ i3 + 5 ] = fc.b;

				colors[ i3 + 6 ] = fc.r;
				colors[ i3 + 7 ] = fc.g;
				colors[ i3 + 8 ] = fc.b;

			} else if ( vertexColors === THREE.VertexColors ) {

				var vca = face.vertexColors[ 0 ];
				var vcb = face.vertexColors[ 1 ];
				var vcc = face.vertexColors[ 2 ];

				colors[ i3     ] = vca.r;
				colors[ i3 + 1 ] = vca.g;
				colors[ i3 + 2 ] = vca.b;

				colors[ i3 + 3 ] = vcb.r;
				colors[ i3 + 4 ] = vcb.g;
				colors[ i3 + 5 ] = vcb.b;

				colors[ i3 + 6 ] = vcc.r;
				colors[ i3 + 7 ] = vcc.g;
				colors[ i3 + 8 ] = vcc.b;

			}

			if ( hasFaceVertexUv === true ) {

				var uva = faceVertexUvs[ 0 ][ i ][ 0 ];
				var uvb = faceVertexUvs[ 0 ][ i ][ 1 ];
				var uvc = faceVertexUvs[ 0 ][ i ][ 2 ];

				uvs[ i2     ] = uva.x;
				uvs[ i2 + 1 ] = uva.y;

				uvs[ i2 + 2 ] = uvb.x;
				uvs[ i2 + 3 ] = uvb.y;

				uvs[ i2 + 4 ] = uvc.x;
				uvs[ i2 + 5 ] = uvc.y;

			}

		}

		this.computeBoundingSphere()

		return this;

	},

	computeBoundingBox: function () {

		var vector = new THREE.Vector3();

		return function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new THREE.Box3();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				var bb = this.boundingBox;
				bb.makeEmpty();

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );
					bb.expandByPoint( vector );

				}

			}

			if ( positions === undefined || positions.length === 0 ) {

				this.boundingBox.min.set( 0, 0, 0 );
				this.boundingBox.max.set( 0, 0, 0 );

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.' );

			}

		}

	}(),

	computeBoundingSphere: function () {

		var box = new THREE.Box3();
		var vector = new THREE.Vector3();

		return function () {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new THREE.Sphere();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				box.makeEmpty();

				var center = this.boundingSphere.center;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );
					box.expandByPoint( vector );

				}

				box.center( center );

				// hoping to find a boundingSphere with a radius smaller than the
				// boundingSphere of the boundingBox:  sqrt(3) smaller in the best case

				var maxRadiusSq = 0;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );
					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.' );

				}

			}

		}

	}(),

	computeFaceNormals: function () {

		// backwards compatibility

	},

	computeVertexNormals: function () {

		var attributes = this.attributes;

		if ( attributes.position ) {

			var positions = attributes.position.array;

			if ( attributes.normal === undefined ) {

				this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( positions.length ), 3 ) );

			} else {

				// reset existing normals to zero

				var normals = attributes.normal.array;

				for ( var i = 0, il = normals.length; i < il; i ++ ) {

					normals[ i ] = 0;

				}

			}

			var normals = attributes.normal.array;

			var vA, vB, vC,

			pA = new THREE.Vector3(),
			pB = new THREE.Vector3(),
			pC = new THREE.Vector3(),

			cb = new THREE.Vector3(),
			ab = new THREE.Vector3();

			// indexed elements

			if ( attributes.index ) {

				var indices = attributes.index.array;

				var offsets = ( this.offsets.length > 0 ? this.offsets : [ { start: 0, count: indices.length, index: 0 } ] );

				for ( var j = 0, jl = offsets.length; j < jl; ++ j ) {

					var start = offsets[ j ].start;
					var count = offsets[ j ].count;
					var index = offsets[ j ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						vA = ( index + indices[ i     ] ) * 3;
						vB = ( index + indices[ i + 1 ] ) * 3;
						vC = ( index + indices[ i + 2 ] ) * 3;

						pA.fromArray( positions, vA );
						pB.fromArray( positions, vB );
						pC.fromArray( positions, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ vA     ] += cb.x;
						normals[ vA + 1 ] += cb.y;
						normals[ vA + 2 ] += cb.z;

						normals[ vB     ] += cb.x;
						normals[ vB + 1 ] += cb.y;
						normals[ vB + 2 ] += cb.z;

						normals[ vC     ] += cb.x;
						normals[ vC + 1 ] += cb.y;
						normals[ vC + 2 ] += cb.z;

					}

				}

			} else {

				// non-indexed elements (unconnected triangle soup)

				for ( var i = 0, il = positions.length; i < il; i += 9 ) {

					pA.fromArray( positions, i );
					pB.fromArray( positions, i + 3 );
					pC.fromArray( positions, i + 6 );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					normals[ i     ] = cb.x;
					normals[ i + 1 ] = cb.y;
					normals[ i + 2 ] = cb.z;

					normals[ i + 3 ] = cb.x;
					normals[ i + 4 ] = cb.y;
					normals[ i + 5 ] = cb.z;

					normals[ i + 6 ] = cb.x;
					normals[ i + 7 ] = cb.y;
					normals[ i + 8 ] = cb.z;

				}

			}

			this.normalizeNormals();

			attributes.normal.needsUpdate = true;

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if ( this.attributes.index === undefined ||
			 this.attributes.position === undefined ||
			 this.attributes.normal === undefined ||
			 this.attributes.uv === undefined ) {

			console.warn( 'Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()' );
			return;

		}

		var indices = this.attributes.index.array;
		var positions = this.attributes.position.array;
		var normals = this.attributes.normal.array;
		var uvs = this.attributes.uv.array;

		var nVertices = positions.length / 3;

		if ( this.attributes.tangent === undefined ) {

			this.addAttribute( 'tangent', new THREE.BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

		}

		var tangents = this.attributes.tangent.array;

		var tan1 = [], tan2 = [];

		for ( var k = 0; k < nVertices; k ++ ) {

			tan1[ k ] = new THREE.Vector3();
			tan2[ k ] = new THREE.Vector3();

		}

		var vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3(),

			uvA = new THREE.Vector2(),
			uvB = new THREE.Vector2(),
			uvC = new THREE.Vector2(),

			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r;

		var sdir = new THREE.Vector3(), tdir = new THREE.Vector3();

		function handleTriangle( a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			uvA.fromArray( uvs, a * 2 );
			uvB.fromArray( uvs, b * 2 );
			uvC.fromArray( uvs, c * 2 );

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;

			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;

			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.x - uvA.x;
			s2 = uvC.x - uvA.x;

			t1 = uvB.y - uvA.y;
			t2 = uvC.y - uvA.y;

			r = 1.0 / ( s1 * t2 - s2 * t1 );

			sdir.set(
				( t2 * x1 - t1 * x2 ) * r,
				( t2 * y1 - t1 * y2 ) * r,
				( t2 * z1 - t1 * z2 ) * r
			);

			tdir.set(
				( s1 * x2 - s2 * x1 ) * r,
				( s1 * y2 - s2 * y1 ) * r,
				( s1 * z2 - s2 * z1 ) * r
			);

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		var i, il;
		var j, jl;
		var iA, iB, iC;

		if ( this.drawcalls.length === 0 ) {

			this.addDrawCall( 0, indices.length, 0 );

		}

		var drawcalls = this.drawcalls;

		for ( j = 0, jl = drawcalls.length; j < jl; ++ j ) {

			var start = drawcalls[ j ].start;
			var count = drawcalls[ j ].count;
			var index = drawcalls[ j ].index;

			for ( i = start, il = start + count; i < il; i += 3 ) {

				iA = index + indices[ i ];
				iB = index + indices[ i + 1 ];
				iC = index + indices[ i + 2 ];

				handleTriangle( iA, iB, iC );

			}

		}

		var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
		var n = new THREE.Vector3(), n2 = new THREE.Vector3();
		var w, t, test;

		function handleVertex( v ) {

			n.fromArray( normals, v * 3 );
			n2.copy( n );

			t = tan1[ v ];

			// Gram-Schmidt orthogonalize

			tmp.copy( t );
			tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

			// Calculate handedness

			tmp2.crossVectors( n2, t );
			test = tmp2.dot( tan2[ v ] );
			w = ( test < 0.0 ) ? - 1.0 : 1.0;

			tangents[ v * 4     ] = tmp.x;
			tangents[ v * 4 + 1 ] = tmp.y;
			tangents[ v * 4 + 2 ] = tmp.z;
			tangents[ v * 4 + 3 ] = w;

		}

		for ( j = 0, jl = drawcalls.length; j < jl; ++ j ) {

			var start = drawcalls[ j ].start;
			var count = drawcalls[ j ].count;
			var index = drawcalls[ j ].index;

			for ( i = start, il = start + count; i < il; i += 3 ) {

				iA = index + indices[ i ];
				iB = index + indices[ i + 1 ];
				iC = index + indices[ i + 2 ];

				handleVertex( iA );
				handleVertex( iB );
				handleVertex( iC );

			}

		}

	},

	/*
		computeOffsets
		Compute the draw offset for large models by chunking the index buffer into chunks of 65k addressable vertices.
		This method will effectively rewrite the index buffer and remap all attributes to match the new indices.
		WARNING: This method will also expand the vertex count to prevent sprawled triangles across draw offsets.
		indexBufferSize - Defaults to 65535, but allows for larger or smaller chunks.
	*/
	computeOffsets: function ( indexBufferSize ) {

		var size = indexBufferSize;
		if ( indexBufferSize === undefined )
			size = 65535; //WebGL limits type of index buffer values to 16-bit.

		var s = Date.now();

		var indices = this.attributes.index.array;
		var vertices = this.attributes.position.array;

		var verticesCount = ( vertices.length / 3 );
		var facesCount = ( indices.length / 3 );

		/*
		console.log("Computing buffers in offsets of "+size+" -> indices:"+indices.length+" vertices:"+vertices.length);
		console.log("Faces to process: "+(indices.length/3));
		console.log("Reordering "+verticesCount+" vertices.");
		*/

		var sortedIndices = new Uint16Array( indices.length ); //16-bit buffers
		var indexPtr = 0;
		var vertexPtr = 0;

		var offsets = [ { start:0, count:0, index:0 } ];
		var offset = offsets[ 0 ];

		var duplicatedVertices = 0;
		var newVerticeMaps = 0;
		var faceVertices = new Int32Array( 6 );
		var vertexMap = new Int32Array( vertices.length );
		var revVertexMap = new Int32Array( vertices.length );
		for ( var j = 0; j < vertices.length; j ++ ) { vertexMap[ j ] = - 1; revVertexMap[ j ] = - 1; }

		/*
			Traverse every face and reorder vertices in the proper offsets of 65k.
			We can have more than 65k entries in the index buffer per offset, but only reference 65k values.
		*/
		for ( var findex = 0; findex < facesCount; findex ++ ) {
			newVerticeMaps = 0;

			for ( var vo = 0; vo < 3; vo ++ ) {
				var vid = indices[ findex * 3 + vo ];
				if ( vertexMap[ vid ] == - 1 ) {
					//Unmapped vertice
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = - 1;
					newVerticeMaps ++;
				} else if ( vertexMap[ vid ] < offset.index ) {
					//Reused vertices from previous block (duplicate)
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = - 1;
					duplicatedVertices ++;
				} else {
					//Reused vertice in the current block
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = vertexMap[ vid ];
				}
			}

			var faceMax = vertexPtr + newVerticeMaps;
			if ( faceMax > ( offset.index + size ) ) {
				var new_offset = { start:indexPtr, count:0, index:vertexPtr };
				offsets.push( new_offset );
				offset = new_offset;

				//Re-evaluate reused vertices in light of new offset.
				for ( var v = 0; v < 6; v += 2 ) {
					var new_vid = faceVertices[ v + 1 ];
					if ( new_vid > - 1 && new_vid < offset.index )
						faceVertices[ v + 1 ] = - 1;
				}
			}

			//Reindex the face.
			for ( var v = 0; v < 6; v += 2 ) {
				var vid = faceVertices[ v ];
				var new_vid = faceVertices[ v + 1 ];

				if ( new_vid === - 1 )
					new_vid = vertexPtr ++;

				vertexMap[ vid ] = new_vid;
				revVertexMap[ new_vid ] = vid;
				sortedIndices[ indexPtr ++ ] = new_vid - offset.index; //XXX overflows at 16bit
				offset.count ++;
			}
		}

		/* Move all attribute values to map to the new computed indices , also expand the vertice stack to match our new vertexPtr. */
		this.reorderBuffers( sortedIndices, revVertexMap, vertexPtr );
		this.offsets = offsets;

		/*
		var orderTime = Date.now();
		console.log("Reorder time: "+(orderTime-s)+"ms");
		console.log("Duplicated "+duplicatedVertices+" vertices.");
		console.log("Compute Buffers time: "+(Date.now()-s)+"ms");
		console.log("Draw offsets: "+offsets.length);
		*/

		return offsets;
	},

	merge: function () {

		console.log( 'BufferGeometry.merge(): TODO' );

	},

	normalizeNormals: function () {

		var normals = this.attributes.normal.array;

		var x, y, z, n;

		for ( var i = 0, il = normals.length; i < il; i += 3 ) {

			x = normals[ i ];
			y = normals[ i + 1 ];
			z = normals[ i + 2 ];

			n = 1.0 / Math.sqrt( x * x + y * y + z * z );

			normals[ i     ] *= n;
			normals[ i + 1 ] *= n;
			normals[ i + 2 ] *= n;

		}

	},

	/*
		reoderBuffers:
		Reorder attributes based on a new indexBuffer and indexMap.
		indexBuffer - Uint16Array of the new ordered indices.
		indexMap - Int32Array where the position is the new vertex ID and the value the old vertex ID for each vertex.
		vertexCount - Amount of total vertices considered in this reordering (in case you want to grow the vertice stack).
	*/
	reorderBuffers: function ( indexBuffer, indexMap, vertexCount ) {

		/* Create a copy of all attributes for reordering. */
		var sortedAttributes = {};
		for ( var attr in this.attributes ) {
			if ( attr == 'index' )
				continue;
			var sourceArray = this.attributes[ attr ].array;
			sortedAttributes[ attr ] = new sourceArray.constructor( this.attributes[ attr ].itemSize * vertexCount );
		}

		/* Move attribute positions based on the new index map */
		for ( var new_vid = 0; new_vid < vertexCount; new_vid ++ ) {
			var vid = indexMap[ new_vid ];
			for ( var attr in this.attributes ) {
				if ( attr == 'index' )
					continue;
				var attrArray = this.attributes[ attr ].array;
				var attrSize = this.attributes[ attr ].itemSize;
				var sortedAttr = sortedAttributes[ attr ];
				for ( var k = 0; k < attrSize; k ++ )
					sortedAttr[ new_vid * attrSize + k ] = attrArray[ vid * attrSize + k ];
			}
		}

		/* Carry the new sorted buffers locally */
		this.attributes[ 'index' ].array = indexBuffer;
		for ( var attr in this.attributes ) {
			if ( attr == 'index' )
				continue;
			this.attributes[ attr ].array = sortedAttributes[ attr ];
			this.attributes[ attr ].numItems = this.attributes[ attr ].itemSize * vertexCount;
		}
	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.0,
				type: 'BufferGeometry',
				generator: 'BufferGeometryExporter'
			},
			uuid: this.uuid,
			type: this.type,
			data: {
				attributes: {}
			}
		};

		var attributes = this.attributes;
		var offsets = this.offsets;
		var boundingSphere = this.boundingSphere;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];

			var array = [], typeArray = attribute.array;

			for ( var i = 0, l = typeArray.length; i < l; i ++ ) {

				array[ i ] = typeArray[ i ];

			}

			output.data.attributes[ key ] = {
				itemSize: attribute.itemSize,
				type: attribute.array.constructor.name,
				array: array
			}

		}

		if ( offsets.length > 0 ) {

			output.data.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		if ( boundingSphere !== null ) {

			output.data.boundingSphere = {
				center: boundingSphere.center.toArray(),
				radius: boundingSphere.radius
			}

		}

		return output;

	},

	clone: function () {

		var geometry = new THREE.BufferGeometry();

		for ( var attr in this.attributes ) {

			var sourceAttr = this.attributes[ attr ];
			geometry.addAttribute( attr, sourceAttr.clone() );

		}

		for ( var i = 0, il = this.offsets.length; i < il; i ++ ) {

			var offset = this.offsets[ i ];

			geometry.offsets.push( {

				start: offset.start,
				index: offset.index,
				count: offset.count

			} );

		}

		return geometry;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.BufferGeometry.prototype );

// File:src/core/Geometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author bhouston / http://exocortex.com
 */

THREE.Geometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Geometry';

	this.vertices = [];
	this.colors = [];  // one-to-one vertex colors, used in Points and Line

	this.faces = [];

	this.faceVertexUvs = [ [] ];

	this.morphTargets = [];
	this.morphColors = [];
	this.morphNormals = [];

	this.skinWeights = [];
	this.skinIndices = [];

	this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	this.hasTangents = false;

	this.dynamic = true; // the intermediate typed arrays will be deleted when set to false

	// update flags

	this.verticesNeedUpdate = false;
	this.elementsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.tangentsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.lineDistancesNeedUpdate = false;

	this.groupsNeedUpdate = false;

};

THREE.Geometry.prototype = {

	constructor: THREE.Geometry,

	applyMatrix: function ( matrix ) {

		var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

			var vertex = this.vertices[ i ];
			vertex.applyMatrix4( matrix );

		}

		for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

			var face = this.faces[ i ];
			face.normal.applyMatrix3( normalMatrix ).normalize();

			for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

			}

		}

		if ( this.boundingBox instanceof THREE.Box3 ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere instanceof THREE.Sphere ) {

			this.computeBoundingSphere();

		}

	},

	fromBufferGeometry: function ( geometry ) {

		var scope = this;

		var attributes = geometry.attributes;

		var vertices = attributes.position.array;
		var indices = attributes.index !== undefined ? attributes.index.array : undefined;
		var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
		var colors = attributes.color !== undefined ? attributes.color.array : undefined;
		var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;

		var tempNormals = [];
		var tempUVs = [];

		for ( var i = 0, j = 0; i < vertices.length; i += 3, j += 2 ) {

			scope.vertices.push( new THREE.Vector3( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] ) );

			if ( normals !== undefined ) {

				tempNormals.push( new THREE.Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

			}

			if ( colors !== undefined ) {

				scope.colors.push( new THREE.Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

			}

			if ( uvs !== undefined ) {

				tempUVs.push( new THREE.Vector2( uvs[ j ], uvs[ j + 1 ] ) );

			}

		}

		var addFace = function ( a, b, c ) {

			var vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
			var vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

			scope.faces.push( new THREE.Face3( a, b, c, vertexNormals, vertexColors ) );
			scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ], tempUVs[ b ], tempUVs[ c ] ] );

		};

		if ( indices !== undefined ) {

			for ( var i = 0; i < indices.length; i += 3 ) {

				addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

			}

		} else {

			for ( var i = 0; i < vertices.length / 3; i += 3 ) {

				addFace( i, i + 1, i + 2 );

			}

		}
		
		this.computeFaceNormals();

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		return this;

	},

	center: function () {

		this.computeBoundingBox();

		var offset = new THREE.Vector3();

		offset.addVectors( this.boundingBox.min, this.boundingBox.max );
		offset.multiplyScalar( - 0.5 );

		this.applyMatrix( new THREE.Matrix4().makeTranslation( offset.x, offset.y, offset.z ) );
		this.computeBoundingBox();

		return offset;

	},

	computeFaceNormals: function () {

		var cb = new THREE.Vector3(), ab = new THREE.Vector3();

		for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

			var face = this.faces[ f ];

			var vA = this.vertices[ face.a ];
			var vB = this.vertices[ face.b ];
			var vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}

	},

	computeVertexNormals: function ( areaWeighted ) {

		var v, vl, f, fl, face, vertices;

		vertices = new Array( this.vertices.length );

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ] = new THREE.Vector3();

		}

		if ( areaWeighted ) {

			// vertex normals weighted by triangle areas
			// http://www.iquilezles.org/www/articles/normals/normals.htm

			var vA, vB, vC, vD;
			var cb = new THREE.Vector3(), ab = new THREE.Vector3(),
				db = new THREE.Vector3(), dc = new THREE.Vector3(), bc = new THREE.Vector3();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vA = this.vertices[ face.a ];
				vB = this.vertices[ face.b ];
				vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				vertices[ face.a ].add( cb );
				vertices[ face.b ].add( cb );
				vertices[ face.c ].add( cb );

			}

		} else {

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vertices[ face.a ].add( face.normal );
				vertices[ face.b ].add( face.normal );
				vertices[ face.c ].add( face.normal );

			}

		}

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.vertexNormals[ 0 ] = vertices[ face.a ].clone();
			face.vertexNormals[ 1 ] = vertices[ face.b ].clone();
			face.vertexNormals[ 2 ] = vertices[ face.c ].clone();

		}

	},

	computeMorphNormals: function () {

		var i, il, f, fl, face;

		// save original normals
		// - create temp variables on first access
		//   otherwise just copy (for faster repeated calls)

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( ! face.__originalFaceNormal ) {

				face.__originalFaceNormal = face.normal.clone();

			} else {

				face.__originalFaceNormal.copy( face.normal );

			}

			if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

			for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

				if ( ! face.__originalVertexNormals[ i ] ) {

					face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

				} else {

					face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

				}

			}

		}

		// use temp geometry to compute face and vertex normals for each morph

		var tmpGeo = new THREE.Geometry();
		tmpGeo.faces = this.faces;

		for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

			// create on first access

			if ( ! this.morphNormals[ i ] ) {

				this.morphNormals[ i ] = {};
				this.morphNormals[ i ].faceNormals = [];
				this.morphNormals[ i ].vertexNormals = [];

				var dstNormalsFace = this.morphNormals[ i ].faceNormals;
				var dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

				var faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					faceNormal = new THREE.Vector3();
					vertexNormals = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() };

					dstNormalsFace.push( faceNormal );
					dstNormalsVertex.push( vertexNormals );

				}

			}

			var morphNormals = this.morphNormals[ i ];

			// set vertices to morph target

			tmpGeo.vertices = this.morphTargets[ i ].vertices;

			// compute morph normals

			tmpGeo.computeFaceNormals();
			tmpGeo.computeVertexNormals();

			// store morph normals

			var faceNormal, vertexNormals;

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				faceNormal = morphNormals.faceNormals[ f ];
				vertexNormals = morphNormals.vertexNormals[ f ];

				faceNormal.copy( face.normal );

				vertexNormals.a.copy( face.vertexNormals[ 0 ] );
				vertexNormals.b.copy( face.vertexNormals[ 1 ] );
				vertexNormals.c.copy( face.vertexNormals[ 2 ] );

			}

		}

		// restore original normals

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.normal = face.__originalFaceNormal;
			face.vertexNormals = face.__originalVertexNormals;

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// tangents go to vertices

		var f, fl, v, vl, i, il, vertexIndex,
			face, uv, vA, vB, vC, uvA, uvB, uvC,
			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r, t, test,
			tan1 = [], tan2 = [],
			sdir = new THREE.Vector3(), tdir = new THREE.Vector3(),
			tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(),
			n = new THREE.Vector3(), w;

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			tan1[ v ] = new THREE.Vector3();
			tan2[ v ] = new THREE.Vector3();

		}

		function handleTriangle( context, a, b, c, ua, ub, uc ) {

			vA = context.vertices[ a ];
			vB = context.vertices[ b ];
			vC = context.vertices[ c ];

			uvA = uv[ ua ];
			uvB = uv[ ub ];
			uvC = uv[ uc ];

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;
			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;
			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.x - uvA.x;
			s2 = uvC.x - uvA.x;
			t1 = uvB.y - uvA.y;
			t2 = uvC.y - uvA.y;

			r = 1.0 / ( s1 * t2 - s2 * t1 );
			sdir.set( ( t2 * x1 - t1 * x2 ) * r,
					  ( t2 * y1 - t1 * y2 ) * r,
					  ( t2 * z1 - t1 * z2 ) * r );
			tdir.set( ( s1 * x2 - s2 * x1 ) * r,
					  ( s1 * y2 - s2 * y1 ) * r,
					  ( s1 * z2 - s2 * z1 ) * r );

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];
			uv = this.faceVertexUvs[ 0 ][ f ]; // use UV layer 0 for tangents

			handleTriangle( this, face.a, face.b, face.c, 0, 1, 2 );

		}

		var faceIndex = [ 'a', 'b', 'c', 'd' ];

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			for ( i = 0; i < Math.min( face.vertexNormals.length, 3 ); i ++ ) {

				n.copy( face.vertexNormals[ i ] );

				vertexIndex = face[ faceIndex[ i ] ];

				t = tan1[ vertexIndex ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.crossVectors( face.vertexNormals[ i ], t );
				test = tmp2.dot( tan2[ vertexIndex ] );
				w = ( test < 0.0 ) ? - 1.0 : 1.0;

				face.vertexTangents[ i ] = new THREE.Vector4( tmp.x, tmp.y, tmp.z, w );

			}

		}

		this.hasTangents = true;

	},

	computeLineDistances: function () {

		var d = 0;
		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			if ( i > 0 ) {

				d += vertices[ i ].distanceTo( vertices[ i - 1 ] );

			}

			this.lineDistances[ i ] = d;

		}

	},

	computeBoundingBox: function () {

		if ( this.boundingBox === null ) {

			this.boundingBox = new THREE.Box3();

		}

		this.boundingBox.setFromPoints( this.vertices );

	},

	computeBoundingSphere: function () {

		if ( this.boundingSphere === null ) {

			this.boundingSphere = new THREE.Sphere();

		}

		this.boundingSphere.setFromPoints( this.vertices );

	},

	merge: function ( geometry, matrix, materialIndexOffset ) {

		if ( geometry instanceof THREE.Geometry === false ) {

			console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
			return;

		}

		var normalMatrix,
		vertexOffset = this.vertices.length,
		vertices1 = this.vertices,
		vertices2 = geometry.vertices,
		faces1 = this.faces,
		faces2 = geometry.faces,
		uvs1 = this.faceVertexUvs[ 0 ],
		uvs2 = geometry.faceVertexUvs[ 0 ];

		if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

		if ( matrix !== undefined ) {

			normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( normalMatrix !== undefined ) {

					normal.applyMatrix3( normalMatrix ).normalize();

				}

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			if ( uv === undefined ) {

				continue;

			}

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

			}

			uvs1.push( uvCopy );

		}

	},

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices: function () {

		var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
		var unique = [], changes = [];

		var v, key;
		var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
		var precision = Math.pow( 10, precisionPoints );
		var i,il, face;
		var indices, k, j, jl, u;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ];
			key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		};


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		var faceIndicesToRemove = [];

		for ( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			indices = [ face.a, face.b, face.c ];

			var dupIndex = - 1;

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( var n = 0; n < 3; n ++ ) {
				if ( indices[ n ] == indices[ ( n + 1 ) % 3 ] ) {

					dupIndex = n;
					faceIndicesToRemove.push( i );
					break;

				}
			}

		}

		for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {
			var idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		var diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.0,
				type: 'BufferGeometry',
				generator: 'BufferGeometryExporter'
			},
			uuid: this.uuid,
			type: this.type
		};

		if ( this.name !== "" ) output.name = this.name;

		if ( this.parameters !== undefined ) {

			var parameters = this.parameters;

			for ( var key in parameters ) {

				if ( parameters[ key ] !== undefined ) output[ key ] = parameters[ key ];

			}

			return output;

		}

		var vertices = [];

		for ( var i = 0; i < this.vertices.length; i ++ ) {

			var vertex = this.vertices[ i ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

		var faces = [];
		var normals = [];
		var normalsHash = {};
		var colors = [];
		var colorsHash = {};
		var uvs = [];
		var uvsHash = {};

		for ( var i = 0; i < this.faces.length; i ++ ) {

			var face = this.faces[ i ];

			var hasMaterial = false; // face.materialIndex !== undefined;
			var hasFaceUv = false; // deprecated
			var hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
			var hasFaceNormal = face.normal.length() > 0;
			var hasFaceVertexNormal = face.vertexNormals.length > 0;
			var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
			var hasFaceVertexColor = face.vertexColors.length > 0;

			var faceType = 0;

			faceType = setBit( faceType, 0, 0 );
			faceType = setBit( faceType, 1, hasMaterial );
			faceType = setBit( faceType, 2, hasFaceUv );
			faceType = setBit( faceType, 3, hasFaceVertexUv );
			faceType = setBit( faceType, 4, hasFaceNormal );
			faceType = setBit( faceType, 5, hasFaceVertexNormal );
			faceType = setBit( faceType, 6, hasFaceColor );
			faceType = setBit( faceType, 7, hasFaceVertexColor );

			faces.push( faceType );
			faces.push( face.a, face.b, face.c );


			/*
			if ( hasMaterial ) {

				faces.push( face.materialIndex );

			}
			*/

			if ( hasFaceVertexUv ) {

				var faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

				faces.push(
					getUvIndex( faceVertexUvs[ 0 ] ),
					getUvIndex( faceVertexUvs[ 1 ] ),
					getUvIndex( faceVertexUvs[ 2 ] )
				);

			}

			if ( hasFaceNormal ) {

				faces.push( getNormalIndex( face.normal ) );

			}

			if ( hasFaceVertexNormal ) {

				var vertexNormals = face.vertexNormals;

				faces.push(
					getNormalIndex( vertexNormals[ 0 ] ),
					getNormalIndex( vertexNormals[ 1 ] ),
					getNormalIndex( vertexNormals[ 2 ] )
				);

			}

			if ( hasFaceColor ) {

				faces.push( getColorIndex( face.color ) );

			}

			if ( hasFaceVertexColor ) {

				var vertexColors = face.vertexColors;

				faces.push(
					getColorIndex( vertexColors[ 0 ] ),
					getColorIndex( vertexColors[ 1 ] ),
					getColorIndex( vertexColors[ 2 ] )
				);

			}

		}

		function setBit( value, position, enabled ) {

			return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position) );

		}

		function getNormalIndex( normal ) {

			var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

			if ( normalsHash[ hash ] !== undefined ) {

				return normalsHash[ hash ];

			}

			normalsHash[ hash ] = normals.length / 3;
			normals.push( normal.x, normal.y, normal.z );

			return normalsHash[ hash ];

		}

		function getColorIndex( color ) {

			var hash = color.r.toString() + color.g.toString() + color.b.toString();

			if ( colorsHash[ hash ] !== undefined ) {

				return colorsHash[ hash ];

			}

			colorsHash[ hash ] = colors.length;
			colors.push( color.getHex() );

			return colorsHash[ hash ];

		}

		function getUvIndex( uv ) {

			var hash = uv.x.toString() + uv.y.toString();

			if ( uvsHash[ hash ] !== undefined ) {

				return uvsHash[ hash ];

			}

			uvsHash[ hash ] = uvs.length / 2;
			uvs.push( uv.x, uv.y );

			return uvsHash[ hash ];

		}

		output.data = {};

		output.data.vertices = vertices;
		output.data.normals = normals;
		if ( colors.length > 0 ) output.data.colors = colors;
		if ( uvs.length > 0 ) output.data.uvs = [ uvs ]; // temporal backward compatibility
		output.data.faces = faces;

		//

		return output;

	},

	clone: function () {

		var geometry = new THREE.Geometry();

		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			geometry.vertices.push( vertices[ i ].clone() );

		}

		var faces = this.faces;

		for ( var i = 0, il = faces.length; i < il; i ++ ) {

			geometry.faces.push( faces[ i ].clone() );

		}

		var uvs = this.faceVertexUvs[ 0 ];

		for ( var i = 0, il = uvs.length; i < il; i ++ ) {

			var uv = uvs[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

			}

			geometry.faceVertexUvs[ 0 ].push( uvCopy );

		}

		return geometry;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Geometry.prototype );

THREE.GeometryIdCount = 0;

// File:src/cameras/Camera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.Camera = function () {

	THREE.Object3D.call( this );

	this.type = 'Camera';

	this.matrixWorldInverse = new THREE.Matrix4();
	this.projectionMatrix = new THREE.Matrix4();

};

THREE.Camera.prototype = Object.create( THREE.Object3D.prototype );

THREE.Camera.prototype.getWorldDirection = function () {

	var quaternion = new THREE.Quaternion();

	return function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.getWorldQuaternion( quaternion );

		return result.set( 0, 0, - 1 ).applyQuaternion( quaternion );

	}

}();

THREE.Camera.prototype.lookAt = function () {

	// This routine does not support cameras with rotated and/or translated parent(s)

	var m1 = new THREE.Matrix4();

	return function ( vector ) {

		m1.lookAt( this.position, vector, this.up );

		this.quaternion.setFromRotationMatrix( m1 );

	};

}();

THREE.Camera.prototype.clone = function ( camera ) {

	if ( camera === undefined ) camera = new THREE.Camera();

	THREE.Object3D.prototype.clone.call( this, camera );

	camera.matrixWorldInverse.copy( this.matrixWorldInverse );
	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;
};

// File:src/cameras/CubeCamera.js

/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CubeCamera = function ( near, far, cubeResolution ) {

	THREE.Object3D.call( this );

	this.type = 'CubeCamera';

	var fov = 90, aspect = 1;

	var cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNY.up.set( 0, 0, - 1 );
	cameraNY.lookAt( new THREE.Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

	this.updateCubeMap = function ( renderer, scene ) {

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.generateMipmaps;

		renderTarget.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, cameraPX, renderTarget );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, cameraNX, renderTarget );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, cameraPY, renderTarget );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, cameraNY, renderTarget );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, cameraPZ, renderTarget );

		renderTarget.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, cameraNZ, renderTarget );

	};

};

THREE.CubeCamera.prototype = Object.create( THREE.Object3D.prototype );

// File:src/cameras/OrthographicCamera.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.Camera.call( this );

	this.type = 'OrthographicCamera';

	this.zoom = 1;

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.near = ( near !== undefined ) ? near : 0.1;
	this.far = ( far !== undefined ) ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.OrthographicCamera.prototype = Object.create( THREE.Camera.prototype );

THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {

	var dx = ( this.right - this.left ) / ( 2 * this.zoom );
	var dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
	var cx = ( this.right + this.left ) / 2;
	var cy = ( this.top + this.bottom ) / 2;

	this.projectionMatrix.makeOrthographic( cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far );

};

THREE.OrthographicCamera.prototype.clone = function () {

	var camera = new THREE.OrthographicCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.left = this.left;
	camera.right = this.right;
	camera.top = this.top;
	camera.bottom = this.bottom;

	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;
};

// File:src/cameras/PerspectiveCamera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.PerspectiveCamera = function ( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.type = 'PerspectiveCamera';

	this.zoom = 1;

	this.fov = fov !== undefined ? fov : 50;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = Object.create( THREE.Camera.prototype );


/**
 * Uses Focal Length (in mm) to estimate and set FOV
 * 35mm (fullframe) camera is used if frame size is not specified;
 * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
 */

THREE.PerspectiveCamera.prototype.setLens = function ( focalLength, frameHeight ) {

	if ( frameHeight === undefined ) frameHeight = 24;

	this.fov = 2 * THREE.Math.radToDeg( Math.atan( frameHeight / ( focalLength * 2 ) ) );
	this.updateProjectionMatrix();

}


/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */

THREE.PerspectiveCamera.prototype.setViewOffset = function ( fullWidth, fullHeight, x, y, width, height ) {

	this.fullWidth = fullWidth;
	this.fullHeight = fullHeight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.updateProjectionMatrix();

};


THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {

	var fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( this.fov ) * 0.5 ) / this.zoom ) );

	if ( this.fullWidth ) {

		var aspect = this.fullWidth / this.fullHeight;
		var top = Math.tan( THREE.Math.degToRad( fov * 0.5 ) ) * this.near;
		var bottom = - top;
		var left = aspect * bottom;
		var right = aspect * top;
		var width = Math.abs( right - left );
		var height = Math.abs( top - bottom );

		this.projectionMatrix.makeFrustum(
			left + this.x * width / this.fullWidth,
			left + ( this.x + this.width ) * width / this.fullWidth,
			top - ( this.y + this.height ) * height / this.fullHeight,
			top - this.y * height / this.fullHeight,
			this.near,
			this.far
		);

	} else {

		this.projectionMatrix.makePerspective( fov, this.aspect, this.near, this.far );

	}

};

THREE.PerspectiveCamera.prototype.clone = function () {

	var camera = new THREE.PerspectiveCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.fov = this.fov;
	camera.aspect = this.aspect;
	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;

};

// File:src/lights/Light.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Light = function ( color ) {

	THREE.Object3D.call( this );

	this.type = 'Light';
	
	this.color = new THREE.Color( color );

};

THREE.Light.prototype = Object.create( THREE.Object3D.prototype );

THREE.Light.prototype.clone = function ( light ) {

	if ( light === undefined ) light = new THREE.Light();

	THREE.Object3D.prototype.clone.call( this, light );

	light.color.copy( this.color );

	return light;

};

// File:src/lights/AmbientLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AmbientLight = function ( color ) {

	THREE.Light.call( this, color );

	this.type = 'AmbientLight';

};

THREE.AmbientLight.prototype = Object.create( THREE.Light.prototype );

THREE.AmbientLight.prototype.clone = function () {

	var light = new THREE.AmbientLight();

	THREE.Light.prototype.clone.call( this, light );

	return light;

};

// File:src/lights/AreaLight.js

/**
 * @author MPanknin / http://www.redplant.de/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.AreaLight = function ( color, intensity ) {

	THREE.Light.call( this, color );

	this.type = 'AreaLight';

	this.normal = new THREE.Vector3( 0, - 1, 0 );
	this.right = new THREE.Vector3( 1, 0, 0 );

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

	this.width = 1.0;
	this.height = 1.0;

	this.constantAttenuation = 1.5;
	this.linearAttenuation = 0.5;
	this.quadraticAttenuation = 0.1;

};

THREE.AreaLight.prototype = Object.create( THREE.Light.prototype );


// File:src/lights/DirectionalLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DirectionalLight = function ( color, intensity ) {

	THREE.Light.call( this, color );

	this.type = 'DirectionalLight';

	this.position.set( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

	this.castShadow = false;
	this.onlyShadow = false;

	//

	this.shadowCameraNear = 50;
	this.shadowCameraFar = 5000;

	this.shadowCameraLeft = - 500;
	this.shadowCameraRight = 500;
	this.shadowCameraTop = 500;
	this.shadowCameraBottom = - 500;

	this.shadowCameraVisible = false;

	this.shadowBias = 0;
	this.shadowDarkness = 0.5;

	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	//

	this.shadowCascade = false;

	this.shadowCascadeOffset = new THREE.Vector3( 0, 0, - 1000 );
	this.shadowCascadeCount = 2;

	this.shadowCascadeBias = [ 0, 0, 0 ];
	this.shadowCascadeWidth = [ 512, 512, 512 ];
	this.shadowCascadeHeight = [ 512, 512, 512 ];

	this.shadowCascadeNearZ = [ - 1.000, 0.990, 0.998 ];
	this.shadowCascadeFarZ  = [  0.990, 0.998, 1.000 ];

	this.shadowCascadeArray = [];

	//

	this.shadowMap = null;
	this.shadowMapSize = null;
	this.shadowCamera = null;
	this.shadowMatrix = null;

};

THREE.DirectionalLight.prototype = Object.create( THREE.Light.prototype );

THREE.DirectionalLight.prototype.clone = function () {

	var light = new THREE.DirectionalLight();

	THREE.Light.prototype.clone.call( this, light );

	light.target = this.target.clone();

	light.intensity = this.intensity;

	light.castShadow = this.castShadow;
	light.onlyShadow = this.onlyShadow;

	//

	light.shadowCameraNear = this.shadowCameraNear;
	light.shadowCameraFar = this.shadowCameraFar;

	light.shadowCameraLeft = this.shadowCameraLeft;
	light.shadowCameraRight = this.shadowCameraRight;
	light.shadowCameraTop = this.shadowCameraTop;
	light.shadowCameraBottom = this.shadowCameraBottom;

	light.shadowCameraVisible = this.shadowCameraVisible;

	light.shadowBias = this.shadowBias;
	light.shadowDarkness = this.shadowDarkness;

	light.shadowMapWidth = this.shadowMapWidth;
	light.shadowMapHeight = this.shadowMapHeight;

	//

	light.shadowCascade = this.shadowCascade;

	light.shadowCascadeOffset.copy( this.shadowCascadeOffset );
	light.shadowCascadeCount = this.shadowCascadeCount;

	light.shadowCascadeBias = this.shadowCascadeBias.slice( 0 );
	light.shadowCascadeWidth = this.shadowCascadeWidth.slice( 0 );
	light.shadowCascadeHeight = this.shadowCascadeHeight.slice( 0 );

	light.shadowCascadeNearZ = this.shadowCascadeNearZ.slice( 0 );
	light.shadowCascadeFarZ  = this.shadowCascadeFarZ.slice( 0 );

	return light;

};

// File:src/lights/HemisphereLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.HemisphereLight = function ( skyColor, groundColor, intensity ) {

	THREE.Light.call( this, skyColor );

	this.type = 'HemisphereLight';

	this.position.set( 0, 100, 0 );

	this.groundColor = new THREE.Color( groundColor );
	this.intensity = ( intensity !== undefined ) ? intensity : 1;

};

THREE.HemisphereLight.prototype = Object.create( THREE.Light.prototype );

THREE.HemisphereLight.prototype.clone = function () {

	var light = new THREE.HemisphereLight();

	THREE.Light.prototype.clone.call( this, light );

	light.groundColor.copy( this.groundColor );
	light.intensity = this.intensity;

	return light;

};

// File:src/lights/PointLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointLight = function ( color, intensity, distance ) {

	THREE.Light.call( this, color );

	this.type = 'PointLight';

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;

};

THREE.PointLight.prototype = Object.create( THREE.Light.prototype );

THREE.PointLight.prototype.clone = function () {

	var light = new THREE.PointLight();

	THREE.Light.prototype.clone.call( this, light );

	light.intensity = this.intensity;
	light.distance = this.distance;

	return light;

};

// File:src/lights/SpotLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpotLight = function ( color, intensity, distance, angle, exponent ) {

	THREE.Light.call( this, color );

	this.type = 'SpotLight';

	this.position.set( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;
	this.angle = ( angle !== undefined ) ? angle : Math.PI / 3;
	this.exponent = ( exponent !== undefined ) ? exponent : 10;

	this.castShadow = false;
	this.onlyShadow = false;

	//

	this.shadowCameraNear = 50;
	this.shadowCameraFar = 5000;
	this.shadowCameraFov = 50;

	this.shadowCameraVisible = false;

	this.shadowBias = 0;
	this.shadowDarkness = 0.5;

	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	//

	this.shadowMap = null;
	this.shadowMapSize = null;
	this.shadowCamera = null;
	this.shadowMatrix = null;

};

THREE.SpotLight.prototype = Object.create( THREE.Light.prototype );

THREE.SpotLight.prototype.clone = function () {

	var light = new THREE.SpotLight();

	THREE.Light.prototype.clone.call( this, light );

	light.target = this.target.clone();

	light.intensity = this.intensity;
	light.distance = this.distance;
	light.angle = this.angle;
	light.exponent = this.exponent;

	light.castShadow = this.castShadow;
	light.onlyShadow = this.onlyShadow;

	//

	light.shadowCameraNear = this.shadowCameraNear;
	light.shadowCameraFar = this.shadowCameraFar;
	light.shadowCameraFov = this.shadowCameraFov;

	light.shadowCameraVisible = this.shadowCameraVisible;

	light.shadowBias = this.shadowBias;
	light.shadowDarkness = this.shadowDarkness;

	light.shadowMapWidth = this.shadowMapWidth;
	light.shadowMapHeight = this.shadowMapHeight;

	return light;

};

// File:src/loaders/Cache.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Cache = function () {

	this.files = {};

};

THREE.Cache.prototype = {

	constructor: THREE.Cache,

	add: function ( key, file ) {

		// console.log( 'THREE.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	},

	get: function ( key ) {

		// console.log( 'THREE.Cache', 'Checking key:', key );

		return this.files[ key ];

	},

	remove: function ( key ) {

		delete this.files[ key ];

	},

	clear: function () {

		this.files = {}

	}

};

// File:src/loaders/Loader.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null;

	this.imageLoader = new THREE.ImageLoader();

	this.onLoadStart = function () {};
	this.onLoadProgress = function () {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	crossOrigin: undefined,

	addStatusElement: function () {

		var e = document.createElement( 'div' );

		e.style.position = 'absolute';
		e.style.right = '0px';
		e.style.top = '0px';
		e.style.fontSize = '0.8em';
		e.style.textAlign = 'left';
		e.style.background = 'rgba(0,0,0,0.25)';
		e.style.color = '#fff';
		e.style.width = '120px';
		e.style.padding = '0.5em 0.5em 0.5em 0.5em';
		e.style.zIndex = 1000;

		e.innerHTML = 'Loading ...';

		return e;

	},

	updateProgress: function ( progress ) {

		var message = 'Loaded ';

		if ( progress.total ) {

			message += ( 100 * progress.loaded / progress.total ).toFixed( 0 ) + '%';


		} else {

			message += ( progress.loaded / 1024 ).toFixed( 2 ) + ' KB';

		}

		this.statusDomElement.innerHTML = message;

	},

	extractUrlBase: function ( url ) {

		var parts = url.split( '/' );

		if ( parts.length === 1 ) return './';

		parts.pop();

		return parts.join( '/' ) + '/';

	},

	initMaterials: function ( materials, texturePath ) {

		var array = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			array[ i ] = this.createMaterial( materials[ i ], texturePath );

		}

		return array;

	},

	needsTangents: function ( materials ) {

		for ( var i = 0, il = materials.length; i < il; i ++ ) {

			var m = materials[ i ];

			if ( m instanceof THREE.ShaderMaterial ) return true;

		}

		return false;

	},

	createMaterial: function ( m, texturePath ) {

		var scope = this;

		function nearest_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.pow( 2, Math.round(  l ) );

		}

		function create_texture( where, name, sourceFile, repeat, offset, wrap, anisotropy ) {

			var fullPath = texturePath + sourceFile;

			var texture;

			var loader = THREE.Loader.Handlers.get( fullPath );

			if ( loader !== null ) {

				texture = loader.load( fullPath );

			} else {

				texture = new THREE.Texture();

				loader = scope.imageLoader;
				loader.crossOrigin = scope.crossOrigin;
				loader.load( fullPath, function ( image ) {

					if ( THREE.Math.isPowerOfTwo( image.width ) === false ||
						 THREE.Math.isPowerOfTwo( image.height ) === false ) {

						var width = nearest_pow2( image.width );
						var height = nearest_pow2( image.height );

						var canvas = document.createElement( 'canvas' );
						canvas.width = width;
						canvas.height = height;

						var context = canvas.getContext( '2d' );
						context.drawImage( image, 0, 0, width, height );

						texture.image = canvas;

					} else {

						texture.image = image;

					}

					texture.needsUpdate = true;

				} );

			}

			texture.sourceFile = sourceFile;

			if ( repeat ) {

				texture.repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] !== 1 ) texture.wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] !== 1 ) texture.wrapT = THREE.RepeatWrapping;

			}

			if ( offset ) {

				texture.offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if ( wrap ) {

				var wrapMap = {
					'repeat': THREE.RepeatWrapping,
					'mirror': THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ wrap[ 1 ] ];

			}

			if ( anisotropy ) {

				texture.anisotropy = anisotropy;

			}

			where[ name ] = texture;

		}

		function rgb2hex( rgb ) {

			return ( rgb[ 0 ] * 255 << 16 ) + ( rgb[ 1 ] * 255 << 8 ) + rgb[ 2 ] * 255;

		}

		// defaults

		var mtype = 'MeshLambertMaterial';
		var mpars = { color: 0xeeeeee, opacity: 1.0, map: null, lightMap: null, normalMap: null, bumpMap: null, wireframe: false };

		// parameters from model file

		if ( m.shading ) {

			var shading = m.shading.toLowerCase();

			if ( shading === 'phong' ) mtype = 'MeshPhongMaterial';
			else if ( shading === 'basic' ) mtype = 'MeshBasicMaterial';

		}

		if ( m.blending !== undefined && THREE[ m.blending ] !== undefined ) {

			mpars.blending = THREE[ m.blending ];

		}

		if ( m.transparent !== undefined || m.opacity < 1.0 ) {

			mpars.transparent = m.transparent;

		}

		if ( m.depthTest !== undefined ) {

			mpars.depthTest = m.depthTest;

		}

		if ( m.depthWrite !== undefined ) {

			mpars.depthWrite = m.depthWrite;

		}

		if ( m.visible !== undefined ) {

			mpars.visible = m.visible;

		}

		if ( m.flipSided !== undefined ) {

			mpars.side = THREE.BackSide;

		}

		if ( m.doubleSided !== undefined ) {

			mpars.side = THREE.DoubleSide;

		}

		if ( m.wireframe !== undefined ) {

			mpars.wireframe = m.wireframe;

		}

		if ( m.vertexColors !== undefined ) {

			if ( m.vertexColors === 'face' ) {

				mpars.vertexColors = THREE.FaceColors;

			} else if ( m.vertexColors ) {

				mpars.vertexColors = THREE.VertexColors;

			}

		}

		// colors

		if ( m.colorDiffuse ) {

			mpars.color = rgb2hex( m.colorDiffuse );

		} else if ( m.DbgColor ) {

			mpars.color = m.DbgColor;

		}

		if ( m.colorSpecular ) {

			mpars.specular = rgb2hex( m.colorSpecular );

		}

		if ( m.colorAmbient ) {

			mpars.ambient = rgb2hex( m.colorAmbient );

		}

		if ( m.colorEmissive ) {

			mpars.emissive = rgb2hex( m.colorEmissive );

		}

		// modifiers

		if ( m.transparency ) {

			mpars.opacity = m.transparency;

		}

		if ( m.specularCoef ) {

			mpars.shininess = m.specularCoef;

		}

		// textures

		if ( m.mapDiffuse && texturePath ) {

			create_texture( mpars, 'map', m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy );

		}

		if ( m.mapLight && texturePath ) {

			create_texture( mpars, 'lightMap', m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy );

		}

		if ( m.mapBump && texturePath ) {

			create_texture( mpars, 'bumpMap', m.mapBump, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy );

		}

		if ( m.mapNormal && texturePath ) {

			create_texture( mpars, 'normalMap', m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy );

		}

		if ( m.mapSpecular && texturePath ) {

			create_texture( mpars, 'specularMap', m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy );

		}

		if ( m.mapAlpha && texturePath ) {

			create_texture( mpars, 'alphaMap', m.mapAlpha, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy );

		}

		//

		if ( m.mapBumpScale ) {

			mpars.bumpScale = m.mapBumpScale;

		}

		// special case for normal mapped material

		if ( m.mapNormal ) {

			var shader = THREE.ShaderLib[ 'normalmap' ];
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			uniforms[ 'tNormal' ].value = mpars.normalMap;

			if ( m.mapNormalFactor ) {

				uniforms[ 'uNormalScale' ].value.set( m.mapNormalFactor, m.mapNormalFactor );

			}

			if ( mpars.map ) {

				uniforms[ 'tDiffuse' ].value = mpars.map;
				uniforms[ 'enableDiffuse' ].value = true;

			}

			if ( mpars.specularMap ) {

				uniforms[ 'tSpecular' ].value = mpars.specularMap;
				uniforms[ 'enableSpecular' ].value = true;

			}

			if ( mpars.lightMap ) {

				uniforms[ 'tAO' ].value = mpars.lightMap;
				uniforms[ 'enableAO' ].value = true;

			}

			// for the moment don't handle displacement texture

			uniforms[ 'diffuse' ].value.setHex( mpars.color );
			uniforms[ 'specular' ].value.setHex( mpars.specular );
			uniforms[ 'ambient' ].value.setHex( mpars.ambient );

			uniforms[ 'shininess' ].value = mpars.shininess;

			if ( mpars.opacity !== undefined ) {

				uniforms[ 'opacity' ].value = mpars.opacity;

			}

			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };
			var material = new THREE.ShaderMaterial( parameters );

			if ( mpars.transparent ) {

				material.transparent = true;

			}

		} else {

			var material = new THREE[ mtype ]( mpars );

		}

		if ( m.DbgName !== undefined ) material.name = m.DbgName;

		return material;

	}

};

THREE.Loader.Handlers = {

	handlers: [],

	add: function ( regex, loader ) {

		this.handlers.push( regex, loader );

	},

	get: function ( file ) {

		for ( var i = 0, l = this.handlers.length; i < l; i += 2 ) {

			var regex = this.handlers[ i ];
			var loader  = this.handlers[ i + 1 ];

			if ( regex.test( file ) ) {

				return loader;

			}

		}

		return null;

	}

};

// File:src/loaders/XHRLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.XHRLoader = function ( manager ) {

	this.cache = new THREE.Cache();
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.XHRLoader.prototype = {

	constructor: THREE.XHRLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = scope.cache.get( url );

		if ( cached !== undefined ) {

			if ( onLoad ) onLoad( cached );
			return;

		}

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		request.addEventListener( 'load', function ( event ) {

			scope.cache.add( url, this.response );

			if ( onLoad ) onLoad( this.response );

			scope.manager.itemEnd( url );

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			request.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;
		if ( this.responseType !== undefined ) request.responseType = this.responseType;

		request.send( null );

		scope.manager.itemStart( url );

	},

	setResponseType: function ( value ) {

		this.responseType = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/ImageLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageLoader = function ( manager ) {

	this.cache = new THREE.Cache();
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ImageLoader.prototype = {

	constructor: THREE.ImageLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = scope.cache.get( url );

		if ( cached !== undefined ) {

			onLoad( cached );
			return;

		}

		var image = document.createElement( 'img' );

		if ( onLoad !== undefined ) {

			image.addEventListener( 'load', function ( event ) {

				scope.cache.add( url, this );

				onLoad( this );
				scope.manager.itemEnd( url );

			}, false );

		}

		if ( onProgress !== undefined ) {

			image.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			image.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

		image.src = url;

		scope.manager.itemStart( url );

		return image;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

}

// File:src/loaders/JSONLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this.withCredentials = false;

};

THREE.JSONLoader.prototype = Object.create( THREE.Loader.prototype );

THREE.JSONLoader.prototype.load = function ( url, callback, texturePath ) {

	var scope = this;

	// todo: unify load API to for easier SceneLoader use

	texturePath = texturePath && ( typeof texturePath === 'string' ) ? texturePath : this.extractUrlBase( url );

	this.onLoadStart();
	this.loadAjaxJSON( this, url, callback, texturePath );

};

THREE.JSONLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	var length = 0;

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === xhr.DONE ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				if ( xhr.responseText ) {

					var json = JSON.parse( xhr.responseText );

					if ( json.metadata !== undefined && json.metadata.type === 'scene' ) {

						console.error( 'THREE.JSONLoader: "' + url + '" seems to be a Scene. Use THREE.SceneLoader instead.' );
						return;

					}

					var result = context.parse( json, texturePath );
					callback( result.geometry, result.materials );

				} else {

					console.error( 'THREE.JSONLoader: "' + url + '" seems to be unreachable or the file is empty.' );

				}

				// in context of more complex asset initialization
				// do not block on single failed file
				// maybe should go even one more level up

				context.onLoadComplete();

			} else {

				console.error( 'THREE.JSONLoader: Couldn\'t load "' + url + '" (' + xhr.status + ')' );

			}

		} else if ( xhr.readyState === xhr.LOADING ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( 'Content-Length' );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {

			if ( callbackProgress !== undefined ) {

				length = xhr.getResponseHeader( 'Content-Length' );

			}

		}

	};

	xhr.open( 'GET', url, true );
	xhr.withCredentials = this.withCredentials;
	xhr.send( null );

};

THREE.JSONLoader.prototype.parse = function ( json, texturePath ) {

	var scope = this,
	geometry = new THREE.Geometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

	parseModel( scale );

	parseSkin();
	parseMorphing( scale );

	geometry.computeFaceNormals();
	geometry.computeBoundingSphere();

	function parseModel( scale ) {

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		}

		var i, j, fi,

		offset, zLength,

		colorIndex, normalIndex, uvIndex, materialIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, faceA, faceB, color, hex, normal,

		uvLayer, uv, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		if ( json.uvs !== undefined ) {

			// disregard empty arrays

			for ( i = 0; i < json.uvs.length; i ++ ) {

				if ( json.uvs[ i ].length ) nUvLayers ++;

			}

			for ( i = 0; i < nUvLayers; i ++ ) {

				geometry.faceVertexUvs[ i ] = [];

			}

		}

		offset = 0;
		zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vector3();

			vertex.x = vertices[ offset ++ ] * scale;
			vertex.y = vertices[ offset ++ ] * scale;
			vertex.z = vertices[ offset ++ ] * scale;

			geometry.vertices.push( vertex );

		}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad              = isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	     = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			// console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {

				faceA = new THREE.Face3();
				faceA.a = faces[ offset ];
				faceA.b = faces[ offset + 1 ];
				faceA.c = faces[ offset + 3 ];

				faceB = new THREE.Face3();
				faceB.a = faces[ offset + 1 ];
				faceB.b = faces[ offset + 2 ];
				faceB.c = faces[ offset + 3 ];

				offset += 4;

				if ( hasMaterial ) {

					materialIndex = faces[ offset ++ ];
					faceA.materialIndex = materialIndex;
					faceB.materialIndex = materialIndex;

				}

				// to get face <=> uv index correspondence

				fi = geometry.faces.length;

				if ( hasFaceVertexUv ) {

					for ( i = 0; i < nUvLayers; i ++ ) {

						uvLayer = json.uvs[ i ];

						geometry.faceVertexUvs[ i ][ fi ] = [];
						geometry.faceVertexUvs[ i ][ fi + 1 ] = []

						for ( j = 0; j < 4; j ++ ) {

							uvIndex = faces[ offset ++ ];

							u = uvLayer[ uvIndex * 2 ];
							v = uvLayer[ uvIndex * 2 + 1 ];

							uv = new THREE.Vector2( u, v );

							if ( j !== 2 ) geometry.faceVertexUvs[ i ][ fi ].push( uv );
							if ( j !== 0 ) geometry.faceVertexUvs[ i ][ fi + 1 ].push( uv );

						}

					}

				}

				if ( hasFaceNormal ) {

					normalIndex = faces[ offset ++ ] * 3;

					faceA.normal.set(
						normals[ normalIndex ++ ],
						normals[ normalIndex ++ ],
						normals[ normalIndex ]
					);

					faceB.normal.copy( faceA.normal );

				}

				if ( hasFaceVertexNormal ) {

					for ( i = 0; i < 4; i ++ ) {

						normalIndex = faces[ offset ++ ] * 3;

						normal = new THREE.Vector3(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);


						if ( i !== 2 ) faceA.vertexNormals.push( normal );
						if ( i !== 0 ) faceB.vertexNormals.push( normal );

					}

				}


				if ( hasFaceColor ) {

					colorIndex = faces[ offset ++ ];
					hex = colors[ colorIndex ];

					faceA.color.setHex( hex );
					faceB.color.setHex( hex );

				}


				if ( hasFaceVertexColor ) {

					for ( i = 0; i < 4; i ++ ) {

						colorIndex = faces[ offset ++ ];
						hex = colors[ colorIndex ];

						if ( i !== 2 ) faceA.vertexColors.push( new THREE.Color( hex ) );
						if ( i !== 0 ) faceB.vertexColors.push( new THREE.Color( hex ) );

					}

				}

				geometry.faces.push( faceA );
				geometry.faces.push( faceB );

			} else {

				face = new THREE.Face3();
				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];

				if ( hasMaterial ) {

					materialIndex = faces[ offset ++ ];
					face.materialIndex = materialIndex;

				}

				// to get face <=> uv index correspondence

				fi = geometry.faces.length;

				if ( hasFaceVertexUv ) {

					for ( i = 0; i < nUvLayers; i ++ ) {

						uvLayer = json.uvs[ i ];

						geometry.faceVertexUvs[ i ][ fi ] = [];

						for ( j = 0; j < 3; j ++ ) {

							uvIndex = faces[ offset ++ ];

							u = uvLayer[ uvIndex * 2 ];
							v = uvLayer[ uvIndex * 2 + 1 ];

							uv = new THREE.Vector2( u, v );

							geometry.faceVertexUvs[ i ][ fi ].push( uv );

						}

					}

				}

				if ( hasFaceNormal ) {

					normalIndex = faces[ offset ++ ] * 3;

					face.normal.set(
						normals[ normalIndex ++ ],
						normals[ normalIndex ++ ],
						normals[ normalIndex ]
					);

				}

				if ( hasFaceVertexNormal ) {

					for ( i = 0; i < 3; i ++ ) {

						normalIndex = faces[ offset ++ ] * 3;

						normal = new THREE.Vector3(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

						face.vertexNormals.push( normal );

					}

				}


				if ( hasFaceColor ) {

					colorIndex = faces[ offset ++ ];
					face.color.setHex( colors[ colorIndex ] );

				}


				if ( hasFaceVertexColor ) {

					for ( i = 0; i < 3; i ++ ) {

						colorIndex = faces[ offset ++ ];
						face.vertexColors.push( new THREE.Color( colors[ colorIndex ] ) );

					}

				}

				geometry.faces.push( face );

			}

		}

	};

	function parseSkin() {
		var influencesPerVertex = ( json.influencesPerVertex !== undefined ) ? json.influencesPerVertex : 2;

		if ( json.skinWeights ) {

			for ( var i = 0, l = json.skinWeights.length; i < l; i += influencesPerVertex ) {

				var x =                               json.skinWeights[ i     ];
				var y = ( influencesPerVertex > 1 ) ? json.skinWeights[ i + 1 ] : 0;
				var z = ( influencesPerVertex > 2 ) ? json.skinWeights[ i + 2 ] : 0;
				var w = ( influencesPerVertex > 3 ) ? json.skinWeights[ i + 3 ] : 0;

				geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

			}

		}

		if ( json.skinIndices ) {

			for ( var i = 0, l = json.skinIndices.length; i < l; i += influencesPerVertex ) {

				var a =                               json.skinIndices[ i     ];
				var b = ( influencesPerVertex > 1 ) ? json.skinIndices[ i + 1 ] : 0;
				var c = ( influencesPerVertex > 2 ) ? json.skinIndices[ i + 2 ] : 0;
				var d = ( influencesPerVertex > 3 ) ? json.skinIndices[ i + 3 ] : 0;

				geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

			}

		}

		geometry.bones = json.bones;

		if ( geometry.bones && geometry.bones.length > 0 && ( geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length ) ) {

				console.warn( 'When skinning, number of vertices (' + geometry.vertices.length + '), skinIndices (' +
					geometry.skinIndices.length + '), and skinWeights (' + geometry.skinWeights.length + ') should match.' );

		}


		// could change this to json.animations[0] or remove completely

		geometry.animation = json.animation;
		geometry.animations = json.animations;

	};

	function parseMorphing( scale ) {

		if ( json.morphTargets !== undefined ) {

			var i, l, v, vl, dstVertices, srcVertices;

			for ( i = 0, l = json.morphTargets.length; i < l; i ++ ) {

				geometry.morphTargets[ i ] = {};
				geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
				geometry.morphTargets[ i ].vertices = [];

				dstVertices = geometry.morphTargets[ i ].vertices;
				srcVertices = json.morphTargets [ i ].vertices;

				for ( v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

					var vertex = new THREE.Vector3();
					vertex.x = srcVertices[ v ] * scale;
					vertex.y = srcVertices[ v + 1 ] * scale;
					vertex.z = srcVertices[ v + 2 ] * scale;

					dstVertices.push( vertex );

				}

			}

		}

		if ( json.morphColors !== undefined ) {

			var i, l, c, cl, dstColors, srcColors, color;

			for ( i = 0, l = json.morphColors.length; i < l; i ++ ) {

				geometry.morphColors[ i ] = {};
				geometry.morphColors[ i ].name = json.morphColors[ i ].name;
				geometry.morphColors[ i ].colors = [];

				dstColors = geometry.morphColors[ i ].colors;
				srcColors = json.morphColors [ i ].colors;

				for ( c = 0, cl = srcColors.length; c < cl; c += 3 ) {

					color = new THREE.Color( 0xffaa00 );
					color.setRGB( srcColors[ c ], srcColors[ c + 1 ], srcColors[ c + 2 ] );
					dstColors.push( color );

				}

			}

		}

	};

	if ( json.materials === undefined || json.materials.length === 0 ) {

		return { geometry: geometry };

	} else {

		var materials = this.initMaterials( json.materials, texturePath );

		if ( this.needsTangents( materials ) ) {

			geometry.computeTangents();

		}

		return { geometry: geometry, materials: materials };

	}

};

// File:src/loaders/LoadingManager.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LoadingManager = function ( onLoad, onProgress, onError ) {

	var scope = this;

	var loaded = 0, total = 0;

	this.onLoad = onLoad;
	this.onProgress = onProgress;
	this.onError = onError;

	this.itemStart = function ( url ) {

		total ++;

	};

	this.itemEnd = function ( url ) {

		loaded ++;

		if ( scope.onProgress !== undefined ) {

			scope.onProgress( url, loaded, total );

		}

		if ( loaded === total && scope.onLoad !== undefined ) {

			scope.onLoad();

		}

	};

};

THREE.DefaultLoadingManager = new THREE.LoadingManager();

// File:src/loaders/BufferGeometryLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometryLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.BufferGeometryLoader.prototype = {

	constructor: THREE.BufferGeometryLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader();
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometry = new THREE.BufferGeometry();

		var attributes = json.attributes;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];
			var typedArray = new self[ attribute.type ]( attribute.array );

			geometry.addAttribute( key, new THREE.BufferAttribute( typedArray, attribute.itemSize ) );

		}

		var offsets = json.offsets;

		if ( offsets !== undefined ) {

			geometry.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		var boundingSphere = json.boundingSphere;

		if ( boundingSphere !== undefined ) {

			var center = new THREE.Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new THREE.Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

};

// File:src/loaders/MaterialLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MaterialLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MaterialLoader.prototype = {

	constructor: THREE.MaterialLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader();
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var material = new THREE[ json.type ];

		if ( json.color !== undefined ) material.color.setHex( json.color );
		if ( json.ambient !== undefined ) material.ambient.setHex( json.ambient );
		if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
		if ( json.specular !== undefined ) material.specular.setHex( json.specular );
		if ( json.shininess !== undefined ) material.shininess = json.shininess;
		if ( json.uniforms !== undefined ) material.uniforms = json.uniforms;
		if ( json.vertexShader !== undefined ) material.vertexShader = json.vertexShader;
		if ( json.fragmentShader !== undefined ) material.fragmentShader = json.fragmentShader;		
		if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
		if ( json.shading !== undefined ) material.shading = json.shading;
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.side !== undefined ) material.side = json.side;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;

		if ( json.materials !== undefined ) {

			for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

				material.materials.push( this.parse( json.materials[ i ] ) );

			}

		}

		return material;

	}

};

// File:src/loaders/ObjectLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ObjectLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ObjectLoader.prototype = {

	constructor: THREE.ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometries = this.parseGeometries( json.geometries );
		var materials = this.parseMaterials( json.materials );
		var object = this.parseObject( json.object, geometries, materials );

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new THREE.JSONLoader();
			var bufferGeometryLoader = new THREE.BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':

						geometry = new THREE.PlaneGeometry(
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new THREE.BoxGeometry(
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':

						geometry = new THREE.CircleGeometry(
							data.radius,
							data.segments
						);

						break;

					case 'CylinderGeometry':

						geometry = new THREE.CylinderGeometry(
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded
						);

						break;

					case 'SphereGeometry':

						geometry = new THREE.SphereGeometry(
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'IcosahedronGeometry':

						geometry = new THREE.IcosahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'TorusGeometry':

						geometry = new THREE.TorusGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':

						geometry = new THREE.TorusKnotGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.p,
							data.q,
							data.heightScale
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data.data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data.data ).geometry;

						break;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json ) {

		var materials = {};

		if ( json !== undefined ) {

			var loader = new THREE.MaterialLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];
				var material = loader.parse( data );

				material.uuid = data.uuid;

				if ( data.name !== undefined ) material.name = data.name;

				materials[ data.uuid ] = material;

			}

		}

		return materials;

	},

	parseObject: function () {

		var matrix = new THREE.Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			switch ( data.type ) {

				case 'Scene':

					object = new THREE.Scene();

					break;

				case 'PerspectiveCamera':

					object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					break;

				case 'OrthographicCamera':

					object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new THREE.AmbientLight( data.color );

					break;

				case 'DirectionalLight':

					object = new THREE.DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE.PointLight( data.color, data.intensity, data.distance );

					break;

				case 'SpotLight':

					object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent );

					break;

				case 'HemisphereLight':

					object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Mesh( geometry, material );

					break;

				case 'Line':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Line( geometry, material );

					break;

				case 'Sprite':

					var material = materials[ data.material ];

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Sprite( material );

					break;

				case 'Group':

					object = new THREE.Group();

					break;

				default:

					object = new THREE.Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				for ( var child in data.children ) {

					object.add( this.parseObject( data.children[ child ], geometries, materials ) );

				}

			}

			return object;

		}

	}()

};

// File:src/loaders/TextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.TextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.TextureLoader.prototype = {

	constructor: THREE.TextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.ImageLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( image ) {

			var texture = new THREE.Texture( image );
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/CompressedTextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * Abstract Base class to block based textures loader (dds, pvr, ...)
 */

THREE.CompressedTextureLoader = function () {

	// override in sub classes
	this._parser = null;

};


THREE.CompressedTextureLoader.prototype = {

	constructor: THREE.CompressedTextureLoader,

	load: function ( url, onLoad, onError ) {

		var scope = this;

		var images = [];

		var texture = new THREE.CompressedTexture();
		texture.image = images;

		var loader = new THREE.XHRLoader();
		loader.setResponseType( 'arraybuffer' );

		if ( url instanceof Array ) {

			var loaded = 0;

			var loadTexture = function ( i ) {

				loader.load( url[ i ], function ( buffer ) {

					var texDatas = scope._parser( buffer, true );

					images[ i ] = {
						width: texDatas.width,
						height: texDatas.height,
						format: texDatas.format,
						mipmaps: texDatas.mipmaps
					};

					loaded += 1;

					if ( loaded === 6 ) {

 						if (texDatas.mipmapCount == 1)
 							texture.minFilter = THREE.LinearFilter;

						texture.format = texDatas.format;
						texture.needsUpdate = true;

						if ( onLoad ) onLoad( texture );

					}

				} );

			};

			for ( var i = 0, il = url.length; i < il; ++ i ) {

				loadTexture( i );

			}

		} else {

			// compressed cubemap texture stored in a single DDS file

			loader.load( url, function ( buffer ) {

				var texDatas = scope._parser( buffer, true );

				if ( texDatas.isCubemap ) {

					var faces = texDatas.mipmaps.length / texDatas.mipmapCount;

					for ( var f = 0; f < faces; f ++ ) {

						images[ f ] = { mipmaps : [] };

						for ( var i = 0; i < texDatas.mipmapCount; i ++ ) {

							images[ f ].mipmaps.push( texDatas.mipmaps[ f * texDatas.mipmapCount + i ] );
							images[ f ].format = texDatas.format;
							images[ f ].width = texDatas.width;
							images[ f ].height = texDatas.height;

						}

					}

				} else {

					texture.image.width = texDatas.width;
					texture.image.height = texDatas.height;
					texture.mipmaps = texDatas.mipmaps;

				}

				if ( texDatas.mipmapCount === 1 ) {

					texture.minFilter = THREE.LinearFilter;

				}

				texture.format = texDatas.format;
				texture.needsUpdate = true;

				if ( onLoad ) onLoad( texture );

			} );

		}

		return texture;

	}

};

// File:src/materials/Material.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Material = function () {

	Object.defineProperty( this, 'id', { value: THREE.MaterialIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.side = THREE.FrontSide;

	this.opacity = 1;
	this.transparent = false;

	this.blending = THREE.NormalBlending;

	this.blendSrc = THREE.SrcAlphaFactor;
	this.blendDst = THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = THREE.AddEquation;

	this.depthTest = true;
	this.depthWrite = true;

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this.needsUpdate = true;

};

THREE.Material.prototype = {

	constructor: THREE.Material,

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			if ( key in this ) {

				var currentValue = this[ key ];

				if ( currentValue instanceof THREE.Color ) {

					currentValue.set( newValue );

				} else if ( currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ) {

					currentValue.copy( newValue );

				} else if ( key == 'overdraw' ) {

					// ensure overdraw is backwards-compatable with legacy boolean type
					this[ key ] = Number( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

	},

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.2,
				type: 'material',
				generator: 'MaterialExporter'
			},
			uuid: this.uuid,
			type: this.type
		};

		if ( this.name !== "" ) output.name = this.name;

		if ( this instanceof THREE.MeshBasicMaterial ) {

			output.color = this.color.getHex();
			if ( this.vertexColors !== THREE.NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshLambertMaterial ) {

			output.color = this.color.getHex();
			output.ambient = this.ambient.getHex();
			output.emissive = this.emissive.getHex();
			if ( this.vertexColors !== THREE.NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshPhongMaterial ) {

			output.color = this.color.getHex();
			output.ambient = this.ambient.getHex();
			output.emissive = this.emissive.getHex();
			output.specular = this.specular.getHex();
			output.shininess = this.shininess;
			if ( this.vertexColors !== THREE.NoColors ) output.vertexColors = this.vertexColors;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshNormalMaterial ) {

			if ( this.shading !== THREE.FlatShading ) output.shading = this.shading;
			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.MeshDepthMaterial ) {

			if ( this.blending !== THREE.NormalBlending ) output.blending = this.blending;
			if ( this.side !== THREE.FrontSide ) output.side = this.side;

		} else if ( this instanceof THREE.ShaderMaterial ) {

			output.uniforms = this.uniforms;
			output.vertexShader = this.vertexShader;
			output.fragmentShader = this.fragmentShader;

		} else if ( this instanceof THREE.SpriteMaterial ) {

			output.color = this.color.getHex();

		}

		if ( this.opacity < 1 ) output.opacity = this.opacity;
		if ( this.transparent !== false ) output.transparent = this.transparent;
		if ( this.wireframe !== false ) output.wireframe = this.wireframe;

		return output;

	},

	clone: function ( material ) {

		if ( material === undefined ) material = new THREE.Material();

		material.name = this.name;

		material.side = this.side;

		material.opacity = this.opacity;
		material.transparent = this.transparent;

		material.blending = this.blending;

		material.blendSrc = this.blendSrc;
		material.blendDst = this.blendDst;
		material.blendEquation = this.blendEquation;

		material.depthTest = this.depthTest;
		material.depthWrite = this.depthWrite;

		material.polygonOffset = this.polygonOffset;
		material.polygonOffsetFactor = this.polygonOffsetFactor;
		material.polygonOffsetUnits = this.polygonOffsetUnits;

		material.alphaTest = this.alphaTest;

		material.overdraw = this.overdraw;

		material.visible = this.visible;

		return material;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Material.prototype );

THREE.MaterialIdCount = 0;

// File:src/materials/LineBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round",
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineBasicMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;
	this.linecap = 'round';
	this.linejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.fog = true;

	this.setValues( parameters );

};

THREE.LineBasicMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.LineBasicMaterial.prototype.clone = function () {

	var material = new THREE.LineBasicMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.linewidth = this.linewidth;
	material.linecap = this.linecap;
	material.linejoin = this.linejoin;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// File:src/materials/LineDashedMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>,
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineDashedMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineDashedMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;

	this.scale = 1;
	this.dashSize = 3;
	this.gapSize = 1;

	this.vertexColors = false;

	this.fog = true;

	this.setValues( parameters );

};

THREE.LineDashedMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.LineDashedMaterial.prototype.clone = function () {

	var material = new THREE.LineDashedMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.linewidth = this.linewidth;

	material.scale = this.scale;
	material.dashSize = this.dashSize;
	material.gapSize = this.gapSize;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// File:src/materials/MeshBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.MeshBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshBasicMaterial';

	this.color = new THREE.Color( 0xffffff ); // emissive

	this.map = null;

	this.lightMap = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshBasicMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshBasicMaterial.prototype.clone = function () {

	var material = new THREE.MeshBasicMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.map = this.map;

	material.lightMap = this.lightMap;

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;

	return material;

};

// File:src/materials/MeshLambertMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  emissive: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshLambertMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshLambertMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.ambient = new THREE.Color( 0xffffff );
	this.emissive = new THREE.Color( 0x000000 );

	this.wrapAround = false;
	this.wrapRGB = new THREE.Vector3( 1, 1, 1 );

	this.map = null;

	this.lightMap = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshLambertMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshLambertMaterial.prototype.clone = function () {

	var material = new THREE.MeshLambertMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.ambient.copy( this.ambient );
	material.emissive.copy( this.emissive );

	material.wrapAround = this.wrapAround;
	material.wrapRGB.copy( this.wrapRGB );

	material.map = this.map;

	material.lightMap = this.lightMap;

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/MeshPhongMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  emissive: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshPhongMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshPhongMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.ambient = new THREE.Color( 0xffffff );
	this.emissive = new THREE.Color( 0x000000 );
	this.specular = new THREE.Color( 0x111111 );
	this.shininess = 30;

	this.metal = false;

	this.wrapAround = false;
	this.wrapRGB = new THREE.Vector3( 1, 1, 1 );

	this.map = null;

	this.lightMap = null;

	this.bumpMap = null;
	this.bumpScale = 1;

	this.normalMap = null;
	this.normalScale = new THREE.Vector2( 1, 1 );

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshPhongMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshPhongMaterial.prototype.clone = function () {

	var material = new THREE.MeshPhongMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.ambient.copy( this.ambient );
	material.emissive.copy( this.emissive );
	material.specular.copy( this.specular );
	material.shininess = this.shininess;

	material.metal = this.metal;

	material.wrapAround = this.wrapAround;
	material.wrapRGB.copy( this.wrapRGB );

	material.map = this.map;

	material.lightMap = this.lightMap;

	material.bumpMap = this.bumpMap;
	material.bumpScale = this.bumpScale;

	material.normalMap = this.normalMap;
	material.normalScale.copy( this.normalScale );

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/MeshDepthMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshDepthMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshDepthMaterial';

	this.morphTargets = false;
	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.setValues( parameters );

};

THREE.MeshDepthMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshDepthMaterial.prototype.clone = function () {

	var material = new THREE.MeshDepthMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};

// File:src/materials/MeshNormalMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  shading: THREE.FlatShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshNormalMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	this.type = 'MeshNormalMaterial';

	this.shading = THREE.FlatShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshNormalMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshNormalMaterial.prototype.clone = function () {

	var material = new THREE.MeshNormalMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};

// File:src/materials/MeshFaceMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MeshFaceMaterial = function ( materials ) {

	this.uuid = THREE.Math.generateUUID();

	this.type = 'MeshFaceMaterial';
	
	this.materials = materials instanceof Array ? materials : [];

};

THREE.MeshFaceMaterial.prototype = {

	constructor: THREE.MeshFaceMaterial,

	toJSON: function () {

		var output = {
			metadata: {
				version: 4.2,
				type: 'material',
				generator: 'MaterialExporter'
			},
			uuid: this.uuid,
			type: this.type,
			materials: []
		};

		for ( var i = 0, l = this.materials.length; i < l; i ++ ) {

			output.materials.push( this.materials[ i ].toJSON() );

		}

		return output;

	},

	clone: function () {

		var material = new THREE.MeshFaceMaterial();

		for ( var i = 0; i < this.materials.length; i ++ ) {

			material.materials.push( this.materials[ i ].clone() );

		}

		return material;

	}

};

// File:src/materials/PointCloudMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  vertexColors: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.PointCloudMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'PointCloudMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.map = null;

	this.size = 1;
	this.sizeAttenuation = true;

	this.vertexColors = THREE.NoColors;

	this.fog = true;

	this.setValues( parameters );

};

THREE.PointCloudMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.PointCloudMaterial.prototype.clone = function () {

	var material = new THREE.PointCloudMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.map = this.map;

	material.size = this.size;
	material.sizeAttenuation = this.sizeAttenuation;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// backwards compatibility

THREE.ParticleBasicMaterial = function ( parameters ) {

	console.warn( 'THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial.' );
	return new THREE.PointCloudMaterial( parameters );

};

THREE.ParticleSystemMaterial = function ( parameters ) {

	console.warn( 'THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial.' );
	return new THREE.PointCloudMaterial( parameters );

};

// File:src/materials/ShaderMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'ShaderMaterial';

	this.defines = {};
	this.uniforms = {};
	this.attributes = null;

	this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
	this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';

	this.shading = THREE.SmoothShading;

	this.linewidth = 1;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false; // set to use scene fog

	this.lights = false; // set to use scene lights

	this.vertexColors = THREE.NoColors; // set to use "color" attribute stream

	this.skinning = false; // set to use skinning attribute streams

	this.morphTargets = false; // set to use morph targets
	this.morphNormals = false; // set to use morph normals

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	this.defaultAttributeValues = {
		'color': [ 1, 1, 1 ],
		'uv': [ 0, 0 ],
		'uv2': [ 0, 0 ]
	};

	this.index0AttributeName = undefined;

	this.setValues( parameters );

};

THREE.ShaderMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.ShaderMaterial.prototype.clone = function () {

	var material = new THREE.ShaderMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.fragmentShader = this.fragmentShader;
	material.vertexShader = this.vertexShader;

	material.uniforms = THREE.UniformsUtils.clone( this.uniforms );

	material.attributes = this.attributes;
	material.defines = this.defines;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	material.fog = this.fog;

	material.lights = this.lights;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;

	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/RawShaderMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.RawShaderMaterial = function ( parameters ) {

	THREE.ShaderMaterial.call( this, parameters );

	this.type = 'RawShaderMaterial';

};

THREE.RawShaderMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

THREE.RawShaderMaterial.prototype.clone = function () {

	var material = new THREE.RawShaderMaterial();

	THREE.ShaderMaterial.prototype.clone.call( this, material );

	return material;

};

// File:src/materials/SpriteMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2(),
 *
 *  fog: <bool>
 * }
 */

THREE.SpriteMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'SpriteMaterial';

	this.color = new THREE.Color( 0xffffff );
	this.map = null;

	this.rotation = 0;

	this.fog = false;

	// set parameters

	this.setValues( parameters );

};

THREE.SpriteMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.SpriteMaterial.prototype.clone = function () {

	var material = new THREE.SpriteMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.map = this.map;

	material.rotation = this.rotation;

	material.fog = this.fog;

	return material;

};

// File:src/textures/Texture.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.Texture = function ( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	Object.defineProperty( this, 'id', { value: THREE.TextureIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';

	this.image = image !== undefined ? image : THREE.Texture.DEFAULT_IMAGE;
	this.mipmaps = [];

	this.mapping = mapping !== undefined ? mapping : THREE.Texture.DEFAULT_MAPPING;

	this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

	this.format = format !== undefined ? format : THREE.RGBAFormat;
	this.type = type !== undefined ? type : THREE.UnsignedByteType;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.generateMipmaps = true;
	this.premultiplyAlpha = false;
	this.flipY = true;
	this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

	this._needsUpdate = false;
	this.onUpdate = null;

};

THREE.Texture.DEFAULT_IMAGE = undefined;
THREE.Texture.DEFAULT_MAPPING = new THREE.UVMapping();

THREE.Texture.prototype = {

	constructor: THREE.Texture,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	clone: function ( texture ) {

		if ( texture === undefined ) texture = new THREE.Texture();

		texture.image = this.image;
		texture.mipmaps = this.mipmaps.slice( 0 );

		texture.mapping = this.mapping;

		texture.wrapS = this.wrapS;
		texture.wrapT = this.wrapT;

		texture.magFilter = this.magFilter;
		texture.minFilter = this.minFilter;

		texture.anisotropy = this.anisotropy;

		texture.format = this.format;
		texture.type = this.type;

		texture.offset.copy( this.offset );
		texture.repeat.copy( this.repeat );

		texture.generateMipmaps = this.generateMipmaps;
		texture.premultiplyAlpha = this.premultiplyAlpha;
		texture.flipY = this.flipY;
		texture.unpackAlignment = this.unpackAlignment;

		return texture;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Texture.prototype );

THREE.TextureIdCount = 0;

// File:src/textures/CubeTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CubeTexture = function ( images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.images = images;

};

THREE.CubeTexture.prototype = Object.create( THREE.Texture.prototype );

THREE.CubeTexture.clone = function ( texture ) {

	if ( texture === undefined ) texture = new THREE.CubeTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	texture.images = this.images;

	return texture;

};

// File:src/textures/CompressedTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CompressedTexture = function ( mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.image = { width: width, height: height };
	this.mipmaps = mipmaps;

	// no flipping for cube textures
	// (also flipping doesn't work for compressed textures )

	this.flipY = false;

	// can't generate mipmaps for compressed textures
	// mips must be embedded in DDS files

	this.generateMipmaps = false;

};

THREE.CompressedTexture.prototype = Object.create( THREE.Texture.prototype );

THREE.CompressedTexture.prototype.clone = function () {

	var texture = new THREE.CompressedTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	return texture;

};

// File:src/textures/DataTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DataTexture = function ( data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.image = { data: data, width: width, height: height };

};

THREE.DataTexture.prototype = Object.create( THREE.Texture.prototype );

THREE.DataTexture.prototype.clone = function () {

	var texture = new THREE.DataTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	return texture;

};

// File:src/textures/VideoTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.VideoTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.generateMipmaps = false;

	var scope = this;

	var update = function () {

		requestAnimationFrame( update );

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			scope.needsUpdate = true;

		}

	};

	update();

};

THREE.VideoTexture.prototype = Object.create( THREE.Texture.prototype );

// File:src/objects/Group.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Group = function () {

	THREE.Object3D.call( this );

	this.type = 'Group';

};

THREE.Group.prototype = Object.create( THREE.Object3D.prototype );

// File:src/objects/PointCloud.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.PointCloud = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'PointCloud';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.PointCloudMaterial( { color: Math.random() * 0xffffff } );

	this.sortParticles = false;

};

THREE.PointCloud.prototype = Object.create( THREE.Object3D.prototype );

THREE.PointCloud.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();

	return function ( raycaster, intersects ) {

		var object = this;
		var geometry = object.geometry;
		var threshold = raycaster.params.PointCloud.threshold;

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false ) {

				return;

			}

		}

		var localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		var position = new THREE.Vector3();

		var testPoint = function ( point, index ) {

			var rayPointDistance = ray.distanceToPoint( point );

			if ( rayPointDistance < localThreshold ) {

				var intersectPoint = ray.closestPointToPoint( point );
				intersectPoint.applyMatrix4( object.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectPoint );

				intersects.push( {

					distance: distance,
					distanceToRay: rayPointDistance,
					point: intersectPoint.clone(),
					index: index,
					face: null,
					object: object

				} );

			}

		};

		if ( geometry instanceof THREE.BufferGeometry ) {

			var attributes = geometry.attributes;
			var positions = attributes.position.array;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					var offset = {
						start: 0,
						count: indices.length,
						index: 0
					};

					offsets = [ offset ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i ++ ) {

						var a = index + indices[ i ];

						position.fromArray( positions, a * 3 );

						testPoint( position, a );

					}

				}

			} else {

				var pointCount = positions.length / 3;

				for ( var i = 0; i < pointCount; i ++ ) {

					position.set(
						positions[ 3 * i ],
						positions[ 3 * i + 1 ],
						positions[ 3 * i + 2 ]
					);

					testPoint( position, i );

				}

			}

		} else {

			var vertices = this.geometry.vertices;

			for ( var i = 0; i < vertices.length; i ++ ) {

				testPoint( vertices[ i ], i );

			}

		}

	};

}() );

THREE.PointCloud.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.PointCloud( this.geometry, this.material );

	object.sortParticles = this.sortParticles;

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// Backwards compatibility

THREE.ParticleSystem = function ( geometry, material ) {

	console.warn( 'THREE.ParticleSystem has been renamed to THREE.PointCloud.' );
	return new THREE.PointCloud( geometry, material );

};

// File:src/objects/Line.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Line = function ( geometry, material, mode ) {

	THREE.Object3D.call( this );

	this.type = 'Line';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } );

	this.mode = ( mode !== undefined ) ? mode : THREE.LineStrip;

};

THREE.LineStrip = 0;
THREE.LinePieces = 1;

THREE.Line.prototype = Object.create( THREE.Object3D.prototype );

THREE.Line.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	return function ( raycaster, intersects ) {

		var precision = raycaster.linePrecision;
		var precisionSq = precision * precision;

		var geometry = this.geometry;

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		// Checking boundingSphere distance to ray

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {

			return;

		}

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		/* if ( geometry instanceof THREE.BufferGeometry ) {

		} else */ if ( geometry instanceof THREE.Geometry ) {

			var vertices = geometry.vertices;
			var nbVertices = vertices.length;
			var interSegment = new THREE.Vector3();
			var interRay = new THREE.Vector3();
			var step = this.mode === THREE.LineStrip ? 1 : 2;

			for ( var i = 0; i < nbVertices - 1; i = i + step ) {

				var distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );

				if ( distSq > precisionSq ) continue;

				var distance = ray.origin.distanceTo( interRay );

				if ( distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					// What do we want? intersection point on the ray or on the segment??
					// point: raycaster.ray.at( distance ),
					point: interSegment.clone().applyMatrix4( this.matrixWorld ),
					face: null,
					faceIndex: null,
					object: this

				} );

			}

		}

	};

}() );

THREE.Line.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Line( this.geometry, this.material, this.mode );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// File:src/objects/Mesh.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'Mesh';
	
	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );

	this.updateMorphTargets();

};

THREE.Mesh.prototype = Object.create( THREE.Object3D.prototype );

THREE.Mesh.prototype.updateMorphTargets = function () {

	if ( this.geometry.morphTargets !== undefined && this.geometry.morphTargets.length > 0 ) {

		this.morphTargetBase = - 1;
		this.morphTargetForcedOrder = [];
		this.morphTargetInfluences = [];
		this.morphTargetDictionary = {};

		for ( var m = 0, ml = this.geometry.morphTargets.length; m < ml; m ++ ) {

			this.morphTargetInfluences.push( 0 );
			this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;

		}

	}

};

THREE.Mesh.prototype.getMorphTargetIndexByName = function ( name ) {

	if ( this.morphTargetDictionary[ name ] !== undefined ) {

		return this.morphTargetDictionary[ name ];

	}

	console.log( 'THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.' );

	return 0;

};


THREE.Mesh.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	var vA = new THREE.Vector3();
	var vB = new THREE.Vector3();
	var vC = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		var geometry = this.geometry;

		// Checking boundingSphere distance to ray

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {

			return;

		}

		// Check boundingBox before continuing

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false )  {

				return;

			}

		}

		if ( geometry instanceof THREE.BufferGeometry ) {

			var material = this.material;

			if ( material === undefined ) return;

			var attributes = geometry.attributes;

			var a, b, c;
			var precision = raycaster.precision;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var positions = attributes.position.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					offsets = [ { start: 0, count: indices.length, index: 0 } ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						a = index + indices[ i ];
						b = index + indices[ i + 1 ];
						c = index + indices[ i + 2 ];

						vA.fromArray( positions, a * 3 );
						vB.fromArray( positions, b * 3 );
						vC.fromArray( positions, c * 3 );

						if ( material.side === THREE.BackSide ) {

							var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );

						} else {

							var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );

						}

						if ( intersectionPoint === null ) continue;

						intersectionPoint.applyMatrix4( this.matrixWorld );

						var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

						if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							point: intersectionPoint,
							face: new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) ),
							faceIndex: null,
							object: this

						} );

					}

				}

			} else {

				var positions = attributes.position.array;

				for ( var i = 0, j = 0, il = positions.length; i < il; i += 3, j += 9 ) {

					a = i;
					b = i + 1;
					c = i + 2;

					vA.fromArray( positions, j );
					vB.fromArray( positions, j + 3 );
					vC.fromArray( positions, j + 6 );

					if ( material.side === THREE.BackSide ) {

						var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );

					} else {

						var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );

					}

					if ( intersectionPoint === null ) continue;

					intersectionPoint.applyMatrix4( this.matrixWorld );

					var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

					if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						point: intersectionPoint,
						face: new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) ),
						faceIndex: null,
						object: this

					} );

				}

			}

		} else if ( geometry instanceof THREE.Geometry ) {

			var isFaceMaterial = this.material instanceof THREE.MeshFaceMaterial;
			var objectMaterials = isFaceMaterial === true ? this.material.materials : null;

			var a, b, c, d;
			var precision = raycaster.precision;

			var vertices = geometry.vertices;

			for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				var face = geometry.faces[ f ];

				var material = isFaceMaterial === true ? objectMaterials[ face.materialIndex ] : this.material;

				if ( material === undefined ) continue;

				a = vertices[ face.a ];
				b = vertices[ face.b ];
				c = vertices[ face.c ];

				if ( material.morphTargets === true ) {

					var morphTargets = geometry.morphTargets;
					var morphInfluences = this.morphTargetInfluences;

					vA.set( 0, 0, 0 );
					vB.set( 0, 0, 0 );
					vC.set( 0, 0, 0 );

					for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

						var influence = morphInfluences[ t ];

						if ( influence === 0 ) continue;

						var targets = morphTargets[ t ].vertices;

						vA.x += ( targets[ face.a ].x - a.x ) * influence;
						vA.y += ( targets[ face.a ].y - a.y ) * influence;
						vA.z += ( targets[ face.a ].z - a.z ) * influence;

						vB.x += ( targets[ face.b ].x - b.x ) * influence;
						vB.y += ( targets[ face.b ].y - b.y ) * influence;
						vB.z += ( targets[ face.b ].z - b.z ) * influence;

						vC.x += ( targets[ face.c ].x - c.x ) * influence;
						vC.y += ( targets[ face.c ].y - c.y ) * influence;
						vC.z += ( targets[ face.c ].z - c.z ) * influence;

					}

					vA.add( a );
					vB.add( b );
					vC.add( c );

					a = vA;
					b = vB;
					c = vC;

				}

				if ( material.side === THREE.BackSide ) {

					var intersectionPoint = ray.intersectTriangle( c, b, a, true );

				} else {

					var intersectionPoint = ray.intersectTriangle( a, b, c, material.side !== THREE.DoubleSide );

				}

				if ( intersectionPoint === null ) continue;

				intersectionPoint.applyMatrix4( this.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

				if ( distance < precision || distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					point: intersectionPoint,
					face: face,
					faceIndex: f,
					object: this

				} );

			}

		}

	};

}() );

THREE.Mesh.prototype.clone = function ( object, recursive ) {

	if ( object === undefined ) object = new THREE.Mesh( this.geometry, this.material );

	THREE.Object3D.prototype.clone.call( this, object, recursive );

	return object;

};

// File:src/objects/Bone.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.Bone = function ( belongsToSkin ) {

	THREE.Object3D.call( this );

	this.skin = belongsToSkin;

};

THREE.Bone.prototype = Object.create( THREE.Object3D.prototype );


// File:src/objects/Skeleton.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */

THREE.Skeleton = function ( bones, boneInverses, useVertexTexture ) {

	this.useVertexTexture = useVertexTexture !== undefined ? useVertexTexture : true;

	this.identityMatrix = new THREE.Matrix4();

	// copy the bone array

	bones = bones || [];

	this.bones = bones.slice( 0 );

	// create a bone texture or an array of floats

	if ( this.useVertexTexture ) {

		// layout (1 matrix = 4 pixels)
		//      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
		//  with  8x8  pixel texture max   16 bones  (8 * 8  / 4)
		//       16x16 pixel texture max   64 bones (16 * 16 / 4)
		//       32x32 pixel texture max  256 bones (32 * 32 / 4)
		//       64x64 pixel texture max 1024 bones (64 * 64 / 4)

		var size;

		if ( this.bones.length > 256 )
			size = 64;
		else if ( this.bones.length > 64 )
			size = 32;
		else if ( this.bones.length > 16 )
			size = 16;
		else
			size = 8;

		this.boneTextureWidth = size;
		this.boneTextureHeight = size;

		this.boneMatrices = new Float32Array( this.boneTextureWidth * this.boneTextureHeight * 4 ); // 4 floats per RGBA pixel
		this.boneTexture = new THREE.DataTexture( this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType );
		this.boneTexture.minFilter = THREE.NearestFilter;
		this.boneTexture.magFilter = THREE.NearestFilter;
		this.boneTexture.generateMipmaps = false;
		this.boneTexture.flipY = false;

	} else {

		this.boneMatrices = new Float32Array( 16 * this.bones.length );

	}

	// use the supplied bone inverses or calculate the inverses

	if ( boneInverses === undefined ) {

		this.calculateInverses();

	} else {

		if ( this.bones.length === boneInverses.length ) {

			this.boneInverses = boneInverses.slice( 0 );

		} else {

			console.warn( 'THREE.Skeleton bonInverses is the wrong length.' );

			this.boneInverses = [];

			for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

				this.boneInverses.push( new THREE.Matrix4() );

			}

		}

	}

};

THREE.Skeleton.prototype.calculateInverses = function () {

	this.boneInverses = [];

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		var inverse = new THREE.Matrix4();

		if ( this.bones[ b ] ) {

			inverse.getInverse( this.bones[ b ].matrixWorld );

		}

		this.boneInverses.push( inverse );

	}

};

THREE.Skeleton.prototype.pose = function () {

	var bone;

	// recover the bind-time world matrices

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		bone = this.bones[ b ];

		if ( bone ) {

			bone.matrixWorld.getInverse( this.boneInverses[ b ] );

		}

	}

	// compute the local matrices, positions, rotations and scales

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		bone = this.bones[ b ];

		if ( bone ) {

			if ( bone.parent ) {

				bone.matrix.getInverse( bone.parent.matrixWorld );
				bone.matrix.multiply( bone.matrixWorld );

			} else {

				bone.matrix.copy( bone.matrixWorld );

			}

			bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

		}

	}

};

THREE.Skeleton.prototype.update = ( function () {

	var offsetMatrix = new THREE.Matrix4();
	
	return function () {

		// flatten bone matrices to array

		for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

			// compute the offset between the current and the original transform

			var matrix = this.bones[ b ] ? this.bones[ b ].matrixWorld : this.identityMatrix;

			offsetMatrix.multiplyMatrices( matrix, this.boneInverses[ b ] );
			offsetMatrix.flattenToArrayOffset( this.boneMatrices, b * 16 );

		}

		if ( this.useVertexTexture ) {

			this.boneTexture.needsUpdate = true;

		}
		
	};

} )();


// File:src/objects/SkinnedMesh.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.SkinnedMesh = function ( geometry, material, useVertexTexture ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'SkinnedMesh';

	this.bindMode = "attached";
	this.bindMatrix = new THREE.Matrix4();
	this.bindMatrixInverse = new THREE.Matrix4();

	// init bones

	// TODO: remove bone creation as there is no reason (other than
	// convenience) for THREE.SkinnedMesh to do this.

	var bones = [];

	if ( this.geometry && this.geometry.bones !== undefined ) {

		var bone, gbone, p, q, s;

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

			gbone = this.geometry.bones[ b ];

			p = gbone.pos;
			q = gbone.rotq;
			s = gbone.scl;

			bone = new THREE.Bone( this );
			bones.push( bone );

			bone.name = gbone.name;
			bone.position.set( p[ 0 ], p[ 1 ], p[ 2 ] );
			bone.quaternion.set( q[ 0 ], q[ 1 ], q[ 2 ], q[ 3 ] );

			if ( s !== undefined ) {

				bone.scale.set( s[ 0 ], s[ 1 ], s[ 2 ] );

			} else {

				bone.scale.set( 1, 1, 1 );

			}

		}

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

			gbone = this.geometry.bones[ b ];

			if ( gbone.parent !== - 1 ) {

				bones[ gbone.parent ].add( bones[ b ] );

			} else {

				this.add( bones[ b ] );

			}

		}

	}

	this.normalizeSkinWeights();

	this.updateMatrixWorld( true );
	this.bind( new THREE.Skeleton( bones, undefined, useVertexTexture ) );

};


THREE.SkinnedMesh.prototype = Object.create( THREE.Mesh.prototype );

THREE.SkinnedMesh.prototype.bind = function( skeleton, bindMatrix ) {

	this.skeleton = skeleton;

	if ( bindMatrix === undefined ) {

		this.updateMatrixWorld( true );

		bindMatrix = this.matrixWorld;

	}

	this.bindMatrix.copy( bindMatrix );
	this.bindMatrixInverse.getInverse( bindMatrix );

};

THREE.SkinnedMesh.prototype.pose = function () {

	this.skeleton.pose();

};

THREE.SkinnedMesh.prototype.normalizeSkinWeights = function () {

	if ( this.geometry instanceof THREE.Geometry ) {

		for ( var i = 0; i < this.geometry.skinIndices.length; i ++ ) {

			var sw = this.geometry.skinWeights[ i ];

			var scale = 1.0 / sw.lengthManhattan();

			if ( scale !== Infinity ) {

				sw.multiplyScalar( scale );

			} else {

				sw.set( 1 ); // this will be normalized by the shader anyway

			}

		}

	} else {

		// skinning weights assumed to be normalized for THREE.BufferGeometry

	}

};

THREE.SkinnedMesh.prototype.updateMatrixWorld = function( force ) {

	THREE.Mesh.prototype.updateMatrixWorld.call( this, true );

	if ( this.bindMode === "attached" ) {

		this.bindMatrixInverse.getInverse( this.matrixWorld );

	} else if ( this.bindMode === "detached" ) {

		this.bindMatrixInverse.getInverse( this.bindMatrix );

	} else {

		console.warn( 'THREE.SkinnedMesh unreckognized bindMode: ' + this.bindMode );

	}

};

THREE.SkinnedMesh.prototype.clone = function( object ) {

	if ( object === undefined ) {

		object = new THREE.SkinnedMesh( this.geometry, this.material, this.useVertexTexture );

	}

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};


// File:src/objects/MorphAnimMesh.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphAnimMesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'MorphAnimMesh';

	// API

	this.duration = 1000; // milliseconds
	this.mirroredLoop = false;
	this.time = 0;

	// internals

	this.lastKeyframe = 0;
	this.currentKeyframe = 0;

	this.direction = 1;
	this.directionBackwards = false;

	this.setFrameRange( 0, this.geometry.morphTargets.length - 1 );

};

THREE.MorphAnimMesh.prototype = Object.create( THREE.Mesh.prototype );

THREE.MorphAnimMesh.prototype.setFrameRange = function ( start, end ) {

	this.startKeyframe = start;
	this.endKeyframe = end;

	this.length = this.endKeyframe - this.startKeyframe + 1;

};

THREE.MorphAnimMesh.prototype.setDirectionForward = function () {

	this.direction = 1;
	this.directionBackwards = false;

};

THREE.MorphAnimMesh.prototype.setDirectionBackward = function () {

	this.direction = - 1;
	this.directionBackwards = true;

};

THREE.MorphAnimMesh.prototype.parseAnimations = function () {

	var geometry = this.geometry;

	if ( ! geometry.animations ) geometry.animations = {};

	var firstAnimation, animations = geometry.animations;

	var pattern = /([a-z]+)_?(\d+)/;

	for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

		var morph = geometry.morphTargets[ i ];
		var parts = morph.name.match( pattern );

		if ( parts && parts.length > 1 ) {

			var label = parts[ 1 ];
			var num = parts[ 2 ];

			if ( ! animations[ label ] ) animations[ label ] = { start: Infinity, end: - Infinity };

			var animation = animations[ label ];

			if ( i < animation.start ) animation.start = i;
			if ( i > animation.end ) animation.end = i;

			if ( ! firstAnimation ) firstAnimation = label;

		}

	}

	geometry.firstAnimation = firstAnimation;

};

THREE.MorphAnimMesh.prototype.setAnimationLabel = function ( label, start, end ) {

	if ( ! this.geometry.animations ) this.geometry.animations = {};

	this.geometry.animations[ label ] = { start: start, end: end };

};

THREE.MorphAnimMesh.prototype.playAnimation = function ( label, fps ) {

	var animation = this.geometry.animations[ label ];

	if ( animation ) {

		this.setFrameRange( animation.start, animation.end );
		this.duration = 1000 * ( ( animation.end - animation.start ) / fps );
		this.time = 0;

	} else {

		console.warn( 'animation[' + label + '] undefined' );

	}

};

THREE.MorphAnimMesh.prototype.updateAnimation = function ( delta ) {

	var frameTime = this.duration / this.length;

	this.time += this.direction * delta;

	if ( this.mirroredLoop ) {

		if ( this.time > this.duration || this.time < 0 ) {

			this.direction *= - 1;

			if ( this.time > this.duration ) {

				this.time = this.duration;
				this.directionBackwards = true;

			}

			if ( this.time < 0 ) {

				this.time = 0;
				this.directionBackwards = false;

			}

		}

	} else {

		this.time = this.time % this.duration;

		if ( this.time < 0 ) this.time += this.duration;

	}

	var keyframe = this.startKeyframe + THREE.Math.clamp( Math.floor( this.time / frameTime ), 0, this.length - 1 );

	if ( keyframe !== this.currentKeyframe ) {

		this.morphTargetInfluences[ this.lastKeyframe ] = 0;
		this.morphTargetInfluences[ this.currentKeyframe ] = 1;

		this.morphTargetInfluences[ keyframe ] = 0;

		this.lastKeyframe = this.currentKeyframe;
		this.currentKeyframe = keyframe;

	}

	var mix = ( this.time % frameTime ) / frameTime;

	if ( this.directionBackwards ) {

		mix = 1 - mix;

	}

	this.morphTargetInfluences[ this.currentKeyframe ] = mix;
	this.morphTargetInfluences[ this.lastKeyframe ] = 1 - mix;

};

THREE.MorphAnimMesh.prototype.interpolateTargets = function ( a, b, t ) {

	var influences = this.morphTargetInfluences;

	for ( var i = 0, l = influences.length; i < l; i ++ ) {

		influences[ i ] = 0;

	}

	if ( a > -1 ) influences[ a ] = 1 - t;
	if ( b > -1 ) influences[ b ] = t;

};

THREE.MorphAnimMesh.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.MorphAnimMesh( this.geometry, this.material );

	object.duration = this.duration;
	object.mirroredLoop = this.mirroredLoop;
	object.time = this.time;

	object.lastKeyframe = this.lastKeyframe;
	object.currentKeyframe = this.currentKeyframe;

	object.direction = this.direction;
	object.directionBackwards = this.directionBackwards;

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};

// File:src/objects/LOD.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LOD = function () {

	THREE.Object3D.call( this );

	this.objects = [];

};


THREE.LOD.prototype = Object.create( THREE.Object3D.prototype );

THREE.LOD.prototype.addLevel = function ( object, distance ) {

	if ( distance === undefined ) distance = 0;

	distance = Math.abs( distance );

	for ( var l = 0; l < this.objects.length; l ++ ) {

		if ( distance < this.objects[ l ].distance ) {

			break;

		}

	}

	this.objects.splice( l, 0, { distance: distance, object: object } );
	this.add( object );

};

THREE.LOD.prototype.getObjectForDistance = function ( distance ) {

	for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

		if ( distance < this.objects[ i ].distance ) {

			break;

		}

	}

	return this.objects[ i - 1 ].object;

};

THREE.LOD.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.origin.distanceTo( matrixPosition );

		this.getObjectForDistance( distance ).raycast( raycaster, intersects );

	};

}() );

THREE.LOD.prototype.update = function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( camera ) {

		if ( this.objects.length > 1 ) {

			v1.setFromMatrixPosition( camera.matrixWorld );
			v2.setFromMatrixPosition( this.matrixWorld );

			var distance = v1.distanceTo( v2 );

			this.objects[ 0 ].object.visible = true;

			for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

				if ( distance >= this.objects[ i ].distance ) {

					this.objects[ i - 1 ].object.visible = false;
					this.objects[ i     ].object.visible = true;

				} else {

					break;

				}

			}

			for ( ; i < l; i ++ ) {

				this.objects[ i ].object.visible = false;

			}

		}

	};

}();

THREE.LOD.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.LOD();

	THREE.Object3D.prototype.clone.call( this, object );

	for ( var i = 0, l = this.objects.length; i < l; i ++ ) {
		var x = this.objects[ i ].object.clone();
		x.visible = i === 0;
		object.addLevel( x, this.objects[ i ].distance );
	}

	return object;

};

// File:src/objects/Sprite.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Sprite = ( function () {

	var indices = new Uint16Array( [ 0, 1, 2,  0, 2, 3 ] );
	var vertices = new Float32Array( [ - 0.5, - 0.5, 0,   0.5, - 0.5, 0,   0.5, 0.5, 0,   - 0.5, 0.5, 0 ] );
	var uvs = new Float32Array( [ 0, 0,   1, 0,   1, 1,   0, 1 ] );

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	return function ( material ) {

		THREE.Object3D.call( this );

		this.type = 'Sprite';

		this.geometry = geometry;
		this.material = ( material !== undefined ) ? material : new THREE.SpriteMaterial();

	};

} )();

THREE.Sprite.prototype = Object.create( THREE.Object3D.prototype );

THREE.Sprite.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.distanceToPoint( matrixPosition );

		if ( distance > this.scale.x ) {

			return;

		}

		intersects.push( {

			distance: distance,
			point: this.position,
			face: null,
			object: this

		} );

	};

}() );

THREE.Sprite.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Sprite( this.material );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// Backwards compatibility

THREE.Particle = THREE.Sprite;

// File:src/objects/LensFlare.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlare = function ( texture, size, distance, blending, color ) {

	THREE.Object3D.call( this );

	this.lensFlares = [];

	this.positionScreen = new THREE.Vector3();
	this.customUpdateCallback = undefined;

	if( texture !== undefined ) {

		this.add( texture, size, distance, blending, color );

	}

};

THREE.LensFlare.prototype = Object.create( THREE.Object3D.prototype );


/*
 * Add: adds another flare
 */

THREE.LensFlare.prototype.add = function ( texture, size, distance, blending, color, opacity ) {

	if ( size === undefined ) size = - 1;
	if ( distance === undefined ) distance = 0;
	if ( opacity === undefined ) opacity = 1;
	if ( color === undefined ) color = new THREE.Color( 0xffffff );
	if ( blending === undefined ) blending = THREE.NormalBlending;

	distance = Math.min( distance, Math.max( 0, distance ) );

	this.lensFlares.push( {
		texture: texture, 			// THREE.Texture
		size: size, 				// size in pixels (-1 = use texture.width)
		distance: distance, 		// distance (0-1) from light source (0=at light source)
		x: 0, y: 0, z: 0,			// screen position (-1 => 1) z = 0 is ontop z = 1 is back
		scale: 1, 					// scale
		rotation: 1, 				// rotation
		opacity: opacity,			// opacity
		color: color,				// color
		blending: blending			// blending
	} );

};

/*
 * Update lens flares update positions on all flares based on the screen position
 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
 */

THREE.LensFlare.prototype.updateLensFlares = function () {

	var f, fl = this.lensFlares.length;
	var flare;
	var vecX = - this.positionScreen.x * 2;
	var vecY = - this.positionScreen.y * 2;

	for( f = 0; f < fl; f ++ ) {

		flare = this.lensFlares[ f ];

		flare.x = this.positionScreen.x + vecX * flare.distance;
		flare.y = this.positionScreen.y + vecY * flare.distance;

		flare.wantedRotation = flare.x * Math.PI * 0.25;
		flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;

	}

};


// File:src/scenes/Scene.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.type = 'Scene';

	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer

};

THREE.Scene.prototype = Object.create( THREE.Object3D.prototype );

THREE.Scene.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Scene();

	THREE.Object3D.prototype.clone.call( this, object );

	if ( this.fog !== null ) object.fog = this.fog.clone();
	if ( this.overrideMaterial !== null ) object.overrideMaterial = this.overrideMaterial.clone();

	object.autoUpdate = this.autoUpdate;
	object.matrixAutoUpdate = this.matrixAutoUpdate;

	return object;

};

// File:src/scenes/Fog.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Fog = function ( color, near, far ) {

	this.name = '';

	this.color = new THREE.Color( color );

	this.near = ( near !== undefined ) ? near : 1;
	this.far = ( far !== undefined ) ? far : 1000;

};

THREE.Fog.prototype.clone = function () {

	return new THREE.Fog( this.color.getHex(), this.near, this.far );

};

// File:src/scenes/FogExp2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FogExp2 = function ( color, density ) {

	this.name = '';

	this.color = new THREE.Color( color );
	this.density = ( density !== undefined ) ? density : 0.00025;

};

THREE.FogExp2.prototype.clone = function () {

	return new THREE.FogExp2( this.color.getHex(), this.density );

};

// File:src/renderers/shaders/ShaderChunk.js

THREE.ShaderChunk = {};

// File:src/renderers/shaders/ShaderChunk/alphatest_fragment.glsl

THREE.ShaderChunk[ 'alphatest_fragment'] = "#ifdef ALPHATEST\n\n	if ( gl_FragColor.a < ALPHATEST ) discard;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_vertex'] = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\ntransformedNormal = normalize( transformedNormal );\n\n#if MAX_DIR_LIGHTS > 0\n\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n	vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n	vec3 dirVector = normalize( lDirection.xyz );\n\n	float dotProduct = dot( transformedNormal, dirVector );\n	vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n	#ifdef DOUBLE_SIDED\n\n		vec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n		#ifdef WRAP_AROUND\n\n			vec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n		#endif\n\n	#endif\n\n	#ifdef WRAP_AROUND\n\n		vec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n		directionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\n		#ifdef DOUBLE_SIDED\n\n			directionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\n		#endif\n\n	#endif\n\n	vLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\n	#ifdef DOUBLE_SIDED\n\n		vLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\n	#endif\n\n}\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( pointLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n		float dotProduct = dot( transformedNormal, lVector );\n\n		vec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n		#ifdef DOUBLE_SIDED\n\n			vec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n			#ifdef WRAP_AROUND\n\n				vec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n			#endif\n\n		#endif\n\n		#ifdef WRAP_AROUND\n\n			vec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n			pointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\n			#ifdef DOUBLE_SIDED\n\n				pointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\n			#endif\n\n		#endif\n\n		vLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n			float lDistance = 1.0;\n			if ( spotLightDistance[ i ] > 0.0 )\n				lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\n			lVector = normalize( lVector );\n\n			float dotProduct = dot( transformedNormal, lVector );\n			vec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\n			#ifdef DOUBLE_SIDED\n\n				vec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\n				#ifdef WRAP_AROUND\n\n					vec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\n				#endif\n\n			#endif\n\n			#ifdef WRAP_AROUND\n\n				vec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n				spotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\n				#ifdef DOUBLE_SIDED\n\n					spotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\n				#endif\n\n			#endif\n\n			vLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n		vec3 lVector = normalize( lDirection.xyz );\n\n		float dotProduct = dot( transformedNormal, lVector );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n		float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_particle_pars_fragment.glsl

THREE.ShaderChunk[ 'map_particle_pars_fragment'] = "#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/default_vertex.glsl

THREE.ShaderChunk[ 'default_vertex'] = "vec4 mvPosition;\n\n#ifdef USE_SKINNING\n\n	mvPosition = modelViewMatrix * skinned;\n\n#endif\n\n#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )\n\n	mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#endif\n\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )\n\n	mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;";

// File:src/renderers/shaders/ShaderChunk/map_pars_fragment.glsl

THREE.ShaderChunk[ 'map_pars_fragment'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif\n\n#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl

THREE.ShaderChunk[ 'skinnormal_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_vertex'] = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_pars_vertex.glsl

THREE.ShaderChunk[ 'lightmap_pars_vertex'] = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_phong_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_fragment'] = "vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n\n#ifdef DOUBLE_SIDED\n\n	normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n#endif\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	vec3 pointDiffuse = vec3( 0.0 );\n	vec3 pointSpecular = vec3( 0.0 );\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( pointLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n\n				// diffuse\n\n		float dotProduct = dot( normal, lVector );\n\n		#ifdef WRAP_AROUND\n\n			float pointDiffuseWeightFull = max( dotProduct, 0.0 );\n			float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float pointDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		pointDiffuse += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n\n				// specular\n\n		vec3 pointHalfVector = normalize( lVector + viewPosition );\n		float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n		float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n		pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	vec3 spotDiffuse = vec3( 0.0 );\n	vec3 spotSpecular = vec3( 0.0 );\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n		float lDistance = 1.0;\n		if ( spotLightDistance[ i ] > 0.0 )\n			lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\n		lVector = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );\n\n					// diffuse\n\n			float dotProduct = dot( normal, lVector );\n\n			#ifdef WRAP_AROUND\n\n				float spotDiffuseWeightFull = max( dotProduct, 0.0 );\n				float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n				vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\n			#else\n\n				float spotDiffuseWeight = max( dotProduct, 0.0 );\n\n			#endif\n\n			spotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n\n					// specular\n\n			vec3 spotHalfVector = normalize( lVector + viewPosition );\n			float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n			float spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\n			float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n			spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	vec3 dirDiffuse = vec3( 0.0 );\n	vec3 dirSpecular = vec3( 0.0 );\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n		vec3 dirVector = normalize( lDirection.xyz );\n\n				// diffuse\n\n		float dotProduct = dot( normal, dirVector );\n\n		#ifdef WRAP_AROUND\n\n			float dirDiffuseWeightFull = max( dotProduct, 0.0 );\n			float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\n			vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\n		#else\n\n			float dirDiffuseWeight = max( dotProduct, 0.0 );\n\n		#endif\n\n		dirDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n\n		// specular\n\n		vec3 dirHalfVector = normalize( dirVector + viewPosition );\n		float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n		float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\n		/*\n		// fresnel term from skin shader\n		const float F0 = 0.128;\n\n		float base = 1.0 - dot( viewPosition, dirHalfVector );\n		float exponential = pow( base, 5.0 );\n\n		float fresnel = exponential + F0 * ( 1.0 - exponential );\n		*/\n\n		/*\n		// fresnel term from fresnel shader\n		const float mFresnelBias = 0.08;\n		const float mFresnelScale = 0.3;\n		const float mFresnelPower = 5.0;\n\n		float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );\n		*/\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		// 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;\n\n		vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n		dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	vec3 hemiDiffuse = vec3( 0.0 );\n	vec3 hemiSpecular = vec3( 0.0 );\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n		vec3 lVector = normalize( lDirection.xyz );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lVector );\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		hemiDiffuse += diffuse * hemiColor;\n\n		// specular (sky light)\n\n		vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n		float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n		float hemiSpecularWeightSky = specularStrength * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );\n\n		// specular (ground light)\n\n		vec3 lVectorGround = -lVector;\n\n		vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n		float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n		float hemiSpecularWeightGround = specularStrength * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );\n\n		float dotProductGround = dot( normal, lVectorGround );\n\n		float specularNormalization = ( shininess + 2.0 ) / 8.0;\n\n		vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n		vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n		hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\n	}\n\n#endif\n\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n\n#if MAX_DIR_LIGHTS > 0\n\n	totalDiffuse += dirDiffuse;\n	totalSpecular += dirSpecular;\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	totalDiffuse += hemiDiffuse;\n	totalSpecular += hemiSpecular;\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	totalDiffuse += pointDiffuse;\n	totalSpecular += pointSpecular;\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	totalDiffuse += spotDiffuse;\n	totalSpecular += spotSpecular;\n\n#endif\n\n#ifdef METAL\n\n	gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n\n#else\n\n	gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/fog_pars_fragment.glsl

THREE.ShaderChunk[ 'fog_pars_fragment'] = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphnormal_vertex.glsl

THREE.ShaderChunk[ 'morphnormal_vertex'] = "#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_fragment.glsl

THREE.ShaderChunk[ 'envmap_pars_fragment'] = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	uniform samplerCube envMap;\n	uniform float flipEnvMap;\n	uniform int combine;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform bool useRefract;\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_fragment'] = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/normalmap_pars_fragment.glsl

THREE.ShaderChunk[ 'normalmap_pars_fragment'] = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n			// Per-Pixel Tangent Space Normal Mapping\n			// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_vertex.glsl

THREE.ShaderChunk[ 'lights_phong_pars_vertex'] = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lightmap_pars_fragment.glsl

THREE.ShaderChunk[ 'lightmap_pars_fragment'] = "#ifdef USE_LIGHTMAP\n\n	varying vec2 vUv2;\n	uniform sampler2D lightMap;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_vertex'] = "#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_phong_vertex.glsl

THREE.ShaderChunk[ 'lights_phong_vertex'] = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_fragment.glsl

THREE.ShaderChunk[ 'map_fragment'] = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	#ifdef GAMMA_INPUT\n\n		texelColor.xyz *= texelColor.xyz;\n\n	#endif\n\n	gl_FragColor = gl_FragColor * texelColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_vertex.glsl

THREE.ShaderChunk[ 'lightmap_vertex'] = "#ifdef USE_LIGHTMAP\n\n	vUv2 = uv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_particle_fragment.glsl

THREE.ShaderChunk[ 'map_particle_fragment'] = "#ifdef USE_MAP\n\n	gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_pars_fragment.glsl

THREE.ShaderChunk[ 'color_pars_fragment'] = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/color_vertex.glsl

THREE.ShaderChunk[ 'color_vertex'] = "#ifdef USE_COLOR\n\n	#ifdef GAMMA_INPUT\n\n		vColor = color * color;\n\n	#else\n\n		vColor = color;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinning_vertex.glsl

THREE.ShaderChunk[ 'skinning_vertex'] = "#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_vertex.glsl

THREE.ShaderChunk[ 'envmap_pars_vertex'] = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n	uniform bool useRefract;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/linear_to_gamma_fragment.glsl

THREE.ShaderChunk[ 'linear_to_gamma_fragment'] = "#ifdef GAMMA_OUTPUT\n\n	gl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_pars_vertex.glsl

THREE.ShaderChunk[ 'color_pars_vertex'] = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_pars_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_pars_vertex'] = "uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\n\nuniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_pars_vertex.glsl

THREE.ShaderChunk[ 'map_pars_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_fragment.glsl

THREE.ShaderChunk[ 'envmap_fragment'] = "#ifdef USE_ENVMAP\n\n	vec3 reflectVec;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\n		// Transforming Normal Vectors with the Inverse Transformation\n\n		vec3 worldNormal = normalize( vec3( vec4( normal, 0.0 ) * viewMatrix ) );\n\n		if ( useRefract ) {\n\n			reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		} else { \n\n			reflectVec = reflect( cameraToVertex, worldNormal );\n\n		}\n\n	#else\n\n		reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n\n		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n		vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#else\n\n		vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#endif\n\n	#ifdef GAMMA_INPUT\n\n		cubeColor.xyz *= cubeColor.xyz;\n\n	#endif\n\n	if ( combine == 1 ) {\n\n		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n\n	} else if ( combine == 2 ) {\n\n		gl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;\n\n	} else {\n\n		gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/specularmap_pars_fragment.glsl

THREE.ShaderChunk[ 'specularmap_pars_fragment'] = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_vertex'] = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_pars_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_pars_vertex'] = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/specularmap_fragment.glsl

THREE.ShaderChunk[ 'specularmap_fragment'] = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/fog_fragment.glsl

THREE.ShaderChunk[ 'fog_fragment'] = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		const float LOG2 = 1.442695;\n		float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n		fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl

THREE.ShaderChunk[ 'bumpmap_pars_fragment'] = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n			// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n			//	http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n			// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/defaultnormal_vertex.glsl

THREE.ShaderChunk[ 'defaultnormal_vertex'] = "vec3 objectNormal;\n\n#ifdef USE_SKINNING\n\n	objectNormal = skinnedNormal.xyz;\n\n#endif\n\n#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )\n\n	objectNormal = morphedNormal;\n\n#endif\n\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )\n\n	objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_pars_fragment'] = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\n#ifdef WRAP_AROUND\n\n	uniform vec3 wrapRGB;\n\n#endif\n\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;";

// File:src/renderers/shaders/ShaderChunk/skinbase_vertex.glsl

THREE.ShaderChunk[ 'skinbase_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_vertex.glsl

THREE.ShaderChunk[ 'map_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_fragment.glsl

THREE.ShaderChunk[ 'lightmap_fragment'] = "#ifdef USE_LIGHTMAP\n\n	gl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_pars_vertex'] = "#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_fragment.glsl

THREE.ShaderChunk[ 'color_fragment'] = "#ifdef USE_COLOR\n\n	gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_vertex'] = "#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/envmap_vertex.glsl

THREE.ShaderChunk[ 'envmap_vertex'] = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;\n	worldNormal = normalize( worldNormal );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	if ( useRefract ) {\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	} else {\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_fragment'] = "#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	#ifdef GAMMA_OUTPUT\n\n		shadowColor *= shadowColor;\n\n	#endif\n\n	gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/worldpos_vertex.glsl

THREE.ShaderChunk[ 'worldpos_vertex'] = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#endif\n\n	#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#endif\n\n	#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_pars_fragment'] = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl

THREE.ShaderChunk[ 'skinning_pars_vertex'] = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_fragment'] = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/alphamap_fragment.glsl

THREE.ShaderChunk[ 'alphamap_fragment'] = "#ifdef USE_ALPHAMAP\n\n	gl_FragColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/alphamap_pars_fragment.glsl

THREE.ShaderChunk[ 'alphamap_pars_fragment'] = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n";

// File:src/renderers/shaders/UniformsUtils.js

/**
 * Uniform Utilities
 */

THREE.UniformsUtils = {

	merge: function ( uniforms ) {

		var merged = {};

		for ( var u = 0; u < uniforms.length; u ++ ) {

			var tmp = this.clone( uniforms[ u ] );

			for ( var p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	},

	clone: function ( uniforms_src ) {

		var uniforms_dst = {};

		for ( var u in uniforms_src ) {

			uniforms_dst[ u ] = {};

			for ( var p in uniforms_src[ u ] ) {

				var parameter_src = uniforms_src[ u ][ p ];

				if ( parameter_src instanceof THREE.Color ||
					 parameter_src instanceof THREE.Vector2 ||
					 parameter_src instanceof THREE.Vector3 ||
					 parameter_src instanceof THREE.Vector4 ||
					 parameter_src instanceof THREE.Matrix4 ||
					 parameter_src instanceof THREE.Texture ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( parameter_src instanceof Array ) {

					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

};

// File:src/renderers/shaders/UniformsLib.js

/**
 * Uniforms library for shared webgl shaders
 */

THREE.UniformsLib = {

	common: {

		"diffuse" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },

		"map" : { type: "t", value: null },
		"offsetRepeat" : { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) },

		"lightMap" : { type: "t", value: null },
		"specularMap" : { type: "t", value: null },
		"alphaMap" : { type: "t", value: null },

		"envMap" : { type: "t", value: null },
		"flipEnvMap" : { type: "f", value: - 1 },
		"useRefract" : { type: "i", value: 0 },
		"reflectivity" : { type: "f", value: 1.0 },
		"refractionRatio" : { type: "f", value: 0.98 },
		"combine" : { type: "i", value: 0 },

		"morphTargetInfluences" : { type: "f", value: 0 }

	},

	bump: {

		"bumpMap" : { type: "t", value: null },
		"bumpScale" : { type: "f", value: 1 }

	},

	normalmap: {

		"normalMap" : { type: "t", value: null },
		"normalScale" : { type: "v2", value: new THREE.Vector2( 1, 1 ) }
	},

	fog : {

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	lights: {

		"ambientLightColor" : { type: "fv", value: [] },

		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },

		"hemisphereLightDirection" : { type: "fv", value: [] },
		"hemisphereLightSkyColor" : { type: "fv", value: [] },
		"hemisphereLightGroundColor" : { type: "fv", value: [] },

		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] },

		"spotLightColor" : { type: "fv", value: [] },
		"spotLightPosition" : { type: "fv", value: [] },
		"spotLightDirection" : { type: "fv", value: [] },
		"spotLightDistance" : { type: "fv1", value: [] },
		"spotLightAngleCos" : { type: "fv1", value: [] },
		"spotLightExponent" : { type: "fv1", value: [] }

	},

	particle: {

		"psColor" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },
		"size" : { type: "f", value: 1.0 },
		"scale" : { type: "f", value: 1.0 },
		"map" : { type: "t", value: null },

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	shadowmap: {

		"shadowMap": { type: "tv", value: [] },
		"shadowMapSize": { type: "v2v", value: [] },

		"shadowBias" : { type: "fv1", value: [] },
		"shadowDarkness": { type: "fv1", value: [] },

		"shadowMatrix" : { type: "m4v", value: [] }

	}

};

// File:src/renderers/shaders/ShaderLib.js

/**
 * Webgl Shader Library for three.js
 *
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */


THREE.ShaderLib = {

	'basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],

			"	#ifdef USE_ENVMAP",

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"	#endif",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'lambert': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
			}

		] ),

		vertexShader: [

			"#define LAMBERT",

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_lambert_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],

			"	#ifdef DOUBLE_SIDED",

					//"float isFront = float( gl_FrontFacing );",
					//"gl_FragColor.xyz *= isFront * vLightFront + ( 1.0 - isFront ) * vLightBack;",

			"		if ( gl_FrontFacing )",
			"			gl_FragColor.xyz *= vLightFront;",
			"		else",
			"			gl_FragColor.xyz *= vLightBack;",

			"	#else",

			"		gl_FragColor.xyz *= vLightFront;",

			"	#endif",

				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'phong': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "bump" ],
			THREE.UniformsLib[ "normalmap" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
				"shininess": { type: "f", value: 30 },
				"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
			}

		] ),

		vertexShader: [

			"#define PHONG",

			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"	vNormal = normalize( transformedNormal );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"	vViewPosition = -mvPosition.xyz;",

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_phong_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"#define PHONG",

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform vec3 ambient;",
			"uniform vec3 emissive;",
			"uniform vec3 specular;",
			"uniform float shininess;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
			THREE.ShaderChunk[ "normalmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],

				THREE.ShaderChunk[ "lights_phong_fragment" ],

				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'particle_basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "particle" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			"uniform float size;",
			"uniform float scale;",

			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

			"	#ifdef USE_SIZEATTENUATION",
			"		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
			"	#else",
			"		gl_PointSize = size;",
			"	#endif",

			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],
				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 psColor;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_particle_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( psColor, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_particle_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'dashed': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],

			{
				"scale"    : { type: "f", value: 1 },
				"dashSize" : { type: "f", value: 1 },
				"totalSize": { type: "f", value: 2 }
			}

		] ),

		vertexShader: [

			"uniform float scale;",
			"attribute float lineDistance;",

			"varying float vLineDistance;",

			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

			"	vLineDistance = scale * lineDistance;",

			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform float dashSize;",
			"uniform float totalSize;",

			"varying float vLineDistance;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	if ( mod( vLineDistance, totalSize ) > dashSize ) {",

			"		discard;",

			"	}",

			"	gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'depth': {

		uniforms: {

			"mNear": { type: "f", value: 1.0 },
			"mFar" : { type: "f", value: 2000.0 },
			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float mNear;",
			"uniform float mFar;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	#ifdef USE_LOGDEPTHBUF_EXT",

			"		float depth = gl_FragDepthEXT / gl_FragCoord.w;",

			"	#else",

			"		float depth = gl_FragCoord.z / gl_FragCoord.w;",

			"	#endif",

			"	float color = 1.0 - smoothstep( mNear, mFar, depth );",
			"	gl_FragColor = vec4( vec3( color ), opacity );",

			"}"

		].join("\n")

	},

	'normal': {

		uniforms: {

			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vNormal = normalize( normalMatrix * normal );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Normal map shader
	//		- Blinn-Phong
	//		- normal + diffuse + specular + AO + displacement + reflection + shadow maps
	//		- point and directional lights (use with "lights: true" material option)
	 ------------------------------------------------------------------------- */

	'normalmap' : {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{

			"enableAO"          : { type: "i", value: 0 },
			"enableDiffuse"     : { type: "i", value: 0 },
			"enableSpecular"    : { type: "i", value: 0 },
			"enableReflection"  : { type: "i", value: 0 },
			"enableDisplacement": { type: "i", value: 0 },

			"tDisplacement": { type: "t", value: null }, // must go first as this is vertex texture
			"tDiffuse"     : { type: "t", value: null },
			"tCube"        : { type: "t", value: null },
			"tNormal"      : { type: "t", value: null },
			"tSpecular"    : { type: "t", value: null },
			"tAO"          : { type: "t", value: null },

			"uNormalScale": { type: "v2", value: new THREE.Vector2( 1, 1 ) },

			"uDisplacementBias": { type: "f", value: 0.0 },
			"uDisplacementScale": { type: "f", value: 1.0 },

			"diffuse": { type: "c", value: new THREE.Color( 0xffffff ) },
			"specular": { type: "c", value: new THREE.Color( 0x111111 ) },
			"ambient": { type: "c", value: new THREE.Color( 0xffffff ) },
			"shininess": { type: "f", value: 30 },
			"opacity": { type: "f", value: 1 },

			"useRefract": { type: "i", value: 0 },
			"refractionRatio": { type: "f", value: 0.98 },
			"reflectivity": { type: "f", value: 0.5 },

			"uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) },
			"uRepeat" : { type: "v2", value: new THREE.Vector2( 1, 1 ) },

			"wrapRGB" : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

			}

		] ),

		fragmentShader: [

			"uniform vec3 ambient;",
			"uniform vec3 diffuse;",
			"uniform vec3 specular;",
			"uniform float shininess;",
			"uniform float opacity;",

			"uniform bool enableDiffuse;",
			"uniform bool enableSpecular;",
			"uniform bool enableAO;",
			"uniform bool enableReflection;",

			"uniform sampler2D tDiffuse;",
			"uniform sampler2D tNormal;",
			"uniform sampler2D tSpecular;",
			"uniform sampler2D tAO;",

			"uniform samplerCube tCube;",

			"uniform vec2 uNormalScale;",

			"uniform bool useRefract;",
			"uniform float refractionRatio;",
			"uniform float reflectivity;",

			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"uniform vec3 ambientLightColor;",

			"#if MAX_DIR_LIGHTS > 0",

			"	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
			"	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

			"#endif",

			"#if MAX_HEMI_LIGHTS > 0",

			"	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];",
			"	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];",
			"	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];",

			"#endif",

			"#if MAX_POINT_LIGHTS > 0",

			"	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
			"	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
			"	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

			"#endif",

			"#if MAX_SPOT_LIGHTS > 0",

			"	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];",
			"	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];",
			"	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];",
			"	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];",
			"	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];",
			"	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];",

			"#endif",

			"#ifdef WRAP_AROUND",

			"	uniform vec3 wrapRGB;",

			"#endif",

			"varying vec3 vWorldPosition;",
			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",
				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

			"	vec3 specularTex = vec3( 1.0 );",

			"	vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
			"	normalTex.xy *= uNormalScale;",
			"	normalTex = normalize( normalTex );",

			"	if( enableDiffuse ) {",

			"		#ifdef GAMMA_INPUT",

			"			vec4 texelColor = texture2D( tDiffuse, vUv );",
			"			texelColor.xyz *= texelColor.xyz;",

			"			gl_FragColor = gl_FragColor * texelColor;",

			"		#else",

			"			gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",

			"		#endif",

			"	}",

			"	if( enableAO ) {",

			"		#ifdef GAMMA_INPUT",

			"			vec4 aoColor = texture2D( tAO, vUv );",
			"			aoColor.xyz *= aoColor.xyz;",

			"			gl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;",

			"		#else",

			"			gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",

			"		#endif",

			"	}",
			
			THREE.ShaderChunk[ "alphatest_fragment" ],

			"	if( enableSpecular )",
			"		specularTex = texture2D( tSpecular, vUv ).xyz;",

			"	mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );",
			"	vec3 finalNormal = tsb * normalTex;",

			"	#ifdef FLIP_SIDED",

			"		finalNormal = -finalNormal;",

			"	#endif",

			"	vec3 normal = normalize( finalNormal );",
			"	vec3 viewPosition = normalize( vViewPosition );",

				// point lights

			"	#if MAX_POINT_LIGHTS > 0",

			"		vec3 pointDiffuse = vec3( 0.0 );",
			"		vec3 pointSpecular = vec3( 0.0 );",

			"		for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

			"			vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",
			"			vec3 pointVector = lPosition.xyz + vViewPosition.xyz;",

			"			float pointDistance = 1.0;",
			"			if ( pointLightDistance[ i ] > 0.0 )",
			"				pointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );",

			"			pointVector = normalize( pointVector );",

						// diffuse

			"			#ifdef WRAP_AROUND",

			"				float pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );",
			"				float pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );",

			"				vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );",

			"			#else",

			"				float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

			"			#endif",

			"			pointDiffuse += pointDistance * pointLightColor[ i ] * diffuse * pointDiffuseWeight;",

						// specular

			"			vec3 pointHalfVector = normalize( pointVector + viewPosition );",
			"			float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
			"			float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );",

			"			float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( pointVector, pointHalfVector ), 0.0 ), 5.0 );",
			"			pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;",

			"		}",

			"	#endif",

				// spot lights

			"	#if MAX_SPOT_LIGHTS > 0",

			"		vec3 spotDiffuse = vec3( 0.0 );",
			"		vec3 spotSpecular = vec3( 0.0 );",

			"		for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {",

			"			vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );",
			"			vec3 spotVector = lPosition.xyz + vViewPosition.xyz;",

			"			float spotDistance = 1.0;",
			"			if ( spotLightDistance[ i ] > 0.0 )",
			"				spotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );",

			"			spotVector = normalize( spotVector );",

			"			float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );",

			"			if ( spotEffect > spotLightAngleCos[ i ] ) {",

			"				spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );",

							// diffuse

			"				#ifdef WRAP_AROUND",

			"					float spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );",
			"					float spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );",

			"					vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );",

			"				#else",

			"					float spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );",

			"				#endif",

			"				spotDiffuse += spotDistance * spotLightColor[ i ] * diffuse * spotDiffuseWeight * spotEffect;",

							// specular

			"				vec3 spotHalfVector = normalize( spotVector + viewPosition );",
			"				float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );",
			"				float spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, shininess ), 0.0 );",

			"				float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"				vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( spotVector, spotHalfVector ), 0.0 ), 5.0 );",
			"				spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;",

			"			}",

			"		}",

			"	#endif",

				// directional lights

			"	#if MAX_DIR_LIGHTS > 0",

			"		vec3 dirDiffuse = vec3( 0.0 );",
			"		vec3 dirSpecular = vec3( 0.0 );",

			"		for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

			"			vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
			"			vec3 dirVector = normalize( lDirection.xyz );",

						// diffuse

			"			#ifdef WRAP_AROUND",

			"				float directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );",
			"				float directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );",

			"				vec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );",

			"			#else",

			"				float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

			"			#endif",

			"			dirDiffuse += directionalLightColor[ i ] * diffuse * dirDiffuseWeight;",

						// specular

			"			vec3 dirHalfVector = normalize( dirVector + viewPosition );",
			"			float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
			"			float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );",

			"			float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"			vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );",
			"			dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;",

			"		}",

			"	#endif",

				// hemisphere lights

			"	#if MAX_HEMI_LIGHTS > 0",

			"		vec3 hemiDiffuse = vec3( 0.0 );",
			"		vec3 hemiSpecular = vec3( 0.0 );" ,

			"		for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {",

			"			vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );",
			"			vec3 lVector = normalize( lDirection.xyz );",

						// diffuse

			"			float dotProduct = dot( normal, lVector );",
			"			float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

			"			vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );",

			"			hemiDiffuse += diffuse * hemiColor;",

						// specular (sky light)


			"			vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );",
			"			float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;",
			"			float hemiSpecularWeightSky = specularTex.r * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );",

						// specular (ground light)

			"			vec3 lVectorGround = -lVector;",

			"			vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );",
			"			float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;",
			"			float hemiSpecularWeightGround = specularTex.r * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );",

			"			float dotProductGround = dot( normal, lVectorGround );",

			"			float specularNormalization = ( shininess + 2.0 ) / 8.0;",

			"			vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );",
			"			vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );",
			"			hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );",

			"		}",

			"	#endif",

				// all lights contribution summation

			"	vec3 totalDiffuse = vec3( 0.0 );",
			"	vec3 totalSpecular = vec3( 0.0 );",

			"	#if MAX_DIR_LIGHTS > 0",

			"		totalDiffuse += dirDiffuse;",
			"		totalSpecular += dirSpecular;",

			"	#endif",

			"	#if MAX_HEMI_LIGHTS > 0",

			"		totalDiffuse += hemiDiffuse;",
			"		totalSpecular += hemiSpecular;",

			"	#endif",

			"	#if MAX_POINT_LIGHTS > 0",

			"		totalDiffuse += pointDiffuse;",
			"		totalSpecular += pointSpecular;",

			"	#endif",

			"	#if MAX_SPOT_LIGHTS > 0",

			"		totalDiffuse += spotDiffuse;",
			"		totalSpecular += spotSpecular;",

			"	#endif",

			"	#ifdef METAL",

			"		gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient + totalSpecular );",

			"	#else",

			"		gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;",

			"	#endif",

			"	if ( enableReflection ) {",

			"		vec3 vReflect;",
			"		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );",

			"		if ( useRefract ) {",

			"			vReflect = refract( cameraToVertex, normal, refractionRatio );",

			"		} else {",

			"			vReflect = reflect( cameraToVertex, normal );",

			"		}",

			"		vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",

			"		#ifdef GAMMA_INPUT",

			"			cubeColor.xyz *= cubeColor.xyz;",

			"		#endif",

			"		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * reflectivity );",

			"	}",

				THREE.ShaderChunk[ "shadowmap_fragment" ],
				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n"),

		vertexShader: [

			"attribute vec4 tangent;",

			"uniform vec2 uOffset;",
			"uniform vec2 uRepeat;",

			"uniform bool enableDisplacement;",

			"#ifdef VERTEX_TEXTURES",

			"	uniform sampler2D tDisplacement;",
			"	uniform float uDisplacementScale;",
			"	uniform float uDisplacementBias;",

			"#endif",

			"varying vec3 vTangent;",
			"varying vec3 vBinormal;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"varying vec3 vWorldPosition;",
			"varying vec3 vViewPosition;",

			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],

				// normal, tangent and binormal vectors

			"	#ifdef USE_SKINNING",

			"		vNormal = normalize( normalMatrix * skinnedNormal.xyz );",

			"		vec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );",
			"		vTangent = normalize( normalMatrix * skinnedTangent.xyz );",

			"	#else",

			"		vNormal = normalize( normalMatrix * normal );",
			"		vTangent = normalize( normalMatrix * tangent.xyz );",

			"	#endif",

			"	vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );",

			"	vUv = uv * uRepeat + uOffset;",

				// displacement mapping

			"	vec3 displacedPosition;",

			"	#ifdef VERTEX_TEXTURES",

			"		if ( enableDisplacement ) {",

			"			vec3 dv = texture2D( tDisplacement, uv ).xyz;",
			"			float df = uDisplacementScale * dv.x + uDisplacementBias;",
			"			displacedPosition = position + normalize( normal ) * df;",

			"		} else {",

			"			#ifdef USE_SKINNING",

			"				vec4 skinVertex = bindMatrix * vec4( position, 1.0 );",

			"				vec4 skinned = vec4( 0.0 );",
			"				skinned += boneMatX * skinVertex * skinWeight.x;",
			"				skinned += boneMatY * skinVertex * skinWeight.y;",
			"				skinned += boneMatZ * skinVertex * skinWeight.z;",
			"				skinned += boneMatW * skinVertex * skinWeight.w;",
			"				skinned  = bindMatrixInverse * skinned;",

			"				displacedPosition = skinned.xyz;",

			"			#else",

			"				displacedPosition = position;",

			"			#endif",

			"		}",

			"	#else",

			"		#ifdef USE_SKINNING",

			"			vec4 skinVertex = bindMatrix * vec4( position, 1.0 );",

			"			vec4 skinned = vec4( 0.0 );",
			"			skinned += boneMatX * skinVertex * skinWeight.x;",
			"			skinned += boneMatY * skinVertex * skinWeight.y;",
			"			skinned += boneMatZ * skinVertex * skinWeight.z;",
			"			skinned += boneMatW * skinVertex * skinWeight.w;",
			"			skinned  = bindMatrixInverse * skinned;",

			"			displacedPosition = skinned.xyz;",

			"		#else",

			"			displacedPosition = position;",

			"		#endif",

			"	#endif",

				//

			"	vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );",
			"	vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );",

			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				//

			"	vWorldPosition = worldPosition.xyz;",
			"	vViewPosition = -mvPosition.xyz;",

				// shadows

			"	#ifdef USE_SHADOWMAP",

			"		for( int i = 0; i < MAX_SHADOWS; i ++ ) {",

			"			vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;",

			"		}",

			"	#endif",

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Cube map shader
	 ------------------------------------------------------------------------- */

	'cube': {

		uniforms: { "tCube": { type: "t", value: null },
					"tFlip": { type: "f", value: - 1 } },

		vertexShader: [

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"	vWorldPosition = worldPosition.xyz;",

			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform samplerCube tCube;",
			"uniform float tFlip;",

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* Depth encoding into RGBA texture
	 *
	 * based on SpiderGL shadow map example
	 * http://spidergl.org/example.php?id=6
	 *
	 * originally from
	 * http://www.gamedev.net/topic/442138-packing-a-float-into-a-a8r8g8b8-texture-shader/page__whichpage__1%25EF%25BF%25BD
	 *
	 * see also
	 * http://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/
	 */

	'depthRGBA': {

		uniforms: {},

		vertexShader: [

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"vec4 pack_depth( const in float depth ) {",

			"	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );",
			"	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );",
			"	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", // "	vec4 res = fract( depth * bit_shift );",
			"	res -= res.xxyz * bit_mask;",
			"	return res;",

			"}",

			"void main() {",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	#ifdef USE_LOGDEPTHBUF_EXT",

			"		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );",

			"	#else",

			"		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );",

			"	#endif",

				//"gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z / gl_FragCoord.w );",
				//"float z = ( ( gl_FragCoord.z / gl_FragCoord.w ) - 3.0 ) / ( 4000.0 - 3.0 );",
				//"gl_FragData[ 0 ] = pack_depth( z );",
				//"gl_FragData[ 0 ] = vec4( z, z, z, 1.0 );",

			"}"

		].join("\n")

	}

};

// File:src/renderers/WebGLRenderer.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.WebGLRenderer = function ( parameters ) {

	console.log( 'THREE.WebGLRenderer', THREE.REVISION );

	parameters = parameters || {};

	var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),
	_context = parameters.context !== undefined ? parameters.context : null,

	_precision = parameters.precision !== undefined ? parameters.precision : 'highp',

	_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
	_depth = parameters.depth !== undefined ? parameters.depth : true,
	_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
	_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
	_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
	_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
	_logarithmicDepthBuffer = parameters.logarithmicDepthBuffer !== undefined ? parameters.logarithmicDepthBuffer : false,

	_clearColor = new THREE.Color( 0x000000 ),
	_clearAlpha = 0;

	var lights = [];

	var _webglObjects = {};
	var _webglObjectsImmediate = [];

	var opaqueObjects = [];
	var transparentObjects = [];

	var sprites = [];
	var lensFlares = [];

	// public properties

	this.domElement = _canvas;
	this.context = null;
	this.devicePixelRatio = parameters.devicePixelRatio !== undefined
				 ? parameters.devicePixelRatio
				 : self.devicePixelRatio !== undefined
					 ? self.devicePixelRatio
					 : 1;

	// clearing

	this.autoClear = true;
	this.autoClearColor = true;
	this.autoClearDepth = true;
	this.autoClearStencil = true;

	// scene graph

	this.sortObjects = true;

	// physically based shading

	this.gammaInput = false;
	this.gammaOutput = false;

	// shadow map

	this.shadowMapEnabled = false;
	this.shadowMapType = THREE.PCFShadowMap;
	this.shadowMapCullFace = THREE.CullFaceFront;
	this.shadowMapDebug = false;
	this.shadowMapCascade = false;

	// morphs

	this.maxMorphTargets = 8;
	this.maxMorphNormals = 4;

	// flags

	this.autoScaleCubemaps = true;

	// info

	this.info = {

		memory: {

			programs: 0,
			geometries: 0,
			textures: 0

		},

		render: {

			calls: 0,
			vertices: 0,
			faces: 0,
			points: 0

		}

	};

	// internal properties

	var _this = this,

	_programs = [],

	// internal state cache

	_currentProgram = null,
	_currentFramebuffer = null,
	_currentMaterialId = - 1,
	_currentGeometryGroupHash = - 1,
	_currentCamera = null,

	_usedTextureUnits = 0,

	// GL state cache

	_oldDoubleSided = - 1,
	_oldFlipSided = - 1,

	_oldBlending = - 1,

	_oldBlendEquation = - 1,
	_oldBlendSrc = - 1,
	_oldBlendDst = - 1,

	_oldDepthTest = - 1,
	_oldDepthWrite = - 1,

	_oldPolygonOffset = null,
	_oldPolygonOffsetFactor = null,
	_oldPolygonOffsetUnits = null,

	_oldLineWidth = null,

	_viewportX = 0,
	_viewportY = 0,
	_viewportWidth = _canvas.width,
	_viewportHeight = _canvas.height,
	_currentWidth = 0,
	_currentHeight = 0,

	_newAttributes = new Uint8Array( 16 ),
	_enabledAttributes = new Uint8Array( 16 ),

	// frustum

	_frustum = new THREE.Frustum(),

	 // camera matrices cache

	_projScreenMatrix = new THREE.Matrix4(),
	_projScreenMatrixPS = new THREE.Matrix4(),

	_vector3 = new THREE.Vector3(),

	// light arrays cache

	_direction = new THREE.Vector3(),

	_lightsNeedUpdate = true,

	_lights = {

		ambient: [ 0, 0, 0 ],
		directional: { length: 0, colors:[], positions: [] },
		point: { length: 0, colors: [], positions: [], distances: [] },
		spot: { length: 0, colors: [], positions: [], distances: [], directions: [], anglesCos: [], exponents: [] },
		hemi: { length: 0, skyColors: [], groundColors: [], positions: [] }

	};

	// initialize

	var _gl;

	try {

		var attributes = {
			alpha: _alpha,
			depth: _depth,
			stencil: _stencil,
			antialias: _antialias,
			premultipliedAlpha: _premultipliedAlpha,
			preserveDrawingBuffer: _preserveDrawingBuffer
		};

		_gl = _context || _canvas.getContext( 'webgl', attributes ) || _canvas.getContext( 'experimental-webgl', attributes );

		if ( _gl === null ) {

			if ( _canvas.getContext( 'webgl') !== null ) {

				throw 'Error creating WebGL context with your selected attributes.';

			} else {

				throw 'Error creating WebGL context.';

			}

		}

	} catch ( error ) {

		console.error( error );

	}

	if ( _gl.getShaderPrecisionFormat === undefined ) {

		_gl.getShaderPrecisionFormat = function () {

			return {
				'rangeMin': 1,
				'rangeMax': 1,
				'precision': 1
			};

		}

	}

	var extensions = new THREE.WebGLExtensions( _gl );

	extensions.get( 'OES_texture_float' );
	extensions.get( 'OES_texture_float_linear' );
	extensions.get( 'OES_standard_derivatives' );

	if ( _logarithmicDepthBuffer ) {

		extensions.get( 'EXT_frag_depth' );

	}

	//

	function setDefaultGLState() {

		_gl.clearColor( 0, 0, 0, 1 );
		_gl.clearDepth( 1 );
		_gl.clearStencil( 0 );

		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthFunc( _gl.LEQUAL );

		_gl.frontFace( _gl.CCW );
		_gl.cullFace( _gl.BACK );
		_gl.enable( _gl.CULL_FACE );

		_gl.enable( _gl.BLEND );
		_gl.blendEquation( _gl.FUNC_ADD );
		_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	}

	setDefaultGLState();

	this.context = _gl;

	// GPU capabilities

	var _maxTextures = _gl.getParameter( _gl.MAX_TEXTURE_IMAGE_UNITS );
	var _maxVertexTextures = _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
	var _maxTextureSize = _gl.getParameter( _gl.MAX_TEXTURE_SIZE );
	var _maxCubemapSize = _gl.getParameter( _gl.MAX_CUBE_MAP_TEXTURE_SIZE );

	var _supportsVertexTextures = _maxVertexTextures > 0;
	var _supportsBoneTextures = _supportsVertexTextures && extensions.get( 'OES_texture_float' );

	//

	var _vertexShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.HIGH_FLOAT );
	var _vertexShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.MEDIUM_FLOAT );
	var _vertexShaderPrecisionLowpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.LOW_FLOAT );

	var _fragmentShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.HIGH_FLOAT );
	var _fragmentShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.MEDIUM_FLOAT );
	var _fragmentShaderPrecisionLowpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.LOW_FLOAT );

	var getCompressedTextureFormats = ( function () {

		var array;

		return function () {

			if ( array !== undefined ) {

				return array;

			}

			array = [];

			if ( extensions.get( 'WEBGL_compressed_texture_pvrtc' ) || extensions.get( 'WEBGL_compressed_texture_s3tc' ) ) {

				var formats = _gl.getParameter( _gl.COMPRESSED_TEXTURE_FORMATS );

				for ( var i = 0; i < formats.length; i ++ ){

					array.push( formats[ i ] );

				}

			}
			
			return array;

		};

	} )();

	// clamp precision to maximum available

	var highpAvailable = _vertexShaderPrecisionHighpFloat.precision > 0 && _fragmentShaderPrecisionHighpFloat.precision > 0;
	var mediumpAvailable = _vertexShaderPrecisionMediumpFloat.precision > 0 && _fragmentShaderPrecisionMediumpFloat.precision > 0;

	if ( _precision === 'highp' && ! highpAvailable ) {

		if ( mediumpAvailable ) {

			_precision = 'mediump';
			console.warn( 'THREE.WebGLRenderer: highp not supported, using mediump.' );

		} else {

			_precision = 'lowp';
			console.warn( 'THREE.WebGLRenderer: highp and mediump not supported, using lowp.' );

		}

	}

	if ( _precision === 'mediump' && ! mediumpAvailable ) {

		_precision = 'lowp';
		console.warn( 'THREE.WebGLRenderer: mediump not supported, using lowp.' );

	}

	// Plugins

	var shadowMapPlugin = new THREE.ShadowMapPlugin( this, lights, _webglObjects, _webglObjectsImmediate );

	var spritePlugin = new THREE.SpritePlugin( this, sprites );
	var lensFlarePlugin = new THREE.LensFlarePlugin( this, lensFlares );

	// API

	this.getContext = function () {

		return _gl;

	};

	this.supportsVertexTextures = function () {

		return _supportsVertexTextures;

	};

	this.supportsFloatTextures = function () {

		return extensions.get( 'OES_texture_float' );

	};

	this.supportsStandardDerivatives = function () {

		return extensions.get( 'OES_standard_derivatives' );

	};

	this.supportsCompressedTextureS3TC = function () {

		return extensions.get( 'WEBGL_compressed_texture_s3tc' );

	};

	this.supportsCompressedTexturePVRTC = function () {

		return extensions.get( 'WEBGL_compressed_texture_pvrtc' );

	};

	this.supportsBlendMinMax = function () {

		return extensions.get( 'EXT_blend_minmax' );

	};

	this.getMaxAnisotropy = ( function () {

		var value;

		return function () {

			if ( value !== undefined ) {

				return value;

			}

			var extension = extensions.get( 'EXT_texture_filter_anisotropic' );

			value = extension !== null ? _gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT ) : 0;

			return value;

		}

	} )();

	this.getPrecision = function () {

		return _precision;

	};

	this.setSize = function ( width, height, updateStyle ) {

		_canvas.width = width * this.devicePixelRatio;
		_canvas.height = height * this.devicePixelRatio;

		if ( updateStyle !== false ) {

			_canvas.style.width = width + 'px';
			_canvas.style.height = height + 'px';

		}

		this.setViewport( 0, 0, width, height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x * this.devicePixelRatio;
		_viewportY = y * this.devicePixelRatio;

		_viewportWidth = width * this.devicePixelRatio;
		_viewportHeight = height * this.devicePixelRatio;

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

	};

	this.setScissor = function ( x, y, width, height ) {

		_gl.scissor(
			x * this.devicePixelRatio,
			y * this.devicePixelRatio,
			width * this.devicePixelRatio,
			height * this.devicePixelRatio
		);

	};

	this.enableScissorTest = function ( enable ) {

		enable ? _gl.enable( _gl.SCISSOR_TEST ) : _gl.disable( _gl.SCISSOR_TEST );

	};

	// Clearing

	this.setClearColor = function ( color, alpha ) {

		_clearColor.set( color );
		_clearAlpha = alpha !== undefined ? alpha : 1;

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.setClearColorHex = function ( hex, alpha ) {

		console.warn( 'THREE.WebGLRenderer: .setClearColorHex() is being removed. Use .setClearColor() instead.' );
		this.setClearColor( hex, alpha );

	};

	this.getClearColor = function () {

		return _clearColor;

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

		_gl.clear( bits );

	};

	this.clearColor = function () {

		_gl.clear( _gl.COLOR_BUFFER_BIT );

	};

	this.clearDepth = function () {

		_gl.clear( _gl.DEPTH_BUFFER_BIT );

	};

	this.clearStencil = function () {

		_gl.clear( _gl.STENCIL_BUFFER_BIT );

	};

	this.clearTarget = function ( renderTarget, color, depth, stencil ) {

		this.setRenderTarget( renderTarget );
		this.clear( color, depth, stencil );

	};

	// Reset

	this.resetGLState = function () {

		_currentProgram = null;
		_currentCamera = null;

		_oldBlending = - 1;
		_oldDepthTest = - 1;
		_oldDepthWrite = - 1;
		_oldDoubleSided = - 1;
		_oldFlipSided = - 1;
		_currentGeometryGroupHash = - 1;
		_currentMaterialId = - 1;

		_lightsNeedUpdate = true;

	};

	// Buffer allocation

	function createParticleBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

		_this.info.memory.geometries ++;

	};

	function createLineBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();
		geometry.__webglLineDistanceBuffer = _gl.createBuffer();

		_this.info.memory.geometries ++;

	};

	function createMeshBuffers ( geometryGroup ) {

		geometryGroup.__webglVertexBuffer = _gl.createBuffer();
		geometryGroup.__webglNormalBuffer = _gl.createBuffer();
		geometryGroup.__webglTangentBuffer = _gl.createBuffer();
		geometryGroup.__webglColorBuffer = _gl.createBuffer();
		geometryGroup.__webglUVBuffer = _gl.createBuffer();
		geometryGroup.__webglUV2Buffer = _gl.createBuffer();

		geometryGroup.__webglSkinIndicesBuffer = _gl.createBuffer();
		geometryGroup.__webglSkinWeightsBuffer = _gl.createBuffer();

		geometryGroup.__webglFaceBuffer = _gl.createBuffer();
		geometryGroup.__webglLineBuffer = _gl.createBuffer();

		var m, ml;

		if ( geometryGroup.numMorphTargets ) {

			geometryGroup.__webglMorphTargetsBuffers = [];

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				geometryGroup.__webglMorphTargetsBuffers.push( _gl.createBuffer() );

			}

		}

		if ( geometryGroup.numMorphNormals ) {

			geometryGroup.__webglMorphNormalsBuffers = [];

			for ( m = 0, ml = geometryGroup.numMorphNormals; m < ml; m ++ ) {

				geometryGroup.__webglMorphNormalsBuffers.push( _gl.createBuffer() );

			}

		}

		_this.info.memory.geometries ++;

	};

	// Events

	var onObjectRemoved = function ( event ) {

		var object = event.target;

		object.traverse( function ( child ) {

			child.removeEventListener( 'remove', onObjectRemoved );

			removeObject( child );

		} );

	};

	var onGeometryDispose = function ( event ) {

		var geometry = event.target;

		geometry.removeEventListener( 'dispose', onGeometryDispose );

		deallocateGeometry( geometry );

	};

	var onTextureDispose = function ( event ) {

		var texture = event.target;

		texture.removeEventListener( 'dispose', onTextureDispose );

		deallocateTexture( texture );

		_this.info.memory.textures --;


	};

	var onRenderTargetDispose = function ( event ) {

		var renderTarget = event.target;

		renderTarget.removeEventListener( 'dispose', onRenderTargetDispose );

		deallocateRenderTarget( renderTarget );

		_this.info.memory.textures --;

	};

	var onMaterialDispose = function ( event ) {

		var material = event.target;

		material.removeEventListener( 'dispose', onMaterialDispose );

		deallocateMaterial( material );

	};

	// Buffer deallocation

	var deleteBuffers = function ( geometry ) {
	
		var buffers = [
			'__webglVertexBuffer',
			'__webglNormalBuffer',
			'__webglTangentBuffer',
			'__webglColorBuffer',
			'__webglUVBuffer',
			'__webglUV2Buffer',
			
			'__webglSkinIndicesBuffer',
			'__webglSkinWeightsBuffer',
			
			'__webglFaceBuffer',
			'__webglLineBuffer',
			
			'__webglLineDistanceBuffer'
		];

		for ( var i = 0, l = buffers.length; i < l; i ++ ) {

			var name = buffers[ i ];

			if ( geometry[ name ] !== undefined ) {

				_gl.deleteBuffer( geometry[ name ] );

				delete geometry[ name ];

			}

		}

		// custom attributes

		if ( geometry.__webglCustomAttributesList !== undefined ) {

			for ( var name in geometry.__webglCustomAttributesList ) {

				_gl.deleteBuffer( geometry.__webglCustomAttributesList[ name ].buffer );

			}

			delete geometry.__webglCustomAttributesList;

		}

		_this.info.memory.geometries --;

	};

	var deallocateGeometry = function ( geometry ) {

		delete geometry.__webglInit;

		if ( geometry instanceof THREE.BufferGeometry ) {

			for ( var name in geometry.attributes ) {
			
				var attribute = geometry.attributes[ name ];

				if ( attribute.buffer !== undefined ) {

					_gl.deleteBuffer( attribute.buffer );

					delete attribute.buffer;

				}

			}

			_this.info.memory.geometries --;

		} else {

			var geometryGroupsList = geometryGroups[ geometry.id ];

			if ( geometryGroupsList !== undefined ) {

				for ( var i = 0,l = geometryGroupsList.length; i < l; i ++ ) {

					var geometryGroup = geometryGroupsList[ i ];

					if ( geometryGroup.numMorphTargets !== undefined ) {

						for ( var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

							_gl.deleteBuffer( geometryGroup.__webglMorphTargetsBuffers[ m ] );

						}

						delete geometryGroup.__webglMorphTargetsBuffers;

					}

					if ( geometryGroup.numMorphNormals !== undefined ) {

						for ( var m = 0, ml = geometryGroup.numMorphNormals; m < ml; m ++ ) {

							_gl.deleteBuffer( geometryGroup.__webglMorphNormalsBuffers[ m ] );

						}

						delete geometryGroup.__webglMorphNormalsBuffers;

					}

					deleteBuffers( geometryGroup );

				}

				delete geometryGroups[ geometry.id ];

			} else {

				deleteBuffers( geometry );

			}

		}

		// TOFIX: Workaround for deleted geometry being currently bound

		_currentGeometryGroupHash = - 1;

	};

	var deallocateTexture = function ( texture ) {

		if ( texture.image && texture.image.__webglTextureCube ) {

			// cube texture

			_gl.deleteTexture( texture.image.__webglTextureCube );

			delete texture.image.__webglTextureCube;

		} else {

			// 2D texture

			if ( texture.__webglInit === undefined ) return;

			_gl.deleteTexture( texture.__webglTexture );

			delete texture.__webglTexture;
			delete texture.__webglInit;

		}

	};

	var deallocateRenderTarget = function ( renderTarget ) {

		if ( ! renderTarget || renderTarget.__webglTexture === undefined ) return;

		_gl.deleteTexture( renderTarget.__webglTexture );

		delete renderTarget.__webglTexture;

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			for ( var i = 0; i < 6; i ++ ) {

				_gl.deleteFramebuffer( renderTarget.__webglFramebuffer[ i ] );
				_gl.deleteRenderbuffer( renderTarget.__webglRenderbuffer[ i ] );

			}

		} else {

			_gl.deleteFramebuffer( renderTarget.__webglFramebuffer );
			_gl.deleteRenderbuffer( renderTarget.__webglRenderbuffer );

		}

		delete renderTarget.__webglFramebuffer;
		delete renderTarget.__webglRenderbuffer;

	};

	var deallocateMaterial = function ( material ) {

		var program = material.program.program;

		if ( program === undefined ) return;

		material.program = undefined;

		// only deallocate GL program if this was the last use of shared program
		// assumed there is only single copy of any program in the _programs list
		// (that's how it's constructed)

		var i, il, programInfo;
		var deleteProgram = false;

		for ( i = 0, il = _programs.length; i < il; i ++ ) {

			programInfo = _programs[ i ];

			if ( programInfo.program === program ) {

				programInfo.usedTimes --;

				if ( programInfo.usedTimes === 0 ) {

					deleteProgram = true;

				}

				break;

			}

		}

		if ( deleteProgram === true ) {

			// avoid using array.splice, this is costlier than creating new array from scratch

			var newPrograms = [];

			for ( i = 0, il = _programs.length; i < il; i ++ ) {

				programInfo = _programs[ i ];

				if ( programInfo.program !== program ) {

					newPrograms.push( programInfo );

				}

			}

			_programs = newPrograms;

			_gl.deleteProgram( program );

			_this.info.memory.programs --;

		}

	};

	// Buffer initialization

	function initCustomAttributes ( object ) {

		var geometry = object.geometry;
		var material = object.material;

		var nvertices = geometry.vertices.length;

		if ( material.attributes ) {

			if ( geometry.__webglCustomAttributesList === undefined ) {

				geometry.__webglCustomAttributesList = [];

			}

			for ( var name in material.attributes ) {

				var attribute = material.attributes[ name ];

				if ( ! attribute.__webglInitialized || attribute.createUniqueBuffers ) {

					attribute.__webglInitialized = true;

					var size = 1;   // "f" and "i"

					if ( attribute.type === 'v2' ) size = 2;
					else if ( attribute.type === 'v3' ) size = 3;
					else if ( attribute.type === 'v4' ) size = 4;
					else if ( attribute.type === 'c'  ) size = 3;

					attribute.size = size;

					attribute.array = new Float32Array( nvertices * size );

					attribute.buffer = _gl.createBuffer();
					attribute.buffer.belongsToAttribute = name;

					attribute.needsUpdate = true;

				}

				geometry.__webglCustomAttributesList.push( attribute );

			}

		}

	};

	function initParticleBuffers ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__sortArray = [];

		geometry.__webglParticleCount = nvertices;

		initCustomAttributes( object );

	};

	function initLineBuffers ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );
		geometry.__lineDistanceArray = new Float32Array( nvertices * 1 );

		geometry.__webglLineCount = nvertices;

		initCustomAttributes( object );

	};

	function initMeshBuffers ( geometryGroup, object ) {

		var geometry = object.geometry,
			faces3 = geometryGroup.faces3,

			nvertices = faces3.length * 3,
			ntris     = faces3.length * 1,
			nlines    = faces3.length * 3,

			material = getBufferMaterial( object, geometryGroup );

		geometryGroup.__vertexArray = new Float32Array( nvertices * 3 );
		geometryGroup.__normalArray = new Float32Array( nvertices * 3 );
		geometryGroup.__colorArray = new Float32Array( nvertices * 3 );
		geometryGroup.__uvArray = new Float32Array( nvertices * 2 );

		if ( geometry.faceVertexUvs.length > 1 ) {

			geometryGroup.__uv2Array = new Float32Array( nvertices * 2 );

		}

		if ( geometry.hasTangents ) {

			geometryGroup.__tangentArray = new Float32Array( nvertices * 4 );

		}

		if ( object.geometry.skinWeights.length && object.geometry.skinIndices.length ) {

			geometryGroup.__skinIndexArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinWeightArray = new Float32Array( nvertices * 4 );

		}

		var UintArray = extensions.get( 'OES_element_index_uint' ) !== null && ntris > 21845 ? Uint32Array : Uint16Array; // 65535 / 3

		geometryGroup.__typeArray = UintArray;
		geometryGroup.__faceArray = new UintArray( ntris * 3 );
		geometryGroup.__lineArray = new UintArray( nlines * 2 );

		var m, ml;

		if ( geometryGroup.numMorphTargets ) {

			geometryGroup.__morphTargetsArrays = [];

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				geometryGroup.__morphTargetsArrays.push( new Float32Array( nvertices * 3 ) );

			}

		}

		if ( geometryGroup.numMorphNormals ) {

			geometryGroup.__morphNormalsArrays = [];

			for ( m = 0, ml = geometryGroup.numMorphNormals; m < ml; m ++ ) {

				geometryGroup.__morphNormalsArrays.push( new Float32Array( nvertices * 3 ) );

			}

		}

		geometryGroup.__webglFaceCount = ntris * 3;
		geometryGroup.__webglLineCount = nlines * 2;


		// custom attributes

		if ( material.attributes ) {

			if ( geometryGroup.__webglCustomAttributesList === undefined ) {

				geometryGroup.__webglCustomAttributesList = [];

			}

			for ( var name in material.attributes ) {

				// Do a shallow copy of the attribute object so different geometryGroup chunks use different
				// attribute buffers which are correctly indexed in the setMeshBuffers function

				var originalAttribute = material.attributes[ name ];

				var attribute = {};

				for ( var property in originalAttribute ) {

					attribute[ property ] = originalAttribute[ property ];

				}

				if ( ! attribute.__webglInitialized || attribute.createUniqueBuffers ) {

					attribute.__webglInitialized = true;

					var size = 1;   // "f" and "i"

					if ( attribute.type === 'v2' ) size = 2;
					else if ( attribute.type === 'v3' ) size = 3;
					else if ( attribute.type === 'v4' ) size = 4;
					else if ( attribute.type === 'c'  ) size = 3;

					attribute.size = size;

					attribute.array = new Float32Array( nvertices * size );

					attribute.buffer = _gl.createBuffer();
					attribute.buffer.belongsToAttribute = name;

					originalAttribute.needsUpdate = true;
					attribute.__original = originalAttribute;

				}

				geometryGroup.__webglCustomAttributesList.push( attribute );

			}

		}

		geometryGroup.__inittedArrays = true;

	};

	function getBufferMaterial( object, geometryGroup ) {

		return object.material instanceof THREE.MeshFaceMaterial
			 ? object.material.materials[ geometryGroup.materialIndex ]
			 : object.material;

	};

	function materialNeedsSmoothNormals ( material ) {

		return material && material.shading !== undefined && material.shading === THREE.SmoothShading;

	};

	// Buffer setting

	function setParticleBuffers ( geometry, hint, object ) {

		var v, c, vertex, offset, index, color,

		vertices = geometry.vertices,
		vl = vertices.length,

		colors = geometry.colors,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		sortArray = geometry.__sortArray,

		dirtyVertices = geometry.verticesNeedUpdate,
		dirtyElements = geometry.elementsNeedUpdate,
		dirtyColors = geometry.colorsNeedUpdate,

		customAttributes = geometry.__webglCustomAttributesList,
		i, il,
		a, ca, cal, value,
		customAttribute;

		if ( object.sortParticles ) {

			_projScreenMatrixPS.copy( _projScreenMatrix );
			_projScreenMatrixPS.multiply( object.matrixWorld );

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ];

				_vector3.copy( vertex );
				_vector3.applyProjection( _projScreenMatrixPS );

				sortArray[ v ] = [ _vector3.z, v ];

			}

			sortArray.sort( numericalSort );

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ sortArray[ v ][ 1 ] ];

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			for ( c = 0; c < cl; c ++ ) {

				offset = c * 3;

				color = colors[ sortArray[ c ][ 1 ] ];

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			if ( customAttributes ) {

				for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

					customAttribute = customAttributes[ i ];

					if ( ! ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) ) continue;

					offset = 0;

					cal = customAttribute.value.length;

					if ( customAttribute.size === 1 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							customAttribute.array[ ca ] = customAttribute.value[ index ];

						}

					} else if ( customAttribute.size === 2 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							value = customAttribute.value[ index ];

							customAttribute.array[ offset ]   = value.x;
							customAttribute.array[ offset + 1 ] = value.y;

							offset += 2;

						}

					} else if ( customAttribute.size === 3 ) {

						if ( customAttribute.type === 'c' ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								index = sortArray[ ca ][ 1 ];

								value = customAttribute.value[ index ];

								customAttribute.array[ offset ]     = value.r;
								customAttribute.array[ offset + 1 ] = value.g;
								customAttribute.array[ offset + 2 ] = value.b;

								offset += 3;

							}

						} else {

							for ( ca = 0; ca < cal; ca ++ ) {

								index = sortArray[ ca ][ 1 ];

								value = customAttribute.value[ index ];

								customAttribute.array[ offset ]   = value.x;
								customAttribute.array[ offset + 1 ] = value.y;
								customAttribute.array[ offset + 2 ] = value.z;

								offset += 3;

							}

						}

					} else if ( customAttribute.size === 4 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							value = customAttribute.value[ index ];

							customAttribute.array[ offset ]      = value.x;
							customAttribute.array[ offset + 1  ] = value.y;
							customAttribute.array[ offset + 2  ] = value.z;
							customAttribute.array[ offset + 3  ] = value.w;

							offset += 4;

						}

					}

				}

			}

		} else {

			if ( dirtyVertices ) {

				for ( v = 0; v < vl; v ++ ) {

					vertex = vertices[ v ];

					offset = v * 3;

					vertexArray[ offset ]     = vertex.x;
					vertexArray[ offset + 1 ] = vertex.y;
					vertexArray[ offset + 2 ] = vertex.z;

				}

			}

			if ( dirtyColors ) {

				for ( c = 0; c < cl; c ++ ) {

					color = colors[ c ];

					offset = c * 3;

					colorArray[ offset ]     = color.r;
					colorArray[ offset + 1 ] = color.g;
					colorArray[ offset + 2 ] = color.b;

				}

			}

			if ( customAttributes ) {

				for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

					customAttribute = customAttributes[ i ];

					if ( customAttribute.needsUpdate &&
						 ( customAttribute.boundTo === undefined ||
							 customAttribute.boundTo === 'vertices' ) ) {

						cal = customAttribute.value.length;

						offset = 0;

						if ( customAttribute.size === 1 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								customAttribute.array[ ca ] = customAttribute.value[ ca ];

							}

						} else if ( customAttribute.size === 2 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]   = value.x;
								customAttribute.array[ offset + 1 ] = value.y;

								offset += 2;

							}

						} else if ( customAttribute.size === 3 ) {

							if ( customAttribute.type === 'c' ) {

								for ( ca = 0; ca < cal; ca ++ ) {

									value = customAttribute.value[ ca ];

									customAttribute.array[ offset ]   = value.r;
									customAttribute.array[ offset + 1 ] = value.g;
									customAttribute.array[ offset + 2 ] = value.b;

									offset += 3;

								}

							} else {

								for ( ca = 0; ca < cal; ca ++ ) {

									value = customAttribute.value[ ca ];

									customAttribute.array[ offset ]   = value.x;
									customAttribute.array[ offset + 1 ] = value.y;
									customAttribute.array[ offset + 2 ] = value.z;

									offset += 3;

								}

							}

						} else if ( customAttribute.size === 4 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]      = value.x;
								customAttribute.array[ offset + 1  ] = value.y;
								customAttribute.array[ offset + 2  ] = value.z;
								customAttribute.array[ offset + 3  ] = value.w;

								offset += 4;

							}

						}

					}

				}

			}

		}

		if ( dirtyVertices || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( customAttribute.needsUpdate || object.sortParticles ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
					_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

				}

			}

		}

	}

	function setLineBuffers ( geometry, hint ) {

		var v, c, d, vertex, offset, color,

		vertices = geometry.vertices,
		colors = geometry.colors,
		lineDistances = geometry.lineDistances,

		vl = vertices.length,
		cl = colors.length,
		dl = lineDistances.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,
		lineDistanceArray = geometry.__lineDistanceArray,

		dirtyVertices = geometry.verticesNeedUpdate,
		dirtyColors = geometry.colorsNeedUpdate,
		dirtyLineDistances = geometry.lineDistancesNeedUpdate,

		customAttributes = geometry.__webglCustomAttributesList,

		i, il,
		a, ca, cal, value,
		customAttribute;

		if ( dirtyVertices ) {

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ];

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors ) {

			for ( c = 0; c < cl; c ++ ) {

				color = colors[ c ];

				offset = c * 3;

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( dirtyLineDistances ) {

			for ( d = 0; d < dl; d ++ ) {

				lineDistanceArray[ d ] = lineDistances[ d ];

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglLineDistanceBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, lineDistanceArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( customAttribute.needsUpdate &&
					 ( customAttribute.boundTo === undefined ||
						 customAttribute.boundTo === 'vertices' ) ) {

					offset = 0;

					cal = customAttribute.value.length;

					if ( customAttribute.size === 1 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							customAttribute.array[ ca ] = customAttribute.value[ ca ];

						}

					} else if ( customAttribute.size === 2 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							value = customAttribute.value[ ca ];

							customAttribute.array[ offset ]   = value.x;
							customAttribute.array[ offset + 1 ] = value.y;

							offset += 2;

						}

					} else if ( customAttribute.size === 3 ) {

						if ( customAttribute.type === 'c' ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]   = value.r;
								customAttribute.array[ offset + 1 ] = value.g;
								customAttribute.array[ offset + 2 ] = value.b;

								offset += 3;

							}

						} else {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]   = value.x;
								customAttribute.array[ offset + 1 ] = value.y;
								customAttribute.array[ offset + 2 ] = value.z;

								offset += 3;

							}

						}

					} else if ( customAttribute.size === 4 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							value = customAttribute.value[ ca ];

							customAttribute.array[ offset ]    = value.x;
							customAttribute.array[ offset + 1  ] = value.y;
							customAttribute.array[ offset + 2  ] = value.z;
							customAttribute.array[ offset + 3  ] = value.w;

							offset += 4;

						}

					}

					_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
					_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

				}

			}

		}

	}

	function setMeshBuffers( geometryGroup, object, hint, dispose, material ) {

		if ( ! geometryGroup.__inittedArrays ) {

			return;

		}

		var needsSmoothNormals = materialNeedsSmoothNormals( material );

		var f, fl, fi, face,
		vertexNormals, faceNormal, normal,
		vertexColors, faceColor,
		vertexTangents,
		uv, uv2, v1, v2, v3, v4, t1, t2, t3, t4, n1, n2, n3, n4,
		c1, c2, c3,
		sw1, sw2, sw3, sw4,
		si1, si2, si3, si4,
		sa1, sa2, sa3, sa4,
		sb1, sb2, sb3, sb4,
		m, ml, i, il,
		vn, uvi, uv2i,
		vk, vkl, vka,
		nka, chf, faceVertexNormals,
		a,

		vertexIndex = 0,

		offset = 0,
		offset_uv = 0,
		offset_uv2 = 0,
		offset_face = 0,
		offset_normal = 0,
		offset_tangent = 0,
		offset_line = 0,
		offset_color = 0,
		offset_skin = 0,
		offset_morphTarget = 0,
		offset_custom = 0,
		offset_customSrc = 0,

		value,

		vertexArray = geometryGroup.__vertexArray,
		uvArray = geometryGroup.__uvArray,
		uv2Array = geometryGroup.__uv2Array,
		normalArray = geometryGroup.__normalArray,
		tangentArray = geometryGroup.__tangentArray,
		colorArray = geometryGroup.__colorArray,

		skinIndexArray = geometryGroup.__skinIndexArray,
		skinWeightArray = geometryGroup.__skinWeightArray,

		morphTargetsArrays = geometryGroup.__morphTargetsArrays,
		morphNormalsArrays = geometryGroup.__morphNormalsArrays,

		customAttributes = geometryGroup.__webglCustomAttributesList,
		customAttribute,

		faceArray = geometryGroup.__faceArray,
		lineArray = geometryGroup.__lineArray,

		geometry = object.geometry, // this is shared for all chunks

		dirtyVertices = geometry.verticesNeedUpdate,
		dirtyElements = geometry.elementsNeedUpdate,
		dirtyUvs = geometry.uvsNeedUpdate,
		dirtyNormals = geometry.normalsNeedUpdate,
		dirtyTangents = geometry.tangentsNeedUpdate,
		dirtyColors = geometry.colorsNeedUpdate,
		dirtyMorphTargets = geometry.morphTargetsNeedUpdate,

		vertices = geometry.vertices,
		chunk_faces3 = geometryGroup.faces3,
		obj_faces = geometry.faces,

		obj_uvs  = geometry.faceVertexUvs[ 0 ],
		obj_uvs2 = geometry.faceVertexUvs[ 1 ],

		obj_colors = geometry.colors,

		obj_skinIndices = geometry.skinIndices,
		obj_skinWeights = geometry.skinWeights,

		morphTargets = geometry.morphTargets,
		morphNormals = geometry.morphNormals;

		if ( dirtyVertices ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				v1 = vertices[ face.a ];
				v2 = vertices[ face.b ];
				v3 = vertices[ face.c ];

				vertexArray[ offset ]     = v1.x;
				vertexArray[ offset + 1 ] = v1.y;
				vertexArray[ offset + 2 ] = v1.z;

				vertexArray[ offset + 3 ] = v2.x;
				vertexArray[ offset + 4 ] = v2.y;
				vertexArray[ offset + 5 ] = v2.z;

				vertexArray[ offset + 6 ] = v3.x;
				vertexArray[ offset + 7 ] = v3.y;
				vertexArray[ offset + 8 ] = v3.z;

				offset += 9;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyMorphTargets ) {

			for ( vk = 0, vkl = morphTargets.length; vk < vkl; vk ++ ) {

				offset_morphTarget = 0;

				for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

					chf = chunk_faces3[ f ];
					face = obj_faces[ chf ];

					// morph positions

					v1 = morphTargets[ vk ].vertices[ face.a ];
					v2 = morphTargets[ vk ].vertices[ face.b ];
					v3 = morphTargets[ vk ].vertices[ face.c ];

					vka = morphTargetsArrays[ vk ];

					vka[ offset_morphTarget ]     = v1.x;
					vka[ offset_morphTarget + 1 ] = v1.y;
					vka[ offset_morphTarget + 2 ] = v1.z;

					vka[ offset_morphTarget + 3 ] = v2.x;
					vka[ offset_morphTarget + 4 ] = v2.y;
					vka[ offset_morphTarget + 5 ] = v2.z;

					vka[ offset_morphTarget + 6 ] = v3.x;
					vka[ offset_morphTarget + 7 ] = v3.y;
					vka[ offset_morphTarget + 8 ] = v3.z;

					// morph normals

					if ( material.morphNormals ) {

						if ( needsSmoothNormals ) {

							faceVertexNormals = morphNormals[ vk ].vertexNormals[ chf ];

							n1 = faceVertexNormals.a;
							n2 = faceVertexNormals.b;
							n3 = faceVertexNormals.c;

						} else {

							n1 = morphNormals[ vk ].faceNormals[ chf ];
							n2 = n1;
							n3 = n1;

						}

						nka = morphNormalsArrays[ vk ];

						nka[ offset_morphTarget ]     = n1.x;
						nka[ offset_morphTarget + 1 ] = n1.y;
						nka[ offset_morphTarget + 2 ] = n1.z;

						nka[ offset_morphTarget + 3 ] = n2.x;
						nka[ offset_morphTarget + 4 ] = n2.y;
						nka[ offset_morphTarget + 5 ] = n2.z;

						nka[ offset_morphTarget + 6 ] = n3.x;
						nka[ offset_morphTarget + 7 ] = n3.y;
						nka[ offset_morphTarget + 8 ] = n3.z;

					}

					//

					offset_morphTarget += 9;

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ vk ] );
				_gl.bufferData( _gl.ARRAY_BUFFER, morphTargetsArrays[ vk ], hint );

				if ( material.morphNormals ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[ vk ] );
					_gl.bufferData( _gl.ARRAY_BUFFER, morphNormalsArrays[ vk ], hint );

				}

			}

		}

		if ( obj_skinWeights.length ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				// weights

				sw1 = obj_skinWeights[ face.a ];
				sw2 = obj_skinWeights[ face.b ];
				sw3 = obj_skinWeights[ face.c ];

				skinWeightArray[ offset_skin ]     = sw1.x;
				skinWeightArray[ offset_skin + 1 ] = sw1.y;
				skinWeightArray[ offset_skin + 2 ] = sw1.z;
				skinWeightArray[ offset_skin + 3 ] = sw1.w;

				skinWeightArray[ offset_skin + 4 ] = sw2.x;
				skinWeightArray[ offset_skin + 5 ] = sw2.y;
				skinWeightArray[ offset_skin + 6 ] = sw2.z;
				skinWeightArray[ offset_skin + 7 ] = sw2.w;

				skinWeightArray[ offset_skin + 8 ]  = sw3.x;
				skinWeightArray[ offset_skin + 9 ]  = sw3.y;
				skinWeightArray[ offset_skin + 10 ] = sw3.z;
				skinWeightArray[ offset_skin + 11 ] = sw3.w;

				// indices

				si1 = obj_skinIndices[ face.a ];
				si2 = obj_skinIndices[ face.b ];
				si3 = obj_skinIndices[ face.c ];

				skinIndexArray[ offset_skin ]     = si1.x;
				skinIndexArray[ offset_skin + 1 ] = si1.y;
				skinIndexArray[ offset_skin + 2 ] = si1.z;
				skinIndexArray[ offset_skin + 3 ] = si1.w;

				skinIndexArray[ offset_skin + 4 ] = si2.x;
				skinIndexArray[ offset_skin + 5 ] = si2.y;
				skinIndexArray[ offset_skin + 6 ] = si2.z;
				skinIndexArray[ offset_skin + 7 ] = si2.w;

				skinIndexArray[ offset_skin + 8 ]  = si3.x;
				skinIndexArray[ offset_skin + 9 ]  = si3.y;
				skinIndexArray[ offset_skin + 10 ] = si3.z;
				skinIndexArray[ offset_skin + 11 ] = si3.w;

				offset_skin += 12;

			}

			if ( offset_skin > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinIndexArray, hint );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinWeightArray, hint );

			}

		}

		if ( dirtyColors ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				vertexColors = face.vertexColors;
				faceColor = face.color;

				if ( vertexColors.length === 3 && material.vertexColors === THREE.VertexColors ) {

					c1 = vertexColors[ 0 ];
					c2 = vertexColors[ 1 ];
					c3 = vertexColors[ 2 ];

				} else {

					c1 = faceColor;
					c2 = faceColor;
					c3 = faceColor;

				}

				colorArray[ offset_color ]     = c1.r;
				colorArray[ offset_color + 1 ] = c1.g;
				colorArray[ offset_color + 2 ] = c1.b;

				colorArray[ offset_color + 3 ] = c2.r;
				colorArray[ offset_color + 4 ] = c2.g;
				colorArray[ offset_color + 5 ] = c2.b;

				colorArray[ offset_color + 6 ] = c3.r;
				colorArray[ offset_color + 7 ] = c3.g;
				colorArray[ offset_color + 8 ] = c3.b;

				offset_color += 9;

			}

			if ( offset_color > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

			}

		}

		if ( dirtyTangents && geometry.hasTangents ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				vertexTangents = face.vertexTangents;

				t1 = vertexTangents[ 0 ];
				t2 = vertexTangents[ 1 ];
				t3 = vertexTangents[ 2 ];

				tangentArray[ offset_tangent ]     = t1.x;
				tangentArray[ offset_tangent + 1 ] = t1.y;
				tangentArray[ offset_tangent + 2 ] = t1.z;
				tangentArray[ offset_tangent + 3 ] = t1.w;

				tangentArray[ offset_tangent + 4 ] = t2.x;
				tangentArray[ offset_tangent + 5 ] = t2.y;
				tangentArray[ offset_tangent + 6 ] = t2.z;
				tangentArray[ offset_tangent + 7 ] = t2.w;

				tangentArray[ offset_tangent + 8 ]  = t3.x;
				tangentArray[ offset_tangent + 9 ]  = t3.y;
				tangentArray[ offset_tangent + 10 ] = t3.z;
				tangentArray[ offset_tangent + 11 ] = t3.w;

				offset_tangent += 12;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, tangentArray, hint );

		}

		if ( dirtyNormals ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				vertexNormals = face.vertexNormals;
				faceNormal = face.normal;

				if ( vertexNormals.length === 3 && needsSmoothNormals ) {

					for ( i = 0; i < 3; i ++ ) {

						vn = vertexNormals[ i ];

						normalArray[ offset_normal ]     = vn.x;
						normalArray[ offset_normal + 1 ] = vn.y;
						normalArray[ offset_normal + 2 ] = vn.z;

						offset_normal += 3;

					}

				} else {

					for ( i = 0; i < 3; i ++ ) {

						normalArray[ offset_normal ]     = faceNormal.x;
						normalArray[ offset_normal + 1 ] = faceNormal.y;
						normalArray[ offset_normal + 2 ] = faceNormal.z;

						offset_normal += 3;

					}

				}

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, normalArray, hint );

		}

		if ( dirtyUvs && obj_uvs ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				fi = chunk_faces3[ f ];

				uv = obj_uvs[ fi ];

				if ( uv === undefined ) continue;

				for ( i = 0; i < 3; i ++ ) {

					uvi = uv[ i ];

					uvArray[ offset_uv ]     = uvi.x;
					uvArray[ offset_uv + 1 ] = uvi.y;

					offset_uv += 2;

				}

			}

			if ( offset_uv > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, uvArray, hint );

			}

		}

		if ( dirtyUvs && obj_uvs2 ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				fi = chunk_faces3[ f ];

				uv2 = obj_uvs2[ fi ];

				if ( uv2 === undefined ) continue;

				for ( i = 0; i < 3; i ++ ) {

					uv2i = uv2[ i ];

					uv2Array[ offset_uv2 ]     = uv2i.x;
					uv2Array[ offset_uv2 + 1 ] = uv2i.y;

					offset_uv2 += 2;

				}

			}

			if ( offset_uv2 > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, uv2Array, hint );

			}

		}

		if ( dirtyElements ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				faceArray[ offset_face ]   = vertexIndex;
				faceArray[ offset_face + 1 ] = vertexIndex + 1;
				faceArray[ offset_face + 2 ] = vertexIndex + 2;

				offset_face += 3;

				lineArray[ offset_line ]     = vertexIndex;
				lineArray[ offset_line + 1 ] = vertexIndex + 1;

				lineArray[ offset_line + 2 ] = vertexIndex;
				lineArray[ offset_line + 3 ] = vertexIndex + 2;

				lineArray[ offset_line + 4 ] = vertexIndex + 1;
				lineArray[ offset_line + 5 ] = vertexIndex + 2;

				offset_line += 6;

				vertexIndex += 3;

			}

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, faceArray, hint );

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, lineArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( ! customAttribute.__original.needsUpdate ) continue;

				offset_custom = 0;
				offset_customSrc = 0;

				if ( customAttribute.size === 1 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							customAttribute.array[ offset_custom ]     = customAttribute.value[ face.a ];
							customAttribute.array[ offset_custom + 1 ] = customAttribute.value[ face.b ];
							customAttribute.array[ offset_custom + 2 ] = customAttribute.value[ face.c ];

							offset_custom += 3;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							customAttribute.array[ offset_custom ]     = value;
							customAttribute.array[ offset_custom + 1 ] = value;
							customAttribute.array[ offset_custom + 2 ] = value;

							offset_custom += 3;

						}

					}

				} else if ( customAttribute.size === 2 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom ]     = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							offset_custom += 6;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom ]     = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							offset_custom += 6;

						}

					}

				} else if ( customAttribute.size === 3 ) {

					var pp;

					if ( customAttribute.type === 'c' ) {

						pp = [ 'r', 'g', 'b' ];

					} else {

						pp = [ 'x', 'y', 'z' ];

					}

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom ]     = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom ]     = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

					} else if ( customAttribute.boundTo === 'faceVertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value[ 0 ];
							v2 = value[ 1 ];
							v3 = value[ 2 ];

							customAttribute.array[ offset_custom ]     = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

					}

				} else if ( customAttribute.size === 4 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === 'vertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom  ]   = v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

					} else if ( customAttribute.boundTo === 'faces' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom  ]   = v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

					} else if ( customAttribute.boundTo === 'faceVertices' ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value[ 0 ];
							v2 = value[ 1 ];
							v3 = value[ 2 ];

							customAttribute.array[ offset_custom  ]   = v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

					}

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

			}

		}

		if ( dispose ) {

			delete geometryGroup.__inittedArrays;
			delete geometryGroup.__colorArray;
			delete geometryGroup.__normalArray;
			delete geometryGroup.__tangentArray;
			delete geometryGroup.__uvArray;
			delete geometryGroup.__uv2Array;
			delete geometryGroup.__faceArray;
			delete geometryGroup.__vertexArray;
			delete geometryGroup.__lineArray;
			delete geometryGroup.__skinIndexArray;
			delete geometryGroup.__skinWeightArray;

		}

	};

	function setDirectBuffers( geometry ) {

		var attributes = geometry.attributes;
		var attributesKeys = geometry.attributesKeys;

		for ( var i = 0, l = attributesKeys.length; i < l; i ++ ) {

			var key = attributesKeys[ i ];
			var attribute = attributes[ key ];

			if ( attribute.buffer === undefined ) {

				attribute.buffer = _gl.createBuffer();
				attribute.needsUpdate = true;

			}

			if ( attribute.needsUpdate === true ) {

				var bufferType = ( key === 'index' ) ? _gl.ELEMENT_ARRAY_BUFFER : _gl.ARRAY_BUFFER;

				_gl.bindBuffer( bufferType, attribute.buffer );
				_gl.bufferData( bufferType, attribute.array, _gl.STATIC_DRAW );

				attribute.needsUpdate = false;

			}

		}

	}

	// Buffer rendering

	this.renderBufferImmediate = function ( object, program, material ) {

		initAttributes();

		if ( object.hasPositions && ! object.__webglVertexBuffer ) object.__webglVertexBuffer = _gl.createBuffer();
		if ( object.hasNormals && ! object.__webglNormalBuffer ) object.__webglNormalBuffer = _gl.createBuffer();
		if ( object.hasUvs && ! object.__webglUvBuffer ) object.__webglUvBuffer = _gl.createBuffer();
		if ( object.hasColors && ! object.__webglColorBuffer ) object.__webglColorBuffer = _gl.createBuffer();

		if ( object.hasPositions ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.position );
			_gl.vertexAttribPointer( program.attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasNormals ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglNormalBuffer );

			if ( material.shading === THREE.FlatShading ) {

				var nx, ny, nz,
					nax, nbx, ncx, nay, nby, ncy, naz, nbz, ncz,
					normalArray,
					i, il = object.count * 3;

				for ( i = 0; i < il; i += 9 ) {

					normalArray = object.normalArray;

					nax  = normalArray[ i ];
					nay  = normalArray[ i + 1 ];
					naz  = normalArray[ i + 2 ];

					nbx  = normalArray[ i + 3 ];
					nby  = normalArray[ i + 4 ];
					nbz  = normalArray[ i + 5 ];

					ncx  = normalArray[ i + 6 ];
					ncy  = normalArray[ i + 7 ];
					ncz  = normalArray[ i + 8 ];

					nx = ( nax + nbx + ncx ) / 3;
					ny = ( nay + nby + ncy ) / 3;
					nz = ( naz + nbz + ncz ) / 3;

					normalArray[ i ]   = nx;
					normalArray[ i + 1 ] = ny;
					normalArray[ i + 2 ] = nz;

					normalArray[ i + 3 ] = nx;
					normalArray[ i + 4 ] = ny;
					normalArray[ i + 5 ] = nz;

					normalArray[ i + 6 ] = nx;
					normalArray[ i + 7 ] = ny;
					normalArray[ i + 8 ] = nz;

				}

			}

			_gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.normal );
			_gl.vertexAttribPointer( program.attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasUvs && material.map ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglUvBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.uv );
			_gl.vertexAttribPointer( program.attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasColors && material.vertexColors !== THREE.NoColors ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW );
			enableAttribute( program.attributes.color );
			_gl.vertexAttribPointer( program.attributes.color, 3, _gl.FLOAT, false, 0, 0 );

		}

		disableUnusedAttributes();

		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );

		object.count = 0;

	};

	function setupVertexAttributes( material, program, geometry, startIndex ) {

		var geometryAttributes = geometry.attributes;

		var programAttributes = program.attributes;
		var programAttributesKeys = program.attributesKeys;

		for ( var i = 0, l = programAttributesKeys.length; i < l; i ++ ) {

			var key = programAttributesKeys[ i ];
			var programAttribute = programAttributes[ key ];

			if ( programAttribute >= 0 ) {

				var geometryAttribute = geometryAttributes[ key ];

				if ( geometryAttribute !== undefined ) {

					var size = geometryAttribute.itemSize;

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryAttribute.buffer );

					enableAttribute( programAttribute );

					_gl.vertexAttribPointer( programAttribute, size, _gl.FLOAT, false, 0, startIndex * size * 4 ); // 4 bytes per Float32

				} else if ( material.defaultAttributeValues !== undefined ) {

					if ( material.defaultAttributeValues[ key ].length === 2 ) {

						_gl.vertexAttrib2fv( programAttribute, material.defaultAttributeValues[ key ] );

					} else if ( material.defaultAttributeValues[ key ].length === 3 ) {

						_gl.vertexAttrib3fv( programAttribute, material.defaultAttributeValues[ key ] );

					}

				}

			}

		}

		disableUnusedAttributes();

	}

	this.renderBufferDirect = function ( camera, lights, fog, material, geometry, object ) {

		if ( material.visible === false ) return;

		var program = setProgram( camera, lights, fog, material, object );

		var updateBuffers = false,
			wireframeBit = material.wireframe ? 1 : 0,
			geometryHash = ( geometry.id * 0xffffff ) + ( program.id * 2 ) + wireframeBit;

		if ( geometryHash !== _currentGeometryGroupHash ) {

			_currentGeometryGroupHash = geometryHash;
			updateBuffers = true;

		}

		if ( updateBuffers ) {

			initAttributes();

		}

		// render mesh

		if ( object instanceof THREE.Mesh ) {

			var mode = material.wireframe === true ? _gl.LINES : _gl.TRIANGLES;

			var index = geometry.attributes.index;

			if ( index ) {

				// indexed triangles

				var type, size;

				if ( index.array instanceof Uint32Array && extensions.get( 'OES_element_index_uint' ) ) {

					type = _gl.UNSIGNED_INT;
					size = 4;

				} else {

					type = _gl.UNSIGNED_SHORT;
					size = 2;

				}

				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, 0 );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					_gl.drawElements( mode, index.array.length, type, 0 );

					_this.info.render.calls ++;
					_this.info.render.vertices += index.array.length; // not really true, here vertices can be shared
					_this.info.render.faces += index.array.length / 3;

				} else {

					// if there is more than 1 chunk
					// must set attribute pointers to use new offsets for each chunk
					// even if geometry and materials didn't change

					updateBuffers = true;

					for ( var i = 0, il = offsets.length; i < il; i ++ ) {

						var startIndex = offsets[ i ].index;

						if ( updateBuffers ) {

							setupVertexAttributes( material, program, geometry, startIndex );
							_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

						}

						// render indexed triangles

						_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size );

						_this.info.render.calls ++;
						_this.info.render.vertices += offsets[ i ].count; // not really true, here vertices can be shared
						_this.info.render.faces += offsets[ i ].count / 3;

					}

				}

			} else {

				// non-indexed triangles

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );

				}

				var position = geometry.attributes[ 'position' ];

				// render non-indexed triangles

				_gl.drawArrays( mode, 0, position.array.length / 3 );

				_this.info.render.calls ++;
				_this.info.render.vertices += position.array.length / 3;
				_this.info.render.faces += position.array.length / 9;

			}

		} else if ( object instanceof THREE.PointCloud ) {

			// render particles

			if ( updateBuffers ) {

				setupVertexAttributes( material, program, geometry, 0 );

			}

			var position = geometry.attributes.position;

			// render particles

			_gl.drawArrays( _gl.POINTS, 0, position.array.length / 3 );

			_this.info.render.calls ++;
			_this.info.render.points += position.array.length / 3;

		} else if ( object instanceof THREE.Line ) {

			var mode = ( object.mode === THREE.LineStrip ) ? _gl.LINE_STRIP : _gl.LINES;

			setLineWidth( material.linewidth );

			var index = geometry.attributes.index;

			if ( index ) {

				// indexed lines

				var type, size;

				if ( index.array instanceof Uint32Array ) {

					type = _gl.UNSIGNED_INT;
					size = 4;

				} else {

					type = _gl.UNSIGNED_SHORT;
					size = 2;

				}

				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, 0 );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					_gl.drawElements( mode, index.array.length, type, 0 ); // 2 bytes per Uint16Array

					_this.info.render.calls ++;
					_this.info.render.vertices += index.array.length; // not really true, here vertices can be shared

				} else {

					// if there is more than 1 chunk
					// must set attribute pointers to use new offsets for each chunk
					// even if geometry and materials didn't change

					if ( offsets.length > 1 ) updateBuffers = true;

					for ( var i = 0, il = offsets.length; i < il; i ++ ) {

						var startIndex = offsets[ i ].index;

						if ( updateBuffers ) {

							setupVertexAttributes( material, program, geometry, startIndex );
							_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

						}

						// render indexed lines

						_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size ); // 2 bytes per Uint16Array

						_this.info.render.calls ++;
						_this.info.render.vertices += offsets[ i ].count; // not really true, here vertices can be shared

					}

				}

			} else {

				// non-indexed lines

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );

				}

				var position = geometry.attributes.position;

				_gl.drawArrays( mode, 0, position.array.length / 3 );

				_this.info.render.calls ++;
				_this.info.render.points += position.array.length / 3;

			}

		}

	};

	this.renderBuffer = function ( camera, lights, fog, material, geometryGroup, object ) {

		if ( material.visible === false ) return;

		var program = setProgram( camera, lights, fog, material, object );

		var attributes = program.attributes;

		var updateBuffers = false,
			wireframeBit = material.wireframe ? 1 : 0,
			geometryGroupHash = ( geometryGroup.id * 0xffffff ) + ( program.id * 2 ) + wireframeBit;

		if ( geometryGroupHash !== _currentGeometryGroupHash ) {

			_currentGeometryGroupHash = geometryGroupHash;
			updateBuffers = true;

		}

		if ( updateBuffers ) {

			initAttributes();

		}

		// vertices

		if ( ! material.morphTargets && attributes.position >= 0 ) {

			if ( updateBuffers ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
				enableAttribute( attributes.position );
				_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

			}

		} else {

			if ( object.morphTargetBase ) {

				setupMorphTargets( material, geometryGroup, object );

			}

		}


		if ( updateBuffers ) {

			// custom attributes

			// Use the per-geometryGroup custom attribute arrays which are setup in initMeshBuffers

			if ( geometryGroup.__webglCustomAttributesList ) {

				for ( var i = 0, il = geometryGroup.__webglCustomAttributesList.length; i < il; i ++ ) {

					var attribute = geometryGroup.__webglCustomAttributesList[ i ];

					if ( attributes[ attribute.buffer.belongsToAttribute ] >= 0 ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, attribute.buffer );
						enableAttribute( attributes[ attribute.buffer.belongsToAttribute ] );
						_gl.vertexAttribPointer( attributes[ attribute.buffer.belongsToAttribute ], attribute.size, _gl.FLOAT, false, 0, 0 );

					}

				}

			}


			// colors

			if ( attributes.color >= 0 ) {

				if ( object.geometry.colors.length > 0 || object.geometry.faces.length > 0 ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
					enableAttribute( attributes.color );
					_gl.vertexAttribPointer( attributes.color, 3, _gl.FLOAT, false, 0, 0 );

				} else if ( material.defaultAttributeValues !== undefined ) {


					_gl.vertexAttrib3fv( attributes.color, material.defaultAttributeValues.color );

				}

			}

			// normals

			if ( attributes.normal >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
				enableAttribute( attributes.normal );
				_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

			}

			// tangents

			if ( attributes.tangent >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
				enableAttribute( attributes.tangent );
				_gl.vertexAttribPointer( attributes.tangent, 4, _gl.FLOAT, false, 0, 0 );

			}

			// uvs

			if ( attributes.uv >= 0 ) {

				if ( object.geometry.faceVertexUvs[ 0 ] ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
					enableAttribute( attributes.uv );
					_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

				} else if ( material.defaultAttributeValues !== undefined ) {


					_gl.vertexAttrib2fv( attributes.uv, material.defaultAttributeValues.uv );

				}

			}

			if ( attributes.uv2 >= 0 ) {

				if ( object.geometry.faceVertexUvs[ 1 ] ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
					enableAttribute( attributes.uv2 );
					_gl.vertexAttribPointer( attributes.uv2, 2, _gl.FLOAT, false, 0, 0 );

				} else if ( material.defaultAttributeValues !== undefined ) {


					_gl.vertexAttrib2fv( attributes.uv2, material.defaultAttributeValues.uv2 );

				}

			}

			if ( material.skinning &&
				 attributes.skinIndex >= 0 && attributes.skinWeight >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
				enableAttribute( attributes.skinIndex );
				_gl.vertexAttribPointer( attributes.skinIndex, 4, _gl.FLOAT, false, 0, 0 );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
				enableAttribute( attributes.skinWeight );
				_gl.vertexAttribPointer( attributes.skinWeight, 4, _gl.FLOAT, false, 0, 0 );

			}

			// line distances

			if ( attributes.lineDistance >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglLineDistanceBuffer );
				enableAttribute( attributes.lineDistance );
				_gl.vertexAttribPointer( attributes.lineDistance, 1, _gl.FLOAT, false, 0, 0 );

			}

		}

		disableUnusedAttributes();

		// render mesh

		if ( object instanceof THREE.Mesh ) {

			var type = geometryGroup.__typeArray === Uint32Array ? _gl.UNSIGNED_INT : _gl.UNSIGNED_SHORT;

			// wireframe

			if ( material.wireframe ) {

				setLineWidth( material.wireframeLinewidth );
				if ( updateBuffers ) _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
				_gl.drawElements( _gl.LINES, geometryGroup.__webglLineCount, type, 0 );

			// triangles

			} else {

				if ( updateBuffers ) _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
				_gl.drawElements( _gl.TRIANGLES, geometryGroup.__webglFaceCount, type, 0 );

			}

			_this.info.render.calls ++;
			_this.info.render.vertices += geometryGroup.__webglFaceCount;
			_this.info.render.faces += geometryGroup.__webglFaceCount / 3;

		// render lines

		} else if ( object instanceof THREE.Line ) {

			var mode = ( object.mode === THREE.LineStrip ) ? _gl.LINE_STRIP : _gl.LINES;

			setLineWidth( material.linewidth );

			_gl.drawArrays( mode, 0, geometryGroup.__webglLineCount );

			_this.info.render.calls ++;

		// render particles

		} else if ( object instanceof THREE.PointCloud ) {

			_gl.drawArrays( _gl.POINTS, 0, geometryGroup.__webglParticleCount );

			_this.info.render.calls ++;
			_this.info.render.points += geometryGroup.__webglParticleCount;

		}

	};

	function initAttributes() {

		for ( var i = 0, l = _newAttributes.length; i < l; i ++ ) {

			_newAttributes[ i ] = 0;

		}

	}

	function enableAttribute( attribute ) {

		_newAttributes[ attribute ] = 1;

		if ( _enabledAttributes[ attribute ] === 0 ) {

			_gl.enableVertexAttribArray( attribute );
			_enabledAttributes[ attribute ] = 1;

		}

	}

	function disableUnusedAttributes() {

		for ( var i = 0, l = _enabledAttributes.length; i < l; i ++ ) {

			if ( _enabledAttributes[ i ] !== _newAttributes[ i ] ) {

				_gl.disableVertexAttribArray( i );
				_enabledAttributes[ i ] = 0;

			}

		}

	}

	function setupMorphTargets ( material, geometryGroup, object ) {

		// set base

		var attributes = material.program.attributes;

		if ( object.morphTargetBase !== - 1 && attributes.position >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ object.morphTargetBase ] );
			enableAttribute( attributes.position );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		} else if ( attributes.position >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			enableAttribute( attributes.position );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.morphTargetForcedOrder.length ) {

			// set forced order

			var m = 0;
			var order = object.morphTargetForcedOrder;
			var influences = object.morphTargetInfluences;

			while ( m < material.numSupportedMorphTargets && m < order.length ) {

				if ( attributes[ 'morphTarget' + m ] >= 0 ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ order[ m ] ] );
					enableAttribute( attributes[ 'morphTarget' + m ] );
					_gl.vertexAttribPointer( attributes[ 'morphTarget' + m ], 3, _gl.FLOAT, false, 0, 0 );

				}

				if ( attributes[ 'morphNormal' + m ] >= 0 && material.morphNormals ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[ order[ m ] ] );
					enableAttribute( attributes[ 'morphNormal' + m ] );
					_gl.vertexAttribPointer( attributes[ 'morphNormal' + m ], 3, _gl.FLOAT, false, 0, 0 );

				}

				object.__webglMorphTargetInfluences[ m ] = influences[ order[ m ] ];

				m ++;
			}

		} else {

			// find the most influencing

			var influence, activeInfluenceIndices = [];
			var influences = object.morphTargetInfluences;
			var i, il = influences.length;

			for ( i = 0; i < il; i ++ ) {

				influence = influences[ i ];

				if ( influence > 0 ) {

					activeInfluenceIndices.push( [ influence, i ] );

				}

			}

			if ( activeInfluenceIndices.length > material.numSupportedMorphTargets ) {

				activeInfluenceIndices.sort( numericalSort );
				activeInfluenceIndices.length = material.numSupportedMorphTargets;

			} else if ( activeInfluenceIndices.length > material.numSupportedMorphNormals ) {

				activeInfluenceIndices.sort( numericalSort );

			} else if ( activeInfluenceIndices.length === 0 ) {

				activeInfluenceIndices.push( [ 0, 0 ] );

			};

			var influenceIndex, m = 0;

			while ( m < material.numSupportedMorphTargets ) {

				if ( activeInfluenceIndices[ m ] ) {

					influenceIndex = activeInfluenceIndices[ m ][ 1 ];

					if ( attributes[ 'morphTarget' + m ] >= 0 ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ influenceIndex ] );
						enableAttribute( attributes[ 'morphTarget' + m ] );
						_gl.vertexAttribPointer( attributes[ 'morphTarget' + m ], 3, _gl.FLOAT, false, 0, 0 );

					}

					if ( attributes[ 'morphNormal' + m ] >= 0 && material.morphNormals ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphNormalsBuffers[ influenceIndex ] );
						enableAttribute( attributes[ 'morphNormal' + m ] );
						_gl.vertexAttribPointer( attributes[ 'morphNormal' + m ], 3, _gl.FLOAT, false, 0, 0 );


					}

					object.__webglMorphTargetInfluences[ m ] = influences[ influenceIndex ];

				} else {

					/*
					_gl.vertexAttribPointer( attributes[ "morphTarget" + m ], 3, _gl.FLOAT, false, 0, 0 );

					if ( material.morphNormals ) {

						_gl.vertexAttribPointer( attributes[ "morphNormal" + m ], 3, _gl.FLOAT, false, 0, 0 );

					}
					*/

					object.__webglMorphTargetInfluences[ m ] = 0;

				}

				m ++;

			}

		}

		// load updated influences uniform

		if ( material.program.uniforms.morphTargetInfluences !== null ) {

			_gl.uniform1fv( material.program.uniforms.morphTargetInfluences, object.__webglMorphTargetInfluences );

		}

	}

	// Sorting

	function painterSortStable ( a, b ) {

		if ( a.material.id !== b.material.id ) {

			return b.material.id - a.material.id;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return a.id - b.id;

		}

	}

	function reversePainterSortStable ( a, b ) {

		if ( a.z !== b.z ) {

			return a.z - b.z;

		} else {

			return a.id - b.id;

		}

	}

	function numericalSort ( a, b ) {

		return b[ 0 ] - a[ 0 ];

	}

	// Rendering

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		if ( camera instanceof THREE.Camera === false ) {

			console.error( 'THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

		var fog = scene.fog;

		// reset caching for this frame

		_currentGeometryGroupHash = - 1;
		_currentMaterialId = - 1;
		_currentCamera = null;
		_lightsNeedUpdate = true;

		// update scene graph

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

		// update camera matrices and frustum

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		// update Skeleton objects

		scene.traverse( function ( object ) {

			if ( object instanceof THREE.SkinnedMesh ) {

				object.skeleton.update();

			}

		} );

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
		_frustum.setFromMatrix( _projScreenMatrix );

		lights.length = 0;
		opaqueObjects.length = 0;
		transparentObjects.length = 0;

		sprites.length = 0;
		lensFlares.length = 0;

		projectObject( scene, scene );

		if ( _this.sortObjects === true ) {

			opaqueObjects.sort( painterSortStable );
			transparentObjects.sort( reversePainterSortStable );

		}

		// custom render plugins (pre pass)

		shadowMapPlugin.render( scene, camera );

		//

		_this.info.render.calls = 0;
		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;
		_this.info.render.points = 0;

		this.setRenderTarget( renderTarget );

		if ( this.autoClear || forceClear ) {

			this.clear( this.autoClearColor, this.autoClearDepth, this.autoClearStencil );

		}

		// set matrices for immediate objects

		for ( var i = 0, il = _webglObjectsImmediate.length; i < il; i ++ ) {

			var webglObject = _webglObjectsImmediate[ i ];
			var object = webglObject.object;

			if ( object.visible ) {

				setupMatrices( object, camera );

				unrollImmediateBufferMaterial( webglObject );

			}

		}

		if ( scene.overrideMaterial ) {

			var material = scene.overrideMaterial;

			this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );
			this.setDepthTest( material.depthTest );
			this.setDepthWrite( material.depthWrite );
			setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

			renderObjects( opaqueObjects, camera, lights, fog, true, material );
			renderObjects( transparentObjects, camera, lights, fog, true, material );
			renderObjectsImmediate( _webglObjectsImmediate, '', camera, lights, fog, false, material );

		} else {

			var material = null;

			// opaque pass (front-to-back order)

			this.setBlending( THREE.NoBlending );

			renderObjects( opaqueObjects, camera, lights, fog, false, material );
			renderObjectsImmediate( _webglObjectsImmediate, 'opaque', camera, lights, fog, false, material );

			// transparent pass (back-to-front order)

			renderObjects( transparentObjects, camera, lights, fog, true, material );
			renderObjectsImmediate( _webglObjectsImmediate, 'transparent', camera, lights, fog, true, material );

		}

		// custom render plugins (post pass)

		spritePlugin.render( scene, camera );
		lensFlarePlugin.render( scene, camera, _currentWidth, _currentHeight );

		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget && renderTarget.generateMipmaps && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			updateRenderTargetMipmap( renderTarget );

		}

		// Ensure depth buffer writing is enabled so it can be cleared on next render

		this.setDepthTest( true );
		this.setDepthWrite( true );

		// _gl.finish();

	};

	function projectObject( scene, object ) {

		if ( object.visible === false ) return;

		if ( object instanceof THREE.Scene || object instanceof THREE.Group ) {

			// skip

		} else {

			initObject( object, scene );

			if ( object instanceof THREE.Light ) {

				lights.push( object );

			} else if ( object instanceof THREE.Sprite ) {

				sprites.push( object );

			} else if ( object instanceof THREE.LensFlare ) {

				lensFlares.push( object );

			} else {

				var webglObjects = _webglObjects[ object.id ];

				if ( webglObjects && ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) ) {

					updateObject( object, scene );

					for ( var i = 0, l = webglObjects.length; i < l; i ++ ) {

						var webglObject = webglObjects[i];

						unrollBufferMaterial( webglObject );

						webglObject.render = true;

						if ( _this.sortObjects === true ) {

							if ( object.renderDepth !== null ) {

								webglObject.z = object.renderDepth;

							} else {

								_vector3.setFromMatrixPosition( object.matrixWorld );
								_vector3.applyProjection( _projScreenMatrix );

								webglObject.z = _vector3.z;

							}

						}

					}

				}

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			projectObject( scene, object.children[ i ] );

		}

	}

	function renderObjects( renderList, camera, lights, fog, useBlending, overrideMaterial ) {

		var material;

		for ( var i = renderList.length - 1; i !== - 1; i -- ) {

			var webglObject = renderList[ i ];

			var object = webglObject.object;
			var buffer = webglObject.buffer;

			setupMatrices( object, camera );

			if ( overrideMaterial ) {

				material = overrideMaterial;

			} else {

				material = webglObject.material;

				if ( ! material ) continue;

				if ( useBlending ) _this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );

				_this.setDepthTest( material.depthTest );
				_this.setDepthWrite( material.depthWrite );
				setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

			}

			_this.setMaterialFaces( material );

			if ( buffer instanceof THREE.BufferGeometry ) {

				_this.renderBufferDirect( camera, lights, fog, material, buffer, object );

			} else {

				_this.renderBuffer( camera, lights, fog, material, buffer, object );

			}

		}

	}

	function renderObjectsImmediate ( renderList, materialType, camera, lights, fog, useBlending, overrideMaterial ) {

		var material;

		for ( var i = 0, il = renderList.length; i < il; i ++ ) {

			var webglObject = renderList[ i ];
			var object = webglObject.object;

			if ( object.visible ) {

				if ( overrideMaterial ) {

					material = overrideMaterial;

				} else {

					material = webglObject[ materialType ];

					if ( ! material ) continue;

					if ( useBlending ) _this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );

					_this.setDepthTest( material.depthTest );
					_this.setDepthWrite( material.depthWrite );
					setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

				}

				_this.renderImmediateObject( camera, lights, fog, material, object );

			}

		}

	}

	this.renderImmediateObject = function ( camera, lights, fog, material, object ) {

		var program = setProgram( camera, lights, fog, material, object );

		_currentGeometryGroupHash = - 1;

		_this.setMaterialFaces( material );

		if ( object.immediateRenderCallback ) {

			object.immediateRenderCallback( program, _gl, _frustum );

		} else {

			object.render( function ( object ) { _this.renderBufferImmediate( object, program, material ); } );

		}

	};

	function unrollImmediateBufferMaterial ( globject ) {

		var object = globject.object,
			material = object.material;

		if ( material.transparent ) {

			globject.transparent = material;
			globject.opaque = null;

		} else {

			globject.opaque = material;
			globject.transparent = null;

		}

	}

	function unrollBufferMaterial ( globject ) {

		var object = globject.object;
		var buffer = globject.buffer;

		var geometry = object.geometry;
		var material = object.material;

		if ( material instanceof THREE.MeshFaceMaterial ) {

			var materialIndex = geometry instanceof THREE.BufferGeometry ? 0 : buffer.materialIndex;

			material = material.materials[ materialIndex ];

			globject.material = material;

			if ( material.transparent ) {

				transparentObjects.push( globject );

			} else {

				opaqueObjects.push( globject );

			}

		} else if ( material ) {

			globject.material = material;

			if ( material.transparent ) {

				transparentObjects.push( globject );

			} else {

				opaqueObjects.push( globject );

			}

		}

	}

	function initObject( object, scene ) {

		if ( object.__webglInit === undefined ) {

			object.__webglInit = true;
			object._modelViewMatrix = new THREE.Matrix4();
			object._normalMatrix = new THREE.Matrix3();

			object.addEventListener( 'removed', onObjectRemoved );

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			// ImmediateRenderObject

		} else if ( geometry.__webglInit === undefined ) {

			geometry.__webglInit = true;
			geometry.addEventListener( 'dispose', onGeometryDispose );

			if ( geometry instanceof THREE.BufferGeometry ) {

				//

			} else if ( object instanceof THREE.Mesh ) {

				initGeometryGroups( scene, object, geometry );

			} else if ( object instanceof THREE.Line ) {

				if ( geometry.__webglVertexBuffer === undefined ) {

					createLineBuffers( geometry );
					initLineBuffers( geometry, object );

					geometry.verticesNeedUpdate = true;
					geometry.colorsNeedUpdate = true;
					geometry.lineDistancesNeedUpdate = true;

				}

			} else if ( object instanceof THREE.PointCloud ) {

				if ( geometry.__webglVertexBuffer === undefined ) {

					createParticleBuffers( geometry );
					initParticleBuffers( geometry, object );

					geometry.verticesNeedUpdate = true;
					geometry.colorsNeedUpdate = true;

				}

			}

		}

		if ( object.__webglActive === undefined) {

			object.__webglActive = true;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					addBuffer( _webglObjects, geometry, object );

				} else if ( geometry instanceof THREE.Geometry ) {

					var geometryGroupsList = geometryGroups[ geometry.id ];

					for ( var i = 0,l = geometryGroupsList.length; i < l; i ++ ) {

						addBuffer( _webglObjects, geometryGroupsList[ i ], object );

					}

				}

			} else if ( object instanceof THREE.Line || object instanceof THREE.PointCloud ) {

				addBuffer( _webglObjects, geometry, object );

			} else if ( object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback ) {

				addBufferImmediate( _webglObjectsImmediate, object );

			}

		}

	}

	// Geometry splitting

	var geometryGroups = {};
	var geometryGroupCounter = 0;

	function makeGroups( geometry, usesFaceMaterial ) {

		var maxVerticesInGroup = extensions.get( 'OES_element_index_uint' ) ? 4294967296 : 65535;

		var groupHash, hash_map = {};

		var numMorphTargets = geometry.morphTargets.length;
		var numMorphNormals = geometry.morphNormals.length;

		var group;
		var groups = {};
		var groupsList = [];

		for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

			var face = geometry.faces[ f ];
			var materialIndex = usesFaceMaterial ? face.materialIndex : 0;

			if ( ! ( materialIndex in hash_map ) ) {

				hash_map[ materialIndex ] = { hash: materialIndex, counter: 0 };

			}

			groupHash = hash_map[ materialIndex ].hash + '_' + hash_map[ materialIndex ].counter;

			if ( ! ( groupHash in groups ) ) {

				group = {
					id: geometryGroupCounter ++,
					faces3: [],
					materialIndex: materialIndex,
					vertices: 0,
					numMorphTargets: numMorphTargets,
					numMorphNormals: numMorphNormals
				};
				
				groups[ groupHash ] = group;
				groupsList.push( group );

			}

			if ( groups[ groupHash ].vertices + 3 > maxVerticesInGroup ) {

				hash_map[ materialIndex ].counter += 1;
				groupHash = hash_map[ materialIndex ].hash + '_' + hash_map[ materialIndex ].counter;

				if ( ! ( groupHash in groups ) ) {

					group = {
						id: geometryGroupCounter ++,
						faces3: [],
						materialIndex: materialIndex,
						vertices: 0,
						numMorphTargets: numMorphTargets,
						numMorphNormals: numMorphNormals
					};
					
					groups[ groupHash ] = group;
					groupsList.push( group );

				}

			}

			groups[ groupHash ].faces3.push( f );
			groups[ groupHash ].vertices += 3;

		}

		return groupsList;

	}

	function initGeometryGroups( scene, object, geometry ) {

		var material = object.material, addBuffers = false;

		if ( geometryGroups[ geometry.id ] === undefined || geometry.groupsNeedUpdate === true ) {

			delete _webglObjects[ object.id ];

			geometryGroups[ geometry.id ] = makeGroups( geometry, material instanceof THREE.MeshFaceMaterial );

			geometry.groupsNeedUpdate = false;

		}

		var geometryGroupsList = geometryGroups[ geometry.id ];

		// create separate VBOs per geometry chunk

		for ( var i = 0, il = geometryGroupsList.length; i < il; i ++ ) {

			var geometryGroup = geometryGroupsList[ i ];

			// initialise VBO on the first access

			if ( geometryGroup.__webglVertexBuffer === undefined ) {

				createMeshBuffers( geometryGroup );
				initMeshBuffers( geometryGroup, object );

				geometry.verticesNeedUpdate = true;
				geometry.morphTargetsNeedUpdate = true;
				geometry.elementsNeedUpdate = true;
				geometry.uvsNeedUpdate = true;
				geometry.normalsNeedUpdate = true;
				geometry.tangentsNeedUpdate = true;
				geometry.colorsNeedUpdate = true;

				addBuffers = true;

			} else {

				addBuffers = false;

			}

			if ( addBuffers || object.__webglActive === undefined ) {

				addBuffer( _webglObjects, geometryGroup, object );

			}

		}

		object.__webglActive = true;

	}

	function addBuffer( objlist, buffer, object ) {

		var id = object.id;
		objlist[id] = objlist[id] || [];
		objlist[id].push(
			{
				id: id,
				buffer: buffer,
				object: object,
				material: null,
				z: 0
			}
		);

	};

	function addBufferImmediate( objlist, object ) {

		objlist.push(
			{
				id: null,
				object: object,
				opaque: null,
				transparent: null,
				z: 0
			}
		);

	};

	// Objects updates

	function updateObject( object, scene ) {

		var geometry = object.geometry, customAttributesDirty, material;

		if ( geometry instanceof THREE.BufferGeometry ) {

			setDirectBuffers( geometry );

		} else if ( object instanceof THREE.Mesh ) {

			// check all geometry groups

			if ( geometry.groupsNeedUpdate === true ) {

				initGeometryGroups( scene, object, geometry );

			}

			var geometryGroupsList = geometryGroups[ geometry.id ];

			for ( var i = 0, il = geometryGroupsList.length; i < il; i ++ ) {

				var geometryGroup = geometryGroupsList[ i ];

				material = getBufferMaterial( object, geometryGroup );

				if ( geometry.groupsNeedUpdate === true ) {

					initMeshBuffers( geometryGroup, object );

				}

				customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

				if ( geometry.verticesNeedUpdate || geometry.morphTargetsNeedUpdate || geometry.elementsNeedUpdate ||
					 geometry.uvsNeedUpdate || geometry.normalsNeedUpdate ||
					 geometry.colorsNeedUpdate || geometry.tangentsNeedUpdate || customAttributesDirty ) {

					setMeshBuffers( geometryGroup, object, _gl.DYNAMIC_DRAW, ! geometry.dynamic, material );

				}

			}

			geometry.verticesNeedUpdate = false;
			geometry.morphTargetsNeedUpdate = false;
			geometry.elementsNeedUpdate = false;
			geometry.uvsNeedUpdate = false;
			geometry.normalsNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.tangentsNeedUpdate = false;

			material.attributes && clearCustomAttributes( material );

		} else if ( object instanceof THREE.Line ) {

			material = getBufferMaterial( object, geometry );

			customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

			if ( geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || geometry.lineDistancesNeedUpdate || customAttributesDirty ) {

				setLineBuffers( geometry, _gl.DYNAMIC_DRAW );

			}

			geometry.verticesNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.lineDistancesNeedUpdate = false;

			material.attributes && clearCustomAttributes( material );


		} else if ( object instanceof THREE.PointCloud ) {

			material = getBufferMaterial( object, geometry );

			customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

			if ( geometry.verticesNeedUpdate || geometry.colorsNeedUpdate || object.sortParticles || customAttributesDirty ) {

				setParticleBuffers( geometry, _gl.DYNAMIC_DRAW, object );

			}

			geometry.verticesNeedUpdate = false;
			geometry.colorsNeedUpdate = false;

			material.attributes && clearCustomAttributes( material );

		}

	}

	// Objects updates - custom attributes check

	function areCustomAttributesDirty( material ) {

		for ( var name in material.attributes ) {

			if ( material.attributes[ name ].needsUpdate ) return true;

		}

		return false;

	}

	function clearCustomAttributes( material ) {

		for ( var name in material.attributes ) {

			material.attributes[ name ].needsUpdate = false;

		}

	}

	// Objects removal

	function removeObject( object ) {

		if ( object instanceof THREE.Mesh  ||
			 object instanceof THREE.PointCloud ||
			 object instanceof THREE.Line ) {

			delete _webglObjects[ object.id ];

		} else if ( object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback ) {

			removeInstances( _webglObjectsImmediate, object );

		}

		delete object.__webglInit;
		delete object._modelViewMatrix;
		delete object._normalMatrix;

		delete object.__webglActive;

	}

	function removeInstances( objlist, object ) {

		for ( var o = objlist.length - 1; o >= 0; o -- ) {

			if ( objlist[ o ].object === object ) {

				objlist.splice( o, 1 );

			}

		}

	}

	// Materials

	function initMaterial( material, lights, fog, object ) {

		material.addEventListener( 'dispose', onMaterialDispose );

		var shaderID;

		if ( material instanceof THREE.MeshDepthMaterial ) {

			shaderID = 'depth';

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			shaderID = 'normal';

		} else if ( material instanceof THREE.MeshBasicMaterial ) {

			shaderID = 'basic';

		} else if ( material instanceof THREE.MeshLambertMaterial ) {

			shaderID = 'lambert';

		} else if ( material instanceof THREE.MeshPhongMaterial ) {

			shaderID = 'phong';

		} else if ( material instanceof THREE.LineBasicMaterial ) {

			shaderID = 'basic';

		} else if ( material instanceof THREE.LineDashedMaterial ) {

			shaderID = 'dashed';

		} else if ( material instanceof THREE.PointCloudMaterial ) {

			shaderID = 'particle_basic';

		}

		if ( shaderID ) {

			var shader = THREE.ShaderLib[ shaderID ];

			material.__webglShader = {
				uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader
			}

		} else {

			material.__webglShader = {
				uniforms: material.uniforms,
				vertexShader: material.vertexShader,
				fragmentShader: material.fragmentShader
			}

		}

		// heuristics to create shader parameters according to lights in the scene
		// (not to blow over maxLights budget)

		var maxLightCount = allocateLights( lights );
		var maxShadows = allocateShadows( lights );
		var maxBones = allocateBones( object );

		var parameters = {

			precision: _precision,
			supportsVertexTextures: _supportsVertexTextures,

			map: !! material.map,
			envMap: !! material.envMap,
			lightMap: !! material.lightMap,
			bumpMap: !! material.bumpMap,
			normalMap: !! material.normalMap,
			specularMap: !! material.specularMap,
			alphaMap: !! material.alphaMap,

			vertexColors: material.vertexColors,

			fog: fog,
			useFog: material.fog,
			fogExp: fog instanceof THREE.FogExp2,

			sizeAttenuation: material.sizeAttenuation,
			logarithmicDepthBuffer: _logarithmicDepthBuffer,

			skinning: material.skinning,
			maxBones: maxBones,
			useVertexTexture: _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture,

			morphTargets: material.morphTargets,
			morphNormals: material.morphNormals,
			maxMorphTargets: _this.maxMorphTargets,
			maxMorphNormals: _this.maxMorphNormals,

			maxDirLights: maxLightCount.directional,
			maxPointLights: maxLightCount.point,
			maxSpotLights: maxLightCount.spot,
			maxHemiLights: maxLightCount.hemi,

			maxShadows: maxShadows,
			shadowMapEnabled: _this.shadowMapEnabled && object.receiveShadow && maxShadows > 0,
			shadowMapType: _this.shadowMapType,
			shadowMapDebug: _this.shadowMapDebug,
			shadowMapCascade: _this.shadowMapCascade,

			alphaTest: material.alphaTest,
			metal: material.metal,
			wrapAround: material.wrapAround,
			doubleSided: material.side === THREE.DoubleSide,
			flipSided: material.side === THREE.BackSide

		};

		// Generate code

		var chunks = [];

		if ( shaderID ) {

			chunks.push( shaderID );

		} else {

			chunks.push( material.fragmentShader );
			chunks.push( material.vertexShader );

		}

		if ( material.defines !== undefined ) {

			for ( var name in material.defines ) {

				chunks.push( name );
				chunks.push( material.defines[ name ] );

			}

		}

		for ( var name in parameters ) {

			chunks.push( name );
			chunks.push( parameters[ name ] );

		}

		var code = chunks.join();

		var program;

		// Check if code has been already compiled

		for ( var p = 0, pl = _programs.length; p < pl; p ++ ) {

			var programInfo = _programs[ p ];

			if ( programInfo.code === code ) {

				program = programInfo;
				program.usedTimes ++;

				break;

			}

		}

		if ( program === undefined ) {

			program = new THREE.WebGLProgram( _this, code, material, parameters );
			_programs.push( program );

			_this.info.memory.programs = _programs.length;

		}

		material.program = program;

		var attributes = program.attributes;

		if ( material.morphTargets ) {

			material.numSupportedMorphTargets = 0;

			var id, base = 'morphTarget';

			for ( var i = 0; i < _this.maxMorphTargets; i ++ ) {

				id = base + i;

				if ( attributes[ id ] >= 0 ) {

					material.numSupportedMorphTargets ++;

				}

			}

		}

		if ( material.morphNormals ) {

			material.numSupportedMorphNormals = 0;

			var id, base = 'morphNormal';

			for ( i = 0; i < _this.maxMorphNormals; i ++ ) {

				id = base + i;

				if ( attributes[ id ] >= 0 ) {

					material.numSupportedMorphNormals ++;

				}

			}

		}

		material.uniformsList = [];

		for ( var u in material.__webglShader.uniforms ) {

			var location = material.program.uniforms[ u ];

			if ( location ) {
				material.uniformsList.push( [ material.__webglShader.uniforms[ u ], location ] );
			}

		}

	}

	function setProgram( camera, lights, fog, material, object ) {

		_usedTextureUnits = 0;

		if ( material.needsUpdate ) {

			if ( material.program ) deallocateMaterial( material );

			initMaterial( material, lights, fog, object );
			material.needsUpdate = false;

		}

		if ( material.morphTargets ) {

			if ( ! object.__webglMorphTargetInfluences ) {

				object.__webglMorphTargetInfluences = new Float32Array( _this.maxMorphTargets );

			}

		}

		var refreshProgram = false;
		var refreshMaterial = false;
		var refreshLights = false;

		var program = material.program,
			p_uniforms = program.uniforms,
			m_uniforms = material.__webglShader.uniforms;

		if ( program.id !== _currentProgram ) {

			_gl.useProgram( program.program );
			_currentProgram = program.id;

			refreshProgram = true;
			refreshMaterial = true;
			refreshLights = true;

		}

		if ( material.id !== _currentMaterialId ) {

			if ( _currentMaterialId === -1 ) refreshLights = true;
			_currentMaterialId = material.id;

			refreshMaterial = true;

		}

		if ( refreshProgram || camera !== _currentCamera ) {

			_gl.uniformMatrix4fv( p_uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

			if ( _logarithmicDepthBuffer ) {

				_gl.uniform1f( p_uniforms.logDepthBufFC, 2.0 / ( Math.log( camera.far + 1.0 ) / Math.LN2 ) );

			}


			if ( camera !== _currentCamera ) _currentCamera = camera;

			// load material specific uniforms
			// (shader material also gets them for the sake of genericity)

			if ( material instanceof THREE.ShaderMaterial ||
				 material instanceof THREE.MeshPhongMaterial ||
				 material.envMap ) {

				if ( p_uniforms.cameraPosition !== null ) {

					_vector3.setFromMatrixPosition( camera.matrixWorld );
					_gl.uniform3f( p_uniforms.cameraPosition, _vector3.x, _vector3.y, _vector3.z );

				}

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.ShaderMaterial ||
				 material.skinning ) {

				if ( p_uniforms.viewMatrix !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, camera.matrixWorldInverse.elements );

				}

			}

		}

		// skinning uniforms must be set even if material didn't change
		// auto-setting of texture unit for bone texture must go before other textures
		// not sure why, but otherwise weird things happen

		if ( material.skinning ) {

			if ( object.bindMatrix && p_uniforms.bindMatrix !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.bindMatrix, false, object.bindMatrix.elements );

			}

			if ( object.bindMatrixInverse && p_uniforms.bindMatrixInverse !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.bindMatrixInverse, false, object.bindMatrixInverse.elements );

			}

			if ( _supportsBoneTextures && object.skeleton && object.skeleton.useVertexTexture ) {

				if ( p_uniforms.boneTexture !== null ) {

					var textureUnit = getTextureUnit();

					_gl.uniform1i( p_uniforms.boneTexture, textureUnit );
					_this.setTexture( object.skeleton.boneTexture, textureUnit );

				}

				if ( p_uniforms.boneTextureWidth !== null ) {

					_gl.uniform1i( p_uniforms.boneTextureWidth, object.skeleton.boneTextureWidth );

				}

				if ( p_uniforms.boneTextureHeight !== null ) {

					_gl.uniform1i( p_uniforms.boneTextureHeight, object.skeleton.boneTextureHeight );

				}

			} else if ( object.skeleton && object.skeleton.boneMatrices ) {

				if ( p_uniforms.boneGlobalMatrices !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.boneGlobalMatrices, false, object.skeleton.boneMatrices );

				}

			}

		}

		if ( refreshMaterial ) {

			// refresh uniforms common to several materials

			if ( fog && material.fog ) {

				refreshUniformsFog( m_uniforms, fog );

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material.lights ) {

				if ( _lightsNeedUpdate ) {

					refreshLights = true;
					setupLights( lights );
					_lightsNeedUpdate = false;
				}

				if ( refreshLights ) {
					refreshUniformsLights( m_uniforms, _lights );
					markUniformsLightsNeedsUpdate( m_uniforms, true );
				} else {
					markUniformsLightsNeedsUpdate( m_uniforms, false );
				}

			}

			if ( material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsCommon( m_uniforms, material );

			}

			// refresh single material specific uniforms

			if ( material instanceof THREE.LineBasicMaterial ) {

				refreshUniformsLine( m_uniforms, material );

			} else if ( material instanceof THREE.LineDashedMaterial ) {

				refreshUniformsLine( m_uniforms, material );
				refreshUniformsDash( m_uniforms, material );

			} else if ( material instanceof THREE.PointCloudMaterial ) {

				refreshUniformsParticle( m_uniforms, material );

			} else if ( material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsPhong( m_uniforms, material );

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				refreshUniformsLambert( m_uniforms, material );

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				m_uniforms.mNear.value = camera.near;
				m_uniforms.mFar.value = camera.far;
				m_uniforms.opacity.value = material.opacity;

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				m_uniforms.opacity.value = material.opacity;

			}

			if ( object.receiveShadow && ! material._shadowPass ) {

				refreshUniformsShadow( m_uniforms, lights );

			}

			// load common uniforms

			loadUniformsGeneric( material.uniformsList );

		}

		loadUniformsMatrices( p_uniforms, object );

		if ( p_uniforms.modelMatrix !== null ) {

			_gl.uniformMatrix4fv( p_uniforms.modelMatrix, false, object.matrixWorld.elements );

		}

		return program;

	}

	// Uniforms (refresh uniforms objects)

	function refreshUniformsCommon ( uniforms, material ) {

		uniforms.opacity.value = material.opacity;

		if ( _this.gammaInput ) {

			uniforms.diffuse.value.copyGammaToLinear( material.color );

		} else {

			uniforms.diffuse.value = material.color;

		}

		uniforms.map.value = material.map;
		uniforms.lightMap.value = material.lightMap;
		uniforms.specularMap.value = material.specularMap;
		uniforms.alphaMap.value = material.alphaMap;

		if ( material.bumpMap ) {

			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;

		}

		if ( material.normalMap ) {

			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy( material.normalScale );

		}

		// uv repeat and offset setting priorities
		//  1. color map
		//  2. specular map
		//  3. normal map
		//  4. bump map
		//  5. alpha map

		var uvScaleMap;

		if ( material.map ) {

			uvScaleMap = material.map;

		} else if ( material.specularMap ) {

			uvScaleMap = material.specularMap;

		} else if ( material.normalMap ) {

			uvScaleMap = material.normalMap;

		} else if ( material.bumpMap ) {

			uvScaleMap = material.bumpMap;

		} else if ( material.alphaMap ) {

			uvScaleMap = material.alphaMap;

		}

		if ( uvScaleMap !== undefined ) {

			var offset = uvScaleMap.offset;
			var repeat = uvScaleMap.repeat;

			uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

		}

		uniforms.envMap.value = material.envMap;
		uniforms.flipEnvMap.value = ( material.envMap instanceof THREE.WebGLRenderTargetCube ) ? 1 : - 1;

		if ( _this.gammaInput ) {

			//uniforms.reflectivity.value = material.reflectivity * material.reflectivity;
			uniforms.reflectivity.value = material.reflectivity;

		} else {

			uniforms.reflectivity.value = material.reflectivity;

		}

		uniforms.refractionRatio.value = material.refractionRatio;
		uniforms.combine.value = material.combine;
		uniforms.useRefract.value = material.envMap && material.envMap.mapping instanceof THREE.CubeRefractionMapping;

	}

	function refreshUniformsLine ( uniforms, material ) {

		uniforms.diffuse.value = material.color;
		uniforms.opacity.value = material.opacity;

	}

	function refreshUniformsDash ( uniforms, material ) {

		uniforms.dashSize.value = material.dashSize;
		uniforms.totalSize.value = material.dashSize + material.gapSize;
		uniforms.scale.value = material.scale;

	}

	function refreshUniformsParticle ( uniforms, material ) {

		uniforms.psColor.value = material.color;
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size;
		uniforms.scale.value = _canvas.height / 2.0; // TODO: Cache this.

		uniforms.map.value = material.map;

	}

	function refreshUniformsFog ( uniforms, fog ) {

		uniforms.fogColor.value = fog.color;

		if ( fog instanceof THREE.Fog ) {

			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;

		} else if ( fog instanceof THREE.FogExp2 ) {

			uniforms.fogDensity.value = fog.density;

		}

	}

	function refreshUniformsPhong ( uniforms, material ) {

		uniforms.shininess.value = material.shininess;

		if ( _this.gammaInput ) {

			uniforms.ambient.value.copyGammaToLinear( material.ambient );
			uniforms.emissive.value.copyGammaToLinear( material.emissive );
			uniforms.specular.value.copyGammaToLinear( material.specular );

		} else {

			uniforms.ambient.value = material.ambient;
			uniforms.emissive.value = material.emissive;
			uniforms.specular.value = material.specular;

		}

		if ( material.wrapAround ) {

			uniforms.wrapRGB.value.copy( material.wrapRGB );

		}

	}

	function refreshUniformsLambert ( uniforms, material ) {

		if ( _this.gammaInput ) {

			uniforms.ambient.value.copyGammaToLinear( material.ambient );
			uniforms.emissive.value.copyGammaToLinear( material.emissive );

		} else {

			uniforms.ambient.value = material.ambient;
			uniforms.emissive.value = material.emissive;

		}

		if ( material.wrapAround ) {

			uniforms.wrapRGB.value.copy( material.wrapRGB );

		}

	}

	function refreshUniformsLights ( uniforms, lights ) {

		uniforms.ambientLightColor.value = lights.ambient;

		uniforms.directionalLightColor.value = lights.directional.colors;
		uniforms.directionalLightDirection.value = lights.directional.positions;

		uniforms.pointLightColor.value = lights.point.colors;
		uniforms.pointLightPosition.value = lights.point.positions;
		uniforms.pointLightDistance.value = lights.point.distances;

		uniforms.spotLightColor.value = lights.spot.colors;
		uniforms.spotLightPosition.value = lights.spot.positions;
		uniforms.spotLightDistance.value = lights.spot.distances;
		uniforms.spotLightDirection.value = lights.spot.directions;
		uniforms.spotLightAngleCos.value = lights.spot.anglesCos;
		uniforms.spotLightExponent.value = lights.spot.exponents;

		uniforms.hemisphereLightSkyColor.value = lights.hemi.skyColors;
		uniforms.hemisphereLightGroundColor.value = lights.hemi.groundColors;
		uniforms.hemisphereLightDirection.value = lights.hemi.positions;

	}

	// If uniforms are marked as clean, they don't need to be loaded to the GPU.

	function markUniformsLightsNeedsUpdate ( uniforms, boolean ) {

		uniforms.ambientLightColor.needsUpdate = boolean;

		uniforms.directionalLightColor.needsUpdate = boolean;
		uniforms.directionalLightDirection.needsUpdate = boolean;

		uniforms.pointLightColor.needsUpdate = boolean;
		uniforms.pointLightPosition.needsUpdate = boolean;
		uniforms.pointLightDistance.needsUpdate = boolean;

		uniforms.spotLightColor.needsUpdate = boolean;
		uniforms.spotLightPosition.needsUpdate = boolean;
		uniforms.spotLightDistance.needsUpdate = boolean;
		uniforms.spotLightDirection.needsUpdate = boolean;
		uniforms.spotLightAngleCos.needsUpdate = boolean;
		uniforms.spotLightExponent.needsUpdate = boolean;

		uniforms.hemisphereLightSkyColor.needsUpdate = boolean;
		uniforms.hemisphereLightGroundColor.needsUpdate = boolean;
		uniforms.hemisphereLightDirection.needsUpdate = boolean;

	}

	function refreshUniformsShadow ( uniforms, lights ) {

		if ( uniforms.shadowMatrix ) {

			var j = 0;

			for ( var i = 0, il = lights.length; i < il; i ++ ) {

				var light = lights[ i ];

				if ( ! light.castShadow ) continue;

				if ( light instanceof THREE.SpotLight || ( light instanceof THREE.DirectionalLight && ! light.shadowCascade ) ) {

					uniforms.shadowMap.value[ j ] = light.shadowMap;
					uniforms.shadowMapSize.value[ j ] = light.shadowMapSize;

					uniforms.shadowMatrix.value[ j ] = light.shadowMatrix;

					uniforms.shadowDarkness.value[ j ] = light.shadowDarkness;
					uniforms.shadowBias.value[ j ] = light.shadowBias;

					j ++;

				}

			}

		}

	}

	// Uniforms (load to GPU)

	function loadUniformsMatrices ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, object._modelViewMatrix.elements );

		if ( uniforms.normalMatrix ) {

			_gl.uniformMatrix3fv( uniforms.normalMatrix, false, object._normalMatrix.elements );

		}

	}

	function getTextureUnit() {

		var textureUnit = _usedTextureUnits;

		if ( textureUnit >= _maxTextures ) {

			console.warn( 'WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + _maxTextures );

		}

		_usedTextureUnits += 1;

		return textureUnit;

	}

	function loadUniformsGeneric ( uniforms ) {

		var texture, textureUnit, offset;

		for ( var j = 0, jl = uniforms.length; j < jl; j ++ ) {

			var uniform = uniforms[ j ][ 0 ];

			// needsUpdate property is not added to all uniforms.
			if ( uniform.needsUpdate === false ) continue;

			var type = uniform.type;
			var value = uniform.value;
			var location = uniforms[ j ][ 1 ];

			switch ( type ) {

				case '1i':
					_gl.uniform1i( location, value );
					break;

				case '1f':
					_gl.uniform1f( location, value );
					break;

				case '2f':
					_gl.uniform2f( location, value[ 0 ], value[ 1 ] );
					break;

				case '3f':
					_gl.uniform3f( location, value[ 0 ], value[ 1 ], value[ 2 ] );
					break;

				case '4f':
					_gl.uniform4f( location, value[ 0 ], value[ 1 ], value[ 2 ], value[ 3 ] );
					break;

				case '1iv':
					_gl.uniform1iv( location, value );
					break;

				case '3iv':
					_gl.uniform3iv( location, value );
					break;

				case '1fv':
					_gl.uniform1fv( location, value );
					break;

				case '2fv':
					_gl.uniform2fv( location, value );
					break;

				case '3fv':
					_gl.uniform3fv( location, value );
					break;

				case '4fv':
					_gl.uniform4fv( location, value );
					break;

				case 'Matrix3fv':
					_gl.uniformMatrix3fv( location, false, value );
					break;

				case 'Matrix4fv':
					_gl.uniformMatrix4fv( location, false, value );
					break;

				//

				case 'i':

					// single integer
					_gl.uniform1i( location, value );

					break;

				case 'f':

					// single float
					_gl.uniform1f( location, value );

					break;

				case 'v2':

					// single THREE.Vector2
					_gl.uniform2f( location, value.x, value.y );

					break;

				case 'v3':

					// single THREE.Vector3
					_gl.uniform3f( location, value.x, value.y, value.z );

					break;

				case 'v4':

					// single THREE.Vector4
					_gl.uniform4f( location, value.x, value.y, value.z, value.w );

					break;

				case 'c':

					// single THREE.Color
					_gl.uniform3f( location, value.r, value.g, value.b );

					break;

				case 'iv1':

					// flat array of integers (JS or typed array)
					_gl.uniform1iv( location, value );

					break;

				case 'iv':

					// flat array of integers with 3 x N size (JS or typed array)
					_gl.uniform3iv( location, value );

					break;

				case 'fv1':

					// flat array of floats (JS or typed array)
					_gl.uniform1fv( location, value );

					break;

				case 'fv':

					// flat array of floats with 3 x N size (JS or typed array)
					_gl.uniform3fv( location, value );

					break;

				case 'v2v':

					// array of THREE.Vector2

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 2 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 2;

						uniform._array[ offset ]   = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;

					}

					_gl.uniform2fv( location, uniform._array );

					break;

				case 'v3v':

					// array of THREE.Vector3

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 3 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 3;

						uniform._array[ offset ]   = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;
						uniform._array[ offset + 2 ] = value[ i ].z;

					}

					_gl.uniform3fv( location, uniform._array );

					break;

				case 'v4v':

					// array of THREE.Vector4

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 4 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 4;

						uniform._array[ offset ]   = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;
						uniform._array[ offset + 2 ] = value[ i ].z;
						uniform._array[ offset + 3 ] = value[ i ].w;

					}

					_gl.uniform4fv( location, uniform._array );

					break;

				case 'm3':

					// single THREE.Matrix3
					_gl.uniformMatrix3fv( location, false, value.elements );

					break;

				case 'm3v':

					// array of THREE.Matrix3

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 9 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						value[ i ].flattenToArrayOffset( uniform._array, i * 9 );

					}

					_gl.uniformMatrix3fv( location, false, uniform._array );

					break;

				case 'm4':

					// single THREE.Matrix4
					_gl.uniformMatrix4fv( location, false, value.elements );

					break;

				case 'm4v':

					// array of THREE.Matrix4

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 16 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						value[ i ].flattenToArrayOffset( uniform._array, i * 16 );

					}

					_gl.uniformMatrix4fv( location, false, uniform._array );

					break;

				case 't':

					// single THREE.Texture (2d or cube)

					texture = value;
					textureUnit = getTextureUnit();

					_gl.uniform1i( location, textureUnit );

					if ( ! texture ) continue;

					if ( texture instanceof THREE.CubeTexture ||
					   ( texture.image instanceof Array && texture.image.length === 6 ) ) { // CompressedTexture can have Array in image :/

						setCubeTexture( texture, textureUnit );

					} else if ( texture instanceof THREE.WebGLRenderTargetCube ) {

						setCubeTextureDynamic( texture, textureUnit );

					} else {

						_this.setTexture( texture, textureUnit );

					}

					break;

				case 'tv':

					// array of THREE.Texture (2d)

					if ( uniform._array === undefined ) {

						uniform._array = [];

					}

					for ( var i = 0, il = uniform.value.length; i < il; i ++ ) {

						uniform._array[ i ] = getTextureUnit();

					}

					_gl.uniform1iv( location, uniform._array );

					for ( var i = 0, il = uniform.value.length; i < il; i ++ ) {

						texture = uniform.value[ i ];
						textureUnit = uniform._array[ i ];

						if ( ! texture ) continue;

						_this.setTexture( texture, textureUnit );

					}

					break;

				default:

					console.warn( 'THREE.WebGLRenderer: Unknown uniform type: ' + type );

			}

		}

	}

	function setupMatrices ( object, camera ) {

		object._modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
		object._normalMatrix.getNormalMatrix( object._modelViewMatrix );

	}

	//

	function setColorGamma( array, offset, color, intensitySq ) {

		array[ offset ]     = color.r * color.r * intensitySq;
		array[ offset + 1 ] = color.g * color.g * intensitySq;
		array[ offset + 2 ] = color.b * color.b * intensitySq;

	}

	function setColorLinear( array, offset, color, intensity ) {

		array[ offset ]     = color.r * intensity;
		array[ offset + 1 ] = color.g * intensity;
		array[ offset + 2 ] = color.b * intensity;

	}

	function setupLights ( lights ) {

		var l, ll, light, n,
		r = 0, g = 0, b = 0,
		color, skyColor, groundColor,
		intensity,  intensitySq,
		position,
		distance,

		zlights = _lights,

		dirColors = zlights.directional.colors,
		dirPositions = zlights.directional.positions,

		pointColors = zlights.point.colors,
		pointPositions = zlights.point.positions,
		pointDistances = zlights.point.distances,

		spotColors = zlights.spot.colors,
		spotPositions = zlights.spot.positions,
		spotDistances = zlights.spot.distances,
		spotDirections = zlights.spot.directions,
		spotAnglesCos = zlights.spot.anglesCos,
		spotExponents = zlights.spot.exponents,

		hemiSkyColors = zlights.hemi.skyColors,
		hemiGroundColors = zlights.hemi.groundColors,
		hemiPositions = zlights.hemi.positions,

		dirLength = 0,
		pointLength = 0,
		spotLength = 0,
		hemiLength = 0,

		dirCount = 0,
		pointCount = 0,
		spotCount = 0,
		hemiCount = 0,

		dirOffset = 0,
		pointOffset = 0,
		spotOffset = 0,
		hemiOffset = 0;

		for ( l = 0, ll = lights.length; l < ll; l ++ ) {

			light = lights[ l ];

			if ( light.onlyShadow ) continue;

			color = light.color;
			intensity = light.intensity;
			distance = light.distance;

			if ( light instanceof THREE.AmbientLight ) {

				if ( ! light.visible ) continue;

				if ( _this.gammaInput ) {

					r += color.r * color.r;
					g += color.g * color.g;
					b += color.b * color.b;

				} else {

					r += color.r;
					g += color.g;
					b += color.b;

				}

			} else if ( light instanceof THREE.DirectionalLight ) {

				dirCount += 1;

				if ( ! light.visible ) continue;

				_direction.setFromMatrixPosition( light.matrixWorld );
				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				_direction.sub( _vector3 );
				_direction.normalize();

				dirOffset = dirLength * 3;

				dirPositions[ dirOffset ]     = _direction.x;
				dirPositions[ dirOffset + 1 ] = _direction.y;
				dirPositions[ dirOffset + 2 ] = _direction.z;

				if ( _this.gammaInput ) {

					setColorGamma( dirColors, dirOffset, color, intensity * intensity );

				} else {

					setColorLinear( dirColors, dirOffset, color, intensity );

				}

				dirLength += 1;

			} else if ( light instanceof THREE.PointLight ) {

				pointCount += 1;

				if ( ! light.visible ) continue;

				pointOffset = pointLength * 3;

				if ( _this.gammaInput ) {

					setColorGamma( pointColors, pointOffset, color, intensity * intensity );

				} else {

					setColorLinear( pointColors, pointOffset, color, intensity );

				}

				_vector3.setFromMatrixPosition( light.matrixWorld );

				pointPositions[ pointOffset ]     = _vector3.x;
				pointPositions[ pointOffset + 1 ] = _vector3.y;
				pointPositions[ pointOffset + 2 ] = _vector3.z;

				pointDistances[ pointLength ] = distance;

				pointLength += 1;

			} else if ( light instanceof THREE.SpotLight ) {

				spotCount += 1;

				if ( ! light.visible ) continue;

				spotOffset = spotLength * 3;

				if ( _this.gammaInput ) {

					setColorGamma( spotColors, spotOffset, color, intensity * intensity );

				} else {

					setColorLinear( spotColors, spotOffset, color, intensity );

				}

				_direction.setFromMatrixPosition( light.matrixWorld );

				spotPositions[ spotOffset ]     = _direction.x;
				spotPositions[ spotOffset + 1 ] = _direction.y;
				spotPositions[ spotOffset + 2 ] = _direction.z;

				spotDistances[ spotLength ] = distance;

				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				_direction.sub( _vector3 );
				_direction.normalize();

				spotDirections[ spotOffset ]     = _direction.x;
				spotDirections[ spotOffset + 1 ] = _direction.y;
				spotDirections[ spotOffset + 2 ] = _direction.z;

				spotAnglesCos[ spotLength ] = Math.cos( light.angle );
				spotExponents[ spotLength ] = light.exponent;

				spotLength += 1;

			} else if ( light instanceof THREE.HemisphereLight ) {

				hemiCount += 1;

				if ( ! light.visible ) continue;

				_direction.setFromMatrixPosition( light.matrixWorld );
				_direction.normalize();

				hemiOffset = hemiLength * 3;

				hemiPositions[ hemiOffset ]     = _direction.x;
				hemiPositions[ hemiOffset + 1 ] = _direction.y;
				hemiPositions[ hemiOffset + 2 ] = _direction.z;

				skyColor = light.color;
				groundColor = light.groundColor;

				if ( _this.gammaInput ) {

					intensitySq = intensity * intensity;

					setColorGamma( hemiSkyColors, hemiOffset, skyColor, intensitySq );
					setColorGamma( hemiGroundColors, hemiOffset, groundColor, intensitySq );

				} else {

					setColorLinear( hemiSkyColors, hemiOffset, skyColor, intensity );
					setColorLinear( hemiGroundColors, hemiOffset, groundColor, intensity );

				}

				hemiLength += 1;

			}

		}

		// null eventual remains from removed lights
		// (this is to avoid if in shader)

		for ( l = dirLength * 3, ll = Math.max( dirColors.length, dirCount * 3 ); l < ll; l ++ ) dirColors[ l ] = 0.0;
		for ( l = pointLength * 3, ll = Math.max( pointColors.length, pointCount * 3 ); l < ll; l ++ ) pointColors[ l ] = 0.0;
		for ( l = spotLength * 3, ll = Math.max( spotColors.length, spotCount * 3 ); l < ll; l ++ ) spotColors[ l ] = 0.0;
		for ( l = hemiLength * 3, ll = Math.max( hemiSkyColors.length, hemiCount * 3 ); l < ll; l ++ ) hemiSkyColors[ l ] = 0.0;
		for ( l = hemiLength * 3, ll = Math.max( hemiGroundColors.length, hemiCount * 3 ); l < ll; l ++ ) hemiGroundColors[ l ] = 0.0;

		zlights.directional.length = dirLength;
		zlights.point.length = pointLength;
		zlights.spot.length = spotLength;
		zlights.hemi.length = hemiLength;

		zlights.ambient[ 0 ] = r;
		zlights.ambient[ 1 ] = g;
		zlights.ambient[ 2 ] = b;

	}

	// GL state setting

	this.setFaceCulling = function ( cullFace, frontFaceDirection ) {

		if ( cullFace === THREE.CullFaceNone ) {

			_gl.disable( _gl.CULL_FACE );

		} else {

			if ( frontFaceDirection === THREE.FrontFaceDirectionCW ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			if ( cullFace === THREE.CullFaceBack ) {

				_gl.cullFace( _gl.BACK );

			} else if ( cullFace === THREE.CullFaceFront ) {

				_gl.cullFace( _gl.FRONT );

			} else {

				_gl.cullFace( _gl.FRONT_AND_BACK );

			}

			_gl.enable( _gl.CULL_FACE );

		}

	};

	this.setMaterialFaces = function ( material ) {

		var doubleSided = material.side === THREE.DoubleSide;
		var flipSided = material.side === THREE.BackSide;

		if ( _oldDoubleSided !== doubleSided ) {

			if ( doubleSided ) {

				_gl.disable( _gl.CULL_FACE );

			} else {

				_gl.enable( _gl.CULL_FACE );

			}

			_oldDoubleSided = doubleSided;

		}

		if ( _oldFlipSided !== flipSided ) {

			if ( flipSided ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			_oldFlipSided = flipSided;

		}

	};

	this.setDepthTest = function ( depthTest ) {

		if ( _oldDepthTest !== depthTest ) {

			if ( depthTest ) {

				_gl.enable( _gl.DEPTH_TEST );

			} else {

				_gl.disable( _gl.DEPTH_TEST );

			}

			_oldDepthTest = depthTest;

		}

	};

	this.setDepthWrite = function ( depthWrite ) {

		if ( _oldDepthWrite !== depthWrite ) {

			_gl.depthMask( depthWrite );
			_oldDepthWrite = depthWrite;

		}

	};

	function setLineWidth ( width ) {

		if ( width !== _oldLineWidth ) {

			_gl.lineWidth( width );

			_oldLineWidth = width;

		}

	}

	function setPolygonOffset ( polygonoffset, factor, units ) {

		if ( _oldPolygonOffset !== polygonoffset ) {

			if ( polygonoffset ) {

				_gl.enable( _gl.POLYGON_OFFSET_FILL );

			} else {

				_gl.disable( _gl.POLYGON_OFFSET_FILL );

			}

			_oldPolygonOffset = polygonoffset;

		}

		if ( polygonoffset && ( _oldPolygonOffsetFactor !== factor || _oldPolygonOffsetUnits !== units ) ) {

			_gl.polygonOffset( factor, units );

			_oldPolygonOffsetFactor = factor;
			_oldPolygonOffsetUnits = units;

		}

	}

	this.setBlending = function ( blending, blendEquation, blendSrc, blendDst ) {

		if ( blending !== _oldBlending ) {

			if ( blending === THREE.NoBlending ) {

				_gl.disable( _gl.BLEND );

			} else if ( blending === THREE.AdditiveBlending ) {

				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE );

			} else if ( blending === THREE.SubtractiveBlending ) {

				// TODO: Find blendFuncSeparate() combination
				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.ZERO, _gl.ONE_MINUS_SRC_COLOR );

			} else if ( blending === THREE.MultiplyBlending ) {

				// TODO: Find blendFuncSeparate() combination
				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.ZERO, _gl.SRC_COLOR );

			} else if ( blending === THREE.CustomBlending ) {

				_gl.enable( _gl.BLEND );

			} else {

				_gl.enable( _gl.BLEND );
				_gl.blendEquationSeparate( _gl.FUNC_ADD, _gl.FUNC_ADD );
				_gl.blendFuncSeparate( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA );

			}

			_oldBlending = blending;

		}

		if ( blending === THREE.CustomBlending ) {

			if ( blendEquation !== _oldBlendEquation ) {

				_gl.blendEquation( paramThreeToGL( blendEquation ) );

				_oldBlendEquation = blendEquation;

			}

			if ( blendSrc !== _oldBlendSrc || blendDst !== _oldBlendDst ) {

				_gl.blendFunc( paramThreeToGL( blendSrc ), paramThreeToGL( blendDst ) );

				_oldBlendSrc = blendSrc;
				_oldBlendDst = blendDst;

			}

		} else {

			_oldBlendEquation = null;
			_oldBlendSrc = null;
			_oldBlendDst = null;

		}

	};

	// Textures

	function setTextureParameters ( textureType, texture, isImagePowerOfTwo ) {

		var extension;

		if ( isImagePowerOfTwo ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

		}

		extension = extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension && texture.type !== THREE.FloatType ) {

			if ( texture.anisotropy > 1 || texture.__oldAnisotropy ) {

				_gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min( texture.anisotropy, _this.getMaxAnisotropy() ) );
				texture.__oldAnisotropy = texture.anisotropy;

			}

		}

	}

	this.uploadTexture = function ( texture ) {

		if ( texture.__webglInit === undefined ) {

			texture.__webglInit = true;

			texture.addEventListener( 'dispose', onTextureDispose );

			texture.__webglTexture = _gl.createTexture();

			_this.info.memory.textures ++;

		}

		_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
		_gl.pixelStorei( _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, texture.unpackAlignment );

		texture.image = clampToMaxSize( texture.image, _maxTextureSize );

		var image = texture.image,
		isImagePowerOfTwo = THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height ),
		glFormat = paramThreeToGL( texture.format ),
		glType = paramThreeToGL( texture.type );

		setTextureParameters( _gl.TEXTURE_2D, texture, isImagePowerOfTwo );

		var mipmap, mipmaps = texture.mipmaps;

		if ( texture instanceof THREE.DataTexture ) {

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isImagePowerOfTwo ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					_gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

				texture.generateMipmaps = false;

			} else {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data );

			}

		} else if ( texture instanceof THREE.CompressedTexture ) {

			for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

				mipmap = mipmaps[ i ];

				if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

					if ( getCompressedTextureFormats().indexOf( glFormat ) > -1 ) {

						_gl.compressedTexImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

					} else {

						console.warn( "Attempt to load unsupported compressed texture format" );

					}

				} else {

					_gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

			}

		} else { // regular Texture (image, video, canvas)

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isImagePowerOfTwo ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					_gl.texImage2D( _gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap );

				}

				texture.generateMipmaps = false;

			} else {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image );

			}

		}

		if ( texture.generateMipmaps && isImagePowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

		texture.needsUpdate = false;

		if ( texture.onUpdate ) texture.onUpdate();

	};

	this.setTexture = function ( texture, slot ) {

		_gl.activeTexture( _gl.TEXTURE0 + slot );

		if ( texture.needsUpdate ) {

			_this.uploadTexture( texture );

		} else {

			_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		}

	};

	function clampToMaxSize ( image, maxSize ) {

		if ( image.width > maxSize || image.height > maxSize ) {

			// Warning: Scaling through the canvas will only work with images that use
			// premultiplied alpha.

			var scale = maxSize / Math.max( image.width, image.height );

			var canvas = document.createElement( 'canvas' );
			canvas.width = Math.floor( image.width * scale );
			canvas.height = Math.floor( image.height * scale );

			var context = canvas.getContext( '2d' );
			context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );

			console.log( 'THREE.WebGLRenderer:', image, 'is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height + '.' );

			return canvas;

		}

		return image;

	}

	function setCubeTexture ( texture, slot ) {

		if ( texture.image.length === 6 ) {

			if ( texture.needsUpdate ) {

				if ( ! texture.image.__webglTextureCube ) {

					texture.addEventListener( 'dispose', onTextureDispose );

					texture.image.__webglTextureCube = _gl.createTexture();

					_this.info.memory.textures ++;

				}

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

				_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );

				var isCompressed = texture instanceof THREE.CompressedTexture;
				var isDataTexture = texture.image[ 0 ] instanceof THREE.DataTexture;

				var cubeImage = [];

				for ( var i = 0; i < 6; i ++ ) {

					if ( _this.autoScaleCubemaps && ! isCompressed && ! isDataTexture ) {

						cubeImage[ i ] = clampToMaxSize( texture.image[ i ], _maxCubemapSize );

					} else {

						cubeImage[ i ] = isDataTexture ? texture.image[ i ].image : texture.image[ i ];

					}

				}

				var image = cubeImage[ 0 ],
				isImagePowerOfTwo = THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height ),
				glFormat = paramThreeToGL( texture.format ),
				glType = paramThreeToGL( texture.type );

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					if ( ! isCompressed ) {

						if ( isDataTexture ) {

							_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[ i ].width, cubeImage[ i ].height, 0, glFormat, glType, cubeImage[ i ].data );

						} else {

							_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[ i ] );

						}

					} else {

						var mipmap, mipmaps = cubeImage[ i ].mipmaps;

						for ( var j = 0, jl = mipmaps.length; j < jl; j ++ ) {

							mipmap = mipmaps[ j ];

							if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

								if ( getCompressedTextureFormats().indexOf( glFormat ) > -1 ) {

									_gl.compressedTexImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

								} else {

									console.warn( "Attempt to load unsupported compressed texture format" );

								}

							} else {

								_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

							}

						}

					}

				}

				if ( texture.generateMipmaps && isImagePowerOfTwo ) {

					_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

				}

				texture.needsUpdate = false;

				if ( texture.onUpdate ) texture.onUpdate();

			} else {

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

			}

		}

	}

	function setCubeTextureDynamic ( texture, slot ) {

		_gl.activeTexture( _gl.TEXTURE0 + slot );
		_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.__webglTexture );

	}

	// Render targets

	function setupFrameBuffer ( framebuffer, renderTarget, textureTarget ) {

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, renderTarget.__webglTexture, 0 );

	}

	function setupRenderBuffer ( renderbuffer, renderTarget  ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		/* For some reason this is not working. Defaulting to RGBA4.
		} else if ( ! renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.STENCIL_INDEX8, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );
		*/
		} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

		}

	}

	this.setRenderTarget = function ( renderTarget ) {

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );

		if ( renderTarget && renderTarget.__webglFramebuffer === undefined ) {

			if ( renderTarget.depthBuffer === undefined ) renderTarget.depthBuffer = true;
			if ( renderTarget.stencilBuffer === undefined ) renderTarget.stencilBuffer = true;

			renderTarget.addEventListener( 'dispose', onRenderTargetDispose );

			renderTarget.__webglTexture = _gl.createTexture();

			_this.info.memory.textures ++;

			// Setup texture, create render and frame buffers

			var isTargetPowerOfTwo = THREE.Math.isPowerOfTwo( renderTarget.width ) && THREE.Math.isPowerOfTwo( renderTarget.height ),
				glFormat = paramThreeToGL( renderTarget.format ),
				glType = paramThreeToGL( renderTarget.type );

			if ( isCube ) {

				renderTarget.__webglFramebuffer = [];
				renderTarget.__webglRenderbuffer = [];

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget, isTargetPowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					renderTarget.__webglFramebuffer[ i ] = _gl.createFramebuffer();
					renderTarget.__webglRenderbuffer[ i ] = _gl.createRenderbuffer();

					_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

					setupFrameBuffer( renderTarget.__webglFramebuffer[ i ], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );
					setupRenderBuffer( renderTarget.__webglRenderbuffer[ i ], renderTarget );

				}

				if ( isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

			} else {

				renderTarget.__webglFramebuffer = _gl.createFramebuffer();

				if ( renderTarget.shareDepthFrom ) {

					renderTarget.__webglRenderbuffer = renderTarget.shareDepthFrom.__webglRenderbuffer;

				} else {

					renderTarget.__webglRenderbuffer = _gl.createRenderbuffer();

				}

				_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_2D, renderTarget, isTargetPowerOfTwo );

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

				setupFrameBuffer( renderTarget.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D );

				if ( renderTarget.shareDepthFrom ) {

					if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

						_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer );

					} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

						_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer );

					}

				} else {

					setupRenderBuffer( renderTarget.__webglRenderbuffer, renderTarget );

				}

				if ( isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

			}

			// Release everything

			if ( isCube ) {

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

			} else {

				_gl.bindTexture( _gl.TEXTURE_2D, null );

			}

			_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );
			_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

		}

		var framebuffer, width, height, vx, vy;

		if ( renderTarget ) {

			if ( isCube ) {

				framebuffer = renderTarget.__webglFramebuffer[ renderTarget.activeCubeFace ];

			} else {

				framebuffer = renderTarget.__webglFramebuffer;

			}

			width = renderTarget.width;
			height = renderTarget.height;

			vx = 0;
			vy = 0;

		} else {

			framebuffer = null;

			width = _viewportWidth;
			height = _viewportHeight;

			vx = _viewportX;
			vy = _viewportY;

		}

		if ( framebuffer !== _currentFramebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_gl.viewport( vx, vy, width, height );

			_currentFramebuffer = framebuffer;

		}

		_currentWidth = width;
		_currentHeight = height;

	};

	function updateRenderTargetMipmap ( renderTarget ) {

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );
			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_2D );
			_gl.bindTexture( _gl.TEXTURE_2D, null );

		}

	}

	// Fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		if ( f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter ) {

			return _gl.NEAREST;

		}

		return _gl.LINEAR;

	}

	// Map three.js constants to WebGL constants

	function paramThreeToGL ( p ) {

		var extension;

		if ( p === THREE.RepeatWrapping ) return _gl.REPEAT;
		if ( p === THREE.ClampToEdgeWrapping ) return _gl.CLAMP_TO_EDGE;
		if ( p === THREE.MirroredRepeatWrapping ) return _gl.MIRRORED_REPEAT;

		if ( p === THREE.NearestFilter ) return _gl.NEAREST;
		if ( p === THREE.NearestMipMapNearestFilter ) return _gl.NEAREST_MIPMAP_NEAREST;
		if ( p === THREE.NearestMipMapLinearFilter ) return _gl.NEAREST_MIPMAP_LINEAR;

		if ( p === THREE.LinearFilter ) return _gl.LINEAR;
		if ( p === THREE.LinearMipMapNearestFilter ) return _gl.LINEAR_MIPMAP_NEAREST;
		if ( p === THREE.LinearMipMapLinearFilter ) return _gl.LINEAR_MIPMAP_LINEAR;

		if ( p === THREE.UnsignedByteType ) return _gl.UNSIGNED_BYTE;
		if ( p === THREE.UnsignedShort4444Type ) return _gl.UNSIGNED_SHORT_4_4_4_4;
		if ( p === THREE.UnsignedShort5551Type ) return _gl.UNSIGNED_SHORT_5_5_5_1;
		if ( p === THREE.UnsignedShort565Type ) return _gl.UNSIGNED_SHORT_5_6_5;

		if ( p === THREE.ByteType ) return _gl.BYTE;
		if ( p === THREE.ShortType ) return _gl.SHORT;
		if ( p === THREE.UnsignedShortType ) return _gl.UNSIGNED_SHORT;
		if ( p === THREE.IntType ) return _gl.INT;
		if ( p === THREE.UnsignedIntType ) return _gl.UNSIGNED_INT;
		if ( p === THREE.FloatType ) return _gl.FLOAT;

		if ( p === THREE.AlphaFormat ) return _gl.ALPHA;
		if ( p === THREE.RGBFormat ) return _gl.RGB;
		if ( p === THREE.RGBAFormat ) return _gl.RGBA;
		if ( p === THREE.LuminanceFormat ) return _gl.LUMINANCE;
		if ( p === THREE.LuminanceAlphaFormat ) return _gl.LUMINANCE_ALPHA;

		if ( p === THREE.AddEquation ) return _gl.FUNC_ADD;
		if ( p === THREE.SubtractEquation ) return _gl.FUNC_SUBTRACT;
		if ( p === THREE.ReverseSubtractEquation ) return _gl.FUNC_REVERSE_SUBTRACT;

		if ( p === THREE.ZeroFactor ) return _gl.ZERO;
		if ( p === THREE.OneFactor ) return _gl.ONE;
		if ( p === THREE.SrcColorFactor ) return _gl.SRC_COLOR;
		if ( p === THREE.OneMinusSrcColorFactor ) return _gl.ONE_MINUS_SRC_COLOR;
		if ( p === THREE.SrcAlphaFactor ) return _gl.SRC_ALPHA;
		if ( p === THREE.OneMinusSrcAlphaFactor ) return _gl.ONE_MINUS_SRC_ALPHA;
		if ( p === THREE.DstAlphaFactor ) return _gl.DST_ALPHA;
		if ( p === THREE.OneMinusDstAlphaFactor ) return _gl.ONE_MINUS_DST_ALPHA;

		if ( p === THREE.DstColorFactor ) return _gl.DST_COLOR;
		if ( p === THREE.OneMinusDstColorFactor ) return _gl.ONE_MINUS_DST_COLOR;
		if ( p === THREE.SrcAlphaSaturateFactor ) return _gl.SRC_ALPHA_SATURATE;

		extension = extensions.get( 'WEBGL_compressed_texture_s3tc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_S3TC_DXT1_Format ) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT1_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT3_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			if ( p === THREE.RGBA_S3TC_DXT5_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;

		}

		extension = extensions.get( 'WEBGL_compressed_texture_pvrtc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGB_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

		}

		extension = extensions.get( 'EXT_blend_minmax' );

		if ( extension !== null ) {

			if ( p === THREE.MinEquation ) return extension.MIN_EXT;
			if ( p === THREE.MaxEquation ) return extension.MAX_EXT;

		}

		return 0;

	}

	// Allocations

	function allocateBones ( object ) {

		if ( _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture ) {

			return 1024;

		} else {

			// default for when object is not specified
			// ( for example when prebuilding shader
			//   to be used with multiple objects )
			//
			//  - leave some extra space for other uniforms
			//  - limit here is ANGLE's 254 max uniform vectors
			//    (up to 54 should be safe)

			var nVertexUniforms = _gl.getParameter( _gl.MAX_VERTEX_UNIFORM_VECTORS );
			var nVertexMatrices = Math.floor( ( nVertexUniforms - 20 ) / 4 );

			var maxBones = nVertexMatrices;

			if ( object !== undefined && object instanceof THREE.SkinnedMesh ) {

				maxBones = Math.min( object.skeleton.bones.length, maxBones );

				if ( maxBones < object.skeleton.bones.length ) {

					console.warn( 'WebGLRenderer: too many bones - ' + object.skeleton.bones.length + ', this GPU supports just ' + maxBones + ' (try OpenGL instead of ANGLE)' );

				}

			}

			return maxBones;

		}

	}

	function allocateLights( lights ) {

		var dirLights = 0;
		var pointLights = 0;
		var spotLights = 0;
		var hemiLights = 0;

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];

			if ( light.onlyShadow || light.visible === false ) continue;

			if ( light instanceof THREE.DirectionalLight ) dirLights ++;
			if ( light instanceof THREE.PointLight ) pointLights ++;
			if ( light instanceof THREE.SpotLight ) spotLights ++;
			if ( light instanceof THREE.HemisphereLight ) hemiLights ++;

		}

		return { 'directional': dirLights, 'point': pointLights, 'spot': spotLights, 'hemi': hemiLights };

	}

	function allocateShadows( lights ) {

		var maxShadows = 0;

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];

			if ( ! light.castShadow ) continue;

			if ( light instanceof THREE.SpotLight ) maxShadows ++;
			if ( light instanceof THREE.DirectionalLight && ! light.shadowCascade ) maxShadows ++;

		}

		return maxShadows;

	}

	// DEPRECATED
	
	this.initMaterial = function () {

		console.warn( 'THREE.WebGLRenderer: .initMaterial() has been removed.' );

	};

	this.addPrePlugin = function () {

		console.warn( 'THREE.WebGLRenderer: .addPrePlugin() has been removed.' );

	};

	this.addPostPlugin = function () {

		console.warn( 'THREE.WebGLRenderer: .addPostPlugin() has been removed.' );

	};

	this.updateShadowMap = function () {

		console.warn( 'THREE.WebGLRenderer: .updateShadowMap() has been removed.' );

	};

};

// File:src/renderers/WebGLRenderTarget.js

/**
 * @author szimek / https://github.com/szimek/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.WebGLRenderTarget = function ( width, height, options ) {

	this.width = width;
	this.height = height;

	options = options || {};

	this.wrapS = options.wrapS !== undefined ? options.wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = options.wrapT !== undefined ? options.wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = options.magFilter !== undefined ? options.magFilter : THREE.LinearFilter;
	this.minFilter = options.minFilter !== undefined ? options.minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = options.anisotropy !== undefined ? options.anisotropy : 1;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.format = options.format !== undefined ? options.format : THREE.RGBAFormat;
	this.type = options.type !== undefined ? options.type : THREE.UnsignedByteType;

	this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
	this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;

	this.generateMipmaps = true;

	this.shareDepthFrom = null;

};

THREE.WebGLRenderTarget.prototype = {

	constructor: THREE.WebGLRenderTarget,

	setSize: function ( width, height ) {

		this.width = width;
		this.height = height;

	},

	clone: function () {

		var tmp = new THREE.WebGLRenderTarget( this.width, this.height );

		tmp.wrapS = this.wrapS;
		tmp.wrapT = this.wrapT;

		tmp.magFilter = this.magFilter;
		tmp.minFilter = this.minFilter;

		tmp.anisotropy = this.anisotropy;

		tmp.offset.copy( this.offset );
		tmp.repeat.copy( this.repeat );

		tmp.format = this.format;
		tmp.type = this.type;

		tmp.depthBuffer = this.depthBuffer;
		tmp.stencilBuffer = this.stencilBuffer;

		tmp.generateMipmaps = this.generateMipmaps;

		tmp.shareDepthFrom = this.shareDepthFrom;

		return tmp;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.WebGLRenderTarget.prototype );

// File:src/renderers/WebGLRenderTargetCube.js

/**
 * @author alteredq / http://alteredqualia.com
 */

THREE.WebGLRenderTargetCube = function ( width, height, options ) {

	THREE.WebGLRenderTarget.call( this, width, height, options );

	this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5

};

THREE.WebGLRenderTargetCube.prototype = Object.create( THREE.WebGLRenderTarget.prototype );

// File:src/renderers/webgl/WebGLExtensions.js

THREE.WebGLExtensions = function ( gl ) {

	var extensions = {};

	this.get = function ( name ) {

		if ( extensions[ name ] !== undefined ) {

			return extensions[ name ];

		}

		var extension;

		switch ( name ) {
		
			case 'OES_texture_float':
				extension = gl.getExtension( 'OES_texture_float' );
				break;

			case 'OES_texture_float_linear':
				extension = gl.getExtension( 'OES_texture_float_linear' );
				break;

			case 'OES_standard_derivatives':
				extension = gl.getExtension( 'OES_standard_derivatives' );
				break;

			case 'EXT_texture_filter_anisotropic':
				extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
				break;

			case 'WEBGL_compressed_texture_s3tc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
				break;

			case 'WEBGL_compressed_texture_pvrtc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
				break;

			case 'OES_element_index_uint':
				extension = gl.getExtension( 'OES_element_index_uint' );
				break;

			case 'EXT_blend_minmax':
				extension = gl.getExtension( 'EXT_blend_minmax' );
				break;

			case 'EXT_frag_depth':
				extension = gl.getExtension( 'EXT_frag_depth' );
				break;

		}

		if ( extension === null ) {

			console.log( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

		}

		extensions[ name ] = extension;

		return extension;

	};

};

// File:src/renderers/webgl/WebGLProgram.js

THREE.WebGLProgram = ( function () {

	var programIdCount = 0;

	var generateDefines = function ( defines ) {

		var value, chunk, chunks = [];

		for ( var d in defines ) {

			value = defines[ d ];
			if ( value === false ) continue;

			chunk = "#define " + d + " " + value;
			chunks.push( chunk );

		}

		return chunks.join( "\n" );

	};

	var cacheUniformLocations = function ( gl, program, identifiers ) {

		var uniforms = {};

		for ( var i = 0, l = identifiers.length; i < l; i ++ ) {

			var id = identifiers[ i ];
			uniforms[ id ] = gl.getUniformLocation( program, id );

		}

		return uniforms;

	};

	var cacheAttributeLocations = function ( gl, program, identifiers ) {

		var attributes = {};

		for ( var i = 0, l = identifiers.length; i < l; i ++ ) {

			var id = identifiers[ i ];
			attributes[ id ] = gl.getAttribLocation( program, id );

		}

		return attributes;

	};

	return function ( renderer, code, material, parameters ) {

		var _this = renderer;
		var _gl = _this.context;

		var defines = material.defines;
		var uniforms = material.__webglShader.uniforms;
		var attributes = material.attributes;

		var vertexShader = material.__webglShader.vertexShader;
		var fragmentShader = material.__webglShader.fragmentShader;

		var index0AttributeName = material.index0AttributeName;

		if ( index0AttributeName === undefined && parameters.morphTargets === true ) {

			// programs with morphTargets displace position out of attribute 0

			index0AttributeName = 'position';

		}

		var shadowMapTypeDefine = "SHADOWMAP_TYPE_BASIC";

		if ( parameters.shadowMapType === THREE.PCFShadowMap ) {

			shadowMapTypeDefine = "SHADOWMAP_TYPE_PCF";

		} else if ( parameters.shadowMapType === THREE.PCFSoftShadowMap ) {

			shadowMapTypeDefine = "SHADOWMAP_TYPE_PCF_SOFT";

		}

		// console.log( "building new program " );

		//

		var customDefines = generateDefines( defines );

		//

		var program = _gl.createProgram();

		var prefix_vertex, prefix_fragment;

		if ( material instanceof THREE.RawShaderMaterial ) {

			prefix_vertex = '';
			prefix_fragment = '';

		} else {

			prefix_vertex = [

				"precision " + parameters.precision + " float;",
				"precision " + parameters.precision + " int;",

				customDefines,

				parameters.supportsVertexTextures ? "#define VERTEX_TEXTURES" : "",

				_this.gammaInput ? "#define GAMMA_INPUT" : "",
				_this.gammaOutput ? "#define GAMMA_OUTPUT" : "",

				"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
				"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,
				"#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights,
				"#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights,

				"#define MAX_SHADOWS " + parameters.maxShadows,

				"#define MAX_BONES " + parameters.maxBones,

				parameters.map ? "#define USE_MAP" : "",
				parameters.envMap ? "#define USE_ENVMAP" : "",
				parameters.lightMap ? "#define USE_LIGHTMAP" : "",
				parameters.bumpMap ? "#define USE_BUMPMAP" : "",
				parameters.normalMap ? "#define USE_NORMALMAP" : "",
				parameters.specularMap ? "#define USE_SPECULARMAP" : "",
				parameters.alphaMap ? "#define USE_ALPHAMAP" : "",
				parameters.vertexColors ? "#define USE_COLOR" : "",

				parameters.skinning ? "#define USE_SKINNING" : "",
				parameters.useVertexTexture ? "#define BONE_TEXTURE" : "",

				parameters.morphTargets ? "#define USE_MORPHTARGETS" : "",
				parameters.morphNormals ? "#define USE_MORPHNORMALS" : "",
				parameters.wrapAround ? "#define WRAP_AROUND" : "",
				parameters.doubleSided ? "#define DOUBLE_SIDED" : "",
				parameters.flipSided ? "#define FLIP_SIDED" : "",

				parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
				parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "",
				parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "",
				parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "",

				parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",

				parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
				//_this._glExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "",


				"uniform mat4 modelMatrix;",
				"uniform mat4 modelViewMatrix;",
				"uniform mat4 projectionMatrix;",
				"uniform mat4 viewMatrix;",
				"uniform mat3 normalMatrix;",
				"uniform vec3 cameraPosition;",

				"attribute vec3 position;",
				"attribute vec3 normal;",
				"attribute vec2 uv;",
				"attribute vec2 uv2;",

				"#ifdef USE_COLOR",

				"	attribute vec3 color;",

				"#endif",

				"#ifdef USE_MORPHTARGETS",

				"	attribute vec3 morphTarget0;",
				"	attribute vec3 morphTarget1;",
				"	attribute vec3 morphTarget2;",
				"	attribute vec3 morphTarget3;",

				"	#ifdef USE_MORPHNORMALS",

				"		attribute vec3 morphNormal0;",
				"		attribute vec3 morphNormal1;",
				"		attribute vec3 morphNormal2;",
				"		attribute vec3 morphNormal3;",

				"	#else",

				"		attribute vec3 morphTarget4;",
				"		attribute vec3 morphTarget5;",
				"		attribute vec3 morphTarget6;",
				"		attribute vec3 morphTarget7;",

				"	#endif",

				"#endif",

				"#ifdef USE_SKINNING",

				"	attribute vec4 skinIndex;",
				"	attribute vec4 skinWeight;",

				"#endif",

				""

			].join( '\n' );

			prefix_fragment = [

				"precision " + parameters.precision + " float;",
				"precision " + parameters.precision + " int;",

				( parameters.bumpMap || parameters.normalMap ) ? "#extension GL_OES_standard_derivatives : enable" : "",

				customDefines,

				"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
				"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,
				"#define MAX_SPOT_LIGHTS " + parameters.maxSpotLights,
				"#define MAX_HEMI_LIGHTS " + parameters.maxHemiLights,

				"#define MAX_SHADOWS " + parameters.maxShadows,

				parameters.alphaTest ? "#define ALPHATEST " + parameters.alphaTest: "",

				_this.gammaInput ? "#define GAMMA_INPUT" : "",
				_this.gammaOutput ? "#define GAMMA_OUTPUT" : "",

				( parameters.useFog && parameters.fog ) ? "#define USE_FOG" : "",
				( parameters.useFog && parameters.fogExp ) ? "#define FOG_EXP2" : "",

				parameters.map ? "#define USE_MAP" : "",
				parameters.envMap ? "#define USE_ENVMAP" : "",
				parameters.lightMap ? "#define USE_LIGHTMAP" : "",
				parameters.bumpMap ? "#define USE_BUMPMAP" : "",
				parameters.normalMap ? "#define USE_NORMALMAP" : "",
				parameters.specularMap ? "#define USE_SPECULARMAP" : "",
				parameters.alphaMap ? "#define USE_ALPHAMAP" : "",
				parameters.vertexColors ? "#define USE_COLOR" : "",

				parameters.metal ? "#define METAL" : "",
				parameters.wrapAround ? "#define WRAP_AROUND" : "",
				parameters.doubleSided ? "#define DOUBLE_SIDED" : "",
				parameters.flipSided ? "#define FLIP_SIDED" : "",

				parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
				parameters.shadowMapEnabled ? "#define " + shadowMapTypeDefine : "",
				parameters.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "",
				parameters.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "",

				parameters.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
				//_this._glExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "",

				"uniform mat4 viewMatrix;",
				"uniform vec3 cameraPosition;",
				""

			].join( '\n' );

		}

		var glVertexShader = new THREE.WebGLShader( _gl, _gl.VERTEX_SHADER, prefix_vertex + vertexShader );
		var glFragmentShader = new THREE.WebGLShader( _gl, _gl.FRAGMENT_SHADER, prefix_fragment + fragmentShader );

		_gl.attachShader( program, glVertexShader );
		_gl.attachShader( program, glFragmentShader );

		if ( index0AttributeName !== undefined ) {

			// Force a particular attribute to index 0.
			// because potentially expensive emulation is done by browser if attribute 0 is disabled.
			// And, color, for example is often automatically bound to index 0 so disabling it

			_gl.bindAttribLocation( program, 0, index0AttributeName );

		}

		_gl.linkProgram( program );

		if ( _gl.getProgramParameter( program, _gl.LINK_STATUS ) === false ) {

			console.error( 'THREE.WebGLProgram: Could not initialise shader.' );
			console.error( 'gl.VALIDATE_STATUS', _gl.getProgramParameter( program, _gl.VALIDATE_STATUS ) );
			console.error( 'gl.getError()', _gl.getError() );

		}

		if ( _gl.getProgramInfoLog( program ) !== '' ) {

			console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', _gl.getProgramInfoLog( program ) );

		}

		// clean up

		_gl.deleteShader( glVertexShader );
		_gl.deleteShader( glFragmentShader );

		// cache uniform locations

		var identifiers = [

			'viewMatrix', 'modelViewMatrix', 'projectionMatrix', 'normalMatrix', 'modelMatrix', 'cameraPosition', 'morphTargetInfluences', 'bindMatrix', 'bindMatrixInverse'

		];

		if ( parameters.useVertexTexture ) {

			identifiers.push( 'boneTexture' );
			identifiers.push( 'boneTextureWidth' );
			identifiers.push( 'boneTextureHeight' );

		} else {

			identifiers.push( 'boneGlobalMatrices' );

		}

		if ( parameters.logarithmicDepthBuffer ) {

			identifiers.push('logDepthBufFC');

		}


		for ( var u in uniforms ) {

			identifiers.push( u );

		}

		this.uniforms = cacheUniformLocations( _gl, program, identifiers );

		// cache attributes locations

		identifiers = [

			"position", "normal", "uv", "uv2", "tangent", "color",
			"skinIndex", "skinWeight", "lineDistance"

		];

		for ( var i = 0; i < parameters.maxMorphTargets; i ++ ) {

			identifiers.push( "morphTarget" + i );

		}

		for ( var i = 0; i < parameters.maxMorphNormals; i ++ ) {

			identifiers.push( "morphNormal" + i );

		}

		for ( var a in attributes ) {

			identifiers.push( a );

		}

		this.attributes = cacheAttributeLocations( _gl, program, identifiers );
		this.attributesKeys = Object.keys( this.attributes );

		//

		this.id = programIdCount ++;
		this.code = code;
		this.usedTimes = 1;
		this.program = program;
		this.vertexShader = glVertexShader;
		this.fragmentShader = glFragmentShader;

		return this;

	};

} )();

// File:src/renderers/webgl/WebGLShader.js

THREE.WebGLShader = ( function () {

	var addLineNumbers = function ( string ) {

		var lines = string.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

		}

		return lines.join( '\n' );

	};

	return function ( gl, type, string ) {

		var shader = gl.createShader( type ); 

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

			console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );

		}

		if ( gl.getShaderInfoLog( shader ) !== '' ) {

			console.warn( 'THREE.WebGLShader: gl.getShaderInfoLog()', gl.getShaderInfoLog( shader ) );
			console.warn( addLineNumbers( string ) );

		}

		// --enable-privileged-webgl-extension
		// console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

		return shader;

	};

} )();

// File:src/renderers/webgl/plugins/LensFlarePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlarePlugin = function ( renderer, flares ) {

	var gl = renderer.context;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;
	var hasVertexTexture;

	var tempTexture, occlusionTexture;

	var init = function () {

		var vertices = new Float32Array( [
			-1, -1,  0, 0,
			 1, -1,  1, 0,
			 1,  1,  1, 1,
			-1,  1,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		// buffers

		vertexBuffer     = gl.createBuffer();
		elementBuffer    = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		// textures

		tempTexture      = gl.createTexture();
		occlusionTexture = gl.createTexture();

		gl.bindTexture( gl.TEXTURE_2D, tempTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		gl.bindTexture( gl.TEXTURE_2D, occlusionTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		hasVertexTexture = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) > 0;

		var shader;

		if ( hasVertexTexture ) {

			shader = {

				vertexShader: [

					"uniform lowp int renderType;",

					"uniform vec3 screenPosition;",
					"uniform vec2 scale;",
					"uniform float rotation;",

					"uniform sampler2D occlusionMap;",

					"attribute vec2 position;",
					"attribute vec2 uv;",

					"varying vec2 vUV;",
					"varying float vVisibility;",

					"void main() {",

						"vUV = uv;",

						"vec2 pos = position;",

						"if( renderType == 2 ) {",

							"vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );",

							"vVisibility =        visibility.r / 9.0;",
							"vVisibility *= 1.0 - visibility.g / 9.0;",
							"vVisibility *=       visibility.b / 9.0;",
							"vVisibility *= 1.0 - visibility.a / 9.0;",

							"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
							"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

						"}",

						"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

					"}"

				].join( "\n" ),

				fragmentShader: [

					"uniform lowp int renderType;",

					"uniform sampler2D map;",
					"uniform float opacity;",
					"uniform vec3 color;",

					"varying vec2 vUV;",
					"varying float vVisibility;",

					"void main() {",

						// pink square

						"if( renderType == 0 ) {",

							"gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );",

						// restore

						"} else if( renderType == 1 ) {",

							"gl_FragColor = texture2D( map, vUV );",

						// flare

						"} else {",

							"vec4 texture = texture2D( map, vUV );",
							"texture.a *= opacity * vVisibility;",
							"gl_FragColor = texture;",
							"gl_FragColor.rgb *= color;",

						"}",

					"}"

				].join( "\n" )

			};

		} else {

			shader = {

				vertexShader: [

					"uniform lowp int renderType;",

					"uniform vec3 screenPosition;",
					"uniform vec2 scale;",
					"uniform float rotation;",

					"attribute vec2 position;",
					"attribute vec2 uv;",

					"varying vec2 vUV;",

					"void main() {",

						"vUV = uv;",

						"vec2 pos = position;",

						"if( renderType == 2 ) {",

							"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
							"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

						"}",

						"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

					"}"

				].join( "\n" ),

				fragmentShader: [

					"precision mediump float;",

					"uniform lowp int renderType;",

					"uniform sampler2D map;",
					"uniform sampler2D occlusionMap;",
					"uniform float opacity;",
					"uniform vec3 color;",

					"varying vec2 vUV;",

					"void main() {",

						// pink square

						"if( renderType == 0 ) {",

							"gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );",

						// restore

						"} else if( renderType == 1 ) {",

							"gl_FragColor = texture2D( map, vUV );",

						// flare

						"} else {",

							"float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;",
							"visibility = ( 1.0 - visibility / 4.0 );",

							"vec4 texture = texture2D( map, vUV );",
							"texture.a *= opacity * visibility;",
							"gl_FragColor = texture;",
							"gl_FragColor.rgb *= color;",

						"}",

					"}"

				].join( "\n" )

			};

		}

		program = createProgram( shader );

		attributes = {
			vertex: gl.getAttribLocation ( program, "position" ),
			uv:     gl.getAttribLocation ( program, "uv" )
		}

		uniforms = {
			renderType:     gl.getUniformLocation( program, "renderType" ),
			map:            gl.getUniformLocation( program, "map" ),
			occlusionMap:   gl.getUniformLocation( program, "occlusionMap" ),
			opacity:        gl.getUniformLocation( program, "opacity" ),
			color:          gl.getUniformLocation( program, "color" ),
			scale:          gl.getUniformLocation( program, "scale" ),
			rotation:       gl.getUniformLocation( program, "rotation" ),
			screenPosition: gl.getUniformLocation( program, "screenPosition" )
		};

	};

	/*
	 * Render lens flares
	 * Method: renders 16x16 0xff00ff-colored points scattered over the light source area,
	 *         reads these back and calculates occlusion.
	 */

	this.render = function ( scene, camera, viewportWidth, viewportHeight ) {

		if ( flares.length === 0 ) return;

		var tempPosition = new THREE.Vector3();

		var invAspect = viewportHeight / viewportWidth,
			halfViewportWidth = viewportWidth * 0.5,
			halfViewportHeight = viewportHeight * 0.5;

		var size = 16 / viewportHeight,
			scale = new THREE.Vector2( size * invAspect, size );

		var screenPosition = new THREE.Vector3( 1, 1, 0 ),
			screenPositionPixels = new THREE.Vector2( 1, 1 );

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		gl.enableVertexAttribArray( attributes.vertex );
		gl.enableVertexAttribArray( attributes.uv );

		// loop through all lens flares to update their occlusion and positions
		// setup gl and common used attribs/unforms

		gl.uniform1i( uniforms.occlusionMap, 0 );
		gl.uniform1i( uniforms.map, 1 );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.vertex, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.disable( gl.CULL_FACE );
		gl.depthMask( false );

		for ( var i = 0, l = flares.length; i < l; i ++ ) {

			size = 16 / viewportHeight;
			scale.set( size * invAspect, size );

			// calc object screen position

			var flare = flares[ i ];
			
			tempPosition.set( flare.matrixWorld.elements[12], flare.matrixWorld.elements[13], flare.matrixWorld.elements[14] );

			tempPosition.applyMatrix4( camera.matrixWorldInverse );
			tempPosition.applyProjection( camera.projectionMatrix );

			// setup arrays for gl programs

			screenPosition.copy( tempPosition )

			screenPositionPixels.x = screenPosition.x * halfViewportWidth + halfViewportWidth;
			screenPositionPixels.y = screenPosition.y * halfViewportHeight + halfViewportHeight;

			// screen cull

			if ( hasVertexTexture || (
				screenPositionPixels.x > 0 &&
				screenPositionPixels.x < viewportWidth &&
				screenPositionPixels.y > 0 &&
				screenPositionPixels.y < viewportHeight ) ) {

				// save current RGB to temp texture

				gl.activeTexture( gl.TEXTURE1 );
				gl.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGB, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0 );


				// render pink quad

				gl.uniform1i( uniforms.renderType, 0 );
				gl.uniform2f( uniforms.scale, scale.x, scale.y );
				gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );

				gl.disable( gl.BLEND );
				gl.enable( gl.DEPTH_TEST );

				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// copy result to occlusionMap

				gl.activeTexture( gl.TEXTURE0 );
				gl.bindTexture( gl.TEXTURE_2D, occlusionTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGBA, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0 );


				// restore graphics

				gl.uniform1i( uniforms.renderType, 1 );
				gl.disable( gl.DEPTH_TEST );

				gl.activeTexture( gl.TEXTURE1 );
				gl.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// update object positions

				flare.positionScreen.copy( screenPosition )

				if ( flare.customUpdateCallback ) {

					flare.customUpdateCallback( flare );

				} else {

					flare.updateLensFlares();

				}

				// render flares

				gl.uniform1i( uniforms.renderType, 2 );
				gl.enable( gl.BLEND );

				for ( var j = 0, jl = flare.lensFlares.length; j < jl; j ++ ) {

					var sprite = flare.lensFlares[ j ];

					if ( sprite.opacity > 0.001 && sprite.scale > 0.001 ) {

						screenPosition.x = sprite.x;
						screenPosition.y = sprite.y;
						screenPosition.z = sprite.z;

						size = sprite.size * sprite.scale / viewportHeight;

						scale.x = size * invAspect;
						scale.y = size;

						gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );
						gl.uniform2f( uniforms.scale, scale.x, scale.y );
						gl.uniform1f( uniforms.rotation, sprite.rotation );

						gl.uniform1f( uniforms.opacity, sprite.opacity );
						gl.uniform3f( uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b );

						renderer.setBlending( sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst );
						renderer.setTexture( sprite.texture, 1 );

						gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

					}

				}

			}

		}

		// restore gl

		gl.enable( gl.CULL_FACE );
		gl.enable( gl.DEPTH_TEST );
		gl.depthMask( true );

		renderer.resetGLState();

	};

	function createProgram ( shader ) {

		var program = gl.createProgram();

		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
		var vertexShader = gl.createShader( gl.VERTEX_SHADER );

		var prefix = "precision " + renderer.getPrecision() + " float;\n";

		gl.shaderSource( fragmentShader, prefix + shader.fragmentShader );
		gl.shaderSource( vertexShader, prefix + shader.vertexShader );

		gl.compileShader( fragmentShader );
		gl.compileShader( vertexShader );

		gl.attachShader( program, fragmentShader );
		gl.attachShader( program, vertexShader );

		gl.linkProgram( program );

		return program;

	}

};

// File:src/renderers/webgl/plugins/ShadowMapPlugin.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShadowMapPlugin = function ( _renderer, _lights, _webglObjects, _webglObjectsImmediate ) {

	var _gl = _renderer.context;

	var _depthMaterial, _depthMaterialMorph, _depthMaterialSkin, _depthMaterialMorphSkin,

	_frustum = new THREE.Frustum(),
	_projScreenMatrix = new THREE.Matrix4(),

	_min = new THREE.Vector3(),
	_max = new THREE.Vector3(),

	_matrixPosition = new THREE.Vector3(),
	
	_renderList = [];

	// init

	var depthShader = THREE.ShaderLib[ "depthRGBA" ];
	var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

	_depthMaterial = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader
	 } );

	_depthMaterialMorph = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true
	} );

	_depthMaterialSkin = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		skinning: true
	} );

	_depthMaterialMorphSkin = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true,
		skinning: true
	} );

	_depthMaterial._shadowPass = true;
	_depthMaterialMorph._shadowPass = true;
	_depthMaterialSkin._shadowPass = true;
	_depthMaterialMorphSkin._shadowPass = true;

	this.render = function ( scene, camera ) {

		if ( _renderer.shadowMapEnabled === false ) return;

		var i, il, j, jl, n,

		shadowMap, shadowMatrix, shadowCamera,
		program, buffer, material,
		webglObject, object, light,

		lights = [],
		k = 0,

		fog = null;

		// set GL state for depth map

		_gl.clearColor( 1, 1, 1, 1 );
		_gl.disable( _gl.BLEND );

		_gl.enable( _gl.CULL_FACE );
		_gl.frontFace( _gl.CCW );

		if ( _renderer.shadowMapCullFace === THREE.CullFaceFront ) {

			_gl.cullFace( _gl.FRONT );

		} else {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.setDepthTest( true );

		// preprocess lights
		// 	- skip lights that are not casting shadows
		//	- create virtual lights for cascaded shadow maps

		for ( i = 0, il = _lights.length; i < il; i ++ ) {

			light = _lights[ i ];

			if ( ! light.castShadow ) continue;

			if ( ( light instanceof THREE.DirectionalLight ) && light.shadowCascade ) {

				for ( n = 0; n < light.shadowCascadeCount; n ++ ) {

					var virtualLight;

					if ( ! light.shadowCascadeArray[ n ] ) {

						virtualLight = createVirtualLight( light, n );
						virtualLight.originalCamera = camera;

						var gyro = new THREE.Gyroscope();
						gyro.position.copy( light.shadowCascadeOffset );

						gyro.add( virtualLight );
						gyro.add( virtualLight.target );

						camera.add( gyro );

						light.shadowCascadeArray[ n ] = virtualLight;

						console.log( "Created virtualLight", virtualLight );

					} else {

						virtualLight = light.shadowCascadeArray[ n ];

					}

					updateVirtualLight( light, n );

					lights[ k ] = virtualLight;
					k ++;

				}

			} else {

				lights[ k ] = light;
				k ++;

			}

		}

		// render depth map

		for ( i = 0, il = lights.length; i < il; i ++ ) {

			light = lights[ i ];

			if ( ! light.shadowMap ) {

				var shadowFilter = THREE.LinearFilter;

				if ( _renderer.shadowMapType === THREE.PCFSoftShadowMap ) {

					shadowFilter = THREE.NearestFilter;

				}

				var pars = { minFilter: shadowFilter, magFilter: shadowFilter, format: THREE.RGBAFormat };

				light.shadowMap = new THREE.WebGLRenderTarget( light.shadowMapWidth, light.shadowMapHeight, pars );
				light.shadowMapSize = new THREE.Vector2( light.shadowMapWidth, light.shadowMapHeight );

				light.shadowMatrix = new THREE.Matrix4();

			}

			if ( ! light.shadowCamera ) {

				if ( light instanceof THREE.SpotLight ) {

					light.shadowCamera = new THREE.PerspectiveCamera( light.shadowCameraFov, light.shadowMapWidth / light.shadowMapHeight, light.shadowCameraNear, light.shadowCameraFar );

				} else if ( light instanceof THREE.DirectionalLight ) {

					light.shadowCamera = new THREE.OrthographicCamera( light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar );

				} else {

					console.error( "Unsupported light type for shadow" );
					continue;

				}

				scene.add( light.shadowCamera );

				if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

			}

			if ( light.shadowCameraVisible && ! light.cameraHelper ) {

				light.cameraHelper = new THREE.CameraHelper( light.shadowCamera );
				scene.add( light.cameraHelper );

			}

			if ( light.isVirtual && virtualLight.originalCamera == camera ) {

				updateShadowCamera( camera, light );

			}

			shadowMap = light.shadowMap;
			shadowMatrix = light.shadowMatrix;
			shadowCamera = light.shadowCamera;

			//

			shadowCamera.position.setFromMatrixPosition( light.matrixWorld );
			_matrixPosition.setFromMatrixPosition( light.target.matrixWorld );
			shadowCamera.lookAt( _matrixPosition );
			shadowCamera.updateMatrixWorld();

			shadowCamera.matrixWorldInverse.getInverse( shadowCamera.matrixWorld );

			//

			if ( light.cameraHelper ) light.cameraHelper.visible = light.shadowCameraVisible;
			if ( light.shadowCameraVisible ) light.cameraHelper.update();

			// compute shadow matrix

			shadowMatrix.set(
				0.5, 0.0, 0.0, 0.5,
				0.0, 0.5, 0.0, 0.5,
				0.0, 0.0, 0.5, 0.5,
				0.0, 0.0, 0.0, 1.0
			);

			shadowMatrix.multiply( shadowCamera.projectionMatrix );
			shadowMatrix.multiply( shadowCamera.matrixWorldInverse );

			// update camera matrices and frustum

			_projScreenMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );
			_frustum.setFromMatrix( _projScreenMatrix );

			// render shadow map

			_renderer.setRenderTarget( shadowMap );
			_renderer.clear();

			// set object matrices & frustum culling

			_renderList.length = 0;

			projectObject( scene, scene, shadowCamera );


			// render regular objects

			var objectMaterial, useMorphing, useSkinning;

			for ( j = 0, jl = _renderList.length; j < jl; j ++ ) {

				webglObject = _renderList[ j ];

				object = webglObject.object;
				buffer = webglObject.buffer;

				// culling is overriden globally for all objects
				// while rendering depth map

				// need to deal with MeshFaceMaterial somehow
				// in that case just use the first of material.materials for now
				// (proper solution would require to break objects by materials
				//  similarly to regular rendering and then set corresponding
				//  depth materials per each chunk instead of just once per object)

				objectMaterial = getObjectMaterial( object );

				useMorphing = object.geometry.morphTargets !== undefined && object.geometry.morphTargets.length > 0 && objectMaterial.morphTargets;
				useSkinning = object instanceof THREE.SkinnedMesh && objectMaterial.skinning;

				if ( object.customDepthMaterial ) {

					material = object.customDepthMaterial;

				} else if ( useSkinning ) {

					material = useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin;

				} else if ( useMorphing ) {

					material = _depthMaterialMorph;

				} else {

					material = _depthMaterial;

				}

				_renderer.setMaterialFaces( objectMaterial );

				if ( buffer instanceof THREE.BufferGeometry ) {

					_renderer.renderBufferDirect( shadowCamera, _lights, fog, material, buffer, object );

				} else {

					_renderer.renderBuffer( shadowCamera, _lights, fog, material, buffer, object );

				}

			}

			// set matrices and render immediate objects

			for ( j = 0, jl = _webglObjectsImmediate.length; j < jl; j ++ ) {

				webglObject = _webglObjectsImmediate[ j ];
				object = webglObject.object;

				if ( object.visible && object.castShadow ) {

					object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );

					_renderer.renderImmediateObject( shadowCamera, _lights, fog, _depthMaterial, object );

				}

			}

		}

		// restore GL state

		var clearColor = _renderer.getClearColor(),
		clearAlpha = _renderer.getClearAlpha();

		_gl.clearColor( clearColor.r, clearColor.g, clearColor.b, clearAlpha );
		_gl.enable( _gl.BLEND );

		if ( _renderer.shadowMapCullFace === THREE.CullFaceFront ) {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.resetGLState();

	};

	function projectObject( scene, object, shadowCamera ){

		if ( object.visible ) {

			var webglObjects = _webglObjects[ object.id ];

			if ( webglObjects && object.castShadow && (object.frustumCulled === false || _frustum.intersectsObject( object ) === true) ) {

				for ( var i = 0, l = webglObjects.length; i < l; i ++ ) {

					var webglObject = webglObjects[ i ];

					object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );
					_renderList.push( webglObject );

				}

			}

			for ( var i = 0, l = object.children.length; i < l; i ++ ) {

				projectObject( scene, object.children[ i ], shadowCamera );

			}

		}

	}

	function createVirtualLight( light, cascade ) {

		var virtualLight = new THREE.DirectionalLight();

		virtualLight.isVirtual = true;

		virtualLight.onlyShadow = true;
		virtualLight.castShadow = true;

		virtualLight.shadowCameraNear = light.shadowCameraNear;
		virtualLight.shadowCameraFar = light.shadowCameraFar;

		virtualLight.shadowCameraLeft = light.shadowCameraLeft;
		virtualLight.shadowCameraRight = light.shadowCameraRight;
		virtualLight.shadowCameraBottom = light.shadowCameraBottom;
		virtualLight.shadowCameraTop = light.shadowCameraTop;

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;

		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];
		virtualLight.shadowMapWidth = light.shadowCascadeWidth[ cascade ];
		virtualLight.shadowMapHeight = light.shadowCascadeHeight[ cascade ];

		virtualLight.pointsWorld = [];
		virtualLight.pointsFrustum = [];

		var pointsWorld = virtualLight.pointsWorld,
			pointsFrustum = virtualLight.pointsFrustum;

		for ( var i = 0; i < 8; i ++ ) {

			pointsWorld[ i ] = new THREE.Vector3();
			pointsFrustum[ i ] = new THREE.Vector3();

		}

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		pointsFrustum[ 0 ].set( - 1, - 1, nearZ );
		pointsFrustum[ 1 ].set(  1, - 1, nearZ );
		pointsFrustum[ 2 ].set( - 1,  1, nearZ );
		pointsFrustum[ 3 ].set(  1,  1, nearZ );

		pointsFrustum[ 4 ].set( - 1, - 1, farZ );
		pointsFrustum[ 5 ].set(  1, - 1, farZ );
		pointsFrustum[ 6 ].set( - 1,  1, farZ );
		pointsFrustum[ 7 ].set(  1,  1, farZ );

		return virtualLight;

	}

	// Synchronize virtual light with the original light

	function updateVirtualLight( light, cascade ) {

		var virtualLight = light.shadowCascadeArray[ cascade ];

		virtualLight.position.copy( light.position );
		virtualLight.target.position.copy( light.target.position );
		virtualLight.lookAt( virtualLight.target );

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;
		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		var pointsFrustum = virtualLight.pointsFrustum;

		pointsFrustum[ 0 ].z = nearZ;
		pointsFrustum[ 1 ].z = nearZ;
		pointsFrustum[ 2 ].z = nearZ;
		pointsFrustum[ 3 ].z = nearZ;

		pointsFrustum[ 4 ].z = farZ;
		pointsFrustum[ 5 ].z = farZ;
		pointsFrustum[ 6 ].z = farZ;
		pointsFrustum[ 7 ].z = farZ;

	}

	// Fit shadow camera's ortho frustum to camera frustum

	function updateShadowCamera( camera, light ) {

		var shadowCamera = light.shadowCamera,
			pointsFrustum = light.pointsFrustum,
			pointsWorld = light.pointsWorld;

		_min.set( Infinity, Infinity, Infinity );
		_max.set( - Infinity, - Infinity, - Infinity );

		for ( var i = 0; i < 8; i ++ ) {

			var p = pointsWorld[ i ];

			p.copy( pointsFrustum[ i ] );
			p.unproject( camera );

			p.applyMatrix4( shadowCamera.matrixWorldInverse );

			if ( p.x < _min.x ) _min.x = p.x;
			if ( p.x > _max.x ) _max.x = p.x;

			if ( p.y < _min.y ) _min.y = p.y;
			if ( p.y > _max.y ) _max.y = p.y;

			if ( p.z < _min.z ) _min.z = p.z;
			if ( p.z > _max.z ) _max.z = p.z;

		}

		shadowCamera.left = _min.x;
		shadowCamera.right = _max.x;
		shadowCamera.top = _max.y;
		shadowCamera.bottom = _min.y;

		// can't really fit near/far
		//shadowCamera.near = _min.z;
		//shadowCamera.far = _max.z;

		shadowCamera.updateProjectionMatrix();

	}

	// For the moment just ignore objects that have multiple materials with different animation methods
	// Only the first material will be taken into account for deciding which depth material to use for shadow maps

	function getObjectMaterial( object ) {

		return object.material instanceof THREE.MeshFaceMaterial
			? object.material.materials[ 0 ]
			: object.material;

	};

};

// File:src/renderers/webgl/plugins/SpritePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpritePlugin = function ( renderer, sprites ) {

	var gl = renderer.context;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;

	var texture;
	
	var init = function () {

		var vertices = new Float32Array( [
			- 0.5, - 0.5,  0, 0,
			  0.5, - 0.5,  1, 0,
			  0.5,   0.5,  1, 1,
			- 0.5,   0.5,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		vertexBuffer  = gl.createBuffer();
		elementBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		program = createProgram();

		attributes = {
			position:			gl.getAttribLocation ( program, 'position' ),
			uv:					gl.getAttribLocation ( program, 'uv' )
		};

		uniforms = {
			uvOffset:			gl.getUniformLocation( program, 'uvOffset' ),
			uvScale:			gl.getUniformLocation( program, 'uvScale' ),

			rotation:			gl.getUniformLocation( program, 'rotation' ),
			scale:				gl.getUniformLocation( program, 'scale' ),

			color:				gl.getUniformLocation( program, 'color' ),
			map:				gl.getUniformLocation( program, 'map' ),
			opacity:			gl.getUniformLocation( program, 'opacity' ),

			modelViewMatrix: 	gl.getUniformLocation( program, 'modelViewMatrix' ),
			projectionMatrix:	gl.getUniformLocation( program, 'projectionMatrix' ),

			fogType:			gl.getUniformLocation( program, 'fogType' ),
			fogDensity:			gl.getUniformLocation( program, 'fogDensity' ),
			fogNear:			gl.getUniformLocation( program, 'fogNear' ),
			fogFar:				gl.getUniformLocation( program, 'fogFar' ),
			fogColor:			gl.getUniformLocation( program, 'fogColor' ),

			alphaTest:			gl.getUniformLocation( program, 'alphaTest' )
		};

		var canvas = document.createElement( 'canvas' );
		canvas.width = 8;
		canvas.height = 8;

		var context = canvas.getContext( '2d' );
		context.fillStyle = 'white';
		context.fillRect( 0, 0, 8, 8 );

		texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;

	};

	this.render = function ( scene, camera ) {

		if ( sprites.length === 0 ) return;

		// setup gl

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		gl.enableVertexAttribArray( attributes.position );
		gl.enableVertexAttribArray( attributes.uv );

		gl.disable( gl.CULL_FACE );
		gl.enable( gl.BLEND );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.position, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.uniformMatrix4fv( uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

		gl.activeTexture( gl.TEXTURE0 );
		gl.uniform1i( uniforms.map, 0 );

		var oldFogType = 0;
		var sceneFogType = 0;
		var fog = scene.fog;

		if ( fog ) {

			gl.uniform3f( uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b );

			if ( fog instanceof THREE.Fog ) {

				gl.uniform1f( uniforms.fogNear, fog.near );
				gl.uniform1f( uniforms.fogFar, fog.far );

				gl.uniform1i( uniforms.fogType, 1 );
				oldFogType = 1;
				sceneFogType = 1;

			} else if ( fog instanceof THREE.FogExp2 ) {

				gl.uniform1f( uniforms.fogDensity, fog.density );

				gl.uniform1i( uniforms.fogType, 2 );
				oldFogType = 2;
				sceneFogType = 2;

			}

		} else {

			gl.uniform1i( uniforms.fogType, 0 );
			oldFogType = 0;
			sceneFogType = 0;

		}


		// update positions and sort

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];

			sprite._modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, sprite.matrixWorld );

			if ( sprite.renderDepth === null ) {

				sprite.z = - sprite._modelViewMatrix.elements[ 14 ];

			} else {

				sprite.z = sprite.renderDepth;

			}

		}

		sprites.sort( painterSortStable );

		// render all sprites

		var scale = [];

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];
			var material = sprite.material;

			gl.uniform1f( uniforms.alphaTest, material.alphaTest );
			gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, sprite._modelViewMatrix.elements );

			scale[ 0 ] = sprite.scale.x;
			scale[ 1 ] = sprite.scale.y;

			var fogType = 0;

			if ( scene.fog && material.fog ) {

				fogType = sceneFogType;

			}

			if ( oldFogType !== fogType ) {

				gl.uniform1i( uniforms.fogType, fogType );
				oldFogType = fogType;

			}

			if ( material.map !== null ) {

				gl.uniform2f( uniforms.uvOffset, material.map.offset.x, material.map.offset.y );
				gl.uniform2f( uniforms.uvScale, material.map.repeat.x, material.map.repeat.y );

			} else {

				gl.uniform2f( uniforms.uvOffset, 0, 0 );
				gl.uniform2f( uniforms.uvScale, 1, 1 );

			}

			gl.uniform1f( uniforms.opacity, material.opacity );
			gl.uniform3f( uniforms.color, material.color.r, material.color.g, material.color.b );

			gl.uniform1f( uniforms.rotation, material.rotation );
			gl.uniform2fv( uniforms.scale, scale );

			renderer.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );
			renderer.setDepthTest( material.depthTest );
			renderer.setDepthWrite( material.depthWrite );

			if ( material.map && material.map.image && material.map.image.width ) {

				renderer.setTexture( material.map, 0 );

			} else {

				renderer.setTexture( texture, 0 );

			}

			gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

		}

		// restore gl

		gl.enable( gl.CULL_FACE );
		
		renderer.resetGLState();

	};

	function createProgram () {

		var program = gl.createProgram();

		var vertexShader = gl.createShader( gl.VERTEX_SHADER );
		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

		gl.shaderSource( vertexShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform mat4 modelViewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform float rotation;',
			'uniform vec2 scale;',
			'uniform vec2 uvOffset;',
			'uniform vec2 uvScale;',

			'attribute vec2 position;',
			'attribute vec2 uv;',

			'varying vec2 vUV;',

			'void main() {',

				'vUV = uvOffset + uv * uvScale;',

				'vec2 alignedPosition = position * scale;',

				'vec2 rotatedPosition;',
				'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
				'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

				'vec4 finalPosition;',

				'finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
				'finalPosition.xy += rotatedPosition;',
				'finalPosition = projectionMatrix * finalPosition;',

				'gl_Position = finalPosition;',

			'}'

		].join( '\n' ) );

		gl.shaderSource( fragmentShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform vec3 color;',
			'uniform sampler2D map;',
			'uniform float opacity;',

			'uniform int fogType;',
			'uniform vec3 fogColor;',
			'uniform float fogDensity;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'uniform float alphaTest;',

			'varying vec2 vUV;',

			'void main() {',

				'vec4 texture = texture2D( map, vUV );',

				'if ( texture.a < alphaTest ) discard;',

				'gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );',

				'if ( fogType > 0 ) {',

					'float depth = gl_FragCoord.z / gl_FragCoord.w;',
					'float fogFactor = 0.0;',

					'if ( fogType == 1 ) {',

						'fogFactor = smoothstep( fogNear, fogFar, depth );',

					'} else {',

						'const float LOG2 = 1.442695;',
						'float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );',
						'fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );',

					'}',

					'gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );',

				'}',

			'}'

		].join( '\n' ) );

		gl.compileShader( vertexShader );
		gl.compileShader( fragmentShader );

		gl.attachShader( program, vertexShader );
		gl.attachShader( program, fragmentShader );

		gl.linkProgram( program );

		return program;

	};

	function painterSortStable ( a, b ) {

		if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return b.id - a.id;

		}

	};

};

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BinaryLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.BinaryLoader.prototype = Object.create( THREE.Loader.prototype );

// Load models generated by slim OBJ converter with BINARY option (converter_obj_three_slim.py -t binary)
//  - binary models consist of two files: JS and BIN
//  - parameters
//		- url (required)
//		- callback (required)
//		- texturePath (optional: if not specified, textures will be assumed to be in the same folder as JS model file)
//		- binaryPath (optional: if not specified, binary file will be assumed to be in the same folder as JS model file)

THREE.BinaryLoader.prototype.load = function ( url, callback, texturePath, binaryPath, progressCB ) {

	// todo: unify load API to for easier SceneLoader use

	texturePath = texturePath || this.extractUrlBase( url );
	binaryPath = binaryPath || this.extractUrlBase( url );

	var callbackProgress = progressCB;

	this.onLoadStart();

	// #1 load JS part via web worker

	this.loadAjaxJSON( this, url, callback, texturePath, binaryPath, callbackProgress );

};

THREE.BinaryLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, binaryPath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	texturePath = texturePath && ( typeof texturePath === "string" ) ? texturePath : this.extractUrlBase( url );
	binaryPath = binaryPath && ( typeof binaryPath === "string" ) ? binaryPath : this.extractUrlBase( url );

	xhr.onreadystatechange = function () {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				var json = JSON.parse( xhr.responseText );
				context.loadAjaxBuffers( json, callback, binaryPath, texturePath, callbackProgress );

			} else {

				console.error( "THREE.BinaryLoader: Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.send( null );

};

THREE.BinaryLoader.prototype.loadAjaxBuffers = function ( json, callback, binaryPath, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest(),
		url = binaryPath + json.buffers;

	xhr.addEventListener( 'load', function ( event ) {

		var buffer = xhr.response;

		if ( buffer === undefined ) {

			// IEWEBGL needs this
			buffer = ( new Uint8Array( xhr.responseBody ) ).buffer;

		}

		if ( buffer.byteLength == 0 ) {  // iOS and other XMLHttpRequest level 1

			var buffer = new ArrayBuffer( xhr.responseText.length );

			var bufView = new Uint8Array( buffer );

			for ( var i = 0, l = xhr.responseText.length; i < l; i ++ ) {

				bufView[ i ] = xhr.responseText.charCodeAt( i ) & 0xff;

			}

		}

		THREE.BinaryLoader.prototype.createBinModel( buffer, callback, texturePath, json.materials );

	}, false );

	if ( callbackProgress !== undefined ) {

		xhr.addEventListener( 'progress', function ( event ) {

			if ( event.lengthComputable ) {

				callbackProgress( event );

			}

		}, false );

	}

	xhr.addEventListener( 'error', function ( event ) {

		console.error( "THREE.BinaryLoader: Couldn't load [" + url + "] [" + xhr.status + "]" );

	}, false );


	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";
	if ( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	xhr.send( null );

};

// Binary AJAX parser

THREE.BinaryLoader.prototype.createBinModel = function ( data, callback, texturePath, jsonMaterials ) {

	var Model = function ( texturePath ) {

		var scope = this,
			currentOffset = 0,
			md,
			normals = [],
			uvs = [],
			start_tri_flat, start_tri_smooth, start_tri_flat_uv, start_tri_smooth_uv,
			start_quad_flat, start_quad_smooth, start_quad_flat_uv, start_quad_smooth_uv,
			tri_size, quad_size,
			len_tri_flat, len_tri_smooth, len_tri_flat_uv, len_tri_smooth_uv,
			len_quad_flat, len_quad_smooth, len_quad_flat_uv, len_quad_smooth_uv;


		THREE.Geometry.call( this );

		md = parseMetaData( data, currentOffset );

		currentOffset += md.header_bytes;
/*
		md.vertex_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
		md.material_index_bytes = Uint16Array.BYTES_PER_ELEMENT;
		md.normal_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
		md.uv_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
*/
		// buffers sizes

		tri_size =  md.vertex_index_bytes * 3 + md.material_index_bytes;
		quad_size = md.vertex_index_bytes * 4 + md.material_index_bytes;

		len_tri_flat      = md.ntri_flat      * ( tri_size );
		len_tri_smooth    = md.ntri_smooth    * ( tri_size + md.normal_index_bytes * 3 );
		len_tri_flat_uv   = md.ntri_flat_uv   * ( tri_size + md.uv_index_bytes * 3 );
		len_tri_smooth_uv = md.ntri_smooth_uv * ( tri_size + md.normal_index_bytes * 3 + md.uv_index_bytes * 3 );

		len_quad_flat      = md.nquad_flat      * ( quad_size );
		len_quad_smooth    = md.nquad_smooth    * ( quad_size + md.normal_index_bytes * 4 );
		len_quad_flat_uv   = md.nquad_flat_uv   * ( quad_size + md.uv_index_bytes * 4 );
		len_quad_smooth_uv = md.nquad_smooth_uv * ( quad_size + md.normal_index_bytes * 4 + md.uv_index_bytes * 4 );

		// read buffers

		currentOffset += init_vertices( currentOffset );

		currentOffset += init_normals( currentOffset );
		currentOffset += handlePadding( md.nnormals * 3 );

		currentOffset += init_uvs( currentOffset );

		start_tri_flat 		= currentOffset;
		start_tri_smooth    = start_tri_flat    + len_tri_flat    + handlePadding( md.ntri_flat * 2 );
		start_tri_flat_uv   = start_tri_smooth  + len_tri_smooth  + handlePadding( md.ntri_smooth * 2 );
		start_tri_smooth_uv = start_tri_flat_uv + len_tri_flat_uv + handlePadding( md.ntri_flat_uv * 2 );

		start_quad_flat     = start_tri_smooth_uv + len_tri_smooth_uv  + handlePadding( md.ntri_smooth_uv * 2 );
		start_quad_smooth   = start_quad_flat     + len_quad_flat	   + handlePadding( md.nquad_flat * 2 );
		start_quad_flat_uv  = start_quad_smooth   + len_quad_smooth    + handlePadding( md.nquad_smooth * 2 );
		start_quad_smooth_uv= start_quad_flat_uv  + len_quad_flat_uv   + handlePadding( md.nquad_flat_uv * 2 );

		// have to first process faces with uvs
		// so that face and uv indices match

		init_triangles_flat_uv( start_tri_flat_uv );
		init_triangles_smooth_uv( start_tri_smooth_uv );

		init_quads_flat_uv( start_quad_flat_uv );
		init_quads_smooth_uv( start_quad_smooth_uv );

		// now we can process untextured faces

		init_triangles_flat( start_tri_flat );
		init_triangles_smooth( start_tri_smooth );

		init_quads_flat( start_quad_flat );
		init_quads_smooth( start_quad_smooth );

		this.computeCentroids();
		this.computeFaceNormals();

		function handlePadding( n ) {

			return ( n % 4 ) ? ( 4 - n % 4 ) : 0;

		};

		function parseMetaData( data, offset ) {

			var metaData = {

				'signature'               :parseString( data, offset,  12 ),
				'header_bytes'            :parseUChar8( data, offset + 12 ),

				'vertex_coordinate_bytes' :parseUChar8( data, offset + 13 ),
				'normal_coordinate_bytes' :parseUChar8( data, offset + 14 ),
				'uv_coordinate_bytes'     :parseUChar8( data, offset + 15 ),

				'vertex_index_bytes'      :parseUChar8( data, offset + 16 ),
				'normal_index_bytes'      :parseUChar8( data, offset + 17 ),
				'uv_index_bytes'          :parseUChar8( data, offset + 18 ),
				'material_index_bytes'    :parseUChar8( data, offset + 19 ),

				'nvertices'    :parseUInt32( data, offset + 20 ),
				'nnormals'     :parseUInt32( data, offset + 20 + 4*1 ),
				'nuvs'         :parseUInt32( data, offset + 20 + 4*2 ),

				'ntri_flat'      :parseUInt32( data, offset + 20 + 4*3 ),
				'ntri_smooth'    :parseUInt32( data, offset + 20 + 4*4 ),
				'ntri_flat_uv'   :parseUInt32( data, offset + 20 + 4*5 ),
				'ntri_smooth_uv' :parseUInt32( data, offset + 20 + 4*6 ),

				'nquad_flat'      :parseUInt32( data, offset + 20 + 4*7 ),
				'nquad_smooth'    :parseUInt32( data, offset + 20 + 4*8 ),
				'nquad_flat_uv'   :parseUInt32( data, offset + 20 + 4*9 ),
				'nquad_smooth_uv' :parseUInt32( data, offset + 20 + 4*10 )

			};
/*
			console.log( "signature: " + metaData.signature );

			console.log( "header_bytes: " + metaData.header_bytes );
			console.log( "vertex_coordinate_bytes: " + metaData.vertex_coordinate_bytes );
			console.log( "normal_coordinate_bytes: " + metaData.normal_coordinate_bytes );
			console.log( "uv_coordinate_bytes: " + metaData.uv_coordinate_bytes );

			console.log( "vertex_index_bytes: " + metaData.vertex_index_bytes );
			console.log( "normal_index_bytes: " + metaData.normal_index_bytes );
			console.log( "uv_index_bytes: " + metaData.uv_index_bytes );
			console.log( "material_index_bytes: " + metaData.material_index_bytes );

			console.log( "nvertices: " + metaData.nvertices );
			console.log( "nnormals: " + metaData.nnormals );
			console.log( "nuvs: " + metaData.nuvs );

			console.log( "ntri_flat: " + metaData.ntri_flat );
			console.log( "ntri_smooth: " + metaData.ntri_smooth );
			console.log( "ntri_flat_uv: " + metaData.ntri_flat_uv );
			console.log( "ntri_smooth_uv: " + metaData.ntri_smooth_uv );

			console.log( "nquad_flat: " + metaData.nquad_flat );
			console.log( "nquad_smooth: " + metaData.nquad_smooth );
			console.log( "nquad_flat_uv: " + metaData.nquad_flat_uv );
			console.log( "nquad_smooth_uv: " + metaData.nquad_smooth_uv );

			var total = metaData.header_bytes
					  + metaData.nvertices * metaData.vertex_coordinate_bytes * 3
					  + metaData.nnormals * metaData.normal_coordinate_bytes * 3
					  + metaData.nuvs * metaData.uv_coordinate_bytes * 2
					  + metaData.ntri_flat * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes )
					  + metaData.ntri_smooth * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 )
					  + metaData.ntri_flat_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.uv_index_bytes*3 )
					  + metaData.ntri_smooth_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 + metaData.uv_index_bytes*3 )
					  + metaData.nquad_flat * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes )
					  + metaData.nquad_smooth * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 )
					  + metaData.nquad_flat_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.uv_index_bytes*4 )
					  + metaData.nquad_smooth_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 + metaData.uv_index_bytes*4 );
			console.log( "total bytes: " + total );
*/

			return metaData;

		};

		function parseString( data, offset, length ) {

			var charArray = new Uint8Array( data, offset, length );

			var text = "";

			for ( var i = 0; i < length; i ++ ) {

				text += String.fromCharCode( charArray[ offset + i ] );

			}

			return text;

		};

		function parseUChar8( data, offset ) {

			var charArray = new Uint8Array( data, offset, 1 );

			return charArray[ 0 ];

		};

		function parseUInt32( data, offset ) {

			var intArray = new Uint32Array( data, offset, 1 );

			return intArray[ 0 ];

		};

		function init_vertices( start ) {

			var nElements = md.nvertices;

			var coordArray = new Float32Array( data, start, nElements * 3 );

			var i, x, y, z;

			for( i = 0; i < nElements; i ++ ) {

				x = coordArray[ i * 3 ];
				y = coordArray[ i * 3 + 1 ];
				z = coordArray[ i * 3 + 2 ];

				vertex( scope, x, y, z );

			}

			return nElements * 3 * Float32Array.BYTES_PER_ELEMENT;

		};

		function init_normals( start ) {

			var nElements = md.nnormals;

			if ( nElements ) {

				var normalArray = new Int8Array( data, start, nElements * 3 );

				var i, x, y, z;

				for( i = 0; i < nElements; i ++ ) {

					x = normalArray[ i * 3 ];
					y = normalArray[ i * 3 + 1 ];
					z = normalArray[ i * 3 + 2 ];

					normals.push( x/127, y/127, z/127 );

				}

			}

			return nElements * 3 * Int8Array.BYTES_PER_ELEMENT;

		};

		function init_uvs( start ) {

			var nElements = md.nuvs;

			if ( nElements ) {

				var uvArray = new Float32Array( data, start, nElements * 2 );

				var i, u, v;

				for( i = 0; i < nElements; i ++ ) {

					u = uvArray[ i * 2 ];
					v = uvArray[ i * 2 + 1 ];

					uvs.push( u, v );

				}

			}

			return nElements * 2 * Float32Array.BYTES_PER_ELEMENT;

		};

		function init_uvs3( nElements, offset ) {

			var i, uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

			var uvIndexBuffer = new Uint32Array( data, offset, 3 * nElements );

			for( i = 0; i < nElements; i ++ ) {

				uva = uvIndexBuffer[ i * 3 ];
				uvb = uvIndexBuffer[ i * 3 + 1 ];
				uvc = uvIndexBuffer[ i * 3 + 2 ];

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

			}

		};

		function init_uvs4( nElements, offset ) {

			var i, uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

			var uvIndexBuffer = new Uint32Array( data, offset, 4 * nElements );

			for( i = 0; i < nElements; i ++ ) {

				uva = uvIndexBuffer[ i * 4 ];
				uvb = uvIndexBuffer[ i * 4 + 1 ];
				uvc = uvIndexBuffer[ i * 4 + 2 ];
				uvd = uvIndexBuffer[ i * 4 + 3 ];

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				u4 = uvs[ uvd*2 ];
				v4 = uvs[ uvd*2 + 1 ];

				uv4( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3, u4, v4 );

			}

		};

		function init_faces3_flat( nElements, offsetVertices, offsetMaterials ) {

			var i, a, b, c, m;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 3 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 3 ];
				b = vertexIndexBuffer[ i * 3 + 1 ];
				c = vertexIndexBuffer[ i * 3 + 2 ];

				m = materialIndexBuffer[ i ];

				f3( scope, a, b, c, m );

			}

		};

		function init_faces4_flat( nElements, offsetVertices, offsetMaterials ) {

			var i, a, b, c, d, m;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 4 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 4 ];
				b = vertexIndexBuffer[ i * 4 + 1 ];
				c = vertexIndexBuffer[ i * 4 + 2 ];
				d = vertexIndexBuffer[ i * 4 + 3 ];

				m = materialIndexBuffer[ i ];

				f4( scope, a, b, c, d, m );

			}

		};

		function init_faces3_smooth( nElements, offsetVertices, offsetNormals, offsetMaterials ) {

			var i, a, b, c, m;
			var na, nb, nc;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 3 * nElements );
			var normalIndexBuffer = new Uint32Array( data, offsetNormals, 3 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 3 ];
				b = vertexIndexBuffer[ i * 3 + 1 ];
				c = vertexIndexBuffer[ i * 3 + 2 ];

				na = normalIndexBuffer[ i * 3 ];
				nb = normalIndexBuffer[ i * 3 + 1 ];
				nc = normalIndexBuffer[ i * 3 + 2 ];

				m = materialIndexBuffer[ i ];

				f3n( scope, normals, a, b, c, m, na, nb, nc );

			}

		};

		function init_faces4_smooth( nElements, offsetVertices, offsetNormals, offsetMaterials ) {

			var i, a, b, c, d, m;
			var na, nb, nc, nd;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 4 * nElements );
			var normalIndexBuffer = new Uint32Array( data, offsetNormals, 4 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 4 ];
				b = vertexIndexBuffer[ i * 4 + 1 ];
				c = vertexIndexBuffer[ i * 4 + 2 ];
				d = vertexIndexBuffer[ i * 4 + 3 ];

				na = normalIndexBuffer[ i * 4 ];
				nb = normalIndexBuffer[ i * 4 + 1 ];
				nc = normalIndexBuffer[ i * 4 + 2 ];
				nd = normalIndexBuffer[ i * 4 + 3 ];

				m = materialIndexBuffer[ i ];

				f4n( scope, normals, a, b, c, d, m, na, nb, nc, nd );

			}

		};

		function init_triangles_flat( start ) {

			var nElements = md.ntri_flat;

			if ( nElements ) {

				var offsetMaterials = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				init_faces3_flat( nElements, start, offsetMaterials );

			}

		};

		function init_triangles_flat_uv( start ) {

			var nElements = md.ntri_flat_uv;

			if ( nElements ) {

				var offsetUvs = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_flat( nElements, start, offsetMaterials );
				init_uvs3( nElements, offsetUvs );

			}

		};

		function init_triangles_smooth( start ) {

			var nElements = md.ntri_smooth;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_smooth( nElements, start, offsetNormals, offsetMaterials );

			}

		};

		function init_triangles_smooth_uv( start ) {

			var nElements = md.ntri_smooth_uv;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetUvs = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_smooth( nElements, start, offsetNormals, offsetMaterials );
				init_uvs3( nElements, offsetUvs );

			}

		};

		function init_quads_flat( start ) {

			var nElements = md.nquad_flat;

			if ( nElements ) {

				var offsetMaterials = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				init_faces4_flat( nElements, start, offsetMaterials );

			}

		};

		function init_quads_flat_uv( start ) {

			var nElements = md.nquad_flat_uv;

			if ( nElements ) {

				var offsetUvs = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_flat( nElements, start, offsetMaterials );
				init_uvs4( nElements, offsetUvs );

			}

		};

		function init_quads_smooth( start ) {

			var nElements = md.nquad_smooth;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_smooth( nElements, start, offsetNormals, offsetMaterials );

			}

		};

		function init_quads_smooth_uv( start ) {

			var nElements = md.nquad_smooth_uv;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetUvs = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_smooth( nElements, start, offsetNormals, offsetMaterials );
				init_uvs4( nElements, offsetUvs );

			}

		};

	};

	function vertex ( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	};

	function f3 ( scope, a, b, c, mi ) {

		scope.faces.push( new THREE.Face3( a, b, c, null, null, mi ) );

	};

	function f4 ( scope, a, b, c, d, mi ) {

		scope.faces.push( new THREE.Face3( a, b, d, null, null, mi ) );
		scope.faces.push( new THREE.Face3( b, c, d, null, null, mi ) );

	};

	function f3n ( scope, normals, a, b, c, mi, na, nb, nc ) {

		var nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, c,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz )],
						  null,
						  mi ) );

	};

	function f4n ( scope, normals, a, b, c, d, mi, na, nb, nc, nd ) {

		var nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ],

			ndx = normals[ nd*3     ],
			ndy = normals[ nd*3 + 1 ],
			ndz = normals[ nd*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, d, [
			new THREE.Vector3( nax, nay, naz ),
			new THREE.Vector3( nbx, nby, nbz ),
			new THREE.Vector3( ndx, ndy, ndz )
		], null, mi ) );

		scope.faces.push( new THREE.Face3( b, c, d, [
			new THREE.Vector3( nbx, nby, nbz ),
			new THREE.Vector3( ncx, ncy, ncz ),
			new THREE.Vector3( ndx, ndy, ndz )
		], null, mi ) );

	};

	function uv3 ( where, u1, v1, u2, v2, u3, v3 ) {

		where.push( [
			new THREE.Vector2( u1, v1 ),
			new THREE.Vector2( u2, v2 ),
			new THREE.Vector2( u3, v3 )
		] );

	};

	function uv4 ( where, u1, v1, u2, v2, u3, v3, u4, v4 ) {

		where.push( [
			new THREE.Vector2( u1, v1 ),
			new THREE.Vector2( u2, v2 ),
			new THREE.Vector2( u4, v4 )
		] );

		where.push( [
			new THREE.Vector2( u2, v2 ),
			new THREE.Vector2( u3, v3 ),
			new THREE.Vector2( u4, v4 )
		] );

	};

	Model.prototype = Object.create( THREE.Geometry.prototype );

	var geometry = new Model( texturePath );
	var materials = this.initMaterials( jsonMaterials, texturePath );

	if ( this.needsTangents( materials ) ) geometry.computeTangents();

	callback( geometry, materials );

};
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.2
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);
if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}


;(function(){
var m,ba=this;
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ca="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ha(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ia(a,b,c){ia=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ha;return ia.apply(null,arguments)};function ja(a){return Array.prototype.join.call(arguments,"")}Math.random();function ka(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function na(a,b){null!=a&&this.append.apply(this,arguments)}m=na.prototype;m.Pa="";m.set=function(a){this.Pa=""+a};m.append=function(a,b,c){this.Pa+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Pa+=arguments[d];return this};m.clear=function(){this.Pa=""};m.toString=function(){return this.Pa};var oa=Array.prototype;function qa(a,b,c){return 2>=arguments.length?oa.slice.call(a,b):oa.slice.call(a,b,c)}function ra(a,b){return a>b?1:a<b?-1:0};if("undefined"===typeof sa)var sa=function(){throw Error("No *print-fn* fn set for evaluation environment");};var ua=!0,va=null;if("undefined"===typeof wa)var wa=null;function xa(){return new u(null,5,[za,!0,Aa,!0,Ba,!1,Da,!1,Ea,null],null)}function v(a){return null!=a&&!1!==a}function Ga(a){return v(a)?!1:!0}function x(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function Ha(a){return null==a?null:a.constructor}
function y(a,b){var c=Ha(b),c=v(v(c)?c.Za:c)?c.Ya:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ia(a){var b=a.Ya;return v(b)?b:""+A(a)}var Ja="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.Fd:"@@iterator";function Ka(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function La(a){for(var b=Array(arguments.length),c=0;;)if(c<b.length)b[c]=arguments[c],c+=1;else return b}
var Pa=function(){function a(a,b){function c(a,b){a.push(b);return a}var g=[];return Oa.c?Oa.c(c,g,b):Oa.call(null,c,g,b)}function b(a){return c.b(null,a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,0,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),Qa={},Ra={};function Sa(a){if(a?a.P:a)return a.P(a);var b;b=Sa[t(null==a?null:a)];if(!b&&(b=Sa._,!b))throw y("ICounted.-count",a);return b.call(null,a)}
function Ta(a){if(a?a.V:a)return a.V(a);var b;b=Ta[t(null==a?null:a)];if(!b&&(b=Ta._,!b))throw y("IEmptyableCollection.-empty",a);return b.call(null,a)}var Ua={};function Va(a,b){if(a?a.O:a)return a.O(a,b);var c;c=Va[t(null==a?null:a)];if(!c&&(c=Va._,!c))throw y("ICollection.-conj",a);return c.call(null,a,b)}
var Wa={},C=function(){function a(a,b,c){if(a?a.ta:a)return a.ta(a,b,c);var g;g=C[t(null==a?null:a)];if(!g&&(g=C._,!g))throw y("IIndexed.-nth",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.t:a)return a.t(a,b);var c;c=C[t(null==a?null:a)];if(!c&&(c=C._,!c))throw y("IIndexed.-nth",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),
Xa={};function Ya(a){if(a?a.W:a)return a.W(a);var b;b=Ya[t(null==a?null:a)];if(!b&&(b=Ya._,!b))throw y("ISeq.-first",a);return b.call(null,a)}function Za(a){if(a?a.pa:a)return a.pa(a);var b;b=Za[t(null==a?null:a)];if(!b&&(b=Za._,!b))throw y("ISeq.-rest",a);return b.call(null,a)}
var $a={},ab={},bb=function(){function a(a,b,c){if(a?a.I:a)return a.I(a,b,c);var g;g=bb[t(null==a?null:a)];if(!g&&(g=bb._,!g))throw y("ILookup.-lookup",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.J:a)return a.J(a,b);var c;c=bb[t(null==a?null:a)];if(!c&&(c=bb._,!c))throw y("ILookup.-lookup",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=
a;return c}();function cb(a,b){if(a?a.Hb:a)return a.Hb(a,b);var c;c=cb[t(null==a?null:a)];if(!c&&(c=cb._,!c))throw y("IAssociative.-contains-key?",a);return c.call(null,a,b)}function db(a,b,c){if(a?a.Da:a)return a.Da(a,b,c);var d;d=db[t(null==a?null:a)];if(!d&&(d=db._,!d))throw y("IAssociative.-assoc",a);return d.call(null,a,b,c)}var eb={};function hb(a,b){if(a?a.La:a)return a.La(a,b);var c;c=hb[t(null==a?null:a)];if(!c&&(c=hb._,!c))throw y("IMap.-dissoc",a);return c.call(null,a,b)}var ib={};
function jb(a){if(a?a.Mb:a)return a.Mb();var b;b=jb[t(null==a?null:a)];if(!b&&(b=jb._,!b))throw y("IMapEntry.-key",a);return b.call(null,a)}function kb(a){if(a?a.Nb:a)return a.Nb();var b;b=kb[t(null==a?null:a)];if(!b&&(b=kb._,!b))throw y("IMapEntry.-val",a);return b.call(null,a)}var mb={};function nb(a,b){if(a?a.Xb:a)return a.Xb(0,b);var c;c=nb[t(null==a?null:a)];if(!c&&(c=nb._,!c))throw y("ISet.-disjoin",a);return c.call(null,a,b)}var ob={};
function qb(a,b,c){if(a?a.Ob:a)return a.Ob(a,b,c);var d;d=qb[t(null==a?null:a)];if(!d&&(d=qb._,!d))throw y("IVector.-assoc-n",a);return d.call(null,a,b,c)}function rb(a){if(a?a.Wa:a)return a.Wa(a);var b;b=rb[t(null==a?null:a)];if(!b&&(b=rb._,!b))throw y("IDeref.-deref",a);return b.call(null,a)}var sb={};function tb(a){if(a?a.A:a)return a.A(a);var b;b=tb[t(null==a?null:a)];if(!b&&(b=tb._,!b))throw y("IMeta.-meta",a);return b.call(null,a)}var ub={};
function vb(a,b){if(a?a.D:a)return a.D(a,b);var c;c=vb[t(null==a?null:a)];if(!c&&(c=vb._,!c))throw y("IWithMeta.-with-meta",a);return c.call(null,a,b)}
var wb={},xb=function(){function a(a,b,c){if(a?a.ja:a)return a.ja(a,b,c);var g;g=xb[t(null==a?null:a)];if(!g&&(g=xb._,!g))throw y("IReduce.-reduce",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.ia:a)return a.ia(a,b);var c;c=xb[t(null==a?null:a)];if(!c&&(c=xb._,!c))throw y("IReduce.-reduce",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=
a;return c}();function yb(a,b){if(a?a.B:a)return a.B(a,b);var c;c=yb[t(null==a?null:a)];if(!c&&(c=yb._,!c))throw y("IEquiv.-equiv",a);return c.call(null,a,b)}function zb(a){if(a?a.C:a)return a.C(a);var b;b=zb[t(null==a?null:a)];if(!b&&(b=zb._,!b))throw y("IHash.-hash",a);return b.call(null,a)}var Ab={};function Bb(a){if(a?a.M:a)return a.M(a);var b;b=Bb[t(null==a?null:a)];if(!b&&(b=Bb._,!b))throw y("ISeqable.-seq",a);return b.call(null,a)}var Cb={},Db={};
function Eb(a){if(a?a.wb:a)return a.wb(a);var b;b=Eb[t(null==a?null:a)];if(!b&&(b=Eb._,!b))throw y("IReversible.-rseq",a);return b.call(null,a)}function Fb(a,b){if(a?a.bc:a)return a.bc(0,b);var c;c=Fb[t(null==a?null:a)];if(!c&&(c=Fb._,!c))throw y("IWriter.-write",a);return c.call(null,a,b)}var Gb={};function Hb(a,b,c){if(a?a.v:a)return a.v(a,b,c);var d;d=Hb[t(null==a?null:a)];if(!d&&(d=Hb._,!d))throw y("IPrintWithWriter.-pr-writer",a);return d.call(null,a,b,c)}
function Ib(a,b,c){if(a?a.$b:a)return a.$b(0,b,c);var d;d=Ib[t(null==a?null:a)];if(!d&&(d=Ib._,!d))throw y("IWatchable.-notify-watches",a);return d.call(null,a,b,c)}function Jb(a,b,c){if(a?a.Zb:a)return a.Zb(0,b,c);var d;d=Jb[t(null==a?null:a)];if(!d&&(d=Jb._,!d))throw y("IWatchable.-add-watch",a);return d.call(null,a,b,c)}function Kb(a,b){if(a?a.ac:a)return a.ac(0,b);var c;c=Kb[t(null==a?null:a)];if(!c&&(c=Kb._,!c))throw y("IWatchable.-remove-watch",a);return c.call(null,a,b)}
function Lb(a){if(a?a.Xa:a)return a.Xa(a);var b;b=Lb[t(null==a?null:a)];if(!b&&(b=Lb._,!b))throw y("IEditableCollection.-as-transient",a);return b.call(null,a)}function Nb(a,b){if(a?a.Qa:a)return a.Qa(a,b);var c;c=Nb[t(null==a?null:a)];if(!c&&(c=Nb._,!c))throw y("ITransientCollection.-conj!",a);return c.call(null,a,b)}function Ob(a){if(a?a.Ra:a)return a.Ra(a);var b;b=Ob[t(null==a?null:a)];if(!b&&(b=Ob._,!b))throw y("ITransientCollection.-persistent!",a);return b.call(null,a)}
function Pb(a,b,c){if(a?a.kb:a)return a.kb(a,b,c);var d;d=Pb[t(null==a?null:a)];if(!d&&(d=Pb._,!d))throw y("ITransientAssociative.-assoc!",a);return d.call(null,a,b,c)}function Qb(a,b,c){if(a?a.Yb:a)return a.Yb(0,b,c);var d;d=Qb[t(null==a?null:a)];if(!d&&(d=Qb._,!d))throw y("ITransientVector.-assoc-n!",a);return d.call(null,a,b,c)}function Rb(a){if(a?a.Ub:a)return a.Ub();var b;b=Rb[t(null==a?null:a)];if(!b&&(b=Rb._,!b))throw y("IChunk.-drop-first",a);return b.call(null,a)}
function Sb(a){if(a?a.Jb:a)return a.Jb(a);var b;b=Sb[t(null==a?null:a)];if(!b&&(b=Sb._,!b))throw y("IChunkedSeq.-chunked-first",a);return b.call(null,a)}function Tb(a){if(a?a.Kb:a)return a.Kb(a);var b;b=Tb[t(null==a?null:a)];if(!b&&(b=Tb._,!b))throw y("IChunkedSeq.-chunked-rest",a);return b.call(null,a)}function Ub(a){if(a?a.Ib:a)return a.Ib(a);var b;b=Ub[t(null==a?null:a)];if(!b&&(b=Ub._,!b))throw y("IChunkedNext.-chunked-next",a);return b.call(null,a)}
function Vb(a){if(a?a.hb:a)return a.hb(a);var b;b=Vb[t(null==a?null:a)];if(!b&&(b=Vb._,!b))throw y("INamed.-name",a);return b.call(null,a)}function Wb(a){if(a?a.ib:a)return a.ib(a);var b;b=Wb[t(null==a?null:a)];if(!b&&(b=Wb._,!b))throw y("INamed.-namespace",a);return b.call(null,a)}function Xb(a,b){if(a?a.cd:a)return a.cd(a,b);var c;c=Xb[t(null==a?null:a)];if(!c&&(c=Xb._,!c))throw y("IReset.-reset!",a);return c.call(null,a,b)}
var Yb=function(){function a(a,b,c,d,e){if(a?a.gd:a)return a.gd(a,b,c,d,e);var n;n=Yb[t(null==a?null:a)];if(!n&&(n=Yb._,!n))throw y("ISwap.-swap!",a);return n.call(null,a,b,c,d,e)}function b(a,b,c,d){if(a?a.fd:a)return a.fd(a,b,c,d);var e;e=Yb[t(null==a?null:a)];if(!e&&(e=Yb._,!e))throw y("ISwap.-swap!",a);return e.call(null,a,b,c,d)}function c(a,b,c){if(a?a.ed:a)return a.ed(a,b,c);var d;d=Yb[t(null==a?null:a)];if(!d&&(d=Yb._,!d))throw y("ISwap.-swap!",a);return d.call(null,a,b,c)}function d(a,b){if(a?
a.dd:a)return a.dd(a,b);var c;c=Yb[t(null==a?null:a)];if(!c&&(c=Yb._,!c))throw y("ISwap.-swap!",a);return c.call(null,a,b)}var e=null,e=function(e,g,h,k,l){switch(arguments.length){case 2:return d.call(this,e,g);case 3:return c.call(this,e,g,h);case 4:return b.call(this,e,g,h,k);case 5:return a.call(this,e,g,h,k,l)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.c=c;e.i=b;e.r=a;return e}();
function Zb(a,b){if(a?a.Pb:a)return a.Pb(0,b);var c;c=Zb[t(null==a?null:a)];if(!c&&(c=Zb._,!c))throw y("IVolatile.-vreset!",a);return c.call(null,a,b)}function $b(a){if(a?a.gb:a)return a.gb(a);var b;b=$b[t(null==a?null:a)];if(!b&&(b=$b._,!b))throw y("IIterable.-iterator",a);return b.call(null,a)}function ac(a){this.td=a;this.q=0;this.j=1073741824}ac.prototype.bc=function(a,b){return this.td.append(b)};function bc(a){var b=new na;a.v(null,new ac(b),xa());return""+A(b)}
var cc="undefined"!==typeof Math.imul&&0!==(Math.imul.b?Math.imul.b(4294967295,5):Math.imul.call(null,4294967295,5))?function(a,b){return Math.imul.b?Math.imul.b(a,b):Math.imul.call(null,a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function dc(a){a=cc(a,3432918353);return cc(a<<15|a>>>-15,461845907)}function ec(a,b){var c=a^b;return cc(c<<13|c>>>-13,5)+3864292196}
function fc(a,b){var c=a^b,c=cc(c^c>>>16,2246822507),c=cc(c^c>>>13,3266489909);return c^c>>>16}var gc={},hc=0;function ic(a){255<hc&&(gc={},hc=0);var b=gc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b){for(var c=0,d=0;;)if(c<b)var e=c+1,d=cc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}b=void 0}else b=0;else b=0;gc[a]=b;hc+=1}return a=b}
function jc(a){a&&(a.j&4194304||a.yd)?a=a.C(null):"number"===typeof a?a=(Math.floor.a?Math.floor.a(a):Math.floor.call(null,a))%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=ic(a),0!==a&&(a=dc(a),a=ec(0,a),a=fc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:zb(a);return a}
function kc(a){var b;b=a.name;var c;a:{c=1;for(var d=0;;)if(c<b.length){var e=c+2,d=ec(d,dc(b.charCodeAt(c-1)|b.charCodeAt(c)<<16));c=e}else{c=d;break a}c=void 0}c=1===(b.length&1)?c^dc(b.charCodeAt(b.length-1)):c;b=fc(c,cc(2,b.length));a=ic(a.na);return b^a+2654435769+(b<<6)+(b>>2)}function lc(a,b){if(a.str===b.str)return 0;var c=Ga(a.na);if(v(c?b.na:c))return-1;if(v(a.na)){if(Ga(b.na))return 1;c=ra(a.na,b.na);return 0===c?ra(a.name,b.name):c}return ra(a.name,b.name)}
function mc(a,b,c,d,e){this.na=a;this.name=b;this.str=c;this.Va=d;this.oa=e;this.j=2154168321;this.q=4096}m=mc.prototype;m.v=function(a,b){return Fb(b,this.str)};m.hb=function(){return this.name};m.ib=function(){return this.na};m.C=function(){var a=this.Va;return null!=a?a:this.Va=a=kc(this)};m.D=function(a,b){return new mc(this.na,this.name,this.str,this.Va,b)};m.A=function(){return this.oa};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return bb.c(c,this,null);case 3:return bb.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return bb.c(c,this,null)};a.c=function(a,c,d){return bb.c(c,this,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return bb.c(a,this,null)};m.b=function(a,b){return bb.c(a,this,b)};m.B=function(a,b){return b instanceof mc?this.str===b.str:!1};
m.toString=function(){return this.str};var nc=function(){function a(a,b){var c=null!=a?[A(a),A("/"),A(b)].join(""):b;return new mc(a,b,c,null,null)}function b(a){return a instanceof mc?a:c.b(null,a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();
function E(a){if(null==a)return null;if(a&&(a.j&8388608||a.Ad))return a.M(null);if(a instanceof Array||"string"===typeof a)return 0===a.length?null:new G(a,0);if(x(Ab,a))return Bb(a);throw Error([A(a),A(" is not ISeqable")].join(""));}function H(a){if(null==a)return null;if(a&&(a.j&64||a.jb))return a.W(null);a=E(a);return null==a?null:Ya(a)}function I(a){return null!=a?a&&(a.j&64||a.jb)?a.pa(null):(a=E(a))?Za(a):oc:oc}function J(a){return null==a?null:a&&(a.j&128||a.vb)?a.la(null):E(I(a))}
var pc=function(){function a(a,b){return null==a?null==b:a===b||yb(a,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;)if(b.b(a,d))if(J(e))a=d,d=H(e),e=J(e);else return b.b(d,H(e));else return!1}a.l=2;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return!0;
case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.a=function(){return!0};b.b=a;b.d=c.d;return b}();function qc(a){this.K=a}qc.prototype.next=function(){if(null!=this.K){var a=H(this.K);this.K=J(this.K);return{done:!1,value:a}}return{done:!0,value:null}};function rc(a){return new qc(E(a))}
function sc(a,b){var c=dc(a),c=ec(0,c);return fc(c,b)}function tc(a){var b=0,c=1;for(a=E(a);;)if(null!=a)b+=1,c=cc(31,c)+jc(H(a))|0,a=J(a);else return sc(c,b)}var uc=sc(1,0);function vc(a){var b=0,c=0;for(a=E(a);;)if(null!=a)b+=1,c=c+jc(H(a))|0,a=J(a);else return sc(c,b)}var wc=sc(0,0);Ra["null"]=!0;Sa["null"]=function(){return 0};Date.prototype.B=function(a,b){return b instanceof Date&&this.toString()===b.toString()};yb.number=function(a,b){return a===b};sb["function"]=!0;tb["function"]=function(){return null};
Qa["function"]=!0;zb._=function(a){return a[ca]||(a[ca]=++ea)};function xc(a){return a+1}function yc(a){this.T=a;this.q=0;this.j=32768}yc.prototype.Wa=function(){return this.T};function zc(a){return a instanceof yc}function K(a){return rb(a)}
var Ac=function(){function a(a,b,c,d){for(var k=Sa(a);;)if(d<k){var l=C.b(a,d);c=b.b?b.b(c,l):b.call(null,c,l);if(zc(c))return rb(c);d+=1}else return c}function b(a,b,c){var d=Sa(a),k=c;for(c=0;;)if(c<d){var l=C.b(a,c),k=b.b?b.b(k,l):b.call(null,k,l);if(zc(k))return rb(k);c+=1}else return k}function c(a,b){var c=Sa(a);if(0===c)return b.k?b.k():b.call(null);for(var d=C.b(a,0),k=1;;)if(k<c){var l=C.b(a,k),d=b.b?b.b(d,l):b.call(null,d,l);if(zc(d))return rb(d);k+=1}else return d}var d=null,d=function(d,
f,g,h){switch(arguments.length){case 2:return c.call(this,d,f);case 3:return b.call(this,d,f,g);case 4:return a.call(this,d,f,g,h)}throw Error("Invalid arity: "+arguments.length);};d.b=c;d.c=b;d.i=a;return d}(),Bc=function(){function a(a,b,c,d){for(var k=a.length;;)if(d<k){var l=a[d];c=b.b?b.b(c,l):b.call(null,c,l);if(zc(c))return rb(c);d+=1}else return c}function b(a,b,c){var d=a.length,k=c;for(c=0;;)if(c<d){var l=a[c],k=b.b?b.b(k,l):b.call(null,k,l);if(zc(k))return rb(k);c+=1}else return k}function c(a,
b){var c=a.length;if(0===a.length)return b.k?b.k():b.call(null);for(var d=a[0],k=1;;)if(k<c){var l=a[k],d=b.b?b.b(d,l):b.call(null,d,l);if(zc(d))return rb(d);k+=1}else return d}var d=null,d=function(d,f,g,h){switch(arguments.length){case 2:return c.call(this,d,f);case 3:return b.call(this,d,f,g);case 4:return a.call(this,d,f,g,h)}throw Error("Invalid arity: "+arguments.length);};d.b=c;d.c=b;d.i=a;return d}();function Cc(a){return a?a.j&2||a.Tc?!0:a.j?!1:x(Ra,a):x(Ra,a)}
function Ec(a){return a?a.j&16||a.Vb?!0:a.j?!1:x(Wa,a):x(Wa,a)}function Fc(a,b){this.e=a;this.n=b}Fc.prototype.Cb=function(){return this.n<this.e.length};Fc.prototype.next=function(){var a=this.e[this.n];this.n+=1;return a};function G(a,b){this.e=a;this.n=b;this.j=166199550;this.q=8192}m=G.prototype;m.toString=function(){return bc(this)};m.t=function(a,b){var c=b+this.n;return c<this.e.length?this.e[c]:null};m.ta=function(a,b,c){a=b+this.n;return a<this.e.length?this.e[a]:c};
m.gb=function(){return new Fc(this.e,this.n)};m.la=function(){return this.n+1<this.e.length?new G(this.e,this.n+1):null};m.P=function(){return this.e.length-this.n};m.wb=function(){var a=Sa(this);return 0<a?new Gc(this,a-1,null):null};m.C=function(){return tc(this)};m.B=function(a,b){return Hc.b?Hc.b(this,b):Hc.call(null,this,b)};m.V=function(){return oc};m.ia=function(a,b){return Bc.i(this.e,b,this.e[this.n],this.n+1)};m.ja=function(a,b,c){return Bc.i(this.e,b,c,this.n)};m.W=function(){return this.e[this.n]};
m.pa=function(){return this.n+1<this.e.length?new G(this.e,this.n+1):oc};m.M=function(){return this};m.O=function(a,b){return L.b?L.b(b,this):L.call(null,b,this)};G.prototype[Ja]=function(){return rc(this)};
var Ic=function(){function a(a,b){return b<a.length?new G(a,b):null}function b(a){return c.b(a,0)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),M=function(){function a(a,b){return Ic.b(a,b)}function b(a){return Ic.b(a,0)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+
arguments.length);};c.a=b;c.b=a;return c}();function Gc(a,b,c){this.sb=a;this.n=b;this.p=c;this.j=32374990;this.q=8192}m=Gc.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};m.la=function(){return 0<this.n?new Gc(this.sb,this.n-1,null):null};m.P=function(){return this.n+1};m.C=function(){return tc(this)};m.B=function(a,b){return Hc.b?Hc.b(this,b):Hc.call(null,this,b)};m.V=function(){var a=this.p;return Jc.b?Jc.b(oc,a):Jc.call(null,oc,a)};
m.ia=function(a,b){return Kc.b?Kc.b(b,this):Kc.call(null,b,this)};m.ja=function(a,b,c){return Kc.c?Kc.c(b,c,this):Kc.call(null,b,c,this)};m.W=function(){return C.b(this.sb,this.n)};m.pa=function(){return 0<this.n?new Gc(this.sb,this.n-1,null):oc};m.M=function(){return this};m.D=function(a,b){return new Gc(this.sb,this.n,b)};m.O=function(a,b){return L.b?L.b(b,this):L.call(null,b,this)};Gc.prototype[Ja]=function(){return rc(this)};yb._=function(a,b){return a===b};
var Mc=function(){function a(a,b){return null!=a?Va(a,b):Va(oc,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;)if(v(e))a=b.b(a,d),d=H(e),e=J(e);else return b.b(a,d)}a.l=2;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 0:return Lc;case 1:return b;
case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.k=function(){return Lc};b.a=function(a){return a};b.b=a;b.d=c.d;return b}();
function P(a){if(null!=a)if(a&&(a.j&2||a.Tc))a=a.P(null);else if(a instanceof Array)a=a.length;else if("string"===typeof a)a=a.length;else if(x(Ra,a))a=Sa(a);else a:{a=E(a);for(var b=0;;){if(Cc(a)){a=b+Sa(a);break a}a=J(a);b+=1}a=void 0}else a=0;return a}
var Nc=function(){function a(a,b,c){for(;;){if(null==a)return c;if(0===b)return E(a)?H(a):c;if(Ec(a))return C.c(a,b,c);if(E(a))a=J(a),b-=1;else return c}}function b(a,b){for(;;){if(null==a)throw Error("Index out of bounds");if(0===b){if(E(a))return H(a);throw Error("Index out of bounds");}if(Ec(a))return C.b(a,b);if(E(a)){var c=J(a),g=b-1;a=c;b=g}else throw Error("Index out of bounds");}}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,
c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Q=function(){function a(a,b,c){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return c;if(a&&(a.j&16||a.Vb))return a.ta(null,b,c);if(a instanceof Array||"string"===typeof a)return b<a.length?a[b]:c;if(x(Wa,a))return C.b(a,b);if(a?a.j&64||a.jb||(a.j?0:x(Xa,a)):x(Xa,a))return Nc.c(a,b,c);throw Error([A("nth not supported on this type "),A(Ia(Ha(a)))].join(""));}function b(a,b){if("number"!==
typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(a&&(a.j&16||a.Vb))return a.t(null,b);if(a instanceof Array||"string"===typeof a)return b<a.length?a[b]:null;if(x(Wa,a))return C.b(a,b);if(a?a.j&64||a.jb||(a.j?0:x(Xa,a)):x(Xa,a))return Nc.b(a,b);throw Error([A("nth not supported on this type "),A(Ia(Ha(a)))].join(""));}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+
arguments.length);};c.b=b;c.c=a;return c}(),R=function(){function a(a,b,c){return null!=a?a&&(a.j&256||a.Wb)?a.I(null,b,c):a instanceof Array?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:x(ab,a)?bb.c(a,b,c):c:c}function b(a,b){return null==a?null:a&&(a.j&256||a.Wb)?a.J(null,b):a instanceof Array?b<a.length?a[b]:null:"string"===typeof a?b<a.length?a[b]:null:x(ab,a)?bb.b(a,b):null}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,
c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Pc=function(){function a(a,b,c){return null!=a?db(a,b,c):Oc([b],[c])}var b=null,c=function(){function a(b,d,h,k){var l=null;if(3<arguments.length){for(var l=0,n=Array(arguments.length-3);l<n.length;)n[l]=arguments[l+3],++l;l=new G(n,0)}return c.call(this,b,d,h,l)}function c(a,d,e,k){for(;;)if(a=b.c(a,d,e),v(k))d=H(k),e=H(J(k)),k=J(J(k));else return a}a.l=3;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=J(a);var k=H(a);
a=I(a);return c(b,d,k,a)};a.d=c;return a}(),b=function(b,e,f,g){switch(arguments.length){case 3:return a.call(this,b,e,f);default:var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new G(k,0)}return c.d(b,e,f,h)}throw Error("Invalid arity: "+arguments.length);};b.l=3;b.g=c.g;b.c=a;b.d=c.d;return b}(),Qc=function(){function a(a,b){return null==a?null:hb(a,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=
0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;){if(null==a)return null;a=b.b(a,d);if(v(e))d=H(e),e=J(e);else return a}}a.l=2;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;
g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.a=function(a){return a};b.b=a;b.d=c.d;return b}();function Rc(a){var b="function"==t(a);return v(b)?b:a?v(v(null)?null:a.Sc)?!0:a.Rb?!1:x(Qa,a):x(Qa,a)}function Sc(a,b){this.f=a;this.p=b;this.q=0;this.j=393217}m=Sc.prototype;
m.call=function(){function a(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N,D,O){a=this.f;return S.fb?S.fb(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N,D,O):S.call(null,a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N,D,O)}function b(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N,D){a=this;return a.f.ga?a.f.ga(b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N,D):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N,D)}function c(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N){a=this;return a.f.fa?a.f.fa(b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N):a.f.call(null,
b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F,N)}function d(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F){a=this;return a.f.ea?a.f.ea(b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B,F)}function e(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B){a=this;return a.f.da?a.f.da(b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z,B)}function f(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z){a=this;return a.f.ca?a.f.ca(b,c,d,e,f,g,h,k,l,n,p,r,q,s,w,z):a.f.call(null,b,c,d,e,f,g,h,k,
l,n,p,r,q,s,w,z)}function g(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w){a=this;return a.f.ba?a.f.ba(b,c,d,e,f,g,h,k,l,n,p,r,q,s,w):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r,q,s,w)}function h(a,b,c,d,e,f,g,h,k,l,n,p,r,q,s){a=this;return a.f.aa?a.f.aa(b,c,d,e,f,g,h,k,l,n,p,r,q,s):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r,q,s)}function k(a,b,c,d,e,f,g,h,k,l,n,p,r,q){a=this;return a.f.$?a.f.$(b,c,d,e,f,g,h,k,l,n,p,r,q):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r,q)}function l(a,b,c,d,e,f,g,h,k,l,n,p,r){a=this;return a.f.Z?a.f.Z(b,
c,d,e,f,g,h,k,l,n,p,r):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p,r)}function n(a,b,c,d,e,f,g,h,k,l,n,p){a=this;return a.f.Y?a.f.Y(b,c,d,e,f,g,h,k,l,n,p):a.f.call(null,b,c,d,e,f,g,h,k,l,n,p)}function p(a,b,c,d,e,f,g,h,k,l,n){a=this;return a.f.X?a.f.X(b,c,d,e,f,g,h,k,l,n):a.f.call(null,b,c,d,e,f,g,h,k,l,n)}function q(a,b,c,d,e,f,g,h,k,l){a=this;return a.f.ha?a.f.ha(b,c,d,e,f,g,h,k,l):a.f.call(null,b,c,d,e,f,g,h,k,l)}function r(a,b,c,d,e,f,g,h,k){a=this;return a.f.S?a.f.S(b,c,d,e,f,g,h,k):a.f.call(null,b,
c,d,e,f,g,h,k)}function s(a,b,c,d,e,f,g,h){a=this;return a.f.L?a.f.L(b,c,d,e,f,g,h):a.f.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;return a.f.u?a.f.u(b,c,d,e,f,g):a.f.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.f.r?a.f.r(b,c,d,e,f):a.f.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;return a.f.i?a.f.i(b,c,d,e):a.f.call(null,b,c,d,e)}function F(a,b,c,d){a=this;return a.f.c?a.f.c(b,c,d):a.f.call(null,b,c,d)}function N(a,b,c){a=this;return a.f.b?a.f.b(b,c):a.f.call(null,
b,c)}function O(a,b){a=this;return a.f.a?a.f.a(b):a.f.call(null,b)}function aa(a){a=this;return a.f.k?a.f.k():a.f.call(null)}var D=null,D=function(la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb,gb,Mb,Dc,jd,pe){switch(arguments.length){case 1:return aa.call(this,la);case 2:return O.call(this,la,U);case 3:return N.call(this,la,U,X);case 4:return F.call(this,la,U,X,$);case 5:return B.call(this,la,U,X,$,ga);case 6:return z.call(this,la,U,X,$,ga,da);case 7:return w.call(this,la,U,X,$,ga,da,ma);case 8:return s.call(this,
la,U,X,$,ga,da,ma,pa);case 9:return r.call(this,la,U,X,$,ga,da,ma,pa,ta);case 10:return q.call(this,la,U,X,$,ga,da,ma,pa,ta,ya);case 11:return p.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca);case 12:return n.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D);case 13:return l.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa);case 14:return k.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma);case 15:return h.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na);case 16:return g.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,
D,Fa,Ma,Na,fb);case 17:return f.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb);case 18:return e.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb,gb);case 19:return d.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb,gb,Mb);case 20:return c.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb,gb,Mb,Dc);case 21:return b.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb,gb,Mb,Dc,jd);case 22:return a.call(this,la,U,X,$,ga,da,ma,pa,ta,ya,Ca,D,Fa,Ma,Na,fb,lb,gb,Mb,Dc,
jd,pe)}throw Error("Invalid arity: "+arguments.length);};D.a=aa;D.b=O;D.c=N;D.i=F;D.r=B;D.u=z;D.L=w;D.S=s;D.ha=r;D.X=q;D.Y=p;D.Z=n;D.$=l;D.aa=k;D.ba=h;D.ca=g;D.da=f;D.ea=e;D.fa=d;D.ga=c;D.Lb=b;D.fb=a;return D}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.k=function(){return this.f.k?this.f.k():this.f.call(null)};m.a=function(a){return this.f.a?this.f.a(a):this.f.call(null,a)};m.b=function(a,b){return this.f.b?this.f.b(a,b):this.f.call(null,a,b)};
m.c=function(a,b,c){return this.f.c?this.f.c(a,b,c):this.f.call(null,a,b,c)};m.i=function(a,b,c,d){return this.f.i?this.f.i(a,b,c,d):this.f.call(null,a,b,c,d)};m.r=function(a,b,c,d,e){return this.f.r?this.f.r(a,b,c,d,e):this.f.call(null,a,b,c,d,e)};m.u=function(a,b,c,d,e,f){return this.f.u?this.f.u(a,b,c,d,e,f):this.f.call(null,a,b,c,d,e,f)};m.L=function(a,b,c,d,e,f,g){return this.f.L?this.f.L(a,b,c,d,e,f,g):this.f.call(null,a,b,c,d,e,f,g)};
m.S=function(a,b,c,d,e,f,g,h){return this.f.S?this.f.S(a,b,c,d,e,f,g,h):this.f.call(null,a,b,c,d,e,f,g,h)};m.ha=function(a,b,c,d,e,f,g,h,k){return this.f.ha?this.f.ha(a,b,c,d,e,f,g,h,k):this.f.call(null,a,b,c,d,e,f,g,h,k)};m.X=function(a,b,c,d,e,f,g,h,k,l){return this.f.X?this.f.X(a,b,c,d,e,f,g,h,k,l):this.f.call(null,a,b,c,d,e,f,g,h,k,l)};m.Y=function(a,b,c,d,e,f,g,h,k,l,n){return this.f.Y?this.f.Y(a,b,c,d,e,f,g,h,k,l,n):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n)};
m.Z=function(a,b,c,d,e,f,g,h,k,l,n,p){return this.f.Z?this.f.Z(a,b,c,d,e,f,g,h,k,l,n,p):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p)};m.$=function(a,b,c,d,e,f,g,h,k,l,n,p,q){return this.f.$?this.f.$(a,b,c,d,e,f,g,h,k,l,n,p,q):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q)};m.aa=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r){return this.f.aa?this.f.aa(a,b,c,d,e,f,g,h,k,l,n,p,q,r):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r)};
m.ba=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s){return this.f.ba?this.f.ba(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s)};m.ca=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w){return this.f.ca?this.f.ca(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w)};m.da=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z){return this.f.da?this.f.da(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z)};
m.ea=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B){return this.f.ea?this.f.ea(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B)};m.fa=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F){return this.f.fa?this.f.fa(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F)};
m.ga=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N){return this.f.ga?this.f.ga(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N):this.f.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N)};m.Lb=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O){var aa=this.f;return S.fb?S.fb(aa,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O):S.call(null,aa,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O)};m.Sc=!0;m.D=function(a,b){return new Sc(this.f,b)};m.A=function(){return this.p};
function Jc(a,b){return Rc(a)&&!(a?a.j&262144||a.Ed||(a.j?0:x(ub,a)):x(ub,a))?new Sc(a,b):null==a?null:vb(a,b)}function Tc(a){var b=null!=a;return(b?a?a.j&131072||a.$c||(a.j?0:x(sb,a)):x(sb,a):b)?tb(a):null}
var Uc=function(){function a(a,b){return null==a?null:nb(a,b)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return c.call(this,b,d,k)}function c(a,d,e){for(;;){if(null==a)return null;a=b.b(a,d);if(v(e))d=H(e),e=J(e);else return a}}a.l=2;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;
case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.a=function(a){return a};b.b=a;b.d=c.d;return b}();function Vc(a){return null==a?!1:a?a.j&8||a.wd?!0:a.j?!1:x(Ua,a):x(Ua,a)}function Wc(a){return null==a?!1:a?a.j&4096||a.Cd?!0:a.j?!1:x(mb,a):x(mb,a)}
function Xc(a){return a?a.j&16777216||a.Bd?!0:a.j?!1:x(Cb,a):x(Cb,a)}function Yc(a){return null==a?!1:a?a.j&1024||a.Yc?!0:a.j?!1:x(eb,a):x(eb,a)}function Zc(a){return a?a.j&16384||a.Dd?!0:a.j?!1:x(ob,a):x(ob,a)}function $c(a){return a?a.q&512||a.vd?!0:!1:!1}function ad(a){var b=[];ka(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function bd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,e-=1,b+=1}function cd(a,b,c,d,e){b+=e-1;for(d+=e-1;0!==e;)c[d]=a[b],d-=1,e-=1,b-=1}var dd={};
function ed(a){return null==a?!1:a?a.j&64||a.jb?!0:a.j?!1:x(Xa,a):x(Xa,a)}function fd(a){return v(a)?!0:!1}function gd(a,b){return R.c(a,b,dd)===dd?!1:!0}function hd(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if(Ha(a)===Ha(b))return a&&(a.q&2048||a.tb)?a.ub(null,b):ra(a,b);throw Error("compare on non-nil objects of different types");}
var id=function(){function a(a,b,c,g){for(;;){var h=hd(Q.b(a,g),Q.b(b,g));if(0===h&&g+1<c)g+=1;else return h}}function b(a,b){var f=P(a),g=P(b);return f<g?-1:f>g?1:c.i(a,b,f,0)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.i=a;return c}(),Kc=function(){function a(a,b,c){for(c=E(c);;)if(c){var g=H(c);b=a.b?a.b(b,g):a.call(null,b,g);if(zc(b))return rb(b);c=J(c)}else return b}
function b(a,b){var c=E(b);if(c){var g=H(c),c=J(c);return Oa.c?Oa.c(a,g,c):Oa.call(null,a,g,c)}return a.k?a.k():a.call(null)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Oa=function(){function a(a,b,c){return c&&(c.j&524288||c.bd)?c.ja(null,a,b):c instanceof Array?Bc.c(c,a,b):"string"===typeof c?Bc.c(c,a,b):x(wb,c)?xb.c(c,a,b):Kc.c(a,b,c)}function b(a,
b){return b&&(b.j&524288||b.bd)?b.ia(null,a):b instanceof Array?Bc.b(b,a):"string"===typeof b?Bc.b(b,a):x(wb,b)?xb.b(b,a):Kc.b(a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();function kd(a){return a}
var ld=function(){function a(a,b,c,g){a=a.a?a.a(b):a.call(null,b);c=Oa.c(a,c,g);return a.a?a.a(c):a.call(null,c)}function b(a,b,f){return c.i(a,b,b.k?b.k():b.call(null),f)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 3:return b.call(this,c,e,f);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.i=a;return c}(),md=function(){var a=null,b=function(){function b(a,c,g){var h=null;if(2<arguments.length){for(var h=0,k=Array(arguments.length-2);h<
k.length;)k[h]=arguments[h+2],++h;h=new G(k,0)}return d.call(this,a,c,h)}function d(b,c,d){return Oa.c(a,b+c,d)}b.l=2;b.g=function(a){var b=H(a);a=J(a);var c=H(a);a=I(a);return d(b,c,a)};b.d=d;return b}(),a=function(a,d,e){switch(arguments.length){case 0:return 0;case 1:return a;case 2:return a+d;default:var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new G(g,0)}return b.d(a,d,f)}throw Error("Invalid arity: "+arguments.length);};a.l=
2;a.g=b.g;a.k=function(){return 0};a.a=function(a){return a};a.b=function(a,b){return a+b};a.d=b.d;return a}(),nd=function(){var a=null,b=function(){function b(a,c,g){var h=null;if(2<arguments.length){for(var h=0,k=Array(arguments.length-2);h<k.length;)k[h]=arguments[h+2],++h;h=new G(k,0)}return d.call(this,a,c,h)}function d(b,c,d){return Oa.c(a,b-c,d)}b.l=2;b.g=function(a){var b=H(a);a=J(a);var c=H(a);a=I(a);return d(b,c,a)};b.d=d;return b}(),a=function(a,d,e){switch(arguments.length){case 1:return-a;
case 2:return a-d;default:var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new G(g,0)}return b.d(a,d,f)}throw Error("Invalid arity: "+arguments.length);};a.l=2;a.g=b.g;a.a=function(a){return-a};a.b=function(a,b){return a-b};a.d=b.d;return a}();function od(a,b){var c=(a-a%b)/b;return 0<=c?Math.floor.a?Math.floor.a(c):Math.floor.call(null,c):Math.ceil.a?Math.ceil.a(c):Math.ceil.call(null,c)}
function pd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function qd(a){var b=1;for(a=E(a);;)if(a&&0<b)b-=1,a=J(a);else return a}
var A=function(){function a(a){return null==a?"":ja(a)}var b=null,c=function(){function a(b,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new G(k,0)}return c.call(this,b,h)}function c(a,d){for(var e=new na(b.a(a)),k=d;;)if(v(k))e=e.append(b.a(H(k))),k=J(k);else return e.toString()}a.l=1;a.g=function(a){var b=H(a);a=I(a);return c(b,a)};a.d=c;return a}(),b=function(b,e){switch(arguments.length){case 0:return"";case 1:return a.call(this,
b);default:var f=null;if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new G(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.g=c.g;b.k=function(){return""};b.a=a;b.d=c.d;return b}();function Hc(a,b){var c;if(Xc(b))if(Cc(a)&&Cc(b)&&P(a)!==P(b))c=!1;else a:{c=E(a);for(var d=E(b);;){if(null==c){c=null==d;break a}if(null!=d&&pc.b(H(c),H(d)))c=J(c),d=J(d);else{c=!1;break a}}c=void 0}else c=null;return fd(c)}
function rd(a){var b=0;for(a=E(a);;)if(a){var c=H(a),b=(b+(jc(function(){var a=c;return sd.a?sd.a(a):sd.call(null,a)}())^jc(function(){var a=c;return td.a?td.a(a):td.call(null,a)}())))%4503599627370496;a=J(a)}else return b}function ud(a,b,c,d,e){this.p=a;this.first=b;this.Ha=c;this.count=d;this.o=e;this.j=65937646;this.q=8192}m=ud.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};m.la=function(){return 1===this.count?null:this.Ha};m.P=function(){return this.count};
m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return vb(oc,this.p)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return this.first};m.pa=function(){return 1===this.count?oc:this.Ha};m.M=function(){return this};m.D=function(a,b){return new ud(b,this.first,this.Ha,this.count,this.o)};m.O=function(a,b){return new ud(this.p,b,this,this.count+1,null)};ud.prototype[Ja]=function(){return rc(this)};
function vd(a){this.p=a;this.j=65937614;this.q=8192}m=vd.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};m.la=function(){return null};m.P=function(){return 0};m.C=function(){return uc};m.B=function(a,b){return Hc(this,b)};m.V=function(){return this};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return null};m.pa=function(){return oc};m.M=function(){return null};m.D=function(a,b){return new vd(b)};
m.O=function(a,b){return new ud(this.p,b,null,1,null)};var oc=new vd(null);vd.prototype[Ja]=function(){return rc(this)};function wd(a){return(a?a.j&134217728||a.zd||(a.j?0:x(Db,a)):x(Db,a))?Eb(a):Oa.c(Mc,oc,a)}
var xd=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){var b;if(a instanceof G&&0===a.n)b=a.e;else a:{for(b=[];;)if(null!=a)b.push(a.W(null)),a=a.la(null);else break a;b=void 0}a=b.length;for(var e=oc;;)if(0<a){var f=a-1,e=e.O(null,b[a-1]);a=f}else return e}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}();
function yd(a,b,c,d){this.p=a;this.first=b;this.Ha=c;this.o=d;this.j=65929452;this.q=8192}m=yd.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};m.la=function(){return null==this.Ha?null:E(this.Ha)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.p)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return this.first};
m.pa=function(){return null==this.Ha?oc:this.Ha};m.M=function(){return this};m.D=function(a,b){return new yd(b,this.first,this.Ha,this.o)};m.O=function(a,b){return new yd(null,b,this,this.o)};yd.prototype[Ja]=function(){return rc(this)};function L(a,b){var c=null==b;return(c?c:b&&(b.j&64||b.jb))?new yd(null,a,b,null):new yd(null,a,E(b),null)}
function zd(a,b){if(a.ra===b.ra)return 0;var c=Ga(a.na);if(v(c?b.na:c))return-1;if(v(a.na)){if(Ga(b.na))return 1;c=ra(a.na,b.na);return 0===c?ra(a.name,b.name):c}return ra(a.name,b.name)}function T(a,b,c,d){this.na=a;this.name=b;this.ra=c;this.Va=d;this.j=2153775105;this.q=4096}m=T.prototype;m.v=function(a,b){return Fb(b,[A(":"),A(this.ra)].join(""))};m.hb=function(){return this.name};m.ib=function(){return this.na};m.C=function(){var a=this.Va;return null!=a?a:this.Va=a=kc(this)+2654435769|0};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return R.b(c,this);case 3:return R.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return R.b(c,this)};a.c=function(a,c,d){return R.c(c,this,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return R.b(a,this)};m.b=function(a,b){return R.c(a,this,b)};m.B=function(a,b){return b instanceof T?this.ra===b.ra:!1};
m.toString=function(){return[A(":"),A(this.ra)].join("")};function Ad(a,b){return a===b?!0:a instanceof T&&b instanceof T?a.ra===b.ra:!1}
var Cd=function(){function a(a,b){return new T(a,b,[A(v(a)?[A(a),A("/")].join(""):null),A(b)].join(""),null)}function b(a){if(a instanceof T)return a;if(a instanceof mc){var b;if(a&&(a.q&4096||a.ad))b=a.ib(null);else throw Error([A("Doesn't support namespace: "),A(a)].join(""));return new T(b,Bd.a?Bd.a(a):Bd.call(null,a),a.str,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new T(b[0],b[1],a,null):new T(null,b[0],a,null)):null}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function Dd(a,b,c,d){this.p=a;this.bb=b;this.K=c;this.o=d;this.q=0;this.j=32374988}m=Dd.prototype;m.toString=function(){return bc(this)};function Ed(a){null!=a.bb&&(a.K=a.bb.k?a.bb.k():a.bb.call(null),a.bb=null);return a.K}m.A=function(){return this.p};m.la=function(){Bb(this);return null==this.K?null:J(this.K)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};
m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.p)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){Bb(this);return null==this.K?null:H(this.K)};m.pa=function(){Bb(this);return null!=this.K?I(this.K):oc};m.M=function(){Ed(this);if(null==this.K)return null;for(var a=this.K;;)if(a instanceof Dd)a=Ed(a);else return this.K=a,E(this.K)};m.D=function(a,b){return new Dd(b,this.bb,this.K,this.o)};m.O=function(a,b){return L(b,this)};
Dd.prototype[Ja]=function(){return rc(this)};function Fd(a,b){this.H=a;this.end=b;this.q=0;this.j=2}Fd.prototype.P=function(){return this.end};Fd.prototype.add=function(a){this.H[this.end]=a;return this.end+=1};Fd.prototype.U=function(){var a=new Gd(this.H,0,this.end);this.H=null;return a};function Hd(a){return new Fd(Array(a),0)}function Gd(a,b,c){this.e=a;this.ka=b;this.end=c;this.q=0;this.j=524306}m=Gd.prototype;m.ia=function(a,b){return Bc.i(this.e,b,this.e[this.ka],this.ka+1)};
m.ja=function(a,b,c){return Bc.i(this.e,b,c,this.ka)};m.Ub=function(){if(this.ka===this.end)throw Error("-drop-first of empty chunk");return new Gd(this.e,this.ka+1,this.end)};m.t=function(a,b){return this.e[this.ka+b]};m.ta=function(a,b,c){return 0<=b&&b<this.end-this.ka?this.e[this.ka+b]:c};m.P=function(){return this.end-this.ka};
var Id=function(){function a(a,b,c){return new Gd(a,b,c)}function b(a,b){return new Gd(a,b,a.length)}function c(a){return new Gd(a,0,a.length)}var d=null,d=function(d,f,g){switch(arguments.length){case 1:return c.call(this,d);case 2:return b.call(this,d,f);case 3:return a.call(this,d,f,g)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.b=b;d.c=a;return d}();function Jd(a,b,c,d){this.U=a;this.Ea=b;this.p=c;this.o=d;this.j=31850732;this.q=1536}m=Jd.prototype;m.toString=function(){return bc(this)};
m.A=function(){return this.p};m.la=function(){if(1<Sa(this.U))return new Jd(Rb(this.U),this.Ea,this.p,null);var a=Bb(this.Ea);return null==a?null:a};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.p)};m.W=function(){return C.b(this.U,0)};m.pa=function(){return 1<Sa(this.U)?new Jd(Rb(this.U),this.Ea,this.p,null):null==this.Ea?oc:this.Ea};m.M=function(){return this};m.Jb=function(){return this.U};
m.Kb=function(){return null==this.Ea?oc:this.Ea};m.D=function(a,b){return new Jd(this.U,this.Ea,b,this.o)};m.O=function(a,b){return L(b,this)};m.Ib=function(){return null==this.Ea?null:this.Ea};Jd.prototype[Ja]=function(){return rc(this)};function Kd(a,b){return 0===Sa(a)?b:new Jd(a,b,null,null)}function Ld(a,b){a.add(b)}function Md(a){for(var b=[];;)if(E(a))b.push(H(a)),a=J(a);else return b}function Nd(a,b){if(Cc(a))return P(a);for(var c=a,d=b,e=0;;)if(0<d&&E(c))c=J(c),d-=1,e+=1;else return e}
var Pd=function Od(b){return null==b?null:null==J(b)?E(H(b)):L(H(b),Od(J(b)))},Qd=function(){function a(a,b){return new Dd(null,function(){var c=E(a);return c?$c(c)?Kd(Sb(c),d.b(Tb(c),b)):L(H(c),d.b(I(c),b)):b},null,null)}function b(a){return new Dd(null,function(){return a},null,null)}function c(){return new Dd(null,function(){return null},null,null)}var d=null,e=function(){function a(c,d,e){var f=null;if(2<arguments.length){for(var f=0,p=Array(arguments.length-2);f<p.length;)p[f]=arguments[f+2],
++f;f=new G(p,0)}return b.call(this,c,d,f)}function b(a,c,e){return function p(a,b){return new Dd(null,function(){var c=E(a);return c?$c(c)?Kd(Sb(c),p(Tb(c),b)):L(H(c),p(I(c),b)):v(b)?p(H(b),J(b)):null},null,null)}(d.b(a,c),e)}a.l=2;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=I(a);return b(c,d,a)};a.d=b;return a}(),d=function(d,g,h){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,d);case 2:return a.call(this,d,g);default:var k=null;if(2<arguments.length){for(var k=
0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return e.d(d,g,k)}throw Error("Invalid arity: "+arguments.length);};d.l=2;d.g=e.g;d.k=c;d.a=b;d.b=a;d.d=e.d;return d}(),Sd=function(){function a(a,b,c,d){return L(a,L(b,L(c,d)))}function b(a,b,c){return L(a,L(b,c))}var c=null,d=function(){function a(c,d,e,l,n){var p=null;if(4<arguments.length){for(var p=0,q=Array(arguments.length-4);p<q.length;)q[p]=arguments[p+4],++p;p=new G(q,0)}return b.call(this,c,d,e,l,p)}function b(a,
c,d,e,f){return L(a,L(c,L(d,L(e,Pd(f)))))}a.l=4;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var n=H(a);a=I(a);return b(c,d,e,n,a)};a.d=b;return a}(),c=function(c,f,g,h,k){switch(arguments.length){case 1:return E(c);case 2:return L(c,f);case 3:return b.call(this,c,f,g);case 4:return a.call(this,c,f,g,h);default:var l=null;if(4<arguments.length){for(var l=0,n=Array(arguments.length-4);l<n.length;)n[l]=arguments[l+4],++l;l=new G(n,0)}return d.d(c,f,g,h,l)}throw Error("Invalid arity: "+
arguments.length);};c.l=4;c.g=d.g;c.a=function(a){return E(a)};c.b=function(a,b){return L(a,b)};c.c=b;c.i=a;c.d=d.d;return c}();function Td(a){return Ob(a)}
var Ud=function(){function a(){return Lb(Lc)}var b=null,c=function(){function a(c,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return b.call(this,c,d,k)}function b(a,c,d){for(;;)if(a=Nb(a,c),v(d))c=H(d),d=J(d);else return a}a.l=2;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=I(a);return b(c,d,a)};a.d=b;return a}(),b=function(b,e,f){switch(arguments.length){case 0:return a.call(this);case 1:return b;case 2:return Nb(b,
e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.k=a;b.a=function(a){return a};b.b=function(a,b){return Nb(a,b)};b.d=c.d;return b}(),Vd=function(){var a=null,b=function(){function a(c,f,g,h){var k=null;if(3<arguments.length){for(var k=0,l=Array(arguments.length-3);k<l.length;)l[k]=arguments[k+3],++k;k=new G(l,0)}return b.call(this,
c,f,g,k)}function b(a,c,d,h){for(;;)if(a=Pb(a,c,d),v(h))c=H(h),d=H(J(h)),h=J(J(h));else return a}a.l=3;a.g=function(a){var c=H(a);a=J(a);var g=H(a);a=J(a);var h=H(a);a=I(a);return b(c,g,h,a)};a.d=b;return a}(),a=function(a,d,e,f){switch(arguments.length){case 3:return Pb(a,d,e);default:var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new G(h,0)}return b.d(a,d,e,g)}throw Error("Invalid arity: "+arguments.length);};a.l=3;a.g=b.g;a.c=function(a,
b,e){return Pb(a,b,e)};a.d=b.d;return a}();
function Wd(a,b,c){var d=E(c);if(0===b)return a.k?a.k():a.call(null);c=Ya(d);var e=Za(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Ya(e),f=Za(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Ya(f),g=Za(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Ya(g),h=Za(g);if(4===b)return a.i?a.i(c,d,e,f):a.i?a.i(c,d,e,f):a.call(null,c,d,e,f);var g=Ya(h),k=Za(h);if(5===b)return a.r?a.r(c,d,e,f,g):a.r?a.r(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=Ya(k),
l=Za(k);if(6===b)return a.u?a.u(c,d,e,f,g,h):a.u?a.u(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var k=Ya(l),n=Za(l);if(7===b)return a.L?a.L(c,d,e,f,g,h,k):a.L?a.L(c,d,e,f,g,h,k):a.call(null,c,d,e,f,g,h,k);var l=Ya(n),p=Za(n);if(8===b)return a.S?a.S(c,d,e,f,g,h,k,l):a.S?a.S(c,d,e,f,g,h,k,l):a.call(null,c,d,e,f,g,h,k,l);var n=Ya(p),q=Za(p);if(9===b)return a.ha?a.ha(c,d,e,f,g,h,k,l,n):a.ha?a.ha(c,d,e,f,g,h,k,l,n):a.call(null,c,d,e,f,g,h,k,l,n);var p=Ya(q),r=Za(q);if(10===b)return a.X?a.X(c,d,e,f,g,h,k,l,
n,p):a.X?a.X(c,d,e,f,g,h,k,l,n,p):a.call(null,c,d,e,f,g,h,k,l,n,p);var q=Ya(r),s=Za(r);if(11===b)return a.Y?a.Y(c,d,e,f,g,h,k,l,n,p,q):a.Y?a.Y(c,d,e,f,g,h,k,l,n,p,q):a.call(null,c,d,e,f,g,h,k,l,n,p,q);var r=Ya(s),w=Za(s);if(12===b)return a.Z?a.Z(c,d,e,f,g,h,k,l,n,p,q,r):a.Z?a.Z(c,d,e,f,g,h,k,l,n,p,q,r):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r);var s=Ya(w),z=Za(w);if(13===b)return a.$?a.$(c,d,e,f,g,h,k,l,n,p,q,r,s):a.$?a.$(c,d,e,f,g,h,k,l,n,p,q,r,s):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s);var w=Ya(z),B=
Za(z);if(14===b)return a.aa?a.aa(c,d,e,f,g,h,k,l,n,p,q,r,s,w):a.aa?a.aa(c,d,e,f,g,h,k,l,n,p,q,r,s,w):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w);var z=Ya(B),F=Za(B);if(15===b)return a.ba?a.ba(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):a.ba?a.ba(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z);var B=Ya(F),N=Za(F);if(16===b)return a.ca?a.ca(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):a.ca?a.ca(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B);var F=Ya(N),O=Za(N);if(17===b)return a.da?
a.da(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):a.da?a.da(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F);var N=Ya(O),aa=Za(O);if(18===b)return a.ea?a.ea(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N):a.ea?a.ea(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N);O=Ya(aa);aa=Za(aa);if(19===b)return a.fa?a.fa(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O):a.fa?a.fa(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O);var D=
Ya(aa);Za(aa);if(20===b)return a.ga?a.ga(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O,D):a.ga?a.ga(c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O,D):a.call(null,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O,D);throw Error("Only up to 20 arguments supported on functions");}
var S=function(){function a(a,b,c,d,e){b=Sd.i(b,c,d,e);c=a.l;return a.g?(d=Nd(b,c+1),d<=c?Wd(a,d,b):a.g(b)):a.apply(a,Md(b))}function b(a,b,c,d){b=Sd.c(b,c,d);c=a.l;return a.g?(d=Nd(b,c+1),d<=c?Wd(a,d,b):a.g(b)):a.apply(a,Md(b))}function c(a,b,c){b=Sd.b(b,c);c=a.l;if(a.g){var d=Nd(b,c+1);return d<=c?Wd(a,d,b):a.g(b)}return a.apply(a,Md(b))}function d(a,b){var c=a.l;if(a.g){var d=Nd(b,c+1);return d<=c?Wd(a,d,b):a.g(b)}return a.apply(a,Md(b))}var e=null,f=function(){function a(c,d,e,f,g,r){var s=null;
if(5<arguments.length){for(var s=0,w=Array(arguments.length-5);s<w.length;)w[s]=arguments[s+5],++s;s=new G(w,0)}return b.call(this,c,d,e,f,g,s)}function b(a,c,d,e,f,g){c=L(c,L(d,L(e,L(f,Pd(g)))));d=a.l;return a.g?(e=Nd(c,d+1),e<=d?Wd(a,e,c):a.g(c)):a.apply(a,Md(c))}a.l=5;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=J(a);var g=H(a);a=I(a);return b(c,d,e,f,g,a)};a.d=b;return a}(),e=function(e,h,k,l,n,p){switch(arguments.length){case 2:return d.call(this,e,h);case 3:return c.call(this,
e,h,k);case 4:return b.call(this,e,h,k,l);case 5:return a.call(this,e,h,k,l,n);default:var q=null;if(5<arguments.length){for(var q=0,r=Array(arguments.length-5);q<r.length;)r[q]=arguments[q+5],++q;q=new G(r,0)}return f.d(e,h,k,l,n,q)}throw Error("Invalid arity: "+arguments.length);};e.l=5;e.g=f.g;e.b=d;e.c=c;e.i=b;e.r=a;e.d=f.d;return e}(),Xd=function(){function a(a,b){return!pc.b(a,b)}var b=null,c=function(){function a(c,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-
2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return b.call(this,c,d,k)}function b(a,c,d){return Ga(S.i(pc,a,c,d))}a.l=2;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=I(a);return b(c,d,a)};a.d=b;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return!1;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);
};b.l=2;b.g=c.g;b.a=function(){return!1};b.b=a;b.d=c.d;return b}();function Yd(a){return E(a)?a:null}function Zd(a,b){for(;;){if(null==E(b))return!0;var c;c=H(b);c=a.a?a.a(c):a.call(null,c);if(v(c)){c=a;var d=J(b);a=c;b=d}else return!1}}function $d(a){for(var b=kd;;)if(E(a)){var c;c=H(a);c=b.a?b.a(c):b.call(null,c);if(v(c))return c;a=J(a)}else return null}
function ae(a){return function(){function b(b,c){return Ga(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Ga(a.a?a.a(b):a.call(null,b))}function d(){return Ga(a.k?a.k():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new G(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ga(S.i(a,b,d,e))}b.l=2;b.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};b.d=c;
return b}(),e=function(a,e,k){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var l=null;if(2<arguments.length){for(var l=0,n=Array(arguments.length-2);l<n.length;)n[l]=arguments[l+2],++l;l=new G(n,0)}return f.d(a,e,l)}throw Error("Invalid arity: "+arguments.length);};e.l=2;e.g=f.g;e.k=d;e.a=c;e.b=b;e.d=f.d;return e}()}
function be(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.l=0;a.g=function(a){E(a);return!1};a.d=function(){return!1};return a}()}
var ce=function(){function a(a,b,c){return function(){function d(h,k,l){h=c.c?c.c(h,k,l):c.call(null,h,k,l);h=b.a?b.a(h):b.call(null,h);return a.a?a.a(h):a.call(null,h)}function k(d,h){var k;k=c.b?c.b(d,h):c.call(null,d,h);k=b.a?b.a(k):b.call(null,k);return a.a?a.a(k):a.call(null,k)}function l(d){d=c.a?c.a(d):c.call(null,d);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function n(){var d;d=c.k?c.k():c.call(null);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}var p=null,
q=function(){function d(a,b,c,e){var f=null;if(3<arguments.length){for(var f=0,g=Array(arguments.length-3);f<g.length;)g[f]=arguments[f+3],++f;f=new G(g,0)}return h.call(this,a,b,c,f)}function h(d,k,l,n){d=S.r(c,d,k,l,n);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}d.l=3;d.g=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var d=H(a);a=I(a);return h(b,c,d,a)};d.d=h;return d}(),p=function(a,b,c,e){switch(arguments.length){case 0:return n.call(this);case 1:return l.call(this,a);case 2:return k.call(this,
a,b);case 3:return d.call(this,a,b,c);default:var f=null;if(3<arguments.length){for(var f=0,g=Array(arguments.length-3);f<g.length;)g[f]=arguments[f+3],++f;f=new G(g,0)}return q.d(a,b,c,f)}throw Error("Invalid arity: "+arguments.length);};p.l=3;p.g=q.g;p.k=n;p.a=l;p.b=k;p.c=d;p.d=q.d;return p}()}function b(a,b){return function(){function c(d,g,h){d=b.c?b.c(d,g,h):b.call(null,d,g,h);return a.a?a.a(d):a.call(null,d)}function d(c,g){var h=b.b?b.b(c,g):b.call(null,c,g);return a.a?a.a(h):a.call(null,h)}
function k(c){c=b.a?b.a(c):b.call(null,c);return a.a?a.a(c):a.call(null,c)}function l(){var c=b.k?b.k():b.call(null);return a.a?a.a(c):a.call(null,c)}var n=null,p=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new G(h,0)}return d.call(this,a,b,e,g)}function d(c,g,h,k){c=S.r(b,c,g,h,k);return a.a?a.a(c):a.call(null,c)}c.l=3;c.g=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var e=H(a);a=I(a);return d(b,
c,e,a)};c.d=d;return c}(),n=function(a,b,e,f){switch(arguments.length){case 0:return l.call(this);case 1:return k.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,e);default:var n=null;if(3<arguments.length){for(var n=0,B=Array(arguments.length-3);n<B.length;)B[n]=arguments[n+3],++n;n=new G(B,0)}return p.d(a,b,e,n)}throw Error("Invalid arity: "+arguments.length);};n.l=3;n.g=p.g;n.k=l;n.a=k;n.b=d;n.c=c;n.d=p.d;return n}()}var c=null,d=function(){function a(c,d,e,l){var n=null;
if(3<arguments.length){for(var n=0,p=Array(arguments.length-3);n<p.length;)p[n]=arguments[n+3],++n;n=new G(p,0)}return b.call(this,c,d,e,n)}function b(a,c,d,e){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return c.call(this,d)}function c(b){b=S.b(H(a),b);for(var d=J(a);;)if(d)b=H(d).call(null,b),d=J(d);else return b}b.l=0;b.g=function(a){a=E(a);return c(a)};b.d=c;return b}()}(wd(Sd.i(a,
c,d,e)))}a.l=3;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=I(a);return b(c,d,e,a)};a.d=b;return a}(),c=function(c,f,g,h){switch(arguments.length){case 0:return kd;case 1:return c;case 2:return b.call(this,c,f);case 3:return a.call(this,c,f,g);default:var k=null;if(3<arguments.length){for(var k=0,l=Array(arguments.length-3);k<l.length;)l[k]=arguments[k+3],++k;k=new G(l,0)}return d.d(c,f,g,k)}throw Error("Invalid arity: "+arguments.length);};c.l=3;c.g=d.g;c.k=function(){return kd};
c.a=function(a){return a};c.b=b;c.c=a;c.d=d.d;return c}(),de=function(){function a(a,b,c,d){return function(){function e(l,n,p){return a.u?a.u(b,c,d,l,n,p):a.call(null,b,c,d,l,n,p)}function n(e,l){return a.r?a.r(b,c,d,e,l):a.call(null,b,c,d,e,l)}function p(e){return a.i?a.i(b,c,d,e):a.call(null,b,c,d,e)}function q(){return a.c?a.c(b,c,d):a.call(null,b,c,d)}var r=null,s=function(){function e(a,b,c,d){var f=null;if(3<arguments.length){for(var f=0,g=Array(arguments.length-3);f<g.length;)g[f]=arguments[f+
3],++f;f=new G(g,0)}return l.call(this,a,b,c,f)}function l(e,n,p,q){return S.d(a,b,c,d,e,M([n,p,q],0))}e.l=3;e.g=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var d=H(a);a=I(a);return l(b,c,d,a)};e.d=l;return e}(),r=function(a,b,c,d){switch(arguments.length){case 0:return q.call(this);case 1:return p.call(this,a);case 2:return n.call(this,a,b);case 3:return e.call(this,a,b,c);default:var f=null;if(3<arguments.length){for(var f=0,g=Array(arguments.length-3);f<g.length;)g[f]=arguments[f+3],++f;f=
new G(g,0)}return s.d(a,b,c,f)}throw Error("Invalid arity: "+arguments.length);};r.l=3;r.g=s.g;r.k=q;r.a=p;r.b=n;r.c=e;r.d=s.d;return r}()}function b(a,b,c){return function(){function d(e,k,l){return a.r?a.r(b,c,e,k,l):a.call(null,b,c,e,k,l)}function e(d,k){return a.i?a.i(b,c,d,k):a.call(null,b,c,d,k)}function n(d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function p(){return a.b?a.b(b,c):a.call(null,b,c)}var q=null,r=function(){function d(a,b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-
3);g<h.length;)h[g]=arguments[g+3],++g;g=new G(h,0)}return e.call(this,a,b,c,g)}function e(d,k,l,n){return S.d(a,b,c,d,k,M([l,n],0))}d.l=3;d.g=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var d=H(a);a=I(a);return e(b,c,d,a)};d.d=e;return d}(),q=function(a,b,c,f){switch(arguments.length){case 0:return p.call(this);case 1:return n.call(this,a);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c);default:var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=
arguments[g+3],++g;g=new G(h,0)}return r.d(a,b,c,g)}throw Error("Invalid arity: "+arguments.length);};q.l=3;q.g=r.g;q.k=p;q.a=n;q.b=e;q.c=d;q.d=r.d;return q}()}function c(a,b){return function(){function c(d,e,h){return a.i?a.i(b,d,e,h):a.call(null,b,d,e,h)}function d(c,e){return a.c?a.c(b,c,e):a.call(null,b,c,e)}function e(c){return a.b?a.b(b,c):a.call(null,b,c)}function n(){return a.a?a.a(b):a.call(null,b)}var p=null,q=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,
h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new G(h,0)}return d.call(this,a,b,e,g)}function d(c,e,h,k){return S.d(a,b,c,e,h,M([k],0))}c.l=3;c.g=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var e=H(a);a=I(a);return d(b,c,e,a)};c.d=d;return c}(),p=function(a,b,f,g){switch(arguments.length){case 0:return n.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,f);default:var p=null;if(3<arguments.length){for(var p=0,F=Array(arguments.length-
3);p<F.length;)F[p]=arguments[p+3],++p;p=new G(F,0)}return q.d(a,b,f,p)}throw Error("Invalid arity: "+arguments.length);};p.l=3;p.g=q.g;p.k=n;p.a=e;p.b=d;p.c=c;p.d=q.d;return p}()}var d=null,e=function(){function a(c,d,e,f,p){var q=null;if(4<arguments.length){for(var q=0,r=Array(arguments.length-4);q<r.length;)r[q]=arguments[q+4],++q;q=new G(r,0)}return b.call(this,c,d,e,f,q)}function b(a,c,d,e,f){return function(){function b(a){var c=null;if(0<arguments.length){for(var c=0,d=Array(arguments.length-
0);c<d.length;)d[c]=arguments[c+0],++c;c=new G(d,0)}return g.call(this,c)}function g(b){return S.r(a,c,d,e,Qd.b(f,b))}b.l=0;b.g=function(a){a=E(a);return g(a)};b.d=g;return b}()}a.l=4;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),d=function(d,g,h,k,l){switch(arguments.length){case 1:return d;case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k);default:var n=null;if(4<arguments.length){for(var n=
0,p=Array(arguments.length-4);n<p.length;)p[n]=arguments[n+4],++n;n=new G(p,0)}return e.d(d,g,h,k,n)}throw Error("Invalid arity: "+arguments.length);};d.l=4;d.g=e.g;d.a=function(a){return a};d.b=c;d.c=b;d.i=a;d.d=e.d;return d}();function ee(a,b,c,d){this.state=a;this.p=b;this.ud=c;this.cb=d;this.j=6455296;this.q=16386}m=ee.prototype;m.C=function(){return this[ca]||(this[ca]=++ea)};
m.$b=function(a,b,c){for(var d=E(this.cb),e=null,f=0,g=0;;)if(g<f){a=e.t(null,g);var h=Q.c(a,0,null);a=Q.c(a,1,null);var k=b,l=c;a.i?a.i(h,this,k,l):a.call(null,h,this,k,l);g+=1}else if(a=E(d))d=a,$c(d)?(e=Sb(d),d=Tb(d),a=e,f=P(e),e=a):(a=H(d),h=Q.c(a,0,null),a=Q.c(a,1,null),e=h,f=b,g=c,a.i?a.i(e,this,f,g):a.call(null,e,this,f,g),d=J(d),e=null,f=0),g=0;else return null};m.Zb=function(a,b,c){this.cb=Pc.c(this.cb,b,c);return this};m.ac=function(a,b){return this.cb=Qc.b(this.cb,b)};m.A=function(){return this.p};
m.Wa=function(){return this.state};m.B=function(a,b){return this===b};
var V=function(){function a(a){return new ee(a,null,null,null)}var b=null,c=function(){function a(c,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new G(k,0)}return b.call(this,c,h)}function b(a,c){var d=ed(c)?S.b(fe,c):c,e=R.b(d,ge),d=R.b(d,Ba);return new ee(a,d,e,null)}a.l=1;a.g=function(a){var c=H(a);a=I(a);return b(c,a)};a.d=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:var f=null;
if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new G(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.g=c.g;b.a=a;b.d=c.d;return b}();
function he(a,b){if(a instanceof ee){var c=a.ud;if(null!=c&&!v(c.a?c.a(b):c.call(null,b)))throw Error([A("Assert failed: "),A("Validator rejected reference state"),A("\n"),A(function(){var a=xd(new mc(null,"validate","validate",1439230700,null),new mc(null,"new-value","new-value",-1567397401,null));return ie.a?ie.a(a):ie.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.cb&&Ib(a,c,b);return b}return Xb(a,b)}
var je=function(){function a(a,b,c,d){if(a instanceof ee){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=he(a,b)}else a=Yb.i(a,b,c,d);return a}function b(a,b,c){if(a instanceof ee){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=he(a,b)}else a=Yb.c(a,b,c);return a}function c(a,b){var c;a instanceof ee?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=he(a,c)):c=Yb.b(a,b);return c}var d=null,e=function(){function a(c,d,e,f,p){var q=null;if(4<arguments.length){for(var q=0,r=Array(arguments.length-4);q<
r.length;)r[q]=arguments[q+4],++q;q=new G(r,0)}return b.call(this,c,d,e,f,q)}function b(a,c,d,e,f){return a instanceof ee?he(a,S.r(c,a.state,d,e,f)):Yb.r(a,c,d,e,f)}a.l=4;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),d=function(d,g,h,k,l){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k);default:var n=null;if(4<arguments.length){for(var n=0,p=Array(arguments.length-
4);n<p.length;)p[n]=arguments[n+4],++n;n=new G(p,0)}return e.d(d,g,h,k,n)}throw Error("Invalid arity: "+arguments.length);};d.l=4;d.g=e.g;d.b=c;d.c=b;d.i=a;d.d=e.d;return d}();function ke(a){this.state=a;this.q=0;this.j=32768}ke.prototype.Wa=function(){return this.state};ke.prototype.Pb=function(a,b){return this.state=b};
var le=function(){function a(a,b,c,d){return new Dd(null,function(){var f=E(b),p=E(c),q=E(d);if(f&&p&&q){var r=L,s;s=H(f);var w=H(p),z=H(q);s=a.c?a.c(s,w,z):a.call(null,s,w,z);f=r(s,e.i(a,I(f),I(p),I(q)))}else f=null;return f},null,null)}function b(a,b,c){return new Dd(null,function(){var d=E(b),f=E(c);if(d&&f){var p=L,q;q=H(d);var r=H(f);q=a.b?a.b(q,r):a.call(null,q,r);d=p(q,e.c(a,I(d),I(f)))}else d=null;return d},null,null)}function c(a,b){return new Dd(null,function(){var c=E(b);if(c){if($c(c)){for(var d=
Sb(c),f=P(d),p=Hd(f),q=0;;)if(q<f)Ld(p,function(){var b=C.b(d,q);return a.a?a.a(b):a.call(null,b)}()),q+=1;else break;return Kd(p.U(),e.b(a,Tb(c)))}return L(function(){var b=H(c);return a.a?a.a(b):a.call(null,b)}(),e.b(a,I(c)))}return null},null,null)}function d(a){return function(b){return function(){function c(d,e){var f=a.a?a.a(e):a.call(null,e);return b.b?b.b(d,f):b.call(null,d,f)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.k?b.k():b.call(null)}var f=null,q=function(){function c(a,
b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new G(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=S.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.l=2;c.g=function(a){var b=H(a);a=J(a);var c=H(a);a=I(a);return d(b,c,a)};c.d=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var g=null;if(2<arguments.length){for(var g=0,h=
Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return q.d(a,b,g)}throw Error("Invalid arity: "+arguments.length);};f.l=2;f.g=q.g;f.k=e;f.a=d;f.b=c;f.d=q.d;return f}()}}var e=null,f=function(){function a(c,d,e,f,g){var r=null;if(4<arguments.length){for(var r=0,s=Array(arguments.length-4);r<s.length;)s[r]=arguments[r+4],++r;r=new G(s,0)}return b.call(this,c,d,e,f,r)}function b(a,c,d,f,g){var h=function w(a){return new Dd(null,function(){var b=e.b(E,a);return Zd(kd,b)?L(e.b(H,
b),w(e.b(I,b))):null},null,null)};return e.b(function(){return function(b){return S.b(a,b)}}(h),h(Mc.d(g,f,M([d,c],0))))}a.l=4;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),e=function(e,h,k,l,n){switch(arguments.length){case 1:return d.call(this,e);case 2:return c.call(this,e,h);case 3:return b.call(this,e,h,k);case 4:return a.call(this,e,h,k,l);default:var p=null;if(4<arguments.length){for(var p=0,q=Array(arguments.length-
4);p<q.length;)q[p]=arguments[p+4],++p;p=new G(q,0)}return f.d(e,h,k,l,p)}throw Error("Invalid arity: "+arguments.length);};e.l=4;e.g=f.g;e.a=d;e.b=c;e.c=b;e.i=a;e.d=f.d;return e}(),me=function(){function a(a,b){return new Dd(null,function(){if(0<a){var f=E(b);return f?L(H(f),c.b(a-1,I(f))):null}return null},null,null)}function b(a){return function(b){return function(a){return function(){function c(d,g){var h=rb(a),k=a.Pb(0,a.Wa(null)-1),h=0<h?b.b?b.b(d,g):b.call(null,d,g):d;return 0<k?h:zc(h)?h:
new yc(h)}function d(a){return b.a?b.a(a):b.call(null,a)}function k(){return b.k?b.k():b.call(null)}var l=null,l=function(a,b){switch(arguments.length){case 0:return k.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};l.k=k;l.a=d;l.b=c;return l}()}(new ke(a))}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=
a;return c}(),ne=function(){function a(a,b){return new Dd(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var c=E(b),d;if(d=c)d=H(c),d=a.a?a.a(d):a.call(null,d);if(v(d))d=a,c=I(c),a=d,b=c;else return c}}),null,null)}function b(a){return function(b){return function(c){return function(){function g(g,h){var k=rb(c);if(v(v(k)?a.a?a.a(h):a.call(null,h):k))return g;Zb(c,null);return b.b?b.b(g,h):b.call(null,g,h)}function h(a){return b.a?b.a(a):b.call(null,a)}function k(){return b.k?
b.k():b.call(null)}var l=null,l=function(a,b){switch(arguments.length){case 0:return k.call(this);case 1:return h.call(this,a);case 2:return g.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};l.k=k;l.a=h;l.b=g;return l}()}(new ke(!0))}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),oe=function(){function a(a,b){return me.b(a,c.a(b))}function b(a){return new Dd(null,
function(){return L(a,c.a(a))},null,null)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),re=function(){function a(a){return ce.b(le.a(a),qe)}var b=null,c=function(){function a(c,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new G(k,0)}return b.call(this,c,h)}function b(a,c){return S.b(Qd,S.c(le,
a,c))}a.l=1;a.g=function(a){var c=H(a);a=I(a);return b(c,a)};a.d=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:var f=null;if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new G(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.g=c.g;b.a=a;b.d=c.d;return b}(),se=function(){function a(a,b){return new Dd(null,function(){var f=E(b);if(f){if($c(f)){for(var g=Sb(f),h=P(g),k=Hd(h),
l=0;;)if(l<h){var n;n=C.b(g,l);n=a.a?a.a(n):a.call(null,n);v(n)&&(n=C.b(g,l),k.add(n));l+=1}else break;return Kd(k.U(),c.b(a,Tb(f)))}g=H(f);f=I(f);return v(a.a?a.a(g):a.call(null,g))?L(g,c.b(a,f)):c.b(a,f)}return null},null,null)}function b(a){return function(b){return function(){function c(f,g){return v(a.a?a.a(g):a.call(null,g))?b.b?b.b(f,g):b.call(null,f,g):f}function g(a){return b.a?b.a(a):b.call(null,a)}function h(){return b.k?b.k():b.call(null)}var k=null,k=function(a,b){switch(arguments.length){case 0:return h.call(this);
case 1:return g.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};k.k=h;k.a=g;k.b=c;return k}()}}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),te=function(){function a(a,b){return se.b(ae(a),b)}function b(a){return se.a(ae(a))}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,
c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),ue=function(){function a(a,b,c){return a&&(a.q&4||a.Uc)?Jc(Td(ld.i(b,Ud,Lb(a),c)),Tc(a)):ld.i(b,Mc,a,c)}function b(a,b){return null!=a?a&&(a.q&4||a.Uc)?Jc(Td(Oa.c(Nb,Lb(a),b)),Tc(a)):Oa.c(Va,a,b):Oa.c(Mc,oc,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),ve=function(){function a(a,
b,c,d){return ue.b(Lc,le.i(a,b,c,d))}function b(a,b,c){return ue.b(Lc,le.c(a,b,c))}function c(a,b){return Td(Oa.c(function(b,c){return Ud.b(b,a.a?a.a(c):a.call(null,c))},Lb(Lc),b))}var d=null,e=function(){function a(c,d,e,f,p){var q=null;if(4<arguments.length){for(var q=0,r=Array(arguments.length-4);q<r.length;)r[q]=arguments[q+4],++q;q=new G(r,0)}return b.call(this,c,d,e,f,q)}function b(a,c,d,e,f){return ue.b(Lc,S.d(le,a,c,d,e,M([f],0)))}a.l=4;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);
var e=H(a);a=J(a);var f=H(a);a=I(a);return b(c,d,e,f,a)};a.d=b;return a}(),d=function(d,g,h,k,l){switch(arguments.length){case 2:return c.call(this,d,g);case 3:return b.call(this,d,g,h);case 4:return a.call(this,d,g,h,k);default:var n=null;if(4<arguments.length){for(var n=0,p=Array(arguments.length-4);n<p.length;)p[n]=arguments[n+4],++n;n=new G(p,0)}return e.d(d,g,h,k,n)}throw Error("Invalid arity: "+arguments.length);};d.l=4;d.g=e.g;d.b=c;d.c=b;d.i=a;d.d=e.d;return d}();
function we(a,b){return Td(Oa.c(function(b,d){return v(a.a?a.a(d):a.call(null,d))?Ud.b(b,d):b},Lb(Lc),b))}
var xe=function(){function a(a,b,c){var g=dd;for(b=E(b);;)if(b){var h=a;if(h?h.j&256||h.Wb||(h.j?0:x(ab,h)):x(ab,h)){a=R.c(a,H(b),g);if(g===a)return c;b=J(b)}else return c}else return a}function b(a,b){return c.c(a,b,null)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),ze=function ye(b,c,d){var e=Q.c(c,0,null);return(c=qd(c))?Pc.c(b,e,ye(R.b(b,e),c,d)):Pc.c(b,
e,d)},Ae=function(){function a(a,b,c,d,f,p){var q=Q.c(b,0,null);return(b=qd(b))?Pc.c(a,q,e.u(R.b(a,q),b,c,d,f,p)):Pc.c(a,q,function(){var b=R.b(a,q);return c.i?c.i(b,d,f,p):c.call(null,b,d,f,p)}())}function b(a,b,c,d,f){var p=Q.c(b,0,null);return(b=qd(b))?Pc.c(a,p,e.r(R.b(a,p),b,c,d,f)):Pc.c(a,p,function(){var b=R.b(a,p);return c.c?c.c(b,d,f):c.call(null,b,d,f)}())}function c(a,b,c,d){var f=Q.c(b,0,null);return(b=qd(b))?Pc.c(a,f,e.i(R.b(a,f),b,c,d)):Pc.c(a,f,function(){var b=R.b(a,f);return c.b?c.b(b,
d):c.call(null,b,d)}())}function d(a,b,c){var d=Q.c(b,0,null);return(b=qd(b))?Pc.c(a,d,e.c(R.b(a,d),b,c)):Pc.c(a,d,function(){var b=R.b(a,d);return c.a?c.a(b):c.call(null,b)}())}var e=null,f=function(){function a(c,d,e,f,g,r,s){var w=null;if(6<arguments.length){for(var w=0,z=Array(arguments.length-6);w<z.length;)z[w]=arguments[w+6],++w;w=new G(z,0)}return b.call(this,c,d,e,f,g,r,w)}function b(a,c,d,f,g,h,s){var w=Q.c(c,0,null);return(c=qd(c))?Pc.c(a,w,S.d(e,R.b(a,w),c,d,f,M([g,h,s],0))):Pc.c(a,w,
S.d(d,R.b(a,w),f,g,h,M([s],0)))}a.l=6;a.g=function(a){var c=H(a);a=J(a);var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=J(a);var g=H(a);a=J(a);var s=H(a);a=I(a);return b(c,d,e,f,g,s,a)};a.d=b;return a}(),e=function(e,h,k,l,n,p,q){switch(arguments.length){case 3:return d.call(this,e,h,k);case 4:return c.call(this,e,h,k,l);case 5:return b.call(this,e,h,k,l,n);case 6:return a.call(this,e,h,k,l,n,p);default:var r=null;if(6<arguments.length){for(var r=0,s=Array(arguments.length-6);r<s.length;)s[r]=arguments[r+
6],++r;r=new G(s,0)}return f.d(e,h,k,l,n,p,r)}throw Error("Invalid arity: "+arguments.length);};e.l=6;e.g=f.g;e.c=d;e.i=c;e.r=b;e.u=a;e.d=f.d;return e}();function Be(a,b){this.G=a;this.e=b}function Ce(a){return new Be(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function De(a){a=a.m;return 32>a?0:a-1>>>5<<5}
function Ee(a,b,c){for(;;){if(0===b)return c;var d=Ce(a);d.e[0]=c;c=d;b-=5}}var Ge=function Fe(b,c,d,e){var f=new Be(d.G,Ka(d.e)),g=b.m-1>>>c&31;5===c?f.e[g]=e:(d=d.e[g],b=null!=d?Fe(b,c-5,d,e):Ee(null,c-5,e),f.e[g]=b);return f};function He(a,b){throw Error([A("No item "),A(a),A(" in vector of length "),A(b)].join(""));}function Ie(a,b){if(b>=De(a))return a.F;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.e[b>>>d&31],d=e;else return c.e}function Je(a,b){return 0<=b&&b<a.m?Ie(a,b):He(b,a.m)}
var Le=function Ke(b,c,d,e,f){var g=new Be(d.G,Ka(d.e));if(0===c)g.e[e&31]=f;else{var h=e>>>c&31;b=Ke(b,c-5,d.e[h],e,f);g.e[h]=b}return g};function Me(a,b,c,d,e,f){this.n=a;this.Gb=b;this.e=c;this.Ka=d;this.start=e;this.end=f}Me.prototype.Cb=function(){return this.n<this.end};Me.prototype.next=function(){32===this.n-this.Gb&&(this.e=Ie(this.Ka,this.n),this.Gb+=32);var a=this.e[this.n&31];this.n+=1;return a};
function W(a,b,c,d,e,f){this.p=a;this.m=b;this.shift=c;this.root=d;this.F=e;this.o=f;this.j=167668511;this.q=8196}m=W.prototype;m.toString=function(){return bc(this)};m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};m.t=function(a,b){return Je(this,b)[b&31]};m.ta=function(a,b,c){return 0<=b&&b<this.m?Ie(this,b)[b&31]:c};
m.Ob=function(a,b,c){if(0<=b&&b<this.m)return De(this)<=b?(a=Ka(this.F),a[b&31]=c,new W(this.p,this.m,this.shift,this.root,a,null)):new W(this.p,this.m,this.shift,Le(this,this.shift,this.root,b,c),this.F,null);if(b===this.m)return Va(this,c);throw Error([A("Index "),A(b),A(" out of bounds  [0,"),A(this.m),A("]")].join(""));};m.gb=function(){var a=this.m;return new Me(0,0,0<P(this)?Ie(this,0):null,this,0,a)};m.A=function(){return this.p};m.P=function(){return this.m};
m.Mb=function(){return C.b(this,0)};m.Nb=function(){return C.b(this,1)};m.wb=function(){return 0<this.m?new Gc(this,this.m-1,null):null};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){if(b instanceof W)if(this.m===P(b))for(var c=$b(this),d=$b(b);;)if(v(c.Cb())){var e=c.next(),f=d.next();if(!pc.b(e,f))return!1}else return!0;else return!1;else return Hc(this,b)};
m.Xa=function(){var a=this;return new Ne(a.m,a.shift,function(){var b=a.root;return Oe.a?Oe.a(b):Oe.call(null,b)}(),function(){var b=a.F;return Pe.a?Pe.a(b):Pe.call(null,b)}())};m.V=function(){return Jc(Lc,this.p)};m.ia=function(a,b){return Ac.b(this,b)};
m.ja=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=Ie(this,a);c=e.length;a:{for(var f=0;;)if(f<c){var g=e[f],d=b.b?b.b(d,g):b.call(null,d,g);if(zc(d)){e=d;break a}f+=1}else{e=d;break a}e=void 0}if(zc(e))return b=e,K.a?K.a(b):K.call(null,b);a+=c;d=e}else return d};m.Da=function(a,b,c){if("number"===typeof b)return qb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
m.M=function(){if(0===this.m)return null;if(32>=this.m)return new G(this.F,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.e[0];else{a=a.e;break a}a=void 0}return Qe.i?Qe.i(this,a,0,0):Qe.call(null,this,a,0,0)};m.D=function(a,b){return new W(b,this.m,this.shift,this.root,this.F,this.o)};
m.O=function(a,b){if(32>this.m-De(this)){for(var c=this.F.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.F[e],e+=1;else break;d[c]=b;return new W(this.p,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Ce(null),d.e[0]=this.root,e=Ee(null,this.shift,new Be(null,this.F)),d.e[1]=e):d=Ge(this,this.shift,this.root,new Be(null,this.F));return new W(this.p,this.m+1,c,d,[b],null)};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.t(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return this.t(null,a)};m.b=function(a,b){return this.ta(null,a,b)};
var Y=new Be(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Lc=new W(null,0,5,Y,[],uc);W.prototype[Ja]=function(){return rc(this)};
function Re(a){if(a instanceof Array)a:{var b=a.length;if(32>b)a=new W(null,b,5,Y,a,null);else{for(var c=32,d=(new W(null,32,5,Y,a.slice(0,32),null)).Xa(null);;)if(c<b)var e=c+1,d=Ud.b(d,a[c]),c=e;else{a=Ob(d);break a}a=void 0}}else a=Ob(Oa.c(Nb,Lb(Lc),a));return a}function Se(a,b,c,d,e,f){this.ya=a;this.Ga=b;this.n=c;this.ka=d;this.p=e;this.o=f;this.j=32375020;this.q=1536}m=Se.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};
m.la=function(){if(this.ka+1<this.Ga.length){var a;a=this.ya;var b=this.Ga,c=this.n,d=this.ka+1;a=Qe.i?Qe.i(a,b,c,d):Qe.call(null,a,b,c,d);return null==a?null:a}return Ub(this)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(Lc,this.p)};m.ia=function(a,b){var c=this;return Ac.b(function(){var a=c.ya,b=c.n+c.ka,f=P(c.ya);return af.c?af.c(a,b,f):af.call(null,a,b,f)}(),b)};
m.ja=function(a,b,c){var d=this;return Ac.c(function(){var a=d.ya,b=d.n+d.ka,c=P(d.ya);return af.c?af.c(a,b,c):af.call(null,a,b,c)}(),b,c)};m.W=function(){return this.Ga[this.ka]};m.pa=function(){if(this.ka+1<this.Ga.length){var a;a=this.ya;var b=this.Ga,c=this.n,d=this.ka+1;a=Qe.i?Qe.i(a,b,c,d):Qe.call(null,a,b,c,d);return null==a?oc:a}return Tb(this)};m.M=function(){return this};m.Jb=function(){return Id.b(this.Ga,this.ka)};
m.Kb=function(){var a=this.n+this.Ga.length;if(a<Sa(this.ya)){var b=this.ya,c=Ie(this.ya,a);return Qe.i?Qe.i(b,c,a,0):Qe.call(null,b,c,a,0)}return oc};m.D=function(a,b){var c=this.ya,d=this.Ga,e=this.n,f=this.ka;return Qe.r?Qe.r(c,d,e,f,b):Qe.call(null,c,d,e,f,b)};m.O=function(a,b){return L(b,this)};m.Ib=function(){var a=this.n+this.Ga.length;if(a<Sa(this.ya)){var b=this.ya,c=Ie(this.ya,a);return Qe.i?Qe.i(b,c,a,0):Qe.call(null,b,c,a,0)}return null};Se.prototype[Ja]=function(){return rc(this)};
var Qe=function(){function a(a,b,c,d,k){return new Se(a,b,c,d,k,null)}function b(a,b,c,d){return new Se(a,b,c,d,null,null)}function c(a,b,c){return new Se(a,Je(a,b),b,c,null,null)}var d=null,d=function(d,f,g,h,k){switch(arguments.length){case 3:return c.call(this,d,f,g);case 4:return b.call(this,d,f,g,h);case 5:return a.call(this,d,f,g,h,k)}throw Error("Invalid arity: "+arguments.length);};d.c=c;d.i=b;d.r=a;return d}();
function bf(a,b,c,d,e){this.p=a;this.Ka=b;this.start=c;this.end=d;this.o=e;this.j=166617887;this.q=8192}m=bf.prototype;m.toString=function(){return bc(this)};m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};m.t=function(a,b){return 0>b||this.end<=this.start+b?He(b,this.end-this.start):C.b(this.Ka,this.start+b)};m.ta=function(a,b,c){return 0>b||this.end<=this.start+b?c:C.c(this.Ka,this.start+b,c)};
m.Ob=function(a,b,c){var d=this.start+b;a=this.p;c=Pc.c(this.Ka,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return cf.r?cf.r(a,c,b,d,null):cf.call(null,a,c,b,d,null)};m.A=function(){return this.p};m.P=function(){return this.end-this.start};m.wb=function(){return this.start!==this.end?new Gc(this,this.end-this.start-1,null):null};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(Lc,this.p)};
m.ia=function(a,b){return Ac.b(this,b)};m.ja=function(a,b,c){return Ac.c(this,b,c)};m.Da=function(a,b,c){if("number"===typeof b)return qb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};m.M=function(){var a=this;return function(b){return function d(e){return e===a.end?null:L(C.b(a.Ka,e),new Dd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
m.D=function(a,b){var c=this.Ka,d=this.start,e=this.end,f=this.o;return cf.r?cf.r(b,c,d,e,f):cf.call(null,b,c,d,e,f)};m.O=function(a,b){var c=this.p,d=qb(this.Ka,this.end,b),e=this.start,f=this.end+1;return cf.r?cf.r(c,d,e,f,null):cf.call(null,c,d,e,f,null)};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.t(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.t(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return this.t(null,a)};m.b=function(a,b){return this.ta(null,a,b)};bf.prototype[Ja]=function(){return rc(this)};
function cf(a,b,c,d,e){for(;;)if(b instanceof bf)c=b.start+c,d=b.start+d,b=b.Ka;else{var f=P(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new bf(a,b,c,d,e)}}var af=function(){function a(a,b,c){return cf(null,a,b,c,null)}function b(a,b){return c.c(a,b,P(a))}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();
function df(a,b){return a===b.G?b:new Be(a,Ka(b.e))}function Oe(a){return new Be({},Ka(a.e))}function Pe(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];bd(a,0,b,0,a.length);return b}var ff=function ef(b,c,d,e){d=df(b.root.G,d);var f=b.m-1>>>c&31;if(5===c)b=e;else{var g=d.e[f];b=null!=g?ef(b,c-5,g,e):Ee(b.root.G,c-5,e)}d.e[f]=b;return d};
function Ne(a,b,c,d){this.m=a;this.shift=b;this.root=c;this.F=d;this.j=275;this.q=88}m=Ne.prototype;m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return this.J(null,a)};
m.b=function(a,b){return this.I(null,a,b)};m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};m.t=function(a,b){if(this.root.G)return Je(this,b)[b&31];throw Error("nth after persistent!");};m.ta=function(a,b,c){return 0<=b&&b<this.m?C.b(this,b):c};m.P=function(){if(this.root.G)return this.m;throw Error("count after persistent!");};
m.Yb=function(a,b,c){var d=this;if(d.root.G){if(0<=b&&b<d.m)return De(this)<=b?d.F[b&31]=c:(a=function(){return function f(a,h){var k=df(d.root.G,h);if(0===a)k.e[b&31]=c;else{var l=b>>>a&31,n=f(a-5,k.e[l]);k.e[l]=n}return k}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.m)return Nb(this,c);throw Error([A("Index "),A(b),A(" out of bounds for TransientVector of length"),A(d.m)].join(""));}throw Error("assoc! after persistent!");};
m.kb=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
m.Qa=function(a,b){if(this.root.G){if(32>this.m-De(this))this.F[this.m&31]=b;else{var c=new Be(this.root.G,this.F),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.F=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Ee(this.root.G,this.shift,c);this.root=new Be(this.root.G,d);this.shift=e}else this.root=ff(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};m.Ra=function(){if(this.root.G){this.root.G=null;var a=this.m-De(this),b=Array(a);bd(this.F,0,b,0,a);return new W(null,this.m,this.shift,this.root,b,null)}throw Error("persistent! called twice");};function gf(){this.q=0;this.j=2097152}gf.prototype.B=function(){return!1};var hf=new gf;
function jf(a,b){return fd(Yc(b)?P(a)===P(b)?Zd(kd,le.b(function(a){return pc.b(R.c(b,H(a),hf),H(J(a)))},a)):null:null)}
function kf(a,b){var c=a.e;if(b instanceof T)a:{for(var d=c.length,e=b.ra,f=0;;){if(d<=f){c=-1;break a}var g=c[f];if(g instanceof T&&e===g.ra){c=f;break a}f+=2}c=void 0}else if(d="string"==typeof b,v(v(d)?d:"number"===typeof b))a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(b===c[e]){c=e;break a}e+=2}c=void 0}else if(b instanceof mc)a:{d=c.length;e=b.str;for(f=0;;){if(d<=f){c=-1;break a}g=c[f];if(g instanceof mc&&e===g.str){c=f;break a}f+=2}c=void 0}else if(null==b)a:{d=c.length;for(e=0;;){if(d<=
e){c=-1;break a}if(null==c[e]){c=e;break a}e+=2}c=void 0}else a:{d=c.length;for(e=0;;){if(d<=e){c=-1;break a}if(pc.b(b,c[e])){c=e;break a}e+=2}c=void 0}return c}function lf(a,b,c){this.e=a;this.n=b;this.oa=c;this.q=0;this.j=32374990}m=lf.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.oa};m.la=function(){return this.n<this.e.length-2?new lf(this.e,this.n+2,this.oa):null};m.P=function(){return(this.e.length-this.n)/2};m.C=function(){return tc(this)};
m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.oa)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return new W(null,2,5,Y,[this.e[this.n],this.e[this.n+1]],null)};m.pa=function(){return this.n<this.e.length-2?new lf(this.e,this.n+2,this.oa):oc};m.M=function(){return this};m.D=function(a,b){return new lf(this.e,this.n,b)};m.O=function(a,b){return L(b,this)};lf.prototype[Ja]=function(){return rc(this)};
function mf(a,b,c){this.e=a;this.n=b;this.m=c}mf.prototype.Cb=function(){return this.n<this.m};mf.prototype.next=function(){var a=new W(null,2,5,Y,[this.e[this.n],this.e[this.n+1]],null);this.n+=2;return a};function u(a,b,c,d){this.p=a;this.m=b;this.e=c;this.o=d;this.j=16647951;this.q=8196}m=u.prototype;m.toString=function(){return bc(this)};m.keys=function(){return rc(nf.a?nf.a(this):nf.call(null,this))};m.J=function(a,b){return bb.c(this,b,null)};
m.I=function(a,b,c){a=kf(this,b);return-1===a?c:this.e[a+1]};m.gb=function(){return new mf(this.e,0,2*this.m)};m.A=function(){return this.p};m.P=function(){return this.m};m.C=function(){var a=this.o;return null!=a?a:this.o=a=vc(this)};m.B=function(a,b){if(b&&(b.j&1024||b.Yc)){var c=this.e.length;if(this.m===b.P(null))for(var d=0;;)if(d<c){var e=b.I(null,this.e[d],dd);if(e!==dd)if(pc.b(this.e[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return jf(this,b)};
m.Xa=function(){return new of({},this.e.length,Ka(this.e))};m.V=function(){return vb(Z,this.p)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.La=function(a,b){if(0<=kf(this,b)){var c=this.e.length,d=c-2;if(0===d)return Ta(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new u(this.p,this.m-1,d,null);pc.b(b,this.e[e])||(d[f]=this.e[e],d[f+1]=this.e[e+1],f+=2);e+=2}}else return this};
m.Da=function(a,b,c){a=kf(this,b);if(-1===a){if(this.m<pf){a=this.e;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new u(this.p,this.m+1,e,null)}return vb(db(ue.b(qf,this),b,c),this.p)}if(c===this.e[a+1])return this;b=Ka(this.e);b[a+1]=c;return new u(this.p,this.m,b,null)};m.Hb=function(a,b){return-1!==kf(this,b)};m.M=function(){var a=this.e;return 0<=a.length-2?new lf(a,0,null):null};m.D=function(a,b){return new u(b,this.m,this.e,this.o)};
m.O=function(a,b){if(Zc(b))return db(this,C.b(b,0),C.b(b,1));for(var c=this,d=E(b);;){if(null==d)return c;var e=H(d);if(Zc(e))c=db(c,C.b(e,0),C.b(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return this.J(null,a)};m.b=function(a,b){return this.I(null,a,b)};var Z=new u(null,0,[],wc),pf=8;
function rf(a){for(var b=a.length,c=0,d=Lb(Z);;)if(c<b)var e=c+2,d=Pb(d,a[c],a[c+1]),c=e;else return Ob(d)}u.prototype[Ja]=function(){return rc(this)};function of(a,b,c){this.$a=a;this.len=b;this.e=c;this.q=56;this.j=258}m=of.prototype;
m.kb=function(a,b,c){var d=this;if(v(d.$a)){a=kf(this,b);if(-1===a)return d.len+2<=2*pf?(d.len+=2,d.e.push(b),d.e.push(c),this):Vd.c(function(){var a=d.len,b=d.e;return sf.b?sf.b(a,b):sf.call(null,a,b)}(),b,c);c!==d.e[a+1]&&(d.e[a+1]=c);return this}throw Error("assoc! after persistent!");};
m.Qa=function(a,b){if(v(this.$a)){if(b?b.j&2048||b.Zc||(b.j?0:x(ib,b)):x(ib,b))return Pb(this,sd.a?sd.a(b):sd.call(null,b),td.a?td.a(b):td.call(null,b));for(var c=E(b),d=this;;){var e=H(c);if(v(e))var f=e,c=J(c),d=Pb(d,function(){var a=f;return sd.a?sd.a(a):sd.call(null,a)}(),function(){var a=f;return td.a?td.a(a):td.call(null,a)}());else return d}}else throw Error("conj! after persistent!");};
m.Ra=function(){if(v(this.$a))return this.$a=!1,new u(null,od(this.len,2),this.e,null);throw Error("persistent! called twice");};m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){if(v(this.$a))return a=kf(this,b),-1===a?c:this.e[a+1];throw Error("lookup after persistent!");};m.P=function(){if(v(this.$a))return od(this.len,2);throw Error("count after persistent!");};function sf(a,b){for(var c=Lb(qf),d=0;;)if(d<a)c=Vd.c(c,b[d],b[d+1]),d+=2;else return c}function tf(){this.T=!1}
function uf(a,b){return a===b?!0:Ad(a,b)?!0:pc.b(a,b)}var vf=function(){function a(a,b,c,g,h){a=Ka(a);a[b]=c;a[g]=h;return a}function b(a,b,c){a=Ka(a);a[b]=c;return a}var c=null,c=function(c,e,f,g,h){switch(arguments.length){case 3:return b.call(this,c,e,f);case 5:return a.call(this,c,e,f,g,h)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.r=a;return c}();function wf(a,b){var c=Array(a.length-2);bd(a,0,c,0,2*b);bd(a,2*(b+1),c,2*b,c.length-2*b);return c}
var xf=function(){function a(a,b,c,g,h,k){a=a.ab(b);a.e[c]=g;a.e[h]=k;return a}function b(a,b,c,g){a=a.ab(b);a.e[c]=g;return a}var c=null,c=function(c,e,f,g,h,k){switch(arguments.length){case 4:return b.call(this,c,e,f,g);case 6:return a.call(this,c,e,f,g,h,k)}throw Error("Invalid arity: "+arguments.length);};c.i=b;c.u=a;return c}();function yf(a,b,c){this.G=a;this.N=b;this.e=c}m=yf.prototype;
m.ab=function(a){if(a===this.G)return this;var b=pd(this.N),c=Array(0>b?4:2*(b+1));bd(this.e,0,c,0,2*b);return new yf(a,this.N,c)};m.ob=function(){var a=this.e;return zf.a?zf.a(a):zf.call(null,a)};m.Ma=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.N&e))return d;var f=pd(this.N&e-1),e=this.e[2*f],f=this.e[2*f+1];return null==e?f.Ma(a+5,b,c,d):uf(c,e)?f:d};
m.Ba=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=pd(this.N&g-1);if(0===(this.N&g)){var k=pd(this.N);if(2*k<this.e.length){var l=this.ab(a),n=l.e;f.T=!0;cd(n,2*h,n,2*(h+1),2*(k-h));n[2*h]=d;n[2*h+1]=e;l.N|=g;return l}if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[c>>>b&31]=Af.Ba(a,b+5,c,d,e,f);for(l=h=0;;)if(32>h)0!==(this.N>>>h&1)&&(g[h]=null!=this.e[l]?Af.Ba(a,b+5,jc(this.e[l]),
this.e[l],this.e[l+1],f):this.e[l+1],l+=2),h+=1;else break;return new Bf(a,k+1,g)}n=Array(2*(k+4));bd(this.e,0,n,0,2*h);n[2*h]=d;n[2*h+1]=e;bd(this.e,2*h,n,2*(h+1),2*(k-h));f.T=!0;l=this.ab(a);l.e=n;l.N|=g;return l}var p=this.e[2*h],q=this.e[2*h+1];if(null==p)return k=q.Ba(a,b+5,c,d,e,f),k===q?this:xf.i(this,a,2*h+1,k);if(uf(d,p))return e===q?this:xf.i(this,a,2*h+1,e);f.T=!0;return xf.u(this,a,2*h,null,2*h+1,function(){var f=b+5;return Cf.L?Cf.L(a,f,p,q,c,d,e):Cf.call(null,a,f,p,q,c,d,e)}())};
m.Aa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=pd(this.N&f-1);if(0===(this.N&f)){var h=pd(this.N);if(16<=h){f=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];f[b>>>a&31]=Af.Aa(a+5,b,c,d,e);for(var k=g=0;;)if(32>g)0!==(this.N>>>g&1)&&(f[g]=null!=this.e[k]?Af.Aa(a+5,jc(this.e[k]),this.e[k],this.e[k+1],e):this.e[k+1],k+=2),g+=1;else break;return new Bf(null,h+1,f)}k=Array(2*(h+1));bd(this.e,
0,k,0,2*g);k[2*g]=c;k[2*g+1]=d;bd(this.e,2*g,k,2*(g+1),2*(h-g));e.T=!0;return new yf(null,this.N|f,k)}var l=this.e[2*g],n=this.e[2*g+1];if(null==l)return h=n.Aa(a+5,b,c,d,e),h===n?this:new yf(null,this.N,vf.c(this.e,2*g+1,h));if(uf(c,l))return d===n?this:new yf(null,this.N,vf.c(this.e,2*g+1,d));e.T=!0;return new yf(null,this.N,vf.r(this.e,2*g,null,2*g+1,function(){var e=a+5;return Cf.u?Cf.u(e,l,n,b,c,d):Cf.call(null,e,l,n,b,c,d)}()))};
m.pb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.N&d))return this;var e=pd(this.N&d-1),f=this.e[2*e],g=this.e[2*e+1];return null==f?(a=g.pb(a+5,b,c),a===g?this:null!=a?new yf(null,this.N,vf.c(this.e,2*e+1,a)):this.N===d?null:new yf(null,this.N^d,wf(this.e,e))):uf(c,f)?new yf(null,this.N^d,wf(this.e,e)):this};var Af=new yf(null,0,[]);function Bf(a,b,c){this.G=a;this.m=b;this.e=c}m=Bf.prototype;m.ab=function(a){return a===this.G?this:new Bf(a,this.m,Ka(this.e))};
m.ob=function(){var a=this.e;return Df.a?Df.a(a):Df.call(null,a)};m.Ma=function(a,b,c,d){var e=this.e[b>>>a&31];return null!=e?e.Ma(a+5,b,c,d):d};m.Ba=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.e[g];if(null==h)return a=xf.i(this,a,g,Af.Ba(a,b+5,c,d,e,f)),a.m+=1,a;b=h.Ba(a,b+5,c,d,e,f);return b===h?this:xf.i(this,a,g,b)};
m.Aa=function(a,b,c,d,e){var f=b>>>a&31,g=this.e[f];if(null==g)return new Bf(null,this.m+1,vf.c(this.e,f,Af.Aa(a+5,b,c,d,e)));a=g.Aa(a+5,b,c,d,e);return a===g?this:new Bf(null,this.m,vf.c(this.e,f,a))};
m.pb=function(a,b,c){var d=b>>>a&31,e=this.e[d];if(null!=e){a=e.pb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.m)a:{e=this.e;a=e.length;b=Array(2*(this.m-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new yf(null,g,b);break a}d=void 0}else d=new Bf(null,this.m-1,vf.c(this.e,d,a));else d=new Bf(null,this.m,vf.c(this.e,d,a));return d}return this};function Ef(a,b,c){b*=2;for(var d=0;;)if(d<b){if(uf(c,a[d]))return d;d+=2}else return-1}
function Ff(a,b,c,d){this.G=a;this.Fa=b;this.m=c;this.e=d}m=Ff.prototype;m.ab=function(a){if(a===this.G)return this;var b=Array(2*(this.m+1));bd(this.e,0,b,0,2*this.m);return new Ff(a,this.Fa,this.m,b)};m.ob=function(){var a=this.e;return zf.a?zf.a(a):zf.call(null,a)};m.Ma=function(a,b,c,d){a=Ef(this.e,this.m,c);return 0>a?d:uf(c,this.e[a])?this.e[a+1]:d};
m.Ba=function(a,b,c,d,e,f){if(c===this.Fa){b=Ef(this.e,this.m,d);if(-1===b){if(this.e.length>2*this.m)return a=xf.u(this,a,2*this.m,d,2*this.m+1,e),f.T=!0,a.m+=1,a;c=this.e.length;b=Array(c+2);bd(this.e,0,b,0,c);b[c]=d;b[c+1]=e;f.T=!0;f=this.m+1;a===this.G?(this.e=b,this.m=f,a=this):a=new Ff(this.G,this.Fa,f,b);return a}return this.e[b+1]===e?this:xf.i(this,a,b+1,e)}return(new yf(a,1<<(this.Fa>>>b&31),[null,this,null,null])).Ba(a,b,c,d,e,f)};
m.Aa=function(a,b,c,d,e){return b===this.Fa?(a=Ef(this.e,this.m,c),-1===a?(a=2*this.m,b=Array(a+2),bd(this.e,0,b,0,a),b[a]=c,b[a+1]=d,e.T=!0,new Ff(null,this.Fa,this.m+1,b)):pc.b(this.e[a],d)?this:new Ff(null,this.Fa,this.m,vf.c(this.e,a+1,d))):(new yf(null,1<<(this.Fa>>>a&31),[null,this])).Aa(a,b,c,d,e)};m.pb=function(a,b,c){a=Ef(this.e,this.m,c);return-1===a?this:1===this.m?null:new Ff(null,this.Fa,this.m-1,wf(this.e,od(a,2)))};
var Cf=function(){function a(a,b,c,g,h,k,l){var n=jc(c);if(n===h)return new Ff(null,n,2,[c,g,k,l]);var p=new tf;return Af.Ba(a,b,n,c,g,p).Ba(a,b,h,k,l,p)}function b(a,b,c,g,h,k){var l=jc(b);if(l===g)return new Ff(null,l,2,[b,c,h,k]);var n=new tf;return Af.Aa(a,l,b,c,n).Aa(a,g,h,k,n)}var c=null,c=function(c,e,f,g,h,k,l){switch(arguments.length){case 6:return b.call(this,c,e,f,g,h,k);case 7:return a.call(this,c,e,f,g,h,k,l)}throw Error("Invalid arity: "+arguments.length);};c.u=b;c.L=a;return c}();
function Gf(a,b,c,d,e){this.p=a;this.Na=b;this.n=c;this.K=d;this.o=e;this.q=0;this.j=32374860}m=Gf.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.p)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return null==this.K?new W(null,2,5,Y,[this.Na[this.n],this.Na[this.n+1]],null):H(this.K)};
m.pa=function(){if(null==this.K){var a=this.Na,b=this.n+2;return zf.c?zf.c(a,b,null):zf.call(null,a,b,null)}var a=this.Na,b=this.n,c=J(this.K);return zf.c?zf.c(a,b,c):zf.call(null,a,b,c)};m.M=function(){return this};m.D=function(a,b){return new Gf(b,this.Na,this.n,this.K,this.o)};m.O=function(a,b){return L(b,this)};Gf.prototype[Ja]=function(){return rc(this)};
var zf=function(){function a(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Gf(null,a,b,null,null);var g=a[b+1];if(v(g)&&(g=g.ob(),v(g)))return new Gf(null,a,b+2,g,null);b+=2}else return null;else return new Gf(null,a,b,c,null)}function b(a){return c.c(a,0,null)}var c=null,c=function(c,e,f){switch(arguments.length){case 1:return b.call(this,c);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();
function Hf(a,b,c,d,e){this.p=a;this.Na=b;this.n=c;this.K=d;this.o=e;this.q=0;this.j=32374860}m=Hf.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.p};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.p)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return H(this.K)};
m.pa=function(){var a=this.Na,b=this.n,c=J(this.K);return Df.i?Df.i(null,a,b,c):Df.call(null,null,a,b,c)};m.M=function(){return this};m.D=function(a,b){return new Hf(b,this.Na,this.n,this.K,this.o)};m.O=function(a,b){return L(b,this)};Hf.prototype[Ja]=function(){return rc(this)};
var Df=function(){function a(a,b,c,g){if(null==g)for(g=b.length;;)if(c<g){var h=b[c];if(v(h)&&(h=h.ob(),v(h)))return new Hf(a,b,c+1,h,null);c+=1}else return null;else return new Hf(a,b,c,g,null)}function b(a){return c.i(null,a,0,null)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 1:return b.call(this,c);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.i=a;return c}();
function If(a,b,c,d,e,f){this.p=a;this.m=b;this.root=c;this.sa=d;this.wa=e;this.o=f;this.j=16123663;this.q=8196}m=If.prototype;m.toString=function(){return bc(this)};m.keys=function(){return rc(nf.a?nf.a(this):nf.call(null,this))};m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){return null==b?this.sa?this.wa:c:null==this.root?c:this.root.Ma(0,jc(b),b,c)};m.A=function(){return this.p};m.P=function(){return this.m};m.C=function(){var a=this.o;return null!=a?a:this.o=a=vc(this)};
m.B=function(a,b){return jf(this,b)};m.Xa=function(){return new Jf({},this.root,this.m,this.sa,this.wa)};m.V=function(){return vb(qf,this.p)};m.La=function(a,b){if(null==b)return this.sa?new If(this.p,this.m-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.pb(0,jc(b),b);return c===this.root?this:new If(this.p,this.m-1,c,this.sa,this.wa,null)};
m.Da=function(a,b,c){if(null==b)return this.sa&&c===this.wa?this:new If(this.p,this.sa?this.m:this.m+1,this.root,!0,c,null);a=new tf;b=(null==this.root?Af:this.root).Aa(0,jc(b),b,c,a);return b===this.root?this:new If(this.p,a.T?this.m+1:this.m,b,this.sa,this.wa,null)};m.Hb=function(a,b){return null==b?this.sa:null==this.root?!1:this.root.Ma(0,jc(b),b,dd)!==dd};m.M=function(){if(0<this.m){var a=null!=this.root?this.root.ob():null;return this.sa?L(new W(null,2,5,Y,[null,this.wa],null),a):a}return null};
m.D=function(a,b){return new If(b,this.m,this.root,this.sa,this.wa,this.o)};m.O=function(a,b){if(Zc(b))return db(this,C.b(b,0),C.b(b,1));for(var c=this,d=E(b);;){if(null==d)return c;var e=H(d);if(Zc(e))c=db(c,C.b(e,0),C.b(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return this.J(null,a)};m.b=function(a,b){return this.I(null,a,b)};var qf=new If(null,0,null,!1,null,wc);
function Oc(a,b){for(var c=a.length,d=0,e=Lb(qf);;)if(d<c)var f=d+1,e=e.kb(null,a[d],b[d]),d=f;else return Ob(e)}If.prototype[Ja]=function(){return rc(this)};function Jf(a,b,c,d,e){this.G=a;this.root=b;this.count=c;this.sa=d;this.wa=e;this.q=56;this.j=258}m=Jf.prototype;m.kb=function(a,b,c){return Kf(this,b,c)};m.Qa=function(a,b){return Lf(this,b)};m.Ra=function(){var a;if(this.G)this.G=null,a=new If(null,this.count,this.root,this.sa,this.wa,null);else throw Error("persistent! called twice");return a};
m.J=function(a,b){return null==b?this.sa?this.wa:null:null==this.root?null:this.root.Ma(0,jc(b),b)};m.I=function(a,b,c){return null==b?this.sa?this.wa:c:null==this.root?c:this.root.Ma(0,jc(b),b,c)};m.P=function(){if(this.G)return this.count;throw Error("count after persistent!");};
function Lf(a,b){if(a.G){if(b?b.j&2048||b.Zc||(b.j?0:x(ib,b)):x(ib,b))return Kf(a,sd.a?sd.a(b):sd.call(null,b),td.a?td.a(b):td.call(null,b));for(var c=E(b),d=a;;){var e=H(c);if(v(e))var f=e,c=J(c),d=Kf(d,function(){var a=f;return sd.a?sd.a(a):sd.call(null,a)}(),function(){var a=f;return td.a?td.a(a):td.call(null,a)}());else return d}}else throw Error("conj! after persistent");}
function Kf(a,b,c){if(a.G){if(null==b)a.wa!==c&&(a.wa=c),a.sa||(a.count+=1,a.sa=!0);else{var d=new tf;b=(null==a.root?Af:a.root).Ba(a.G,0,jc(b),b,c,d);b!==a.root&&(a.root=b);d.T&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}
var fe=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){a=E(a);for(var b=Lb(qf);;)if(a){var e=J(J(a)),b=Vd.c(b,H(a),H(J(a)));a=e}else return Ob(b)}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}(),Mf=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,
d)}function b(a){return rf(S.b(La,a))}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}();function Nf(a,b){this.ma=a;this.oa=b;this.q=0;this.j=32374988}m=Nf.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.oa};m.la=function(){var a=this.ma,a=(a?a.j&128||a.vb||(a.j?0:x($a,a)):x($a,a))?this.ma.la(null):J(this.ma);return null==a?null:new Nf(a,this.oa)};m.C=function(){return tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.oa)};
m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return this.ma.W(null).Mb()};m.pa=function(){var a=this.ma,a=(a?a.j&128||a.vb||(a.j?0:x($a,a)):x($a,a))?this.ma.la(null):J(this.ma);return null!=a?new Nf(a,this.oa):oc};m.M=function(){return this};m.D=function(a,b){return new Nf(this.ma,b)};m.O=function(a,b){return L(b,this)};Nf.prototype[Ja]=function(){return rc(this)};function nf(a){return(a=E(a))?new Nf(a,null):null}function sd(a){return jb(a)}
function Of(a,b){this.ma=a;this.oa=b;this.q=0;this.j=32374988}m=Of.prototype;m.toString=function(){return bc(this)};m.A=function(){return this.oa};m.la=function(){var a=this.ma,a=(a?a.j&128||a.vb||(a.j?0:x($a,a)):x($a,a))?this.ma.la(null):J(this.ma);return null==a?null:new Of(a,this.oa)};m.C=function(){return tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.oa)};m.ia=function(a,b){return Kc.b(b,this)};m.ja=function(a,b,c){return Kc.c(b,c,this)};m.W=function(){return this.ma.W(null).Nb()};
m.pa=function(){var a=this.ma,a=(a?a.j&128||a.vb||(a.j?0:x($a,a)):x($a,a))?this.ma.la(null):J(this.ma);return null!=a?new Of(a,this.oa):oc};m.M=function(){return this};m.D=function(a,b){return new Of(this.ma,b)};m.O=function(a,b){return L(b,this)};Of.prototype[Ja]=function(){return rc(this)};function Pf(a){return(a=E(a))?new Of(a,null):null}function td(a){return kb(a)}
var Qf=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){return v($d(a))?Oa.b(function(a,b){return Mc.b(v(a)?a:Z,b)},a):null}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}();function Rf(a,b){for(var c=Z,d=E(b);;)if(d)var e=H(d),f=R.c(a,e,Sf),c=Xd.b(f,Sf)?Pc.c(c,e,f):c,d=J(d);else return Jc(c,Tc(a))}
function Tf(a,b,c){this.p=a;this.Ta=b;this.o=c;this.j=15077647;this.q=8196}m=Tf.prototype;m.toString=function(){return bc(this)};m.keys=function(){return rc(E(this))};m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){return cb(this.Ta,b)?b:c};m.A=function(){return this.p};m.P=function(){return Sa(this.Ta)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=vc(this)};m.B=function(a,b){return Wc(b)&&P(this)===P(b)&&Zd(function(a){return function(b){return gd(a,b)}}(this),b)};m.Xa=function(){return new Uf(Lb(this.Ta))};
m.V=function(){return Jc(Vf,this.p)};m.Xb=function(a,b){return new Tf(this.p,hb(this.Ta,b),null)};m.M=function(){return nf(this.Ta)};m.D=function(a,b){return new Tf(b,this.Ta,this.o)};m.O=function(a,b){return new Tf(this.p,Pc.c(this.Ta,b,null),null)};
m.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return this.J(null,a)};m.b=function(a,b){return this.I(null,a,b)};var Vf=new Tf(null,Z,wc);
function Wf(a){var b=a.length;if(b<=pf)for(var c=0,d=Lb(Z);;)if(c<b)var e=c+1,d=Pb(d,a[c],null),c=e;else return new Tf(null,Ob(d),null);else for(c=0,d=Lb(Vf);;)if(c<b)e=c+1,d=Nb(d,a[c]),c=e;else return Ob(d)}Tf.prototype[Ja]=function(){return rc(this)};function Uf(a){this.Ja=a;this.j=259;this.q=136}m=Uf.prototype;
m.call=function(){function a(a,b,c){return bb.c(this.Ja,b,dd)===dd?c:b}function b(a,b){return bb.c(this.Ja,b,dd)===dd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};m.a=function(a){return bb.c(this.Ja,a,dd)===dd?null:a};m.b=function(a,b){return bb.c(this.Ja,a,dd)===dd?b:a};
m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){return bb.c(this.Ja,b,dd)===dd?c:b};m.P=function(){return P(this.Ja)};m.Qa=function(a,b){this.Ja=Vd.c(this.Ja,b,null);return this};m.Ra=function(){return new Tf(null,Ob(this.Ja),null)};
function Xf(a){a=E(a);if(null==a)return Vf;if(a instanceof G&&0===a.n){a=a.e;a:{for(var b=0,c=Lb(Vf);;)if(b<a.length)var d=b+1,c=c.Qa(null,a[b]),b=d;else{a=c;break a}a=void 0}return a.Ra(null)}for(d=Lb(Vf);;)if(null!=a)b=a.la(null),d=d.Qa(null,a.W(null)),a=b;else return d.Ra(null)}function Bd(a){if(a&&(a.q&4096||a.ad))return a.hb(null);if("string"===typeof a)return a;throw Error([A("Doesn't support name: "),A(a)].join(""));}
var Yf=function(){function a(a,b,c){return(a.a?a.a(b):a.call(null,b))>(a.a?a.a(c):a.call(null,c))?b:c}var b=null,c=function(){function a(b,d,h,k){var l=null;if(3<arguments.length){for(var l=0,n=Array(arguments.length-3);l<n.length;)n[l]=arguments[l+3],++l;l=new G(n,0)}return c.call(this,b,d,h,l)}function c(a,d,e,k){return Oa.c(function(c,d){return b.c(a,c,d)},b.c(a,d,e),k)}a.l=3;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=J(a);var k=H(a);a=I(a);return c(b,d,k,a)};a.d=c;return a}(),b=function(b,
e,f,g){switch(arguments.length){case 2:return e;case 3:return a.call(this,b,e,f);default:var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new G(k,0)}return c.d(b,e,f,h)}throw Error("Invalid arity: "+arguments.length);};b.l=3;b.g=c.g;b.b=function(a,b){return b};b.c=a;b.d=c.d;return b}(),Zf=function(){function a(a,b){return new Dd(null,function(){var f=E(b);if(f){var g;g=H(f);g=a.a?a.a(g):a.call(null,g);f=v(g)?L(H(f),c.b(a,I(f))):null}else f=
null;return f},null,null)}function b(a){return function(b){return function(){function c(f,g){return v(a.a?a.a(g):a.call(null,g))?b.b?b.b(f,g):b.call(null,f,g):new yc(f)}function g(a){return b.a?b.a(a):b.call(null,a)}function h(){return b.k?b.k():b.call(null)}var k=null,k=function(a,b){switch(arguments.length){case 0:return h.call(this);case 1:return g.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};k.k=h;k.a=g;k.b=c;return k}()}}var c=null,c=function(c,
e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function $f(a,b,c){this.n=a;this.end=b;this.step=c}$f.prototype.Cb=function(){return 0<this.step?this.n<this.end:this.n>this.end};$f.prototype.next=function(){var a=this.n;this.n+=this.step;return a};function ag(a,b,c,d,e){this.p=a;this.start=b;this.end=c;this.step=d;this.o=e;this.j=32375006;this.q=8192}m=ag.prototype;m.toString=function(){return bc(this)};
m.t=function(a,b){if(b<Sa(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};m.ta=function(a,b,c){return b<Sa(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};m.gb=function(){return new $f(this.start,this.end,this.step)};m.A=function(){return this.p};
m.la=function(){return 0<this.step?this.start+this.step<this.end?new ag(this.p,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new ag(this.p,this.start+this.step,this.end,this.step,null):null};m.P=function(){if(Ga(Bb(this)))return 0;var a=(this.end-this.start)/this.step;return Math.ceil.a?Math.ceil.a(a):Math.ceil.call(null,a)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=tc(this)};m.B=function(a,b){return Hc(this,b)};m.V=function(){return Jc(oc,this.p)};
m.ia=function(a,b){return Ac.b(this,b)};m.ja=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){var d=a;c=b.b?b.b(c,d):b.call(null,c,d);if(zc(c))return b=c,K.a?K.a(b):K.call(null,b);a+=this.step}else return c};m.W=function(){return null==Bb(this)?null:this.start};m.pa=function(){return null!=Bb(this)?new ag(this.p,this.start+this.step,this.end,this.step,null):oc};m.M=function(){return 0<this.step?this.start<this.end?this:null:this.start>this.end?this:null};
m.D=function(a,b){return new ag(b,this.start,this.end,this.step,this.o)};m.O=function(a,b){return L(b,this)};ag.prototype[Ja]=function(){return rc(this)};
var bg=function(){function a(a,b,c){return new ag(null,a,b,c,null)}function b(a,b){return e.c(a,b,1)}function c(a){return e.c(0,a,1)}function d(){return e.c(0,Number.MAX_VALUE,1)}var e=null,e=function(e,g,h){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,e);case 2:return b.call(this,e,g);case 3:return a.call(this,e,g,h)}throw Error("Invalid arity: "+arguments.length);};e.k=d;e.a=c;e.b=b;e.c=a;return e}();
function cg(a,b){return new W(null,2,5,Y,[Zf.b(a,b),ne.b(a,b)],null)}
var dg=function(){function a(a,b){for(;;)if(E(b)&&0<a){var c=a-1,g=J(b);a=c;b=g}else return null}function b(a){for(;;)if(E(a))a=J(a);else return null}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}(),eg=function(){function a(a,b){dg.b(a,b);return b}function b(a){dg.a(a);return a}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,
c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function fg(a,b,c,d,e,f,g){var h=va;va=null==va?null:va-1;try{if(null!=va&&0>va)return Fb(a,"#");Fb(a,c);if(0===Ea.a(f))E(g)&&Fb(a,"...");else{if(E(g)){var k=H(g);b.c?b.c(k,a,f):b.call(null,k,a,f)}for(var l=J(g),n=Ea.a(f)-1;;)if(!l||null!=n&&0===n){E(l)&&0===n&&(Fb(a,d),Fb(a,"..."));break}else{Fb(a,d);var p=H(l);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=J(l);c=n-1;l=q;n=c}}return Fb(a,e)}finally{va=h}}
var gg=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new G(f,0)}return b.call(this,a,e)}function b(a,b){for(var e=E(b),f=null,g=0,h=0;;)if(h<g){var k=f.t(null,h);Fb(a,k);h+=1}else if(e=E(e))f=e,$c(f)?(e=Sb(f),g=Tb(f),f=e,k=P(e),e=g,g=k):(k=H(f),Fb(a,k),e=J(f),f=null,g=0),h=0;else return null}a.l=1;a.g=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}(),hg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f",
"\n":"\\n","\r":"\\r","\t":"\\t"};function ig(a){return[A('"'),A(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return hg[a]})),A('"')].join("")}
var lg=function jg(b,c,d){if(null==b)return Fb(c,"nil");if(void 0===b)return Fb(c,"#\x3cundefined\x3e");v(function(){var c=R.b(d,Ba);return v(c)?(c=b?b.j&131072||b.$c?!0:b.j?!1:x(sb,b):x(sb,b))?Tc(b):c:c}())&&(Fb(c,"^"),jg(Tc(b),c,d),Fb(c," "));if(null==b)return Fb(c,"nil");if(b.Za)return b.lb(b,c,d);if(b&&(b.j&2147483648||b.R))return b.v(null,c,d);if(Ha(b)===Boolean||"number"===typeof b)return Fb(c,""+A(b));if(null!=b&&b.constructor===Object){Fb(c,"#js ");var e=le.b(function(c){return new W(null,
2,5,Y,[Cd.a(c),b[c]],null)},ad(b));return kg.i?kg.i(e,jg,c,d):kg.call(null,e,jg,c,d)}return b instanceof Array?fg(c,jg,"#js ["," ","]",d,b):v("string"==typeof b)?v(Aa.a(d))?Fb(c,ig(b)):Fb(c,b):Rc(b)?gg.d(c,M(["#\x3c",""+A(b),"\x3e"],0)):b instanceof Date?(e=function(b,c){for(var d=""+A(b);;)if(P(d)<c)d=[A("0"),A(d)].join("");else return d},gg.d(c,M(['#inst "',""+A(b.getUTCFullYear()),"-",e(b.getUTCMonth()+1,2),"-",e(b.getUTCDate(),2),"T",e(b.getUTCHours(),2),":",e(b.getUTCMinutes(),2),":",e(b.getUTCSeconds(),
2),".",e(b.getUTCMilliseconds(),3),"-",'00:00"'],0))):b instanceof RegExp?gg.d(c,M(['#"',b.source,'"'],0)):(b?b.j&2147483648||b.R||(b.j?0:x(Gb,b)):x(Gb,b))?Hb(b,c,d):gg.d(c,M(["#\x3c",""+A(b),"\x3e"],0))};
function mg(a,b){var c;if(null==a||Ga(E(a)))c="";else{c=A;var d=new na;a:{var e=new ac(d);lg(H(a),e,b);for(var f=E(J(a)),g=null,h=0,k=0;;)if(k<h){var l=g.t(null,k);Fb(e," ");lg(l,e,b);k+=1}else if(f=E(f))g=f,$c(g)?(f=Sb(g),h=Tb(g),g=f,l=P(f),f=h,h=l):(l=H(g),Fb(e," "),lg(l,e,b),f=J(g),g=null,h=0),k=0;else break a}c=""+c(d)}return c}
var ie=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){return mg(a,xa())}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}(),ng=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){var b=Pc.c(xa(),Aa,!1);a=mg(a,b);sa.a?sa.a(a):
sa.call(null,a);v(ua)?(a=xa(),sa.a?sa.a("\n"):sa.call(null,"\n"),a=(R.b(a,za),null)):a=null;return a}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}();function kg(a,b,c,d){return fg(c,function(a,c,d){var h=jb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Fb(c," ");a=kb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,E(a))}ke.prototype.R=!0;ke.prototype.v=function(a,b,c){Fb(b,"#\x3cVolatile: ");lg(this.state,b,c);return Fb(b,"\x3e")};G.prototype.R=!0;
G.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};Dd.prototype.R=!0;Dd.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};Gf.prototype.R=!0;Gf.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};lf.prototype.R=!0;lf.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};Se.prototype.R=!0;Se.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};yd.prototype.R=!0;yd.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};
Gc.prototype.R=!0;Gc.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};If.prototype.R=!0;If.prototype.v=function(a,b,c){return kg(this,lg,b,c)};Hf.prototype.R=!0;Hf.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};bf.prototype.R=!0;bf.prototype.v=function(a,b,c){return fg(b,lg,"["," ","]",c,this)};Tf.prototype.R=!0;Tf.prototype.v=function(a,b,c){return fg(b,lg,"#{"," ","}",c,this)};Jd.prototype.R=!0;Jd.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};
ee.prototype.R=!0;ee.prototype.v=function(a,b,c){Fb(b,"#\x3cAtom: ");lg(this.state,b,c);return Fb(b,"\x3e")};Of.prototype.R=!0;Of.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};W.prototype.R=!0;W.prototype.v=function(a,b,c){return fg(b,lg,"["," ","]",c,this)};vd.prototype.R=!0;vd.prototype.v=function(a,b){return Fb(b,"()")};u.prototype.R=!0;u.prototype.v=function(a,b,c){return kg(this,lg,b,c)};ag.prototype.R=!0;ag.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};
Nf.prototype.R=!0;Nf.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};ud.prototype.R=!0;ud.prototype.v=function(a,b,c){return fg(b,lg,"("," ",")",c,this)};W.prototype.tb=!0;W.prototype.ub=function(a,b){return id.b(this,b)};bf.prototype.tb=!0;bf.prototype.ub=function(a,b){return id.b(this,b)};T.prototype.tb=!0;T.prototype.ub=function(a,b){return zd(this,b)};mc.prototype.tb=!0;mc.prototype.ub=function(a,b){return lc(this,b)};function og(a,b,c){Jb(a,b,c)}
function pg(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return zc(d)?new yc(d):d}}
function qe(a){return function(b){return function(){function c(a,c){return Oa.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.k?a.k():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.k=e;f.a=d;f.b=c;return f}()}(pg(a))}var qg={};
function rg(a){if(a?a.Xc:a)return a.Xc(a);var b;b=rg[t(null==a?null:a)];if(!b&&(b=rg._,!b))throw y("IEncodeJS.-clj-\x3ejs",a);return b.call(null,a)}function sg(a){return(a?v(v(null)?null:a.Wc)||(a.Rb?0:x(qg,a)):x(qg,a))?rg(a):"string"===typeof a||"number"===typeof a||a instanceof T||a instanceof mc?tg.a?tg.a(a):tg.call(null,a):ie.d(M([a],0))}
var tg=function ug(b){if(null==b)return null;if(b?v(v(null)?null:b.Wc)||(b.Rb?0:x(qg,b)):x(qg,b))return rg(b);if(b instanceof T)return Bd(b);if(b instanceof mc)return""+A(b);if(Yc(b)){var c={};b=E(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.t(null,f),h=Q.c(g,0,null),g=Q.c(g,1,null);c[sg(h)]=ug(g);f+=1}else if(b=E(b))$c(b)?(e=Sb(b),b=Tb(b),d=e,e=P(e)):(e=H(b),d=Q.c(e,0,null),e=Q.c(e,1,null),c[sg(d)]=ug(e),b=J(b),d=null,e=0),f=0;else break;return c}if(Vc(b)){c=[];b=E(le.b(ug,b));d=null;for(f=e=0;;)if(f<
e)h=d.t(null,f),c.push(h),f+=1;else if(b=E(b))d=b,$c(d)?(b=Sb(d),f=Tb(d),d=b,e=P(b),b=f):(b=H(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},vg={};function wg(a,b){if(a?a.Vc:a)return a.Vc(a,b);var c;c=wg[t(null==a?null:a)];if(!c&&(c=wg._,!c))throw y("IEncodeClojure.-js-\x3eclj",a);return c.call(null,a,b)}
var yg=function(){function a(a){return b.d(a,M([new u(null,1,[xg,!1],null)],0))}var b=null,c=function(){function a(c,d){var h=null;if(1<arguments.length){for(var h=0,k=Array(arguments.length-1);h<k.length;)k[h]=arguments[h+1],++h;h=new G(k,0)}return b.call(this,c,h)}function b(a,c){var d=ed(c)?S.b(fe,c):c,e=R.b(d,xg);return function(a,b,d,e){return function s(f){return(f?v(v(null)?null:f.xd)||(f.Rb?0:x(vg,f)):x(vg,f))?wg(f,S.b(Mf,c)):ed(f)?eg.a(le.b(s,f)):Vc(f)?ue.b(null==f?null:Ta(f),le.b(s,f)):
f instanceof Array?Re(le.b(s,f)):Ha(f)===Object?ue.b(Z,function(){return function(a,b,c,d){return function aa(e){return new Dd(null,function(a,b,c,d){return function(){for(;;){var a=E(e);if(a){if($c(a)){var b=Sb(a),c=P(b),g=Hd(c);return function(){for(var a=0;;)if(a<c){var e=C.b(b,a),h=g,k=Y,l;l=e;l=d.a?d.a(l):d.call(null,l);e=new W(null,2,5,k,[l,s(f[e])],null);h.add(e);a+=1}else return!0}()?Kd(g.U(),aa(Tb(a))):Kd(g.U(),null)}var h=H(a);return L(new W(null,2,5,Y,[function(){var a=h;return d.a?d.a(a):
d.call(null,a)}(),s(f[h])],null),aa(I(a)))}return null}}}(a,b,c,d),null,null)}}(a,b,d,e)(ad(f))}()):f}}(c,d,e,v(e)?Cd:A)(a)}a.l=1;a.g=function(a){var c=H(a);a=I(a);return b(c,a)};a.d=b;return a}(),b=function(b,e){switch(arguments.length){case 1:return a.call(this,b);default:var f=null;if(1<arguments.length){for(var f=0,g=Array(arguments.length-1);f<g.length;)g[f]=arguments[f+1],++f;f=new G(g,0)}return c.d(b,f)}throw Error("Invalid arity: "+arguments.length);};b.l=1;b.g=c.g;b.a=a;b.d=c.d;return b}();
function zg(a){a*=Math.random.k?Math.random.k():Math.random.call(null);return Math.floor.a?Math.floor.a(a):Math.floor.call(null,a)}var Ag=null;function Bg(){if(null==Ag){var a=new u(null,3,[Cg,Z,Dg,Z,Eg,Z],null);Ag=V.a?V.a(a):V.call(null,a)}return Ag}
var Fg=function(){function a(a,b,f){var g=pc.b(b,f);if(!g&&!(g=gd(Eg.a(a).call(null,b),f))&&(g=Zc(f))&&(g=Zc(b)))if(g=P(f)===P(b))for(var h=!0,k=0;;)if(h&&k!==P(f))h=c.c(a,function(){var a=k;return b.a?b.a(a):b.call(null,a)}(),function(){var a=k;return f.a?f.a(a):f.call(null,a)}()),k=g=k+1;else return h;else return g;else return g}function b(a,b){return c.c(function(){var a=Bg();return K.a?K.a(a):K.call(null,a)}(),a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,
c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),Gg=function(){function a(a,b){return Yd(R.b(Cg.a(a),b))}function b(a){return c.b(function(){var a=Bg();return K.a?K.a(a):K.call(null,a)}(),a)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();
function Hg(a,b,c,d){je.b(a,function(){return K.a?K.a(b):K.call(null,b)});je.b(c,function(){return K.a?K.a(d):K.call(null,d)})}var Jg=function Ig(b,c,d){var e=(K.a?K.a(d):K.call(null,d)).call(null,b),e=v(v(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(v(e))return e;e=function(){for(var e=Gg.a(c);;)if(0<P(e))Ig(b,H(e),d),e=I(e);else return null}();if(v(e))return e;e=function(){for(var e=Gg.a(b);;)if(0<P(e))Ig(H(e),c,d),e=I(e);else return null}();return v(e)?e:!1};
function Kg(a,b,c){c=Jg(a,b,c);return v(c)?c:Fg.b(a,b)}
var Mg=function Lg(b,c,d,e,f,g,h){var k=Oa.c(function(e,g){var h=Q.c(g,0,null);Q.c(g,1,null);if(Fg.c(K.a?K.a(d):K.call(null,d),c,h)){var k;k=(k=null==e)?k:Kg(h,H(e),f);k=v(k)?g:e;if(!v(Kg(H(k),h,f)))throw Error([A("Multiple methods in multimethod '"),A(b),A("' match dispatch value: "),A(c),A(" -\x3e "),A(h),A(" and "),A(H(k)),A(", and neither is preferred")].join(""));return k}return e},null,K.a?K.a(e):K.call(null,e));if(v(k)){if(pc.b(K.a?K.a(h):K.call(null,h),K.a?K.a(d):K.call(null,d)))return je.i(g,
Pc,c,H(J(k))),H(J(k));Hg(g,e,h,d);return Lg(b,c,d,e,f,g,h)}return null};function Ng(a,b){throw Error([A("No method in multimethod '"),A(a),A("' for dispatch value: "),A(b)].join(""));}function Og(a,b,c,d,e,f,g,h){this.name=a;this.h=b;this.hd=c;this.Db=d;this.qb=e;this.rd=f;this.Eb=g;this.rb=h;this.j=4194305;this.q=4352}m=Og.prototype;m.C=function(){return this[ca]||(this[ca]=++ea)};m.hb=function(){return Vb(this.name)};m.ib=function(){return Wb(this.name)};
function Pg(a,b,c){je.i(a.qb,Pc,b,c);Hg(a.Eb,a.qb,a.rb,a.Db)}function Qg(a,b){pc.b(function(){var b=a.rb;return K.a?K.a(b):K.call(null,b)}(),function(){var b=a.Db;return K.a?K.a(b):K.call(null,b)}())||Hg(a.Eb,a.qb,a.rb,a.Db);var c=function(){var b=a.Eb;return K.a?K.a(b):K.call(null,b)}().call(null,b);if(v(c))return c;c=Mg(a.name,b,a.Db,a.qb,a.rd,a.Eb,a.rb);return v(c)?c:function(){var b=a.qb;return K.a?K.a(b):K.call(null,b)}().call(null,a.hd)}
m.call=function(){function a(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N,O){a=this;var aa=S.d(a.h,b,c,d,e,M([f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N,O],0)),Rd=Qg(this,aa);v(Rd)||Ng(a.name,aa);return S.d(Rd,b,c,d,e,M([f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N,O],0))}function b(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N){a=this;var O=a.h.ga?a.h.ga(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N),aa=Qg(this,O);v(aa)||Ng(a.name,O);return aa.ga?aa.ga(b,c,d,e,f,g,h,k,l,n,p,q,r,
s,w,z,B,F,D,N):aa.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D,N)}function c(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D){a=this;var N=a.h.fa?a.h.fa(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D),O=Qg(this,N);v(O)||Ng(a.name,N);return O.fa?O.fa(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D):O.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,D)}function d(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F){a=this;var D=a.h.ea?a.h.ea(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):a.h.call(null,
b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F),N=Qg(this,D);v(N)||Ng(a.name,D);return N.ea?N.ea(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):N.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F)}function e(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B){a=this;var F=a.h.da?a.h.da(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B),D=Qg(this,F);v(D)||Ng(a.name,F);return D.da?D.da(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):D.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B)}function f(a,b,c,d,e,f,g,h,k,l,n,p,q,r,
s,w,z){a=this;var B=a.h.ca?a.h.ca(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z),F=Qg(this,B);v(F)||Ng(a.name,B);return F.ca?F.ca(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):F.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z)}function g(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w){a=this;var z=a.h.ba?a.h.ba(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w),B=Qg(this,z);v(B)||Ng(a.name,z);return B.ba?B.ba(b,c,d,e,f,g,h,k,l,n,p,q,r,s,w):B.call(null,b,c,d,e,f,g,h,k,l,n,p,
q,r,s,w)}function h(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s){a=this;var w=a.h.aa?a.h.aa(b,c,d,e,f,g,h,k,l,n,p,q,r,s):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s),z=Qg(this,w);v(z)||Ng(a.name,w);return z.aa?z.aa(b,c,d,e,f,g,h,k,l,n,p,q,r,s):z.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r,s)}function k(a,b,c,d,e,f,g,h,k,l,n,p,q,r){a=this;var s=a.h.$?a.h.$(b,c,d,e,f,g,h,k,l,n,p,q,r):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q,r),w=Qg(this,s);v(w)||Ng(a.name,s);return w.$?w.$(b,c,d,e,f,g,h,k,l,n,p,q,r):w.call(null,b,c,d,e,f,g,h,
k,l,n,p,q,r)}function l(a,b,c,d,e,f,g,h,k,l,n,p,q){a=this;var r=a.h.Z?a.h.Z(b,c,d,e,f,g,h,k,l,n,p,q):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p,q),s=Qg(this,r);v(s)||Ng(a.name,r);return s.Z?s.Z(b,c,d,e,f,g,h,k,l,n,p,q):s.call(null,b,c,d,e,f,g,h,k,l,n,p,q)}function n(a,b,c,d,e,f,g,h,k,l,n,p){a=this;var q=a.h.Y?a.h.Y(b,c,d,e,f,g,h,k,l,n,p):a.h.call(null,b,c,d,e,f,g,h,k,l,n,p),r=Qg(this,q);v(r)||Ng(a.name,q);return r.Y?r.Y(b,c,d,e,f,g,h,k,l,n,p):r.call(null,b,c,d,e,f,g,h,k,l,n,p)}function p(a,b,c,d,e,f,g,h,
k,l,n){a=this;var p=a.h.X?a.h.X(b,c,d,e,f,g,h,k,l,n):a.h.call(null,b,c,d,e,f,g,h,k,l,n),q=Qg(this,p);v(q)||Ng(a.name,p);return q.X?q.X(b,c,d,e,f,g,h,k,l,n):q.call(null,b,c,d,e,f,g,h,k,l,n)}function q(a,b,c,d,e,f,g,h,k,l){a=this;var n=a.h.ha?a.h.ha(b,c,d,e,f,g,h,k,l):a.h.call(null,b,c,d,e,f,g,h,k,l),p=Qg(this,n);v(p)||Ng(a.name,n);return p.ha?p.ha(b,c,d,e,f,g,h,k,l):p.call(null,b,c,d,e,f,g,h,k,l)}function r(a,b,c,d,e,f,g,h,k){a=this;var l=a.h.S?a.h.S(b,c,d,e,f,g,h,k):a.h.call(null,b,c,d,e,f,g,h,k),
n=Qg(this,l);v(n)||Ng(a.name,l);return n.S?n.S(b,c,d,e,f,g,h,k):n.call(null,b,c,d,e,f,g,h,k)}function s(a,b,c,d,e,f,g,h){a=this;var k=a.h.L?a.h.L(b,c,d,e,f,g,h):a.h.call(null,b,c,d,e,f,g,h),l=Qg(this,k);v(l)||Ng(a.name,k);return l.L?l.L(b,c,d,e,f,g,h):l.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.h.u?a.h.u(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g),k=Qg(this,h);v(k)||Ng(a.name,h);return k.u?k.u(b,c,d,e,f,g):k.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;var g=a.h.r?a.h.r(b,
c,d,e,f):a.h.call(null,b,c,d,e,f),h=Qg(this,g);v(h)||Ng(a.name,g);return h.r?h.r(b,c,d,e,f):h.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;var f=a.h.i?a.h.i(b,c,d,e):a.h.call(null,b,c,d,e),g=Qg(this,f);v(g)||Ng(a.name,f);return g.i?g.i(b,c,d,e):g.call(null,b,c,d,e)}function F(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Qg(this,e);v(f)||Ng(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function N(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Qg(this,d);v(e)||
Ng(a.name,d);return e.b?e.b(b,c):e.call(null,b,c)}function O(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Qg(this,c);v(d)||Ng(a.name,c);return d.a?d.a(b):d.call(null,b)}function aa(a){a=this;var b=a.h.k?a.h.k():a.h.call(null),c=Qg(this,b);v(c)||Ng(a.name,b);return c.k?c.k():c.call(null)}var D=null,D=function(D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb,gb,Mb,Dc,jd,pe){switch(arguments.length){case 1:return aa.call(this,D);case 2:return O.call(this,D,U);case 3:return N.call(this,D,U,X);case 4:return F.call(this,
D,U,X,$);case 5:return B.call(this,D,U,X,$,ga);case 6:return z.call(this,D,U,X,$,ga,da);case 7:return w.call(this,D,U,X,$,ga,da,ma);case 8:return s.call(this,D,U,X,$,ga,da,ma,pa);case 9:return r.call(this,D,U,X,$,ga,da,ma,pa,ta);case 10:return q.call(this,D,U,X,$,ga,da,ma,pa,ta,ya);case 11:return p.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca);case 12:return n.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb);case 13:return l.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa);case 14:return k.call(this,D,U,X,$,ga,
da,ma,pa,ta,ya,Ca,pb,Fa,Ma);case 15:return h.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na);case 16:return g.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb);case 17:return f.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb);case 18:return e.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb,gb);case 19:return d.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb,gb,Mb);case 20:return c.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb,gb,Mb,Dc);case 21:return b.call(this,
D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb,gb,Mb,Dc,jd);case 22:return a.call(this,D,U,X,$,ga,da,ma,pa,ta,ya,Ca,pb,Fa,Ma,Na,fb,lb,gb,Mb,Dc,jd,pe)}throw Error("Invalid arity: "+arguments.length);};D.a=aa;D.b=O;D.c=N;D.i=F;D.r=B;D.u=z;D.L=w;D.S=s;D.ha=r;D.X=q;D.Y=p;D.Z=n;D.$=l;D.aa=k;D.ba=h;D.ca=g;D.da=f;D.ea=e;D.fa=d;D.ga=c;D.Lb=b;D.fb=a;return D}();m.apply=function(a,b){return this.call.apply(this,[this].concat(Ka(b)))};
m.k=function(){var a=this.h.k?this.h.k():this.h.call(null),b=Qg(this,a);v(b)||Ng(this.name,a);return b.k?b.k():b.call(null)};m.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Qg(this,b);v(c)||Ng(this.name,b);return c.a?c.a(a):c.call(null,a)};m.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Qg(this,c);v(d)||Ng(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
m.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Qg(this,d);v(e)||Ng(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};m.i=function(a,b,c,d){var e=this.h.i?this.h.i(a,b,c,d):this.h.call(null,a,b,c,d),f=Qg(this,e);v(f)||Ng(this.name,e);return f.i?f.i(a,b,c,d):f.call(null,a,b,c,d)};m.r=function(a,b,c,d,e){var f=this.h.r?this.h.r(a,b,c,d,e):this.h.call(null,a,b,c,d,e),g=Qg(this,f);v(g)||Ng(this.name,f);return g.r?g.r(a,b,c,d,e):g.call(null,a,b,c,d,e)};
m.u=function(a,b,c,d,e,f){var g=this.h.u?this.h.u(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),h=Qg(this,g);v(h)||Ng(this.name,g);return h.u?h.u(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};m.L=function(a,b,c,d,e,f,g){var h=this.h.L?this.h.L(a,b,c,d,e,f,g):this.h.call(null,a,b,c,d,e,f,g),k=Qg(this,h);v(k)||Ng(this.name,h);return k.L?k.L(a,b,c,d,e,f,g):k.call(null,a,b,c,d,e,f,g)};
m.S=function(a,b,c,d,e,f,g,h){var k=this.h.S?this.h.S(a,b,c,d,e,f,g,h):this.h.call(null,a,b,c,d,e,f,g,h),l=Qg(this,k);v(l)||Ng(this.name,k);return l.S?l.S(a,b,c,d,e,f,g,h):l.call(null,a,b,c,d,e,f,g,h)};m.ha=function(a,b,c,d,e,f,g,h,k){var l=this.h.ha?this.h.ha(a,b,c,d,e,f,g,h,k):this.h.call(null,a,b,c,d,e,f,g,h,k),n=Qg(this,l);v(n)||Ng(this.name,l);return n.ha?n.ha(a,b,c,d,e,f,g,h,k):n.call(null,a,b,c,d,e,f,g,h,k)};
m.X=function(a,b,c,d,e,f,g,h,k,l){var n=this.h.X?this.h.X(a,b,c,d,e,f,g,h,k,l):this.h.call(null,a,b,c,d,e,f,g,h,k,l),p=Qg(this,n);v(p)||Ng(this.name,n);return p.X?p.X(a,b,c,d,e,f,g,h,k,l):p.call(null,a,b,c,d,e,f,g,h,k,l)};m.Y=function(a,b,c,d,e,f,g,h,k,l,n){var p=this.h.Y?this.h.Y(a,b,c,d,e,f,g,h,k,l,n):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n),q=Qg(this,p);v(q)||Ng(this.name,p);return q.Y?q.Y(a,b,c,d,e,f,g,h,k,l,n):q.call(null,a,b,c,d,e,f,g,h,k,l,n)};
m.Z=function(a,b,c,d,e,f,g,h,k,l,n,p){var q=this.h.Z?this.h.Z(a,b,c,d,e,f,g,h,k,l,n,p):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p),r=Qg(this,q);v(r)||Ng(this.name,q);return r.Z?r.Z(a,b,c,d,e,f,g,h,k,l,n,p):r.call(null,a,b,c,d,e,f,g,h,k,l,n,p)};m.$=function(a,b,c,d,e,f,g,h,k,l,n,p,q){var r=this.h.$?this.h.$(a,b,c,d,e,f,g,h,k,l,n,p,q):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q),s=Qg(this,r);v(s)||Ng(this.name,r);return s.$?s.$(a,b,c,d,e,f,g,h,k,l,n,p,q):s.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q)};
m.aa=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r){var s=this.h.aa?this.h.aa(a,b,c,d,e,f,g,h,k,l,n,p,q,r):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r),w=Qg(this,s);v(w)||Ng(this.name,s);return w.aa?w.aa(a,b,c,d,e,f,g,h,k,l,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r)};
m.ba=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s){var w=this.h.ba?this.h.ba(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s),z=Qg(this,w);v(z)||Ng(this.name,w);return z.ba?z.ba(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s):z.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s)};
m.ca=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w){var z=this.h.ca?this.h.ca(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w),B=Qg(this,z);v(B)||Ng(this.name,z);return B.ca?B.ca(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w):B.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w)};
m.da=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z){var B=this.h.da?this.h.da(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z),F=Qg(this,B);v(F)||Ng(this.name,B);return F.da?F.da(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z):F.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z)};
m.ea=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B){var F=this.h.ea?this.h.ea(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B),N=Qg(this,F);v(N)||Ng(this.name,F);return N.ea?N.ea(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B):N.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B)};
m.fa=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F){var N=this.h.fa?this.h.fa(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F),O=Qg(this,N);v(O)||Ng(this.name,N);return O.fa?O.fa(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F):O.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F)};
m.ga=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N){var O=this.h.ga?this.h.ga(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N):this.h.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N),aa=Qg(this,O);v(aa)||Ng(this.name,O);return aa.ga?aa.ga(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N):aa.call(null,a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N)};
m.Lb=function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O){var aa=S.d(this.h,a,b,c,d,M([e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O],0)),D=Qg(this,aa);v(D)||Ng(this.name,aa);return S.d(D,a,b,c,d,M([e,f,g,h,k,l,n,p,q,r,s,w,z,B,F,N,O],0))};function Rg(a){this.Fb=a;this.q=0;this.j=2153775104}Rg.prototype.C=function(){for(var a=ie.d(M([this],0)),b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=4294967296;return b};Rg.prototype.v=function(a,b){return Fb(b,[A('#uuid "'),A(this.Fb),A('"')].join(""))};
Rg.prototype.B=function(a,b){return b instanceof Rg&&this.Fb===b.Fb};Rg.prototype.toString=function(){return this.Fb};var Sg;a:{var Tg=ba.navigator;if(Tg){var Ug=Tg.userAgent;if(Ug){Sg=Ug;break a}}Sg=""}function Vg(a){return-1!=Sg.indexOf(a)};var Wg=Vg("Opera")||Vg("OPR"),Xg=Vg("Trident")||Vg("MSIE"),Yg=Vg("Gecko")&&-1==Sg.toLowerCase().indexOf("webkit")&&!(Vg("Trident")||Vg("MSIE")),Zg=-1!=Sg.toLowerCase().indexOf("webkit");(function(){var a="",b;if(Wg&&ba.opera)return a=ba.opera.version,"function"==t(a)?a():a;Yg?b=/rv\:([^\);]+)(\)|;)/:Xg?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Zg&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Sg))?a[1]:"");return Xg&&(b=(b=ba.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var $g=null,ah=null,bh=Yg||Zg||Wg||"function"==typeof ba.atob;function ch(){if(!$g){$g={};ah={};for(var a=0;65>a;a++)$g[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a),ah[$g[a]]=a}};var dh=new T(null,"y","y",-1757859776),eh=new T(null,"scale-objects","scale-objects",141326624),fh=new T(null,"removeLineSegment","removeLineSegment",-885588704),gh=new T(null,"prefer-low-power-to-high-performance","prefer-low-power-to-high-performance",173664672),hh=new T(null,"post-render","post-render",-563595808),ih=new T(null,"clampLower","clampLower",1717322432),jh=new T(null,"point-buffer","point-buffer",-38210816),kh=new T(null,"rgb_f","rgb_f",219331681),lh=new T(null,"preserve-drawing-buffer",
"preserve-drawing-buffer",-529745663),mh=new T(null,"capabilities","capabilities",212739361),nh=new T(null,"projectionMatrix","projectionMatrix",-1041365631),oh=new T(null,"addPropertyListener","addPropertyListener",1694623393),ph=new T(null,"point-stride","point-stride",-2087796991),qh=new T(null,"maxs","maxs",1684246818),rh=new T(null,"imap_f","imap_f",-1429024414),sh=new T(null,"rx","rx",1627208482),th=new T(null,"root-state","root-state",1050879363),uh=new T(null,"blend-function","blend-function",
1123696099),vh=new T(null,"attribs-id","attribs-id",-2063052093),wh=new T(null,"data-type","data-type",-326421468),xh=new T(null,"transform","transform",1381301764),Ba=new T(null,"meta","meta",1499536964),yh=new T(null,"screen","screen",1990059748),zh=new T(null,"modelMatrix","modelMatrix",-1126355100),Ah=new T(null,"planes","planes",-1342990364),Bh=new T(null,"color","color",1011675173),Ch=new T(null,"uv-range","uv-range",210839749),Dh=new T(null,"modelViewMatrix","modelViewMatrix",-411575099),Eh=
new T(null,"render-engine","render-engine",-1649726203),Da=new T(null,"dup","dup",556298533),Fh=new T(null,"preferLowPowerToHighPerformance","preferLowPowerToHighPerformance",-71326203),Gh=new T(null,"setTargetPosition","setTargetPosition",-1252850939),Hh=new T(null,"intensityBlend","intensityBlend",-1646375738),Ih=new T(null,"projectToImage","projectToImage",56107302),Jh=new T(null,"antialias","antialias",-2073640634),Kh=new T(null,"int","int",-1741416922),Lh=new T(null,"clear-color","clear-color",
-1380949274),Mh=new T(null,"bbox-params","bbox-params",531518246),Nh=new T(null,"ks","ks",1900203942),Oh=new T(null,"offset","offset",296498311),Ph=new T(null,"addLineSegment","addLineSegment",1311078599),Qh=new T(null,"db","db",993250759),Rh=new T(null,"setEyePosition","setEyePosition",-2116625977),Sh=new T(null,"tex","tex",1307057959),Th=new T(null,"uniforms","uniforms",-782808153),ge=new T(null,"validator","validator",-1966190681),Uh=new T(null,"intensity_f","intensity_f",748556456),Vh=new T(null,
"default","default",-1987822328),Wh=new T(null,"vec3","vec3",1116680488),Xh=new T(null,"finally-block","finally-block",832982472),ii=new T(null,"float","float",-1732389368),ji=new T(null,"xyzScale","xyzScale",1117901384),ki=new T(null,"new","new",-2085437848),li=new T(null,"transpose","transpose",-474726680),mi=new T(null,"height_f","height_f",-25417944),ni=new T(null,"warn","warn",-436710552),oi=new T(null,"modelViewProjectionMatrix","modelViewProjectionMatrix",-1012685944),pi=new T(null,"name",
"name",1843675177),qi=new T(null,"eye","eye",-1788770007),ri=new T(null,"source-state","source-state",-1680383479),si=new T(null,"fail-if-major-performance-caveat","fail-if-major-performance-caveat",333849513),ti=new T(null,"render-count","render-count",-875399191),ui=new T(null,"addScaleObject","addScaleObject",-892724118),vi=new T(null,"updateCamera","updateCamera",723584298),wi=new T(null,"model-matrix","model-matrix",-53072598),xi=new T(null,"pickPoint","pickPoint",830964042),yi=new T(null,"dirty?",
"dirty?",-2059845846),zi=new T(null,"attrib-loader","attrib-loader",-280099829),Ai=new T(null,"width","width",-384071477),Bi=new T(null,"start","start",-355208981),Ci=new T(null,"blend-func","blend-func",-276929269),Di=new T(null,"render-options","render-options",686799147),Ei=new T(null,"total-points","total-points",2142237035),Fi=new T(null,"premultipliedAlpha","premultipliedAlpha",1701284427),Gi=new T(null,"element-array","element-array",38145164),Hi=new T(null,"removeAllScaleObjects","removeAllScaleObjects",
322968844),Ii=new T(null,"recur","recur",-437573268),Ji=new T(null,"pointSize","pointSize",-796733076),Ki=new T(null,"type","type",1174270348),Li=new T(null,"setClearColor","setClearColor",-509340244),Mi=new T(null,"premultiplied-alpha","premultiplied-alpha",-307675636),Ni=new T(null,"catch-block","catch-block",1175212748),Oi=new T(null,"mins","mins",467369676),Pi=new T(null,"state","state",-1988618099),Qi=new T(null,"point-buffers","point-buffers",-1078372979),Ri=new T(null,"generate-mipmaps?","generate-mipmaps?",
-1559457203),za=new T(null,"flush-on-newline","flush-on-newline",-151457939),Si=new T(null,"setRenderViewSize","setRenderViewSize",-507877395),Ti=new T(null,"line-segments","line-segments",-1922797234),Ui=new T(null,"removeAllLineSegments","removeAllLineSegments",1104736622),Vi=new T(null,"vec4","vec4",631182126),Wi=new T(null,"fov","fov",-12463282),Xi=new T(null,"colorClampLower","colorClampLower",-1918104626),Dg=new T(null,"descendants","descendants",1824886031),Eg=new T(null,"ancestors","ancestors",
-776045424),Yi=new T(null,"circularPoints","circularPoints",1774672048),Zi=new T(null,"run-state","run-state",-1367818032),$i=new T(null,"addCamera","addCamera",2121447888),Aa=new T(null,"readably","readably",1129599760),aj=new T(null,"vec2","vec2",-762258640),bj=new T(null,"failIfMajorPerformanceCaveat","failIfMajorPerformanceCaveat",200641649),cj=new T(null,"level-of-detail","level-of-detail",1817545009),dj=new T(null,"position-location","position-location",1180175729),ej=new T(null,"z","z",-789527183),
fj=new T(null,"normalized?","normalized?",1246099953),gj=new T(null,"clampHigher","clampHigher",-413004015),hj=new T(null,"uvrange","uvrange",314855538),ij=new T(null,"components-per-vertex","components-per-vertex",426723635),jj=new T(null,"which","which",-1255268941),kj=new T(null,"priority","priority",1431093715),lj=new T(null,"removePointBuffer","removePointBuffer",-843939341),mj=new T(null,"overlay_f","overlay_f",-186818893),nj=new T(null,"picker-state","picker-state",-1624666221),Ea=new T(null,
"print-length","print-length",1931866356),oj=new T(null,"active","active",1895962068),pj=new T(null,"gl-buffer","gl-buffer",-1511334444),qj=new T(null,"applyState","applyState",-2022659564),rj=new T(null,"values","values",372645556),sj=new T(null,"addPostRender","addPostRender",834952916),tj=new T(null,"rt","rt",623480692),uj=new T(null,"catch-exception","catch-exception",-1997306795),vj=new T(null,"updateLineSegment","updateLineSegment",1278790869),wj=new T(null,"preserveDrawingBuffer","preserveDrawingBuffer",
187464949),Cg=new T(null,"parents","parents",-2027538891),xj=new T(null,"dp","dp",-1761626539),yj=new T(null,"count","count",2139924085),zj=new T(null,"image-overlay","image-overlay",-1999919467),Aj=new T(null,"addPointBuffer","addPointBuffer",1076136853),Bj=new T(null,"prev","prev",-1597069226),Cj=new T(null,"draw-mode","draw-mode",-1830018794),Dj=new T(null,"info","info",-317069002),Ej=new T(null,"continue-block","continue-block",-1852047850),Fj=new T(null,"mat4","mat4",-237531594),Gj=new T(null,
"fb","fb",-1331669322),Hj=new T(null,"gl","gl",-246422634),Ij=new T(null,"alpha","alpha",-1574982441),Jj=new T(null,"pixel-store-modes","pixel-store-modes",1198746295),Kj=new T(null,"iheight_f","iheight_f",889620311),Lj=new T(null,"internal-pixel-format","internal-pixel-format",-618695817),Mj=new T(null,"display","display",242065432),Nj=new T(null,"pixel-format","pixel-format",-1609978632),Oj=new T(null,"image","image",-58725096),Pj=new T(null,"pointSizeAttenuation","pointSizeAttenuation",1923082712),
Qj=new T(null,"near","near",-1077668328),Rj=new T(null,"error","error",-978969032),Sj=new T(null,"depth","depth",1768663640),Tj=new T(null,"textures","textures",560681081),Uj=new T(null,"x","x",2099068185),Vj=new T(null,"zrange","zrange",-168408615),Wj=new T(null,"setRenderOptions","setRenderOptions",641207801),Xj=new T(null,"proj","proj",1560823673),Yj=new T(null,"class_f","class_f",-815706183),Zj=new T(null,"do_plane_clipping","do_plane_clipping",-1395404871),ak=new T(null,"klassRange","klassRange",
664134617),bk=new T(null,"target","target",253001721),ck=new T(null,"first","first",-644103046),dk=new T(null,"far","far",85807546),ek=new T(null,"end","end",-268185958),fk=new T(null,"visible","visible",-1024216805),gk=new T(null,"hierarchy","hierarchy",-1053470341),hk=new T(null,"map_f","map_f",686095835),ik=new T(null,"render-target","render-target",-567835109),jk=new T(null,"viewport","viewport",443342715),kk=new T(null,"loaders","loaders",1141127131),lk=new T(null,"attributes","attributes",-74013604),
mk=new T(null,"location","location",1815599388),nk=new T(null,"parameters","parameters",-1229919748),xg=new T(null,"keywordize-keys","keywordize-keys",1310784252),ok=new T(null,"cameras","cameras",-1446544612),pk=new T(null,"texture-unit","texture-unit",-731109059),qk=new T(null,"point-size","point-size",-2123819651),rk=new T(null,"removePropertyListener","removePropertyListener",1093641661),sk=new T(null,"map","map",1371690461),tk=new T(null,"stride","stride",-1172818435),uk=new T(null,"rz","rz",
386461181),vk=new T(null,"texture","texture",-266291651),wk=new T(null,"ry","ry",-334598563),xk=new T(null,"maxColorComponent","maxColorComponent",-1941390691),yk=new T(null,"shader","shader",1492833021),zk=new T(null,"picker","picker",-659389603),Ak=new T(null,"dirt","dirt",-349415459),Bk=new T(null,"addLoader","addLoader",-1562689378),Ck=new T(null,"buffer","buffer",617295198),Dk=new T(null,"stencil","stencil",-1049110946),Ek=new T(null,"view","view",1247994814),Vk=new T(null,"old","old",-1825222690),
Wk=new T(null,"height","height",1025178622),Sf=new T("cljs.core","not-found","cljs.core/not-found",-1572889185),Xk=new T(null,"sstate","sstate",-2029164673),Yk=new T(null,"colorClampHigher","colorClampHigher",760735679);var Zk=oc,Zk=function(){var a=window.requestAnimationFrame;if(v(a))return a;var b=window.webkitRequestAnimationFrame;if(v(b))return b;var c=widnow.mozRequestAnimationFrame;if(v(c))return c;var d=window.msRequestAnimationFrame;return v(d)?d:function(a,b,c,d){return function(k){return window.setTimeout(function(){return function(){var a=(new Date).getTime();return k.a?k.a(a):k.call(null,a)}}(a,b,c,d),10)}}(d,c,b,a)}(),$k=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-
1);e<f.length;)f[e]=arguments[e+1],++e;e=new G(f,0)}return b.call(this,a,e)}function b(a,b){function e(){return S.b(a,b)}return Zk.a?Zk.a(e):Zk.call(null,e)}a.l=1;a.g=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();function al(a,b,c){var d=function(){var a=new u(null,3,[yi,!1,Vk,null,ki,null],null);return V.a?V.a(a):V.call(null,a)}();og(a,b,function(d){return function(f,g,h,k){f=function(){var a=Vk.a(K.a?K.a(d):K.call(null,d));return v(a)?a:h}();je.d(d,Pc,Vk,f,M([ki,k],0));if(v(yi.a(K.a?K.a(d):K.call(null,d))))return null;je.i(d,Pc,yi,!0);return $k(function(d,e,f){return function(){var d=Vk.a(K.a?K.a(f):K.call(null,f)),e=ki.a(K.a?K.a(f):K.call(null,f));c.i?c.i(a,b,d,e):c.call(null,a,b,d,e);return je.d(f,Pc,
yi,!1,M([Vk,null,ki,null],0))}}(f,k,d))}}(d))}
function bl(a){var b=JSON.stringify(a);if(bh)a=ba.btoa(b);else{a=[];for(var c=0,d=0;d<b.length;d++){for(var e=b.charCodeAt(d);255<e;)a[c++]=e&255,e>>=8;a[c++]=e}b=t(a);if("array"!=b&&("object"!=b||"number"!=typeof a.length))throw Error("encodeByteArray takes an array as a parameter");ch();b=$g;c=[];for(d=0;d<a.length;d+=3){var f=a[d],g=(e=d+1<a.length)?a[d+1]:0,h=d+2<a.length,k=h?a[d+2]:0,l=f>>2,f=(f&3)<<4|g>>4,g=(g&15)<<2|k>>6,k=k&63;h||(k=64,e||(g=64));c.push(b[l],b[f],b[g],b[k])}a=c.join("")}return a}
function cl(a){var b;if(bh)b=ba.atob(a);else{ch();var c=ah;b=[];for(var d=0;d<a.length;){var e=c[a.charAt(d++)],f=d<a.length?c[a.charAt(d)]:0;++d;var g=d<a.length?c[a.charAt(d)]:64;++d;var h=d<a.length?c[a.charAt(d)]:64;++d;if(null==e||null==f||null==g||null==h)throw Error();b.push(e<<2|f>>4);64!=g&&(b.push(f<<4&240|g>>2),64!=h&&b.push(g<<6&192|h))}if(8192>b.length)b=String.fromCharCode.apply(null,b);else{a="";for(c=0;c<b.length;c+=8192)a+=String.fromCharCode.apply(null,qa(b,c,c+8192));b=a}}return JSON.parse(b)}
;var dl,el,fl;function gl(a,b){if(a?a.Qb:a)return a.Qb(0,b);var c;c=gl[t(null==a?null:a)];if(!c&&(c=gl._,!c))throw y("ReadPort.take!",a);return c.call(null,a,b)}function hl(a,b,c){if(a?a.zb:a)return a.zb(0,b,c);var d;d=hl[t(null==a?null:a)];if(!d&&(d=hl._,!d))throw y("WritePort.put!",a);return d.call(null,a,b,c)}function il(a){if(a?a.yb:a)return a.yb();var b;b=il[t(null==a?null:a)];if(!b&&(b=il._,!b))throw y("Channel.close!",a);return b.call(null,a)}
function jl(a){if(a?a.ua:a)return a.ua(a);var b;b=jl[t(null==a?null:a)];if(!b&&(b=jl._,!b))throw y("Handler.active?",a);return b.call(null,a)}function kl(a){if(a?a.qa:a)return a.qa(a);var b;b=kl[t(null==a?null:a)];if(!b&&(b=kl._,!b))throw y("Handler.commit",a);return b.call(null,a)}function ll(a,b){if(a?a.dc:a)return a.dc(0,b);var c;c=ll[t(null==a?null:a)];if(!c&&(c=ll._,!c))throw y("Buffer.add!*",a);return c.call(null,a,b)}
var ml=function(){function a(a,b){if(null==b)throw Error([A("Assert failed: "),A(ie.d(M([xd(new mc(null,"not","not",1044554643,null),xd(new mc(null,"nil?","nil?",1612038930,null),new mc(null,"itm","itm",-713282527,null)))],0)))].join(""));return ll(a,b)}var b=null,b=function(b,d){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a){return a};b.b=a;return b}();var nl,pl=function ol(b){"undefined"===typeof nl&&(nl=function(b,d,e){this.mb=b;this.Sb=d;this.nd=e;this.q=0;this.j=393216},nl.prototype.ua=function(){return!0},nl.prototype.qa=function(){return this.mb},nl.prototype.A=function(){return this.nd},nl.prototype.D=function(b,d){return new nl(this.mb,this.Sb,d)},nl.Za=!0,nl.Ya="cljs.core.async.impl.ioc-helpers/t26587",nl.lb=function(b,d){return Fb(d,"cljs.core.async.impl.ioc-helpers/t26587")});return new nl(b,ol,Z)};
function ql(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].yb(),b;}}function rl(a,b,c){c=c.Qb(0,pl(function(c){a[2]=c;a[1]=b;return ql(a)}));return v(c)?(a[2]=K.a?K.a(c):K.call(null,c),a[1]=b,Ii):null}function sl(a,b,c,d){c=c.zb(0,d,pl(function(c){a[2]=c;a[1]=b;return ql(a)}));return v(c)?(a[2]=K.a?K.a(c):K.call(null,c),a[1]=b,Ii):null}function tl(a,b){var c=a[6];null!=b&&c.zb(0,b,pl(function(){return function(){return null}}(c)));c.yb();return c}
function ul(a){for(;;){var b=a[4],c=Ni.a(b),d=uj.a(b),e=a[5];if(v(function(){var a=e;return v(a)?Ga(b):a}()))throw e;if(v(function(){var a=e;return v(a)?(a=c,v(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Pc.d(b,Ni,null,M([uj,null],0));break}if(v(function(){var a=e;return v(a)?Ga(c)&&Ga(Xh.a(b)):a}()))a[4]=Bj.a(b);else{if(v(function(){var a=e;return v(a)?(a=Ga(c))?Xh.a(b):a:a}())){a[1]=Xh.a(b);a[4]=Pc.c(b,Xh,null);break}if(v(function(){var a=Ga(e);return a?Xh.a(b):a}())){a[1]=Xh.a(b);
a[4]=Pc.c(b,Xh,null);break}if(Ga(e)&&Ga(Xh.a(b))){a[1]=Ej.a(b);a[4]=Bj.a(b);break}throw Error("No matching clause");}}};var vl;
function wl(){var a=ba.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&(a=function(){var a=document.createElement("iframe");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ia(function(a){if(a.origin==d||a.data==c)this.port1.onmessage()},this);
b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a){var b=new a,c={},d=c;b.port1.onmessage=function(){c=c.next;var a=c.eb;c.eb=null;a()};return function(a){d.next={eb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("script")?function(a){var b=document.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);
b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){ba.setTimeout(a,0)}};var xl=function(){function a(a,b){var c=new u(null,8,[Ij,!0,Sj,!0,Dk,!1,Jh,!0,Mi,!0,lh,!1,gh,!1,si,!1],null),c=function(){return function(a){var b=ed(a)?S.b(fe,a):a;a=R.b(b,si);var c=R.b(b,gh),d=R.b(b,lh),e=R.b(b,Mi),f=R.b(b,Jh),g=R.b(b,Dk),s=R.b(b,Sj),b=R.b(b,Ij);return tg(new u(null,8,[Ij,b,Sj,s,Dk,g,Jh,f,Fi,e,wj,d,Fh,c,bj,a],null))}}(c)(Qf.d(M([c,b],0))),g=a.getContext("experimental-webgl",c);return v(g)?g:a.getContext("webgl",c)}function b(a){return c.b(a,Z)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,
c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function yl(a,b,c){return a.getAttribLocation(b,c)}function zl(a,b,c){b=a.createShader(b);a.shaderSource(b,c);a.compileShader(b);if(!v(a.getShaderParameter(b,35713)))throw Error(a.getShaderInfoLog(b));return b}
var Al=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new G(f,0)}return b.call(this,a,e)}function b(a,b){for(var e=a.createProgram(),f=E(b),g=null,h=0,k=0;;)if(k<h){var l=g.t(null,k);a.attachShader(e,l);k+=1}else if(f=E(f))g=f,$c(g)?(f=Sb(g),k=Tb(g),g=f,h=P(f),f=k):(f=H(g),a.attachShader(e,f),f=J(g),g=null,h=0),k=0;else break;a.linkProgram(e);if(!v(a.getProgramParameter(e,35714)))throw Error("Could not initialize shaders");
a.useProgram(e);return e}a.l=1;a.g=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();function Bl(a){return new Float32Array(tg(a))};var Cl=function(){function a(a,d,e,f,g){var h=null;if(4<arguments.length){for(var h=0,k=Array(arguments.length-4);h<k.length;)k[h]=arguments[h+4],++h;h=new G(k,0)}return b.call(this,a,d,e,f,h)}function b(a,b,e,f,g){g=Q.c(g,0,null);var h=a.createBuffer();a.bindBuffer(e,h);a.bufferData(e,b,f);v(g)&&(h.jd=g,h.Gd=od(b.length,g));return h}a.l=4;a.g=function(a){var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=J(a);var g=H(a);a=I(a);return b(d,e,f,g,a)};a.d=b;return a}();
function Dl(a,b,c,d,e){a.clearColor(b,c,d,e);a.clear(16384);return a}function El(a){a.clearDepth(1);a.clear(256)}
function Fl(a,b,c){var d=ed(c)?S.b(fe,c):c;c=R.b(d,li);var e=R.b(d,rj),f=R.b(d,Ki),d=R.b(d,pi);b=a.getUniformLocation(b,d);switch(f instanceof T?f.ra:null){case "bvec3":a.uniform3fv(b,e);break;case "int":a.uniform1iv(b,e);break;case "mat3":a.uniformMatrix3fv(b,c,e);break;case "vec3":a.uniform3fv(b,e);break;case "float":a.uniform1fv(b,e);break;case "ivec4":a.uniform4iv(b,e);break;case "mat2":a.uniformMatrix2fv(b,c,e);break;case "ivec2":a.uniform2iv(b,e);break;case "vec4":a.uniform4fv(b,e);break;case "vec2":a.uniform2fv(b,
e);break;case "bvec2":a.uniform2fv(b,e);break;case "mat4":a.uniformMatrix4fv(b,c,e);break;case "bvec4":a.uniform4fv(b,e);break;case "bool":a.uniform1fv(b,e);break;case "ivec3":a.uniform3iv(b,e);break}}function Gl(a,b){var c=ed(b)?S.b(fe,b):b,d=R.b(c,Oh),e=R.b(c,tk),f=R.b(c,fj),g=R.b(c,Ki),h=R.b(c,ij),k=R.b(c,mk),c=R.b(c,Ck);a.bindBuffer(34962,c);a.enableVertexAttribArray(k);a.vertexAttribPointer(k,v(h)?h:c.jd,v(g)?g:5126,v(f)?f:!1,v(e)?e:0,v(d)?d:0)}
function Hl(a,b,c){var d=ed(c)?S.b(fe,c):c;R.b(d,pk);c=R.b(d,pi);d=R.b(d,vk);a.activeTexture(33984);a.bindTexture(3553,d);a.uniform1i(a.getUniformLocation(b,c),0)}
var Il=Oc([2960,3024,2929,3042,3089,32926,32823,2884,32928],[!1,!0,!1,!1,!1,!1,!1,!1,!1]),Jl=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new G(f,0)}return b.call(this,a,e)}function b(a,b){var e=ed(b)?S.b(fe,b):b,f=R.b(e,Tj),g=R.b(e,ck),h=R.b(e,jk),k=R.b(e,lk),l=R.b(e,yk),n=R.b(e,mh),p=R.b(e,uh),q=R.b(e,Th),r=R.b(e,Gi),s=R.b(e,yj),w=R.b(e,Cj),z=v(h)?h:new u(null,4,[Uj,0,dh,0,Ai,a.drawingBufferWidth,Wk,a.drawingBufferHeight],
null),B=ed(z)?S.b(fe,z):z,F=R.b(B,Wk),N=R.b(B,Ai),O=R.b(B,dh),aa=R.b(B,Uj);a.viewport(aa,O,N,F);a.useProgram(l);for(var D=E(q),la=null,U=0,X=0;;)if(X<U){var $=la.t(null,X);Fl(a,l,$);X+=1}else{var ga=E(D);if(ga){var da=ga;if($c(da))var ma=Sb(da),pa=Tb(da),ta=ma,ya=P(ma),D=pa,la=ta,U=ya;else{var Ca=H(da);Fl(a,l,Ca);D=J(da);la=null;U=0}X=0}else break}for(var pb=E(k),Fa=null,Ma=0,Na=0;;)if(Na<Ma){var fb=Fa.t(null,Na);Gl(a,fb);Na+=1}else{var lb=E(pb);if(lb){var gb=lb;if($c(gb))var Mb=Sb(gb),Dc=Tb(gb),
jd=Mb,pe=P(Mb),pb=Dc,Fa=jd,Ma=pe;else{var hm=H(gb);Gl(a,hm);pb=J(gb);Fa=null;Ma=0}Na=0}else break}for(var Rd=E(f),Yh=null,Zh=0,Te=0;;)if(Te<Zh){var Bn=Yh.t(null,Te);Hl(a,l,Bn);Te+=1}else{var Fk=E(Rd);if(Fk){var Ue=Fk;if($c(Ue))var Gk=Sb(Ue),Cn=Tb(Ue),Dn=Gk,En=P(Gk),Rd=Cn,Yh=Dn,Zh=En;else{var Fn=H(Ue);Hl(a,l,Fn);Rd=J(Ue);Yh=null;Zh=0}Te=0}else break}for(var $h=E(Qf.d(M([Il,n],0))),ai=null,bi=0,Ve=0;;)if(Ve<bi){var Hk=ai.t(null,Ve),Gn=Q.c(Hk,0,null),Hn=Q.c(Hk,1,null),Ik=a,Jk=Gn;v(Hn)?Ik.enable(Jk):
Ik.disable(Jk);Ve+=1}else{var Kk=E($h);if(Kk){var We=Kk;if($c(We))var Lk=Sb(We),In=Tb(We),Jn=Lk,Kn=P(Lk),$h=In,ai=Jn,bi=Kn;else{var Mk=H(We),Ln=Q.c(Mk,0,null),Mn=Q.c(Mk,1,null),Nk=a,Ok=Ln;v(Mn)?Nk.enable(Ok):Nk.disable(Ok);$h=J(We);ai=null;bi=0}Ve=0}else break}null==r?a.drawArrays(w,v(g)?g:0,s):(a.bindBuffer(34963,Ck.a(r)),a.drawElements(w,s,Ki.a(r),Oh.a(r)));for(var ci=E(k),di=null,ei=0,Xe=0;;)if(Xe<ei){var Nn=di.t(null,Xe);a.disableVertexAttribArray(mk.a(Nn));Xe+=1}else{var Pk=E(ci);if(Pk){var Ye=
Pk;if($c(Ye))var Qk=Sb(Ye),On=Tb(Ye),Pn=Qk,Qn=P(Qk),ci=On,di=Pn,ei=Qn;else{var Rn=H(Ye);a.disableVertexAttribArray(mk.a(Rn));ci=J(Ye);di=null;ei=0}Xe=0}else break}for(var fi=E(p),gi=null,hi=0,Ze=0;;)if(Ze<hi){var Rk=gi.t(null,Ze),Sn=Q.c(Rk,0,null),Tn=Q.c(Rk,1,null);a.blendFunc(Sn,Tn);Ze+=1}else{var Sk=E(fi);if(Sk){var $e=Sk;if($c($e))var Tk=Sb($e),Un=Tb($e),Vn=Tk,Wn=P(Tk),fi=Un,gi=Vn,hi=Wn;else{var Uk=H($e),Xn=Q.c(Uk,0,null),Yn=Q.c(Uk,1,null);a.blendFunc(Xn,Yn);fi=J($e);gi=null;hi=0}Ze=0}else break}return a}
a.l=1;a.g=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();var ua=!1,sa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Pa.a?Pa.a(a):Pa.call(null,a))}a.l=0;a.g=function(a){a=E(a);return b(a)};a.d=b;return a}(),Kl=new u(null,3,[Dj,"INFO",ni,"WARN",Rj,"ERROR"],null),Ll=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+
1],++e;e=new G(f,0)}return b.call(this,a,e)}function b(a,b){return v(!1)?S.c(ng,a.a?a.a(Kl):a.call(null,Kl),b):null}a.l=1;a.g=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}(),Ml=de.b(Ll,Dj);de.b(Ll,ni);de.b(Ll,Rj);function Nl(){function a(){return zg(16).toString(16)}return new Rg((new na(a(),a(),a(),a(),a(),a(),a(),a(),"-",a(),a(),a(),a(),"-4",a(),a(),a(),"-",(8|3&zg(15)).toString(16),a(),a(),a(),"-",a(),a(),a(),a(),a(),a(),a(),a(),a(),a(),a(),a())).toString())};var Ol=new rf([37440,!1,37441,!1,37443,!1,3317,4,3333,4]),Pl=function(){function a(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new G(f,0)}return b.call(this,a,e)}function b(a,b){var e=ed(b)?S.b(fe,b):b,f=R.b(e,nk);R.b(e,wh);var g=R.b(e,Nj),h=R.b(e,Lj),k=R.b(e,cj),l=R.b(e,Ri),n=R.b(e,Jj),p=R.b(e,bk),q=R.b(e,Oj),e=a.createTexture(),p=v(p)?p:3553,n=Qf.d(M([Ol,n],0));a.bindTexture(p,e);for(var n=E(n),r=null,s=0,w=0;;)if(w<s){var z=
r.t(null,w),B=Q.c(z,0,null),z=Q.c(z,1,null);a.pixelStorei(B,z);w+=1}else if(n=E(n))$c(n)?(s=Sb(n),n=Tb(n),r=s,s=P(s)):(s=H(n),r=Q.c(s,0,null),s=Q.c(s,1,null),a.pixelStorei(r,s),n=J(n),r=null,s=0),w=0;else break;a.texImage2D(p,v(k)?k:0,v(h)?h:6408,v(g)?g:6408,5121,q);f=E(f);g=null;for(k=h=0;;)if(k<h)n=g.t(null,k),q=Q.c(n,0,null),n=Q.c(n,1,null),a.texParameteri(p,q,n),k+=1;else if(f=E(f))$c(f)?(h=Sb(f),f=Tb(f),g=h,h=P(h)):(h=H(f),g=Q.c(h,0,null),h=Q.c(h,1,null),a.texParameteri(p,g,h),f=J(f),g=null,
h=0),k=0;else break;v(l)&&a.generateMipmap(p);a.bindTexture(p,null);return e}a.l=1;a.g=function(a){var d=H(a);a=I(a);return b(d,a)};a.d=b;return a}();function Ql(a){var b=zl(a,35633,Rl),c=zl(a,35632,Sl);return Al.d(a,M([b,c],0))}
var Tl=V.a?V.a(null):V.call(null,null),Wl=function(a){return function(b){var c=K.a?K.a(a):K.call(null,a);if(v(c))return c;var c=zl(b,35633,Ul),d=zl(b,35632,Vl);b=Al.d(b,M([c,d],0));he.b?he.b(a,b):he.call(null,a,b);return b}}(V.a?V.a(null):V.call(null,null)),Zl=function(a){return function(b){var c=K.a?K.a(a):K.call(null,a);if(v(c))return c;var c=zl(b,35633,Xl),d=zl(b,35632,Yl);b=Al.d(b,M([c,d],0));return he.b?he.b(a,b):he.call(null,a,b)}}(V.a?V.a(null):V.call(null,null)),Rl="precision mediump float;\n\n   uniform mat4  projectionMatrix;\n   uniform mat4  modelViewMatrix;\n   uniform mat4  modelViewProjectionMatrix;\n   uniform mat4  modelMatrix;\n\n   uniform float pointSize;\n   uniform vec3 xyzScale;\n   uniform vec2 zrange;\n   uniform vec3 offset;\n   uniform vec3 which;\n\n   attribute vec3 position;\n\n   varying vec3 xyz;\n\n   void main() {\n       vec3 fpos \x3d ((position.xyz - offset) * xyzScale).xzy * vec3(-1, 1, 1);\n       vec4 worldPos \x3d modelMatrix * vec4(fpos, 1.0);\n       vec4 mvPosition \x3d modelViewMatrix * worldPos;\n       gl_Position \x3d projectionMatrix * mvPosition;\n       gl_PointSize \x3d pointSize;\n       xyz \x3d which * worldPos.xyz;\n   }",
Sl="precision mediump float;\n\n   varying vec3 xyz;\n   float shift_right(float v, float amt) {\n       v \x3d floor(v) + 0.5;\n       return floor(v / exp2(amt));\n   }\n\n   float shift_left(float v, float amt) {\n       return floor(v * exp2(amt) + 0.5);\n   }\n\n   float mask_last(float v, float bits) {\n       return mod(v, shift_left(1.0, bits));\n   }\n\n   float extract_bits(float num, float from, float to) {\n       from \x3d floor(from + 0.5);\n       to \x3d floor(to + 0.5);\n       return mask_last(shift_right(num, from), to - from);\n   }\n\n   vec4 encode_float(float val) {\n       if (val \x3d\x3d 0.0)\n           return vec4(0, 0, 0, 0);\n\n\n\t   float sign \x3d val \x3e 0.0 ? 0.0 : 1.0;\n\t   val \x3d abs(val);\n       float exponent \x3d floor(log2(val));\n       float biased_exponent \x3d exponent + 127.0;\n       float fraction \x3d ((val / exp2(exponent)) - 1.0) * 8388608.0;\n\n       float t \x3d biased_exponent / 2.0;\n       float last_bit_of_biased_exponent \x3d fract(t) * 2.0;\n       float remaining_bits_of_biased_exponent \x3d floor(t);\n\n       float byte4 \x3d extract_bits(fraction, 0.0, 8.0) / 255.0;\n       float byte3 \x3d extract_bits(fraction, 8.0, 16.0) / 255.0;\n       float byte2 \x3d (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0;\n       float byte1 \x3d (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;\n       return vec4(byte4, byte3, byte2, byte1);\n   }\n\n   void main() {\n       float s \x3d xyz.x + xyz.y + xyz.z;\n\t   gl_FragColor \x3d encode_float(s); }",
Ul="precision mediump float;\n\n   uniform mat4  mv,p;\n   attribute vec3 position;\n\n   void main() {\n       gl_Position \x3d p * mv * vec4(position, 1.0);\n   }",Vl="\n  precision mediump float;\n\n  uniform vec3 color;\n  void main() {\n      gl_FragColor \x3d vec4(color, 1.0);\n  }",Xl="precision mediump float;\n\n   uniform mat4  p;\n   uniform vec2  loc;\n   uniform float size;\n   attribute vec3 position;\n\n   varying vec2 texcoord;\n\n   void main() {\n       texcoord \x3d position.xy * 0.5 + vec2(0.5, 0.5);\n       vec3 offset \x3d vec3(loc, 0.0);\n       gl_Position \x3d p * vec4(position * vec3(size, size, 1.0) + offset, 1.0);\n   }",
Yl="\n  precision mediump float;\n  varying vec2 texcoord;\n  uniform sampler2D sprite;\n\n  void main() {\n      vec4 col \x3d texture2D(sprite, texcoord);\n      if (col.a \x3c 0.1) discard;\n      gl_FragColor \x3d vec4(col.rgb, 1.0);\n  }";function $l(a){return null==a?Lc:Xc(a)?a:new W(null,1,5,Y,[a],null)}function am(a,b){var c=$l(a),d=$l(b);return Qd.b(c,d)}
function bm(a,b){return ue.b(Z,function(){return function d(b){return new Dd(null,function(){for(;;){var f=E(b);if(f){if($c(f)){var g=Sb(f),h=P(g),k=Hd(h);return function(){for(var b=0;;)if(b<h){var d=C.b(g,b),e=Q.c(d,0,null),f=Q.c(d,1,null),d=k,l=Y,n=e,e=new W(null,2,5,Y,[e,f],null),e=a.a?a.a(e):a.call(null,e);d.add(new W(null,2,5,l,[n,e],null));b+=1}else return!0}()?Kd(k.U(),d(Tb(f))):Kd(k.U(),null)}var l=H(f),n=Q.c(l,0,null),p=Q.c(l,1,null);return L(new W(null,2,5,Y,[n,function(){var b=new W(null,
2,5,Y,[n,p],null);return a.a?a.a(b):a.call(null,b)}()],null),d(I(f)))}return null}},null,null)}(b)}())}
var cm=function(a){return function(b,c,d){if(v(function(){var b=K.a?K.a(a):K.call(null,a);return v(b)?pc.b(Ai.a(K.a?K.a(a):K.call(null,a)),c)&&pc.b(Wk.a(K.a?K.a(a):K.call(null,a)),d):b}()))return K.a?K.a(a):K.call(null,a);var e=K.a?K.a(a):K.call(null,a),f=function(){var a=vk.a(e);if(!v(a)){var c,a=document.createElement("canvas");a.width=64;a.height=64;c=new W(null,2,5,Y,[a,a.getContext("2d")],null);a=Q.c(c,0,null);c=Q.c(c,1,null);c.beginPath();c.fillStyle="blue";c.strokeStyle="white";c.lineWidth=
4;c.arc(32,32,26,0,2*Math.PI,!1);c.fill();c.stroke();a=Pl.d(b,M([Oj,a,Ri,!0,Jj,new rf([37440,!0]),nk,new rf([10241,9985,10240,9729])],0))}return a}(),g=function(){var a=pj.a(e);return v(a)?a:Cl(b,new Float32Array([-1,-1,0,-1,1,0,1,1,0,-1,-1,0,1,1,0,1,-1,0]),34962,35044)}(),h=function(){var a;a=Xj.a(e);a=v(a)?a:mat4.create();return mat4.ortho(a,0,c,d,0,-10,10)}(),f=new u(null,3,[vk,f,pj,g,Xj,h],null);return he.b?he.b(a,f):he.call(null,a,f)}}(V.a?V.a(null):V.call(null,null));
function dm(a,b,c,d){var e=cm(a,c,d),f=ed(e)?S.b(fe,e):e,e=R.b(f,vk),g=R.b(f,pj),f=R.b(f,Xj),h=Zl(a),k=a.getUniformLocation(h,"position");b=E(b);for(var l=null,n=0,p=0;;)if(p<n){var q=l.t(null,p),r=Q.c(q,0,null),s=Q.c(q,1,null);Q.c(q,2,null);Jl.d(a,M([yk,h,Cj,4,jk,new u(null,4,[Uj,0,dh,0,Ai,c,Wk,d],null),ck,0,yj,6,mh,new rf([2929,!1]),Tj,new W(null,1,5,Y,[new u(null,2,[vk,e,pi,"sprite"],null)],null),Th,new W(null,3,5,Y,[new u(null,3,[pi,"loc",Ki,aj,rj,Bl(new W(null,2,5,Y,[r,s],null))],null),new u(null,
3,[pi,"p",Ki,Fj,rj,f],null),new u(null,3,[pi,"size",Ki,ii,rj,Bl(new W(null,1,5,Y,[10],null))],null)],null),lk,new W(null,1,5,Y,[new u(null,5,[mk,k,ij,3,Ki,5126,tk,12,Ck,g],null)],null)],0));p+=1}else if(b=E(b))$c(b)?(s=Sb(b),b=Tb(b),r=s,s=P(s),l=r,n=s):(l=H(b),r=Q.c(l,0,null),s=Q.c(l,1,null),Q.c(l,2,null),Jl.d(a,M([yk,h,Cj,4,jk,new u(null,4,[Uj,0,dh,0,Ai,c,Wk,d],null),ck,0,yj,6,mh,new rf([2929,!1]),Tj,new W(null,1,5,Y,[new u(null,2,[vk,e,pi,"sprite"],null)],null),Th,new W(null,3,5,Y,[new u(null,3,
[pi,"loc",Ki,aj,rj,Bl(new W(null,2,5,Y,[r,s],null))],null),new u(null,3,[pi,"p",Ki,Fj,rj,f],null),new u(null,3,[pi,"size",Ki,ii,rj,Bl(new W(null,1,5,Y,[10],null))],null)],null),lk,new W(null,1,5,Y,[new u(null,5,[mk,k,ij,3,Ki,5126,tk,12,Ck,g],null)],null)],0)),b=J(b),l=null,n=0),p=0;else break};var em=null,fm,gm=V.a?V.a(Z):V.call(null,Z),im=V.a?V.a(Z):V.call(null,Z),jm=V.a?V.a(Z):V.call(null,Z),km=V.a?V.a(Z):V.call(null,Z),lm=R.c(Z,gk,Bg());fm=new Og(nc.b("renderer.engine.attribs","reify-attrib"),H,Vh,lm,gm,im,jm,km);var mm,nm=V.a?V.a(Z):V.call(null,Z),om=V.a?V.a(Z):V.call(null,Z),pm=V.a?V.a(Z):V.call(null,Z),qm=V.a?V.a(Z):V.call(null,Z),rm=R.c(Z,gk,Bg());mm=new Og(nc.b("renderer.engine.attribs","unreify-attrib"),H,Vh,rm,nm,om,pm,qm);
Pg(fm,jh,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return new u(null,5,[ph,a.pointStride,qk,a.pointSize,Ei,a.totalPoints,lk,yg.a(a.attributes),pj,Cl(em,a.data,34962,35044)],null)});Pg(fm,zj,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return Pl.d(em,M([Oj,a.image,Jj,new rf([37440,a.needFlip]),nk,new rf([10241,9729,10240,9729])],0))});function sm(a){return[-a[0],a[2],a[1]]}
Pg(fm,xh,function(a){Q.c(a,0,null);var b=Q.c(a,1,null);a=b.position;var c=[-a[0],a[2],a[1]],d=b.mins,e=b.maxs;a=[1,0,0,0,0,1,0,0,0,0,1,0,c[0],c[1],c[2],1];var b=b.offset,f=sm(d),g=sm(e),h;h=d[0];var k=d[1],l=e[0],n=e[1],p=h+(l-h)/2,q=k+(n-k)/2;h=new W(null,4,5,Y,[h-p,k-q,l-p,n-q],null);d=sm(d);e=sm(e);c=tm.c?tm.c(c,d,e):tm.call(null,c,d,e);return new u(null,6,[wi,a,Oh,b,Oi,f,qh,g,Ch,h,Mh,c],null)});Pg(mm,jh,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return em.deleteBuffer(a)});
Pg(mm,zj,function(a){Q.c(a,0,null);a=Q.c(a,1,null);return em.deleteTexture(a)});Pg(mm,xh,function(a){Q.c(a,0,null);a=Q.c(a,1,null);a=xe.b(a,new W(null,2,5,Y,[Mh,Ck],null));return v(a)?em.deleteBuffer(a):null});function um(a,b,c){if(a?a.Nc:a)return a.Nc(0,b,c);var d;d=um[t(null==a?null:a)];if(!d&&(d=um._,!d))throw y("IAttribLoader.reify-attribs",a);return d.call(null,a,b,c)}
var vm=function(){function a(a,b,c){if(a?a.Mc:a)return a.Mc(0,b,c);var g;g=vm[t(null==a?null:a)];if(!g&&(g=vm._,!g))throw y("IAttribLoader.attribs-in",a);return g.call(null,a,b,c)}function b(a,b){if(a?a.Lc:a)return a.Lc(0,b);var c;c=vm[t(null==a?null:a)];if(!c&&(c=vm._,!c))throw y("IAttribLoader.attribs-in",a);return c.call(null,a,b)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);
};c.b=b;c.c=a;return c}();function wm(a,b,c,d){this.state=a;this.w=b;this.s=c;this.o=d;this.j=2229667594;this.q=8192}m=wm.prototype;m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){switch(b instanceof T?b.ra:null){case "state":return this.state;default:return R.c(this.s,b,c)}};m.Nc=function(a,b,c){a=em;em=b;try{var d=bm(function(){return function(a){return fm.a?fm.a(a):fm.call(null,a)}}(a,this),c),e=""+A(Nl());je.i(this.state,Pc,e,d);return e}finally{em=a}};
m.Lc=function(a,b){return vm.c(this,b,Lc)};m.Mc=function(a,b,c){var d=this;a=R.b(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}(),b);return v(a)?(c=Xc(c)?c:new W(null,1,5,Y,[c],null),xe.b(a,c)):null};m.v=function(a,b,c){return fg(b,function(){return function(a){return fg(b,lg,""," ","",c,a)}}(this),"#renderer.engine.attribs.AttribCache{",", ","}",c,Qd.b(new W(null,1,5,Y,[new W(null,2,5,Y,[Pi,this.state],null)],null),this.s))};m.A=function(){return this.w};m.P=function(){return 1+P(this.s)};
m.C=function(){var a=this.o;return null!=a?a:this.o=a=rd(this)};m.B=function(a,b){return v(v(b)?this.constructor===b.constructor&&jf(this,b):b)?!0:!1};m.La=function(a,b){return gd(new Tf(null,new u(null,1,[Pi,null],null),null),b)?Qc.b(Jc(ue.b(Z,this),this.w),b):new wm(this.state,this.w,Yd(Qc.b(this.s,b)),null)};m.Da=function(a,b,c){return v(Ad.b?Ad.b(Pi,b):Ad.call(null,Pi,b))?new wm(c,this.w,this.s,null):new wm(this.state,this.w,Pc.c(this.s,b,c),null)};
m.M=function(){return E(Qd.b(new W(null,1,5,Y,[new W(null,2,5,Y,[Pi,this.state],null)],null),this.s))};m.D=function(a,b){return new wm(this.state,b,this.s,this.o)};m.O=function(a,b){return Zc(b)?db(this,C.b(b,0),C.b(b,1)):Oa.c(Va,this,b)};
function tm(a,b,c){a=xm.c?xm.c(a,b,c):xm.call(null,a,b,c);a=Cl(em,a,34962,35044);b=em;c=K.a?K.a(Tl):K.call(null,Tl);if(v(c))b=c;else{c=zl(b,35633,"attribute vec3 pos; uniform mat4 p, v, m; void main() { gl_Position \x3d p * v * m * vec4(pos, 1.0); }");var d=zl(b,35632,"void main() { gl_FragColor \x3d vec4(1.0, 1.0, 1.0, 1.0); }");b=Al.d(b,M([c,d],0));b=he.b?he.b(Tl,b):he.call(null,Tl,b)}return new u(null,3,[Ck,a,yk,b,dj,em.getAttribLocation(b,"pos")],null)}
function xm(a,b,c){b=ve.c(function(b,c){return b-a[c]},b,bg.k());c=ve.c(function(){return function(b,c){return b-a[c]}}(b),c,bg.k());var d=new Float32Array(72),e=new W(null,12,5,Y,[new W(null,2,5,Y,[0,1],null),new W(null,2,5,Y,[0,2],null),new W(null,2,5,Y,[0,4],null),new W(null,2,5,Y,[1,3],null),new W(null,2,5,Y,[1,5],null),new W(null,2,5,Y,[5,7],null),new W(null,2,5,Y,[5,4],null),new W(null,2,5,Y,[6,7],null),new W(null,2,5,Y,[6,4],null),new W(null,2,5,Y,[6,2],null),new W(null,2,5,Y,[3,2],null),new W(null,
2,5,Y,[3,7],null)],null);eg.a(le.c(function(a,b,c,d){return function(a,b){var e=Q.c(a,0,null),f=Q.c(a,1,null),e=d(e),f=d(f),g=6*b;c.set(e,g);return c.set(f,g+3)}}(b,c,d,function(a,b){return function(c){var d=R.b(0!=(c&4)?b:a,0),e=R.b(0!=(c&2)?b:a,1);c=R.b(0!=(c&1)?b:a,2);return[d,e,c]}}(b,c,d),e),e,bg.k()));return d};function ym(a){return a/180*Math.PI}function zm(a,b,c,d){a=a.sd;var e=c<d?d/c:c/d,f=ym(function(){var a=Wi.a(b);return v(a)?a:75}()),g=function(){var a=Qj.a(b);return v(a)?a:.1}(),h=function(){var a=dk.a(b);return v(a)?a:1E4}();return pc.b(Ki.a(b),"perspective")?mat4.perspective(a,f,e,g,h):mat4.ortho(a,c/-2,c/2,d/2,d/-2,g,h)}var Am=[0,1,0];function Bm(a,b,c){a=a.pd;b=S.b(La,b);c=S.b(La,c);return mat4.lookAt(a,b,c,Am)}
function Cm(a){a=xl.b(a,new u(null,2,[Ij,!0,Mi,!1],null));a.sd=Array(16);a.pd=Array(16);a.Tb=Array(16);return a}
function Dm(a,b){var c;(c=Xc(a))||(c=Ha(a),c=pc.b(c,Float32Array)||pc.b(c,Uint8Array));c=c||pc.b(Ha(a),Array)?a:new W(null,1,5,Y,[a],null);if(v((new Tf(null,new u(null,5,[Wh,null,ii,null,Vi,null,aj,null,Fj,null],null),null)).call(null,b)))return Bl(c);if(v((new Tf(null,new u(null,2,[Kh,null,Sh,null],null),null)).call(null,b)))return new Int32Array(tg(c));throw Error([A("Don't know how to coerce type: "),A(b)].join(""));}
function Em(a,b,c,d){return Pc.c(a,b,new u(null,3,[pi,Bd(b),Ki,c,rj,Dm(d,c)],null))}
var Fm=mat4.identity(Array(16)),Gm=Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Em(Z,nh,Fj,Fm),Dh,Fj,Fm),oi,Fj,Fm),zh,Fj,Fm),Ji,ii,1),Hh,ii,0),xk,ii,1),kh,ii,0),Yj,ii,0),hk,ii,0),rh,ii,0),mj,ii,0),Uh,ii,0),mi,ii,0),Kj,ii,0),ji,Wh,new W(null,3,5,Y,[1,1,1],null)),ih,ii,0),gj,ii,1),Xi,ii,0),Yk,ii,1),Vj,aj,new W(null,2,5,Y,[0,1],null)),hj,Vi,new W(null,4,5,Y,[0,0,1,1],null)),Oh,Wh,new W(null,3,5,Y,[0,0,0],null)),sk,Sh,0),ak,aj,new W(null,2,5,Y,[0,1],null)),Pj,
aj,new W(null,2,5,Y,[1,0],null)),yh,aj,new W(null,2,5,Y,[1E3,1E3],null)),Zj,Kh,0),Yi,Kh,0),Ah,Vi,oe.b(24,0)),Hm=Em(Em(Em(Em(Em(Em(Em(Em(Em(Z,nh,Fj,Fm),Dh,Fj,Fm),oi,Fj,Fm),zh,Fj,Fm),Ji,ii,1),ji,Wh,new W(null,3,5,Y,[1,1,1],null)),Vj,aj,new W(null,2,5,Y,[0,1],null)),Oh,Wh,new W(null,3,5,Y,[0,0,0],null)),jj,Wh,new W(null,3,5,Y,[0,0,0],null));
function Im(a,b){return Oa.c(function(a,b){var e=Q.c(b,0,null),f=Q.c(b,1,null);return Ae.c(a,new W(null,1,5,Y,[e],null),function(a,b,c){return function(a){var d=Ki.a(a);if(v(d))return Pc.c(a,rj,Dm(c,d));throw Error([A("Don't know type for field: "),A(b)].join(""));}}(b,e,f))},a,b)}
function Jm(a,b,c,d,e,f,g,h){var k=de.c(yl,a,c),l=new W(null,2,5,Y,[770,771],null),n=new u(null,4,[Uj,0,dh,0,Ai,g,Wk,h],null);f=Im(Gm,Pc.d(f,yh,new W(null,2,5,Y,[g,h],null),M([nh,d,Dh,e,oi,mat4.multiply(a.Tb,d,e)],0)));g=E(b);h=null;for(var p=0,q=0;;)if(q<p){var r=h.t(null,q),s=ed(r)?S.b(fe,r):r;b=R.b(s,xh);var w=R.b(s,zj),z=R.b(s,jh);if(v(z)){var B=Ei.a(z),F=ph.a(z),N=pj.a(z),r=ve.b(function(a,b,c,d,e,f,g,h,k,l,n,p,q){return function(a){var b=Q.c(a,0,null),c=Q.c(a,1,null);a=Q.c(a,2,null);return new u(null,
6,[mk,q.a?q.a(b):q.call(null,b),ij,a,Ki,5126,tk,f,Oh,4*c,Ck,g],null)}}(g,h,p,q,B,F,N,r,s,b,w,z,k,l,n,f),lk.a(z)),w=v(w)?new W(null,1,5,Y,[new u(null,2,[vk,w,pi,"overlay"],null)],null):null,s=Qf.d(M([new u(null,3,[zh,wi.a(b),Oh,Oh.a(b),hj,Ch.a(b)],null),function(){var a=qk.a(z);return v(a)?new u(null,1,[Ji,a],null):null}()],0)),s=Im(f,s);Jl.d(a,M([yk,c,Cj,0,jk,n,ck,0,Ci,new W(null,1,5,Y,[l],null),yj,B,Tj,w,mh,new rf([2929,!0]),lk,r,Th,Pf(s)],0))}v(!1)&&(w=Mh.a(b),v(w)&&Jl.d(a,M([yk,yk.a(w),Cj,1,jk,
n,ck,0,yj,24,mh,new rf([2929,!1]),Th,new W(null,3,5,Y,[new u(null,3,[pi,"m",Ki,Fj,rj,wi.a(b)],null),new u(null,3,[pi,"v",Ki,Fj,rj,e],null),new u(null,3,[pi,"p",Ki,Fj,rj,d],null)],null),lk,new W(null,1,5,Y,[new u(null,6,[mk,dj.a(w),ij,3,Ki,5126,tk,12,Oh,0,Ck,Ck.a(w)],null)],null)],0)));q+=1}else if(s=E(g)){B=s;if($c(B))g=Sb(B),h=Tb(B),b=g,p=P(g),g=h,h=b;else{F=H(B);N=ed(F)?S.b(fe,F):F;b=R.b(N,xh);w=R.b(N,zj);z=R.b(N,jh);if(v(z)){var r=Ei.a(z),O=ph.a(z),aa=pj.a(z);g=ve.b(function(a,b,c,d,e,f,g,h,k,
l,n,p,q,r,s){return function(a){var b=Q.c(a,0,null),c=Q.c(a,1,null);a=Q.c(a,2,null);return new u(null,6,[mk,s.a?s.a(b):s.call(null,b),ij,a,Ki,5126,tk,f,Oh,4*c,Ck,g],null)}}(g,h,p,q,r,O,aa,F,N,b,w,z,B,s,k,l,n,f),lk.a(z));h=v(w)?new W(null,1,5,Y,[new u(null,2,[vk,w,pi,"overlay"],null)],null):null;p=Qf.d(M([new u(null,3,[zh,wi.a(b),Oh,Oh.a(b),hj,Ch.a(b)],null),function(){var a=qk.a(z);return v(a)?new u(null,1,[Ji,a],null):null}()],0));p=Im(f,p);Jl.d(a,M([yk,c,Cj,0,jk,n,ck,0,Ci,new W(null,1,5,Y,[l],null),
yj,r,Tj,h,mh,new rf([2929,!0]),lk,g,Th,Pf(p)],0))}v(!1)&&(g=Mh.a(b),v(g)&&Jl.d(a,M([yk,yk.a(g),Cj,1,jk,n,ck,0,yj,24,mh,new rf([2929,!1]),Th,new W(null,3,5,Y,[new u(null,3,[pi,"m",Ki,Fj,rj,wi.a(b)],null),new u(null,3,[pi,"v",Ki,Fj,rj,e],null),new u(null,3,[pi,"p",Ki,Fj,rj,d],null)],null),lk,new W(null,1,5,Y,[new u(null,6,[mk,dj.a(g),ij,3,Ki,5126,tk,12,Oh,0,Ck,Ck.a(g)],null)],null)],0)));g=J(B);h=null;p=0}q=0}else break}
function Km(a,b,c,d,e,f,g,h){var k=ed(b)?S.b(fe,b):b;b=R.b(k,xh);var l=R.b(k,jh),k=new W(null,1,5,Y,[new u(null,6,[Ck,pj.a(l),mk,a.getAttribLocation(c,"position"),ij,3,Ki,5126,tk,ph.a(l),Oh,0],null)],null),n=new W(null,2,5,Y,[1,0],null);g=new u(null,4,[Uj,0,dh,0,Ai,g,Wk,h],null);h=Ei.a(l);d=Im(Hm,Pc.d(f,Oh,Oh.a(b),M([zh,wi.a(b),nh,d,Dh,e,oi,mat4.multiply(a.Tb,d,e)],0)));Jl.d(a,M([yk,c,Cj,0,ck,0,jk,g,Ci,new W(null,1,5,Y,[n],null),yj,h,mh,new rf([2929,!0]),lk,k,Th,Pf(d)],0))}
function Lm(a){a=ed(a)?S.b(fe,a):a;a=R.b(a,Hj);return new W(null,2,5,Y,[a.canvas.width,a.canvas.height],null)}function Mm(a){var b=1/vec3.length(a);return[a[0]*b,a[1]*b,a[2]*b,a[3]*b]}
function Nm(a,b){var c=mat4.invert(mat4.create,b),d=mat4.multiply(mat4.create,a,c),e=function(a,b){return function(a,c,d){c=b[c];d=b[d];return a.b?a.b(c,d):a.call(null,c,d)}}(c,d);return le.b(Mm,new W(null,6,5,Y,[function(){var a=e(md,3,0),b=e(md,7,4),c=e(md,11,8),d=e(md,15,12);return[a,b,c,d]}(),function(){var a=e(nd,3,0),b=e(nd,7,4),c=e(nd,11,8),d=e(nd,15,12);return[a,b,c,d]}(),function(){var a=e(md,3,1),b=e(md,7,5),c=e(md,11,9),d=e(md,15,13);return[a,b,c,d]}(),function(){var a=e(nd,3,1),b=e(nd,
7,5),c=e(nd,11,9),d=e(nd,15,13);return[a,b,c,d]}(),function(){var a=e(md,3,2),b=e(md,7,6),c=e(md,11,10),d=e(md,15,14);return[a,b,c,d]}(),function(){var a=e(nd,3,2),b=e(nd,7,6),c=e(nd,11,10),d=e(nd,15,14);return[a,b,c,d]}()],null))}
function Om(a){var b=ed(a)?S.b(fe,a):a,c=R.b(b,ri),d=Hj.a(b),e=zi.a(b),f=Lm(b),g=Q.c(f,0,null),h=Q.c(f,1,null),k=H(se.b(oj,xe.b(c,new W(null,2,5,Y,[Ek,ok],null)))),l=Ek.a(c),n=Mj.a(c),p=function(){var a=qi.a(l);return v(a)?a:new W(null,3,5,Y,[0,0,0],null)}(),q=function(){var a=bk.a(l);return v(a)?a:new W(null,3,5,Y,[0,0,0],null)}(),r=zm(d,k,g,h),s=Bm(d,p,q),w=mat4.multiply(d.Tb,r,s),z=Nm(r,s),B=Di.a(n);S.c(Dl,d,Qd.b(Lh.a(n),new W(null,1,5,Y,[1],null)));El(d);var F=te.b(function(){return function(a){return null==
a}}(d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,a,b,b,c),le.b(function(a,b){return function(a){return vm.b(b,a)}}(d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,a,b,b,c),le.b(vh,Pf(Qi.a(b)))));ng.d(M([P(F),"/",P(Qi.a(b))],0));Jm(d,F,yk.a(b),r,s,B,g,h);for(var F=Wl(d),N=d.getAttribLocation(F,"position"),O=E(Ti.a(b)),aa=null,D=0,la=0;;)if(la<D){var U=aa.t(null,la),X=Q.c(U,0,null),$=Q.c(U,1,null);d.lineWidth(5);Jl.d(d,M([yk,F,Cj,1,jk,new u(null,4,[Uj,0,dh,0,Ai,g,Wk,h],null),ck,0,Ci,new W(null,1,5,Y,[new W(null,2,5,Y,[1,0],null)],
null),yj,2,mh,new rf([2929,!1]),lk,new W(null,1,5,Y,[new u(null,5,[mk,N,ij,3,Ki,5126,tk,12,Ck,Ck.a($)],null)],null),Th,new W(null,3,5,Y,[new u(null,3,[pi,"mv",Ki,Fj,rj,s],null),new u(null,3,[pi,"p",Ki,Fj,rj,r],null),new u(null,3,[pi,"color",Ki,Wh,rj,Bl(le.b(function(){return function(a){return a/255}}(O,aa,D,la,U,X,$,F,N,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,a,b,b,c),Bh.a($)))],null)],null)],0));la+=1}else if(X=E(O)){U=X;if($c(U))O=Sb(U),la=Tb(U),aa=O,D=P(O),O=la;else{var $=H(U),ga=Q.c($,0,null),da=Q.c($,
1,null);d.lineWidth(5);Jl.d(d,M([yk,F,Cj,1,jk,new u(null,4,[Uj,0,dh,0,Ai,g,Wk,h],null),ck,0,Ci,new W(null,1,5,Y,[new W(null,2,5,Y,[1,0],null)],null),yj,2,mh,new rf([2929,!1]),lk,new W(null,1,5,Y,[new u(null,5,[mk,N,ij,3,Ki,5126,tk,12,Ck,Ck.a(da)],null)],null),Th,new W(null,3,5,Y,[new u(null,3,[pi,"mv",Ki,Fj,rj,s],null),new u(null,3,[pi,"p",Ki,Fj,rj,r],null),new u(null,3,[pi,"color",Ki,Wh,rj,Bl(le.b(function(){return function(a){return a/255}}(O,aa,D,la,$,ga,da,U,X,F,N,d,e,f,g,h,k,l,n,p,q,r,s,w,z,
B,a,b,b,c),Bh.a(da)))],null)],null)],0));O=J(U);aa=null;D=0}la=0}else break;if(O=E(Ti.a(b)))aa=function(a,b,c,d,e,f,g,h,k){return function(a,b,c){return new W(null,3,5,Y,[(a+1)/2*h,(1-b)/2*k,c],null)}}(O,O,F,N,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,a,b,b,c),D=re.d(function(a,b,c,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B){return function(b){Q.c(b,0,null);b=Q.c(b,1,null);var c=ed(b)?S.b(fe,b):b;b=R.b(c,ek);c=R.b(c,Bi);c=S.b(La,c);b=S.b(La,b);vec3.transformMat4(c,c,B);vec3.transformMat4(b,b,B);return new W(null,2,5,Y,[a(c[0],
c[1],c[2]),a(b[0],b[1],b[2])],null)}}(aa,O,O,F,N,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,a,b,b,c),M([O],0)),a=se.b(function(a,b,c,d,e,f,g,h,k,l,n){return function(a){var b=Q.c(a,0,null),c=Q.c(a,1,null);return 1>Q.c(a,2,null)&&0<b&&b<l&&0<c&&c<n}}(aa,D,O,O,F,N,d,e,f,g,h,k,l,n,p,q,r,s,w,z,B,a,b,b,c),D),dm(d,a,g,h);g=E(hh.a(b));h=null;for(c=a=0;;)if(c<a)b=h.t(null,c),e=d,f=w,k=s,n=r,b.i?b.i(e,f,k,n):b.call(null,e,f,k,n),c+=1;else if(b=E(g))g=b,$c(g)?(h=Sb(g),g=Tb(g),b=h,a=P(h),h=b):(b=H(g),h=d,a=w,c=s,e=r,b.i?
b.i(h,a,c,e):b.call(null,h,a,c,e),g=J(g),h=null,a=0),c=0;else return null}function Pm(a,b){for(var c=E(b),d=null,e=0,f=0;;)if(f<e){var g=d.t(null,f);a.deleteFramebuffer(Gj.a(g));a.deleteRenderbuffer(Qh.a(g));a.deleteTexture(tj.a(g));f+=1}else if(c=E(c))d=c,$c(d)?(c=Sb(d),e=Tb(d),d=c,g=P(c),c=e,e=g):(g=H(d),a.deleteFramebuffer(Gj.a(g)),a.deleteRenderbuffer(Qh.a(g)),a.deleteTexture(tj.a(g)),c=J(d),d=null,e=0),f=0;else break}
function Qm(a,b,c){var d=a.createFramebuffer(),e=a.createTexture(),f=a.createRenderbuffer();a.bindFramebuffer(36160,d);d.width=b;d.height=c;a.bindTexture(3553,e);a.texParameteri(3553,10240,9728);a.texParameteri(3553,10241,9728);a.texParameteri(3553,10242,33071);a.texParameteri(3553,10243,33071);a.texImage2D(3553,0,6408,b,c,0,6408,5121,null);a.bindRenderbuffer(36161,f);a.renderbufferStorage(36161,33189,b,c);a.framebufferTexture2D(36160,36064,3553,e,0);a.framebufferRenderbuffer(36160,36096,36161,f);
a.bindTexture(3553,null);a.bindRenderbuffer(36161,null);a.bindFramebuffer(36160,null);return new u(null,3,[Gj,d,tj,e,xj,f],null)}function Rm(a,b,c){return new u(null,3,[Uj,Qm(a,b,c),dh,Qm(a,b,c),ej,Qm(a,b,c)],null)}
function Sm(a,b,c,d){var e=ed(a)?S.b(fe,a):a,f=R.b(e,ri);a=Hj.a(e);var g=zi.a(e),h=Lm(e),k=Q.c(h,0,null),h=Q.c(h,1,null),l=H(se.b(oj,xe.b(f,new W(null,2,5,Y,[Ek,ok],null)))),n=Ek.a(f),p=Mj.a(f),f=function(){var a=qi.a(n);return v(a)?a:new W(null,3,5,Y,[0,0,0],null)}(),q=function(){var a=bk.a(n);return v(a)?a:new W(null,3,5,Y,[0,0,0],null)}(),l=zm(a,l,k,h),f=Bm(a,f,q);d=Pc.d(Rf(Di.a(p),new W(null,3,5,Y,[ji,Vj,Oh],null)),Ji,10,M([jj,d],0));a.bindFramebuffer(36160,Gj.a(c));Dl(a,0,0,0,0);El(a);c=E(Pf(Qi.a(e)));
e=null;for(q=p=0;;)if(q<p){var r=e.t(null,q),r=ed(r)?S.b(fe,r):r,r=R.b(r,vh),r=vm.b(g,r);v(r)&&Km(a,r,b,l,f,d,k,h);q+=1}else if(c=E(c))$c(c)?(p=Sb(c),c=Tb(c),e=p,p=P(p)):(e=H(c),e=ed(e)?S.b(fe,e):e,e=R.b(e,vh),e=vm.b(g,e),v(e)&&Km(a,e,b,l,f,d,k,h),c=J(c),e=null,p=0),q=0;else break;a.bindFramebuffer(36160,null)}
var Tm=function(){function a(a,b,c,d,k,l,n){var p=new Uint8Array(n);a.bindFramebuffer(36160,Gj.a(b));a.readPixels(c,d,k,l,6408,5121,p);a.bindFramebuffer(36160,null);return new Float32Array(n)}function b(a,b,c,h,k,l){var n=new Uint8Array(4*k*l);return d.L(a,b,c,h,k,l,n.buffer)}function c(a,b,c,h){return d.u(a,b,c,h,1,1)}var d=null,d=function(d,f,g,h,k,l,n){switch(arguments.length){case 4:return c.call(this,d,f,g,h);case 6:return b.call(this,d,f,g,h,k,l);case 7:return a.call(this,d,f,g,h,k,l,n)}throw Error("Invalid arity: "+
arguments.length);};d.i=c;d.u=b;d.L=a;return d}();
function Um(a,b,c,d){var e=ed(a)?S.b(fe,a):a,f=R.b(e,ri);a=Hj.a(e);var g=Qm(a,d,d),h=Ql(a),k=zi.a(e),l=Mj.a(f),n=function(){switch(c){case 0:return new W(null,3,5,Y,[1,0,0],null);case 1:return new W(null,3,5,Y,[0,0,1],null);default:return new W(null,3,5,Y,[0,1,0],null)}}(),f=Pc.d(Rf(Di.a(l),new W(null,3,5,Y,[ji,Vj,Oh],null)),Ji,1,M([jj,n],0));console.log("projecting!",b,Fm,l,n);a.bindFramebuffer(36160,Gj.a(g));Dl(a,0,0,0,0);El(a);for(var e=E(Pf(Qi.a(e))),l=null,p=n=0;;)if(p<n){var q=l.t(null,p),q=
ed(q)?S.b(fe,q):q,q=R.b(q,vh),q=vm.b(k,q);v(q)&&Km(a,q,h,b,Fm,f,d,d);p+=1}else if(e=E(e))$c(e)?(n=Sb(e),e=Tb(e),l=n,n=P(n)):(l=H(e),l=ed(l)?S.b(fe,l):l,l=R.b(l,vh),l=vm.b(k,l),v(l)&&Km(a,l,h,b,Fm,f,d,d),e=J(e),l=null,n=0),p=0;else break;a.bindFramebuffer(36160,null);b=Tm.u(a,g,0,0,d,d);Pm(a,new W(null,1,5,Y,[g],null));return b}function Vm(a,b,c,d){if(a?a.Oc:a)return a.Oc(0,b,c,d);var e;e=Vm[t(null==a?null:a)];if(!e&&(e=Vm._,!e))throw y("IPointPicker.pick-point",a);return e.call(null,a,b,c,d)}
function Wm(a,b,c,d){this.Q=a;this.w=b;this.s=c;this.o=d;this.j=2229667594;this.q=8192}m=Wm.prototype;m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){switch(b instanceof T?b.ra:null){case "picker-state":return this.Q;default:return R.c(this.s,b,c)}};m.v=function(a,b,c){return fg(b,function(){return function(a){return fg(b,lg,""," ","",c,a)}}(this),"#renderer.engine.render.PointPicker{",", ","}",c,Qd.b(new W(null,1,5,Y,[new W(null,2,5,Y,[nj,this.Q],null)],null),this.s))};m.A=function(){return this.w};
m.P=function(){return 1+P(this.s)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=rd(this)};m.B=function(a,b){return v(v(b)?this.constructor===b.constructor&&jf(this,b):b)?!0:!1};m.La=function(a,b){return gd(new Tf(null,new u(null,1,[nj,null],null),null),b)?Qc.b(Jc(ue.b(Z,this),this.w),b):new Wm(this.Q,this.w,Yd(Qc.b(this.s,b)),null)};m.Da=function(a,b,c){return v(Ad.b?Ad.b(nj,b):Ad.call(null,nj,b))?new Wm(c,this.w,this.s,null):new Wm(this.Q,this.w,Pc.c(this.s,b,c),null)};
m.M=function(){return E(Qd.b(new W(null,1,5,Y,[new W(null,2,5,Y,[nj,this.Q],null)],null),this.s))};
m.Oc=function(a,b,c,d){var e=this;a=ed(b)?S.b(fe,b):b;var f=R.b(a,ri),g=Hj.a(a),h=Lm(a),k=Q.c(h,0,null),l=Q.c(h,1,null),n=Ak.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),p=Mj.a(n)===Mj.a(f)&&Qi.a(n)===Qi.a(a)&&pc.b(Ai.a(n),k)&&pc.b(Wk.a(n),l);if(!p){je.i(e.Q,Pc,Ak,new u(null,4,[Mj,Mj.a(f),Qi,Qi.a(a),Ai,k,Wk,l],null));if(!v(yk.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()))){var q=Ql(g);je.i(e.Q,Pc,yk,q)}if(Xd.b(k,Ai.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,
a)}()))||Xd.b(l,Wk.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()))){Pm(g,Rf(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}(),new W(null,3,5,Y,[Uj,dh,ej],null)));var q=Rm(g,k,l),r=4*k*l;je.d(e.Q,Pc,Ai,k,M([Wk,l,sh,new Float32Array(r),wk,new Float32Array(r),uk,new Float32Array(r),Uj,Uj.a(q),dh,dh.a(q),ej,ej.a(q)],0))}q=yk.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}());Sm(a,q,Uj.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),new W(null,3,5,Y,[1,0,0],null));
Sm(a,q,dh.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),new W(null,3,5,Y,[0,1,0],null));Sm(a,q,ej.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),new W(null,3,5,Y,[0,0,1],null));Tm.L(g,Uj.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),0,0,k,l,sh.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()).buffer);Tm.L(g,dh.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),0,0,k,l,wk.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()).buffer);
Tm.L(g,ej.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()),0,0,k,l,uk.a(function(){var a=e.Q;return K.a?K.a(a):K.call(null,a)}()).buffer)}d=l-d;b=function(a,b,c){return function(a){var b;b=e.Q;b=K.a?K.a(b):K.call(null,b);return(a.a?a.a(b):a.call(null,b))[c]}}(c,d,c+d*k,g,h,k,l,n,p,this,b,a,a,f);return new W(null,3,5,Y,[b(sh),b(wk),b(uk)],null)};m.D=function(a,b){return new Wm(this.Q,b,this.s,this.o)};m.O=function(a,b){return Zc(b)?db(this,C.b(b,0),C.b(b,1)):Oa.c(Va,this,b)};function Xm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Ym(a,b,c,d){this.head=a;this.F=b;this.length=c;this.e=d}Ym.prototype.pop=function(){if(0===this.length)return null;var a=this.e[this.F];this.e[this.F]=null;this.F=(this.F+1)%this.e.length;this.length-=1;return a};Ym.prototype.unshift=function(a){this.e[this.head]=a;this.head=(this.head+1)%this.e.length;this.length+=1;return null};function Zm(a,b){a.length+1===a.e.length&&a.resize();a.unshift(b)}
Ym.prototype.resize=function(){var a=Array(2*this.e.length);return this.F<this.head?(Xm(this.e,this.F,a,0,this.length),this.F=0,this.head=this.length,this.e=a):this.F>this.head?(Xm(this.e,this.F,a,0,this.e.length-this.F),Xm(this.e,0,a,this.e.length-this.F,this.head),this.F=0,this.head=this.length,this.e=a):this.F===this.head?(this.head=this.F=0,this.e=a):null};function $m(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop(),f;f=e;f=b.a?b.a(f):b.call(null,f);v(f)&&a.unshift(e);d+=1}else break}
function an(a){if(!(0<a))throw Error([A("Assert failed: "),A("Can't create a ring buffer of size 0"),A("\n"),A(ie.d(M([xd(new mc(null,"\x3e","\x3e",1085014381,null),new mc(null,"n","n",-2092305744,null),0)],0)))].join(""));return new Ym(0,0,0,Array(a))}function bn(a,b){this.H=a;this.qd=b;this.q=0;this.j=2}bn.prototype.P=function(){return this.H.length};function cn(a){return a.H.length===a.qd}bn.prototype.xb=function(){return this.H.pop()};bn.prototype.dc=function(a,b){Zm(this.H,b);return this};
function dn(a){return new bn(an(a),a)};var en=an(32),fn=!1,gn=!1;function hn(){fn=!0;gn=!1;for(var a=0;;){var b=en.pop();if(null!=b&&(b.k?b.k():b.call(null),1024>a)){a+=1;continue}break}fn=!1;return 0<en.length?jn.k?jn.k():jn.call(null):null}function jn(){var a=gn;if(v(v(a)?fn:a))return null;gn=!0;"function"==t(ba.setImmediate)?ba.setImmediate(hn):(vl||(vl=wl()),vl(hn))}function kn(a){Zm(en,a);jn()};var ln,nn=function mn(b){"undefined"===typeof ln&&(ln=function(b,d,e){this.T=b;this.Rc=d;this.od=e;this.q=0;this.j=425984},ln.prototype.Wa=function(){return this.T},ln.prototype.A=function(){return this.od},ln.prototype.D=function(b,d){return new ln(this.T,this.Rc,d)},ln.Za=!0,ln.Ya="cljs.core.async.impl.channels/t26712",ln.lb=function(b,d){return Fb(d,"cljs.core.async.impl.channels/t26712")});return new ln(b,mn,Z)};function on(a,b){this.nb=a;this.T=b}function pn(a){return jl(a.nb)}
function qn(a){if(a?a.cc:a)return a.cc();var b;b=qn[t(null==a?null:a)];if(!b&&(b=qn._,!b))throw y("MMC.abort",a);return b.call(null,a)}function rn(a,b,c,d,e,f,g){this.Ua=a;this.Bb=b;this.Oa=c;this.Ab=d;this.H=e;this.closed=f;this.za=g}
rn.prototype.yb=function(){var a=this;if(!a.closed){a.closed=!0;if(v(function(){var b=a.H;return v(b)?0===a.Oa.length:b}())){var b=a.H;a.za.a?a.za.a(b):a.za.call(null,b)}for(;b=a.Ua.pop(),null!=b;)if(b.ua(null)){var c=b.qa(null),d=v(function(){var b=a.H;return v(b)?0<P(a.H):b}())?a.H.xb():null;kn(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(c,d,b,this))}}return null};
rn.prototype.Qb=function(a,b){var c=this;if(b.ua(null)){if(null!=c.H&&0<P(c.H)){for(var d=b.qa(null),e=nn(c.H.xb());;){if(!v(cn(c.H))){var f=c.Oa.pop();if(null!=f){var g=f.nb,h=f.T;if(g.ua(null)){var k=g.qa(null);b.qa(null);kn(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(k,g,h,f,d,e,this));zc(function(){var a=c.H,b=h;return c.za.b?c.za.b(a,b):c.za.call(null,a,b)}())&&qn(this)}continue}}break}return e}d=function(){for(;;){var a=c.Oa.pop();if(v(a)){if(jl(a.nb))return a}else return null}}();
if(v(d))return e=kl(d.nb),b.qa(null),kn(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(e,d,this)),nn(d.T);if(v(c.closed))return v(c.H)&&(d=c.H,c.za.a?c.za.a(d):c.za.call(null,d)),v(function(){var a=b.ua(null);return v(a)?b.qa(null):a}())?(d=function(){var a=c.H;return v(a)?0<P(c.H):a}(),d=v(d)?c.H.xb():null,nn(d)):null;64<c.Bb?(c.Bb=0,$m(c.Ua,jl)):c.Bb+=1;if(!(1024>c.Ua.length))throw Error([A("Assert failed: "),A([A("No more than "),A(1024),A(" pending takes are allowed on a single channel.")].join("")),
A("\n"),A(ie.d(M([xd(new mc(null,"\x3c","\x3c",993667236,null),xd(new mc(null,".-length",".-length",-280799999,null),new mc(null,"takes","takes",298247964,null)),new mc("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null))],0)))].join(""));Zm(c.Ua,b)}return null};
rn.prototype.zb=function(a,b,c){var d=this;if(null==b)throw Error([A("Assert failed: "),A("Can't put nil in on a channel"),A("\n"),A(ie.d(M([xd(new mc(null,"not","not",1044554643,null),xd(new mc(null,"nil?","nil?",1612038930,null),new mc(null,"val","val",1769233139,null)))],0)))].join(""));if((a=d.closed)||!c.ua(null))return nn(!a);if(v(function(){var a=d.H;return v(a)?Ga(cn(d.H)):a}())){c.qa(null);for(c=zc(function(){var a=d.H;return d.za.b?d.za.b(a,b):d.za.call(null,a,b)}());;){if(0<d.Ua.length&&
0<P(d.H)){var e=d.Ua.pop();if(e.ua(null)){var f=e.qa(null),g=d.H.xb();kn(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(f,g,e,c,a,this))}else continue}break}c&&qn(this);return nn(!0)}e=function(){for(;;){var a=d.Ua.pop();if(v(a)){if(v(a.ua(null)))return a}else return null}}();if(v(e))return f=kl(e),c.qa(null),kn(function(a){return function(){return a.a?a.a(b):a.call(null,b)}}(f,e,a,this)),nn(!0);64<d.Ab?(d.Ab=0,$m(d.Oa,pn)):d.Ab+=1;if(!(1024>d.Oa.length))throw Error([A("Assert failed: "),
A([A("No more than "),A(1024),A(" pending puts are allowed on a single channel."),A(" Consider using a windowed buffer.")].join("")),A("\n"),A(ie.d(M([xd(new mc(null,"\x3c","\x3c",993667236,null),xd(new mc(null,".-length",".-length",-280799999,null),new mc(null,"puts","puts",-1883877054,null)),new mc("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null))],0)))].join(""));Zm(d.Oa,new on(c,b));return null};
rn.prototype.cc=function(){for(;;){var a=this.Oa.pop();if(null!=a){var b=a.nb,c=a.T;if(b.ua(null)){var d=b.qa(null);kn(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(d,b,c,a,this))}else continue}break}$m(this.Oa,be());return il(this)};function sn(a){console.log(a);return null}function tn(a,b,c){b=(v(b)?b:sn).call(null,c);return null==b?a:ml.b(a,b)}
var un=function(){function a(a,b,c){return new rn(an(32),0,an(32),0,a,!1,function(){return function(a){return function(){function b(d,e){try{return a.b?a.b(d,e):a.call(null,d,e)}catch(f){return tn(d,c,f)}}function d(b){try{return a.a?a.a(b):a.call(null,b)}catch(e){return tn(b,c,e)}}var e=null,e=function(a,c){switch(arguments.length){case 1:return d.call(this,a);case 2:return b.call(this,a,c)}throw Error("Invalid arity: "+arguments.length);};e.a=d;e.b=b;return e}()}(v(b)?b.a?b.a(ml):b.call(null,ml):
ml)}())}function b(a,b){return d.c(a,b,null)}function c(a){return d.b(a,null)}var d=null,d=function(d,f,g){switch(arguments.length){case 1:return c.call(this,d);case 2:return b.call(this,d,f);case 3:return a.call(this,d,f,g)}throw Error("Invalid arity: "+arguments.length);};d.a=c;d.b=b;d.c=a;return d}();function vn(a,b,c){this.key=a;this.T=b;this.forward=c;this.q=0;this.j=2155872256}vn.prototype.v=function(a,b,c){return fg(b,lg,"["," ","]",c,this)};vn.prototype.M=function(){return Va(Va(oc,this.T),this.key)};
(function(){function a(a,b,c){c=Array(c+1);for(var g=0;;)if(g<c.length)c[g]=null,g+=1;else break;return new vn(a,b,c)}function b(a){return c.c(null,null,a)}var c=null,c=function(c,e,f){switch(arguments.length){case 1:return b.call(this,c);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c})().a(0);var wn=function(){function a(a,b,c){a=pc.b(a,0)?null:a;if(v(b)&&!v(a))throw Error([A("Assert failed: "),A("buffer must be supplied when transducer is"),A("\n"),A(ie.d(M([new mc(null,"buf-or-n","buf-or-n",-1646815050,null)],0)))].join(""));return un.c("number"===typeof a?dn(a):a,b,c)}function b(a,b){return e.c(a,b,null)}function c(a){return e.c(a,null,null)}function d(){return e.a(null)}var e=null,e=function(e,g,h){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,e);case 2:return b.call(this,
e,g);case 3:return a.call(this,e,g,h)}throw Error("Invalid arity: "+arguments.length);};e.k=d;e.a=c;e.b=b;e.c=a;return e}();
(function xn(b){"undefined"===typeof dl&&(dl=function(b,d,e){this.mb=b;this.Sb=d;this.kd=e;this.q=0;this.j=393216},dl.prototype.ua=function(){return!0},dl.prototype.qa=function(){return this.mb},dl.prototype.A=function(){return this.kd},dl.prototype.D=function(b,d){return new dl(this.mb,this.Sb,d)},dl.Za=!0,dl.Ya="cljs.core.async/t23175",dl.lb=function(b,d){return Fb(d,"cljs.core.async/t23175")});return new dl(b,xn,Z)})(function(){return null});
function yn(a){for(var b=Array(a),c=0;;)if(c<a)b[c]=0,c+=1;else break;for(c=1;;){if(pc.b(c,a))return b;var d=zg(c);b[c]=b[d];b[d]=c;c+=1}}
var An=function zn(){var b=V.a?V.a(!0):V.call(null,!0);"undefined"===typeof el&&(el=function(b,d,e){this.Sa=b;this.Pc=d;this.ld=e;this.q=0;this.j=393216},el.prototype.ua=function(){return function(){var b=this.Sa;return K.a?K.a(b):K.call(null,b)}}(b),el.prototype.qa=function(){return function(){var b=this.Sa;he.b?he.b(b,null):he.call(null,b,null);return!0}}(b),el.prototype.A=function(){return function(){return this.ld}}(b),el.prototype.D=function(){return function(b,d){return new el(this.Sa,this.Pc,
d)}}(b),el.Za=!0,el.Ya="cljs.core.async/t23223",el.lb=function(){return function(b,d){return Fb(d,"cljs.core.async/t23223")}}(b));return new el(b,zn,Z)},$n=function Zn(b,c){"undefined"===typeof fl&&(fl=function(b,c,f,g){this.eb=b;this.Sa=c;this.Qc=f;this.md=g;this.q=0;this.j=393216},fl.prototype.ua=function(){return jl(this.Sa)},fl.prototype.qa=function(){kl(this.Sa);return this.eb},fl.prototype.A=function(){return this.md},fl.prototype.D=function(b,c){return new fl(this.eb,this.Sa,this.Qc,c)},fl.Za=
!0,fl.Ya="cljs.core.async/t23234",fl.lb=function(b,c){return Fb(c,"cljs.core.async/t23234")});return new fl(c,b,Zn,Z)};
function ao(a,b,c){var d=An(),e=P(b),f=yn(e),g=kj.a(c),h=function(){for(var c=0;;)if(c<e){var h=v(g)?c:f[c],n=Q.b(b,h),p=Zc(n)?n.a?n.a(0):n.call(null,0):null,q=v(p)?function(){var b=n.a?n.a(1):n.call(null,1);return hl(p,b,$n(d,function(b,c,d,e,f){return function(b){b=new W(null,2,5,Y,[b,f],null);return a.a?a.a(b):a.call(null,b)}}(c,b,h,n,p,d,e,f,g)))}():gl(n,$n(d,function(b,c,d){return function(b){b=new W(null,2,5,Y,[b,d],null);return a.a?a.a(b):a.call(null,b)}}(c,h,n,p,d,e,f,g)));if(v(q))return nn(new W(null,
2,5,Y,[function(){var a=q;return K.a?K.a(a):K.call(null,a)}(),function(){var a=p;return v(a)?a:n}()],null));c+=1}else return null}();return v(h)?h:gd(c,Vh)&&(h=function(){var a=d.ua(null);return v(a)?d.qa(null):a}(),v(h))?nn(new W(null,2,5,Y,[Vh.a(c),Vh],null)):null}
function bo(a,b){var c=wn.a(1);kn(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.k=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];if(7===d)return d=c,d[2]=c[2],d[1]=3,Ii;if(6===d){var d=c[8],e=c[7],d=Mc.b?Mc.b(d,e):Mc.call(null,d,e);c[8]=d;c[2]=null;c[1]=2;return Ii}return 5===d?(d=c[8],c[2]=d,c[1]=7,Ii):4===d?(d=c[2],c[7]=d,c[1]=v(null==d)?5:6,Ii):3===d?(d=c[2],tl(c,d)):2===d?rl(c,4,b):1===d?(d=a,c[8]=d,c[2]=null,c[1]=2,Ii):null}}(c),c)}(),f=function(){var a=e.k?e.k():e.call(null);a[6]=c;return a}();return ql(f)}}(c));return c}
var co=function(){function a(a,b,c){var g=wn.a(1);kn(function(g){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.k=c;d.a=b;return d}()}(function(){return function(g){var h=g[1];return 7===h?(h=g,h[2]=g[2],h[1]=6,Ii):1===h?(h=E(b),g[7]=h,g[2]=null,g[1]=2,Ii):4===h?(h=g[7],h=H(h),sl(g,7,a,h)):13===h?(h=g[2],g[2]=h,g[1]=10,Ii):6===h?(h=g[2],g[1]=v(h)?8:9,Ii):3===h?(h=g[2],tl(g,h)):12===h?(g[2]=null,g[1]=13,Ii):2===h?(h=g[7],g[1]=v(h)?4:5,Ii):11===h?(h=il(a),g[2]=h,g[1]=13,Ii):9===h?(g[1]=v(c)?11:12,Ii):5===h?(h=g[7],g[2]=h,g[1]=6,Ii):10===h?(h=g[2],g[2]=h,
g[1]=3,Ii):8===h?(h=g[7],h=J(h),g[7]=h,g[2]=null,g[1]=2,Ii):null}}(g),g)}(),l=function(){var a=k.k?k.k():k.call(null);a[6]=g;return a}();return ql(l)}}(g));return g}function b(a,b){return c.c(a,b,!0)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),eo=function(){function a(a,d,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<
h.length;)h[g]=arguments[g+3],++g;g=new G(h,0)}return b.call(this,a,d,e,g)}function b(a,b,e,f){var g=ed(f)?S.b(fe,f):f;a[1]=b;b=ao(function(){return function(b){a[2]=b;return ql(a)}}(f,g,g),e,g);return v(b)?(a[2]=K.a?K.a(b):K.call(null,b),Ii):null}a.l=3;a.g=function(a){var d=H(a);a=J(a);var e=H(a);a=J(a);var f=H(a);a=I(a);return b(d,e,f,a)};a.d=b;return a}(),fo=function(){function a(a,b){var c=wn.a(b),g=wn.a(1);kn(function(b,c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;
a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.k=c;d.a=b;return d}()}(function(b,c){return function(e){var f=e[1];if(7===f){var g=e[7],
h=e[8],k=e[2],l=Q.c(k,0,null),n=Q.c(k,1,null);e[9]=n;e[7]=k;e[8]=l;e[1]=v(null==l)?8:9;return Ii}if(1===f){var O=Re(a);e[10]=O;e[2]=null;e[1]=2;return Ii}return 4===f?(O=e[10],eo(e,7,O)):6===f?(k=e[2],e[2]=k,e[1]=3,Ii):3===f?(k=e[2],tl(e,k)):2===f?(O=e[10],k=0<P(O),e[1]=v(k)?4:5,Ii):11===f?(O=e[10],e[11]=e[2],e[10]=O,e[2]=null,e[1]=2,Ii):9===f?(h=e[8],sl(e,11,c,h)):5===f?(k=il(c),e[2]=k,e[1]=6,Ii):10===f?(k=e[2],e[2]=k,e[1]=6,Ii):8===f?(n=e[9],g=e[7],h=e[8],O=e[10],k=we(function(){return function(a){return function(b){return Xd.b(a,
b)}}(n,h,g,O,n,g,h,O,f,b,c)}(),O),e[10]=k,e[2]=null,e[1]=2,Ii):null}}(b,c),b,c)}(),f=function(){var a=e.k?e.k():e.call(null);a[6]=b;return a}();return ql(f)}}(g,c));return c}function b(a){return c.b(a,null)}var c=null,c=function(c,e){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.b=a;return c}();function go(a,b){return bo(a,b)};function ho(a,b){var c=S.c(Yf,a,b);return L(c,te.b(function(a){return function(b){return a===b}}(c),b))}
var io=function(){function a(a,b){for(;;)if(P(b)<P(a)){var c=a;a=b;b=c}else return Oa.c(function(a,b){return function(a,c){return gd(b,c)?a:Uc.b(a,c)}}(a,b),a,a)}var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return c.call(this,b,d,k)}function c(a,d,e){a=ho(function(a){return-P(a)},Mc.d(e,d,M([a],0)));return Oa.c(b,H(a),I(a))}a.l=2;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);
return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.a=function(a){return a};b.b=a;b.d=c.d;return b}(),jo=function(){function a(a,b){return P(a)<P(b)?Oa.c(function(a,c){return gd(b,c)?Uc.b(a,c):a},a,a):Oa.c(Uc,a,b)}
var b=null,c=function(){function a(b,d,h){var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new G(l,0)}return c.call(this,b,d,k)}function c(a,d,e){return Oa.c(b,a,Mc.b(e,d))}a.l=2;a.g=function(a){var b=H(a);a=J(a);var d=H(a);a=I(a);return c(b,d,a)};a.d=c;return a}(),b=function(b,e,f){switch(arguments.length){case 1:return b;case 2:return a.call(this,b,e);default:var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<
h.length;)h[g]=arguments[g+2],++g;g=new G(h,0)}return c.d(b,e,g)}throw Error("Invalid arity: "+arguments.length);};b.l=2;b.g=c.g;b.a=function(a){return a};b.b=a;b.d=c.d;return b}();function ko(a,b,c){if(a?a.Fc:a)return a.Fc(0,b,c);var d;d=ko[t(null==a?null:a)];if(!d&&(d=ko._,!d))throw y("ICursor.transact!",a);return d.call(null,a,b,c)}function lo(a,b){if(a?a.Ec:a)return a.Ec(0,b);var c;c=lo[t(null==a?null:a)];if(!c&&(c=lo._,!c))throw y("ICursor.root",a);return c.call(null,a,b)}function mo(a,b,c,d,e,f){this.Ca=a;this.va=b;this.Ia=c;this.w=d;this.s=e;this.o=f;this.j=2229667594;this.q=8192}m=mo.prototype;m.toString=function(){return[A("\x3cStateCursor "),A(this.va),A("\x3e")].join("")};
m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){switch(b instanceof T?b.ra:null){case "sstate":return this.Ia;case "ks":return this.va;case "root-state":return this.Ca;default:return R.c(this.s,b,c)}};m.v=function(a,b,c){return fg(b,function(){return function(a){return fg(b,lg,""," ","",c,a)}}(this),"#renderer.engine.StateCursor{",", ","}",c,Qd.b(new W(null,3,5,Y,[new W(null,2,5,Y,[th,this.Ca],null),new W(null,2,5,Y,[Nh,this.va],null),new W(null,2,5,Y,[Xk,this.Ia],null)],null),this.s))};
m.Fc=function(a,b,c){return je.i(this.Ca,Ae,am(this.va,b),function(a){return function(b){var f=c.a?c.a(b):c.call(null,b),g=""+A(a);Ml.u?Ml.u("Transact!",g,": ",b,"-\x3e",f):Ml.call(null,"Transact!",g,": ",b,"-\x3e",f);return f}}(this))};function no(a,b){var c=""+A(a),d=a.va,e=am(a.va,b);Ml.S?Ml.S("Sub-cursor",c,": ",d,"-\x3e",b,":",e):Ml.call(null,"Sub-cursor",c,": ",d,"-\x3e",b,":",e);return new mo(a.Ca,am(a.va,b),a.Ia,null,null,null)}
m.Ec=function(a,b){var c=this;return xe.b(function(){var a=c.Ca;return K.a?K.a(a):K.call(null,a)}(),$l(b))};m.A=function(){return this.w};m.P=function(){return 3+P(this.s)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=rd(this)};m.B=function(a,b){return v(v(b)?this.constructor===b.constructor&&jf(this,b):b)?!0:!1};
m.La=function(a,b){return gd(new Tf(null,new u(null,3,[th,null,Nh,null,Xk,null],null),null),b)?Qc.b(Jc(ue.b(Z,this),this.w),b):new mo(this.Ca,this.va,this.Ia,this.w,Yd(Qc.b(this.s,b)),null)};
m.Da=function(a,b,c){return v(Ad.b?Ad.b(th,b):Ad.call(null,th,b))?new mo(c,this.va,this.Ia,this.w,this.s,null):v(Ad.b?Ad.b(Nh,b):Ad.call(null,Nh,b))?new mo(this.Ca,c,this.Ia,this.w,this.s,null):v(Ad.b?Ad.b(Xk,b):Ad.call(null,Xk,b))?new mo(this.Ca,this.va,c,this.w,this.s,null):new mo(this.Ca,this.va,this.Ia,this.w,Pc.c(this.s,b,c),null)};
m.M=function(){return E(Qd.b(new W(null,3,5,Y,[new W(null,2,5,Y,[th,this.Ca],null),new W(null,2,5,Y,[Nh,this.va],null),new W(null,2,5,Y,[Xk,this.Ia],null)],null),this.s))};m.D=function(a,b){return new mo(this.Ca,this.va,this.Ia,b,this.s,this.o)};m.O=function(a,b){return Zc(b)?db(this,C.b(b,0),C.b(b,1)):Oa.c(Va,this,b)};function oo(a,b,c){if(a?a.Ic:a)return a.Ic(0,b,c);var d;d=oo[t(null==a?null:a)];if(!d&&(d=oo._,!d))throw y("IRenderEngine.pick-point",a);return d.call(null,a,b,c)}
function po(a,b){if(a?a.Gc:a)return a.Gc(0,b);var c;c=po[t(null==a?null:a)];if(!c&&(c=po._,!c))throw y("IRenderEngine.add-loader",a);return c.call(null,a,b)}function qo(a,b,c){if(a?a.Kc:a)return a.Kc(0,b,c);var d;d=qo[t(null==a?null:a)];if(!d&&(d=qo._,!d))throw y("IRenderEngine.resize-view!",a);return d.call(null,a,b,c)}function ro(a,b){if(a?a.Hc:a)return a.Hc(0,b);var c;c=ro[t(null==a?null:a)];if(!c&&(c=ro._,!c))throw y("IRenderEngine.add-post-render",a);return c.call(null,a,b)}
function so(a,b,c,d){if(a?a.Jc:a)return a.Jc(0,b,c,d);var e;e=so[t(null==a?null:a)];if(!e&&(e=so._,!e))throw y("IRenderEngine.project-to-image",a);return e.call(null,a,b,c,d)}
var to=function(){function a(a,b,c){a=Xf(le.b(c,a));var g=Xf(nf(b));b=jo.b(a,g);c=jo.b(g,a);a=io.b(a,g);return new W(null,3,5,Y,[ue.b(Lc,b),ue.b(Lc,c),ue.b(Lc,a)],null)}function b(a,b){return c.c(a,b,kd)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}(),uo=function(){function a(a,b,c,g,h){var k=to.c(a,b,h),l=Q.c(k,0,null),n=Q.c(k,1,null),p=Q.c(k,2,null),q=ue.b(Z,
function(){return function(a,b,c,d){return function aa(e){return new Dd(null,function(){return function(){for(;;){var a=E(e);if(a){if($c(a)){var b=Sb(a),c=P(b),d=Hd(c);return function(){for(var a=0;;)if(a<c){var e=C.b(b,a),f=d,g=Y,k;k=e;k=h.a?h.a(k):h.call(null,k);f.add(new W(null,2,5,g,[k,e],null));a+=1}else return!0}()?Kd(d.U(),aa(Tb(a))):Kd(d.U(),null)}var f=H(a);return L(new W(null,2,5,Y,[function(){var a=f;return h.a?h.a(a):h.call(null,a)}(),f],null),aa(I(a)))}return null}}}(a,b,c,d),null,null)}}(k,
l,n,p)(a)}()),r=Rf(q,l),s=Rf(b,n),w=Pf(s);eg.a(le.b(g,w));g=ue.b(Z,function(){return function(a,b,d,e,g,h,k){return function U(l){return new Dd(null,function(){return function(){for(;;){var a=E(l);if(a){if($c(a)){var b=Sb(a),d=P(b),e=Hd(d);return function(){for(var a=0;;)if(a<d){var g=C.b(b,a),h=Q.c(g,0,null),k=Q.c(g,1,null),g=e,l=Y,k=c.a?c.a(k):c.call(null,k);g.add(new W(null,2,5,l,[h,k],null));a+=1}else return!0}()?Kd(e.U(),U(Tb(a))):Kd(e.U(),null)}var g=H(a),h=Q.c(g,0,null),k=Q.c(g,1,null);return L(new W(null,
2,5,Y,[h,function(){var a=k;return c.a?c.a(a):c.call(null,a)}()],null),U(I(a)))}return null}}}(a,b,d,e,g,h,k),null,null)}}(k,l,n,p,q,r,s)(r)}());b=S.c(Qc,b,n);return Qf.d(M([b,g],0))}function b(a,b,f,g){return c.r(a,b,f,g,kd)}var c=null,c=function(c,e,f,g,h){switch(arguments.length){case 4:return b.call(this,c,e,f,g);case 5:return a.call(this,c,e,f,g,h)}throw Error("Invalid arity: "+arguments.length);};c.i=b;c.r=a;return c}();
function vo(a,b){var c=wn.k();a.load(b,function(a){return function(b,c){return v(b)?il(a):co.b(a,new W(null,1,5,Y,[c],null))}}(c));return c}
function wo(a,b){var c=wn.a(1);kn(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.k=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];if(2===d){var d=c[7],e=c[8];return tl(c,new W(null,2,5,d,[e,c[2]],null))}if(1===d){var d=Y,e=Cd.a(a.provides),f=vo(a,b);c[7]=d;c[8]=e;return rl(c,2,f)}return null}}(c),c)}(),f=function(){var a=e.k?e.k():e.call(null);a[6]=c;return a}();return ql(f)}}(c));return c}
function xo(a,b){var c=Object.keys(b),d=function(){return function(c){return function g(d){return new Dd(null,function(){return function(){for(var c=d;;)if(c=E(c)){if($c(c)){var e=Sb(c),n=P(e),p=Hd(n);a:{for(var q=0;;)if(q<n){var r=C.b(e,q),s=R.b(a,r);v(s)&&(r=wo(s,b[r]),p.add(r));q+=1}else{e=!0;break a}e=void 0}return e?Kd(p.U(),g(Tb(c))):Kd(p.U(),null)}p=H(c);e=R.b(a,p);if(v(e))return L(wo(e,b[p]),g(I(c)));c=I(c)}else return null}}(c),null,null)}}(c)(c)}();return go(Z,fo.a(d))}
function yo(a,b){var c=lo(a,Hj),d=lo(a,zi),e=lo(a,kk);ko(a,Lc,function(c,d,e){return function(k){return uo.i(b,k,function(b,c,d){return function(e){var f=cl(e),g=wn.a(1);kn(function(b,c,d,f,g){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null];
a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.k=c;d.a=b;return d}()}(function(b,c,d,f,g){return function(h){var k=h[1];if(2===k){var l=h[2],n=[e],p=new W(null,1,5,Y,n,null),r=ko(a,p,function(){return function(a,b,c,d,e,f,g,h,k,l){return function(b){if(null==b)return null;var c=um(l,k,a);return Pc.c(b,vh,c)}}(l,l,Y,n,p,k,b,c,d,f,g)}());return tl(h,r)}return 1===k?(r=
xo(g,c),rl(h,2,r)):null}}(b,c,d,f,g),b,c,d,f,g)}(),k=function(){var a=h.k?h.k():h.call(null);a[6]=b;return a}();return ql(k)}}(g,f,b,c,d));return new u(null,1,[fk,!0],null)}}(c,d,e),kd)}}(c,d,e))}
function zo(a,b){var c=lo(a,Hj);ko(a,Lc,function(a){return function(c){return uo.r(b,c,function(a){return function(b){Q.c(b,0,null);var c=Q.c(b,1,null),d=Q.c(b,2,null);b=Q.c(b,3,null);var e;e=new Float32Array(S.b(La,Qd.b(c,d)));e=Cl(a,e,34962,35044);return new u(null,4,[Ck,e,Bi,c,ek,d,Bh,b],null)}}(a),function(a){return function(b){b=ed(b)?S.b(fe,b):b;var c=R.b(b,Ck);ng.d(M(["remove",b],0));return a.deleteBuffer(c)}}(a),kd)}}(c))}
function Ao(a,b){var c=document.createElement("canvas");c.width=a;c.height=b;return c}function Bo(a,b,c){a.width=b;a.height=c}function Co(a,b,c,d){this.state=a;this.w=b;this.s=c;this.o=d;this.j=2229667594;this.q=8192}m=Co.prototype;m.J=function(a,b){return bb.c(this,b,null)};m.I=function(a,b,c){switch(b instanceof T?b.ra:null){case "state":return this.state;default:return R.c(this.s,b,c)}};
m.v=function(a,b,c){return fg(b,function(){return function(a){return fg(b,lg,""," ","",c,a)}}(this),"#renderer.engine.WebGLRenderEngine{",", ","}",c,Qd.b(new W(null,1,5,Y,[new W(null,2,5,Y,[Pi,this.state],null)],null),this.s))};m.A=function(){return this.w};m.P=function(){return 1+P(this.s)};m.C=function(){var a=this.o;return null!=a?a:this.o=a=rd(this)};m.B=function(a,b){return v(v(b)?this.constructor===b.constructor&&jf(this,b):b)?!0:!1};
function Do(a,b,c){var d=b.offsetWidth,e=b.offsetHeight,f=Ao(d,e),g=Cm(f);b.appendChild(f);var h=function(){var a=new wm(V.a?V.a(Z):V.call(null,Z),null,null,null),c=Z,f=Z,h;h=zl(g,35633,"\n  precision mediump float;\n\n  uniform mat4  projectionMatrix;\n  uniform mat4  modelViewMatrix;\n  uniform mat4  modelViewProjectionMatrix;\n  uniform mat4  modelMatrix;\n\n  uniform float pointSize;\n  uniform float intensityBlend;\n  uniform float maxColorComponent;\n\n  uniform float rgb_f;\n  uniform float intensity_f;\n  uniform float class_f;\n  uniform float height_f;\n  uniform float iheight_f;\n  uniform float map_f;\n  uniform float imap_f;\n  uniform float overlay_f;\n\n  uniform vec3 xyzScale;\n\n  uniform float clampLower;\n  uniform float clampHigher;\n  uniform float colorClampLower;\n  uniform float colorClampHigher;\n  uniform vec2  zrange;\n  uniform vec4  uvrange;\n  uniform vec3  offset;\n  uniform sampler2D map;\n  uniform vec2  klassRange;\n  uniform vec2  pointSizeAttenuation; // (actual size contribution, attenuated size contribution)\n  uniform vec2  screen; // screen dimensions\n\n  uniform sampler2D overlay;\n\n  attribute vec3 position;\n  attribute vec3 color;\n  attribute float intensity;\n  attribute float classification;\n\n  varying vec3 out_color;\n  varying vec3 out_intensity;\n\n  varying vec3 fpos;\n\n\n  void main() {\n      fpos \x3d ((position.xyz - offset) * xyzScale).xzy * vec3(-1, 1, 1);\n\n      vec4 mvPosition \x3d modelViewMatrix * modelMatrix * vec4( fpos, 1.0 );\n      gl_Position \x3d projectionMatrix * mvPosition;\n      float nheight \x3d (position.z - zrange.x) / (zrange.y - zrange.x);\n\n      float nhclamp \x3d (nheight - colorClampLower) / (colorClampHigher - colorClampLower);\n\n      // compute color channels\n      //\n      vec3 norm_color \x3d color / maxColorComponent;\n      vec3 map_color \x3d texture2D(map, vec2(nhclamp, 0.5)).rgb;\n      vec3 inv_map_color \x3d texture2D(map, vec2(1.0 - nhclamp, 0.5)).rgb;\n\n      float iklass \x3d (classification - klassRange.x) / (klassRange.y - klassRange.x);\n      vec3 class_color \x3d texture2D(map, vec2(iklass, 0.5)).rgb;\n\n      // compute intensity channels\n      float i \x3d (intensity - clampLower) / (clampHigher - clampLower);\n      vec3 intensity_color \x3d vec3(i, i, i);\n\n\n      vec3 height_color \x3d vec3(nheight, nheight, nheight);\n      vec3 inv_height_color \x3d vec3(1.0 - nheight, 1.0 - nheight, 1.0 - nheight);\n\n      vec2 uv \x3d vec2(1.0 - (fpos.x - uvrange.x) / (uvrange.z - uvrange.x),\n                     1.0 - (fpos.z - uvrange.y) / (uvrange.w - uvrange.y));\n                     \n      vec3 overlay_color \x3d texture2D(overlay, uv).xyz;\n\n      // turn the appropriate channels on\n      //\n      out_color \x3d norm_color * rgb_f +\n              class_color * class_f +\n              map_color * map_f +\n              inv_map_color * imap_f +\n              overlay_color * overlay_f;\n\n     //out_color \x3d vec3(uv, 0.0);\n              \n      out_intensity \x3d intensity_color * intensity_f +\n                  height_color * height_f +\n                  inv_height_color * iheight_f;\n\n      float attenuatedPointSize \x3d ((1.0 / tan(1.308/2.0)) * pointSize / (-mvPosition.z)) * screen.y / 2.0;\n      gl_PointSize \x3d dot(vec2(pointSize, attenuatedPointSize), pointSizeAttenuation);\n  }");
var q=zl(g,35632,v(g.getExtension("EXT_frag_depth"))?[A("#define have_frag_depth\n\n"),A("\n#if defined have_frag_depth\n#extension GL_EXT_frag_depth : enable\n#endif\n\n  precision mediump float;\n\n  uniform vec4 planes[6];\n  uniform int do_plane_clipping, circularPoints;\n  uniform float intensityBlend;\n\n  uniform sampler2D overlay;\n\n  varying vec3 out_color;\n  varying vec3 out_intensity;\n  varying vec3 fpos;\n\n  void main() {\n      if (do_plane_clipping \x3e 0) {\n          for(int i \x3d 0 ; i \x3c 6 ; i ++) {\n              if (dot(planes[i], vec4(fpos, 1.0)) \x3c 0.0)\n                  discard;\n          }\n      }\n\n\n        if (circularPoints \x3e 0) {\n        float a \x3d pow(2.0*(gl_PointCoord.x - 0.5), 2.0);\n        float b \x3d pow(2.0*(gl_PointCoord.y - 0.5), 2.0);\n        float c \x3d 1.0 - (a + b);\n\n        if(c \x3c 0.0){\n            discard;\n        }      \n\n#if defined have_frag_depth\n        gl_FragDepthEXT \x3d gl_FragCoord.z + 0.002*(1.0-pow(c, 1.0)) * gl_FragCoord.w;\n#endif\n      }\n      gl_FragColor \x3d vec4(mix(out_color, out_intensity, intensityBlend), 1.0);\n  }")].join(""):
"\n#if defined have_frag_depth\n#extension GL_EXT_frag_depth : enable\n#endif\n\n  precision mediump float;\n\n  uniform vec4 planes[6];\n  uniform int do_plane_clipping, circularPoints;\n  uniform float intensityBlend;\n\n  uniform sampler2D overlay;\n\n  varying vec3 out_color;\n  varying vec3 out_intensity;\n  varying vec3 fpos;\n\n  void main() {\n      if (do_plane_clipping \x3e 0) {\n          for(int i \x3d 0 ; i \x3c 6 ; i ++) {\n              if (dot(planes[i], vec4(fpos, 1.0)) \x3c 0.0)\n                  discard;\n          }\n      }\n\n\n        if (circularPoints \x3e 0) {\n        float a \x3d pow(2.0*(gl_PointCoord.x - 0.5), 2.0);\n        float b \x3d pow(2.0*(gl_PointCoord.y - 0.5), 2.0);\n        float c \x3d 1.0 - (a + b);\n\n        if(c \x3c 0.0){\n            discard;\n        }      \n\n#if defined have_frag_depth\n        gl_FragDepthEXT \x3d gl_FragCoord.z + 0.002*(1.0-pow(c, 1.0)) * gl_FragCoord.w;\n#endif\n      }\n      gl_FragColor \x3d vec4(mix(out_color, out_intensity, intensityBlend), 1.0);\n  }");
h=Al.d(g,M([h,q],0));a=Oc([ti,zi,Ai,Qi,Hj,ik,kk,yk,zk,Wk],[0,a,d,c,g,b,f,h,new Wm(V.a?V.a(Z):V.call(null,Z),null,null,null),e]);return V.a?V.a(a):V.call(null,a)}();al(h,"__internal",function(){return function(a,b,d,e){return Om(Pc.c(e,ri,K.a?K.a(c):K.call(null,c)))}}(h,d,e,f,g,a));al(c,"__internal-ss",function(a){return function(b,c,d,e){b=new mo(a,Lc,e,null,null,null);Qi.a(d)!==Qi.a(e)&&yo(no(b,new W(null,1,5,Y,[Qi],null)),Qi.a(e));Ti.a(d)!==Ti.a(e)&&zo(no(b,new W(null,1,5,Y,[Ti],null)),Ti.a(e));
return je.i(a,Ae,new W(null,1,5,Y,[ti],null),xc)}}(h,d,e,f,g,a));a=a.state;h=new u(null,2,[Zi,h,ri,c],null);he.b?he.b(a,h):he.call(null,a,h)}m.Ic=function(a,b,c){var d=this;a=function(){var a=Zi.a(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}());return K.a?K.a(a):K.call(null,a)}();a=Pc.c(a,ri,function(){var a=ri.a(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}());return K.a?K.a(a):K.call(null,a)}());return Vm(zk.a(a),a,b,c)};
m.Gc=function(a,b){var c=this,d=b.key,e=Zi.a(function(){var a=c.state;return K.a?K.a(a):K.call(null,a)}());if(!v(b.provides))throw Error("The loader doesn't advertise what it provides");return je.d(e,Ae,new W(null,1,5,Y,[kk],null),Pc,M([d,b],0))};m.Kc=function(a,b,c){var d=this;a=Zi.a(function(){var a=d.state;return K.a?K.a(a):K.call(null,a)}());var e=Hj.a(K.a?K.a(a):K.call(null,a)).canvas;console.log("reiszing view!",b,c);Bo(e,b,c);return je.c(a,Qf,new u(null,2,[Ai,b,Wk,c],null))};
m.Hc=function(a,b){var c=this,d=Zi.a(function(){var a=c.state;return K.a?K.a(a):K.call(null,a)}());return je.d(d,Ae,new W(null,1,5,Y,[hh],null),Mc,M([b],0))};m.Jc=function(a,b,c,d){var e=this;a=function(){var a=Zi.a(function(){var a=e.state;return K.a?K.a(a):K.call(null,a)}());return K.a?K.a(a):K.call(null,a)}();a=Pc.c(a,ri,function(){var a=ri.a(function(){var a=e.state;return K.a?K.a(a):K.call(null,a)}());return K.a?K.a(a):K.call(null,a)}());return Um(a,b,c,d)};
m.La=function(a,b){return gd(new Tf(null,new u(null,1,[Pi,null],null),null),b)?Qc.b(Jc(ue.b(Z,this),this.w),b):new Co(this.state,this.w,Yd(Qc.b(this.s,b)),null)};m.Da=function(a,b,c){return v(Ad.b?Ad.b(Pi,b):Ad.call(null,Pi,b))?new Co(c,this.w,this.s,null):new Co(this.state,this.w,Pc.c(this.s,b,c),null)};m.M=function(){return E(Qd.b(new W(null,1,5,Y,[new W(null,2,5,Y,[Pi,this.state],null)],null),this.s))};m.D=function(a,b){return new Co(this.state,b,this.s,this.o)};
m.O=function(a,b){return Zc(b)?db(this,C.b(b,0),C.b(b,1)):Oa.c(Va,this,b)};var Eo=new u(null,2,[Ek,new u(null,1,[ok,Lc],null),Mj,new u(null,2,[Lh,new W(null,3,5,Y,[0,0,0],null),Di,Z],null)],null),Fo=function(){function a(a,b,c,g){if(a?a.wc:a)return a.wc(0,b,c,g);var h;h=Fo[t(null==a?null:a)];if(!h&&(h=Fo._,!h))throw y("IPlasioRenderer.set-clear-color",a);return h.call(null,a,b,c,g)}function b(a,b){if(a?a.vc:a)return a.vc(0,b);var c;c=Fo[t(null==a?null:a)];if(!c&&(c=Fo._,!c))throw y("IPlasioRenderer.set-clear-color",a);return c.call(null,a,b)}var c=null,c=function(c,e,f,
g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.i=a;return c}();function Go(a,b){if(a?a.ec:a)return a.ec(0,b);var c;c=Go[t(null==a?null:a)];if(!c&&(c=Go._,!c))throw y("IPlasioRenderer.add-camera",a);return c.call(null,a,b)}function Ho(a,b,c){if(a?a.Cc:a)return a.Cc(0,b,c);var d;d=Ho[t(null==a?null:a)];if(!d&&(d=Ho._,!d))throw y("IPlasioRenderer.update-camera",a);return d.call(null,a,b,c)}
var Io=function(){function a(a,b,c,g){if(a?a.yc:a)return a.yc(0,b,c,g);var h;h=Io[t(null==a?null:a)];if(!h&&(h=Io._,!h))throw y("IPlasioRenderer.set-eye-position",a);return h.call(null,a,b,c,g)}function b(a,b){if(a?a.xc:a)return a.xc(0,b);var c;c=Io[t(null==a?null:a)];if(!c&&(c=Io._,!c))throw y("IPlasioRenderer.set-eye-position",a);return c.call(null,a,b)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,c,e,f,g)}throw Error("Invalid arity: "+
arguments.length);};c.b=b;c.i=a;return c}(),Jo=function(){function a(a,b,c,g){if(a?a.Bc:a)return a.Bc(0,b,c,g);var h;h=Jo[t(null==a?null:a)];if(!h&&(h=Jo._,!h))throw y("IPlasioRenderer.set-target-position",a);return h.call(null,a,b,c,g)}function b(a,b){if(a?a.Ac:a)return a.Ac(0,b);var c;c=Jo[t(null==a?null:a)];if(!c&&(c=Jo._,!c))throw y("IPlasioRenderer.set-target-position",a);return c.call(null,a,b)}var c=null,c=function(c,e,f,g){switch(arguments.length){case 2:return b.call(this,c,e);case 4:return a.call(this,
c,e,f,g)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.i=a;return c}(),Ko=function(){function a(a,b,c,g,h){if(a?a.lc:a)return a.lc(0,b,c,g,h);var k;k=Ko[t(null==a?null:a)];if(!k&&(k=Ko._,!k))throw y("IPlasioRenderer.add-scale-object",a);return k.call(null,a,b,c,g,h)}function b(a,b,c){if(a?a.kc:a)return a.kc(0,b,c);var g;g=Ko[t(null==a?null:a)];if(!g&&(g=Ko._,!g))throw y("IPlasioRenderer.add-scale-object",a);return g.call(null,a,b,c)}var c=null,c=function(c,e,f,g,h){switch(arguments.length){case 3:return b.call(this,
c,e,f);case 5:return a.call(this,c,e,f,g,h)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.r=a;return c}();function Lo(a){if(a?a.qc:a)return a.qc();var b;b=Lo[t(null==a?null:a)];if(!b&&(b=Lo._,!b))throw y("IPlasioRenderer.remove-all-scale-objects",a);return b.call(null,a)}function Mo(a,b,c){if(a?a.jc:a)return a.jc(0,b,c);var d;d=Mo[t(null==a?null:a)];if(!d&&(d=Mo._,!d))throw y("IPlasioRenderer.add-prop-listener",a);return d.call(null,a,b,c)}
function No(a,b){if(a?a.tc:a)return a.tc(0,b);var c;c=No[t(null==a?null:a)];if(!c&&(c=No._,!c))throw y("IPlasioRenderer.remove-prop-listener",a);return c.call(null,a,b)}function Oo(a,b){if(a?a.hc:a)return a.hc(0,b);var c;c=Oo[t(null==a?null:a)];if(!c&&(c=Oo._,!c))throw y("IPlasioRenderer.add-point-buffer",a);return c.call(null,a,b)}
function Po(a,b){if(a?a.sc:a)return a.sc(0,b);var c;c=Po[t(null==a?null:a)];if(!c&&(c=Po._,!c))throw y("IPlasioRenderer.remove-point-buffer",a);return c.call(null,a,b)}function Qo(a,b){if(a?a.gc:a)return a.gc(0,b);var c;c=Qo[t(null==a?null:a)];if(!c&&(c=Qo._,!c))throw y("IPlasioRenderer.add-loader",a);return c.call(null,a,b)}function Ro(a,b){if(a?a.zc:a)return a.zc(0,b);var c;c=Ro[t(null==a?null:a)];if(!c&&(c=Ro._,!c))throw y("IPlasioRenderer.set-render-options",a);return c.call(null,a,b)}
function So(a,b,c){if(a?a.nc:a)return a.nc(0,b,c);var d;d=So[t(null==a?null:a)];if(!d&&(d=So._,!d))throw y("IPlasioRenderer.pick-point",a);return d.call(null,a,b,c)}function To(a,b){if(a?a.mc:a)return a.mc(0,b);var c;c=To[t(null==a?null:a)];if(!c&&(c=To._,!c))throw y("IPlasioRenderer.apply-state",a);return c.call(null,a,b)}function Uo(a,b,c){if(a?a.uc:a)return a.uc(0,b,c);var d;d=Uo[t(null==a?null:a)];if(!d&&(d=Uo._,!d))throw y("IPlasioRenderer.resize-view!",a);return d.call(null,a,b,c)}
function Vo(a,b){if(a?a.ic:a)return a.ic(0,b);var c;c=Vo[t(null==a?null:a)];if(!c&&(c=Vo._,!c))throw y("IPlasioRenderer.add-post-render",a);return c.call(null,a,b)}function Wo(a,b,c,d,e){if(a?a.fc:a)return a.fc(0,b,c,d,e);var f;f=Wo[t(null==a?null:a)];if(!f&&(f=Wo._,!f))throw y("IPlasioRenderer.add-line-segment",a);return f.call(null,a,b,c,d,e)}
function Xo(a,b,c,d,e){if(a?a.Dc:a)return a.Dc(0,b,c,d,e);var f;f=Xo[t(null==a?null:a)];if(!f&&(f=Xo._,!f))throw y("IPlasioRenderer.update-line-segment",a);return f.call(null,a,b,c,d,e)}function Yo(a,b){if(a?a.rc:a)return a.rc(0,b);var c;c=Yo[t(null==a?null:a)];if(!c&&(c=Yo._,!c))throw y("IPlasioRenderer.remove-line-segment",a);return c.call(null,a,b)}
function Zo(a){if(a?a.pc:a)return a.pc();var b;b=Zo[t(null==a?null:a)];if(!b&&(b=Zo._,!b))throw y("IPlasioRenderer.remove-all-line-segments",a);return b.call(null,a)}function $o(a,b,c,d){if(a?a.oc:a)return a.oc(0,b,c,d);var e;e=$o[t(null==a?null:a)];if(!e&&(e=$o._,!e))throw y("IPlasioRenderer.project-to-image",a);return e.call(null,a,b,c,d)}function ap(a,b,c,d,e){this.state=a;this.xa=b;this.w=c;this.s=d;this.o=e;this.j=2229667594;this.q=8192}m=ap.prototype;m.J=function(a,b){return bb.c(this,b,null)};
m.I=function(a,b,c){switch(b instanceof T?b.ra:null){case "render-engine":return this.xa;case "state":return this.state;default:return R.c(this.s,b,c)}};m.v=function(a,b,c){return fg(b,function(){return function(a){return fg(b,lg,""," ","",c,a)}}(this),"#renderer.core.PlasioRenderer{",", ","}",c,Qd.b(new W(null,2,5,Y,[new W(null,2,5,Y,[Pi,this.state],null),new W(null,2,5,Y,[Eh,this.xa],null)],null),this.s))};m.A=function(){return this.w};m.P=function(){return 2+P(this.s)};
m.C=function(){var a=this.o;return null!=a?a:this.o=a=rd(this)};m.B=function(a,b){return v(v(b)?this.constructor===b.constructor&&jf(this,b):b)?!0:!1};m.ic=function(a,b){var c=ro,d;d=this.xa;d=K.a?K.a(d):K.call(null,d);return c(d,b)};m.sc=function(a,b){return je.i(this.state,Ae,new W(null,1,5,Y,[Qi],null),function(){return function(a){return te.b(Wf([bl(b)]),a)}}(this))};m.Cc=function(a,b,c){return je.d(this.state,Ae,new W(null,3,5,Y,[Ek,ok,b],null),Qf,M([c],0))};
m.ec=function(a,b){return je.d(this.state,Ae,new W(null,2,5,Y,[Ek,ok],null),Mc,M([b],0))};m.wc=function(a,b,c,d){return Fo.b(this,new W(null,3,5,Y,[b,c,d],null))};m.vc=function(a,b){return je.i(this.state,ze,new W(null,2,5,Y,[Mj,Lh],null),b)};m.pc=function(){return je.i(this.state,Pc,Ti,oc)};m.tc=function(a,b){var c=this.state;Kb(c,b);return c};m.mc=function(a,b){var c=this.state;return he.b?he.b(c,b):he.call(null,c,b)};
m.rc=function(a,b){return je.i(this.state,Ae,new W(null,1,5,Y,[Ti],null),function(a){return function(d){return te.b(function(){return function(a){return pc.b(H(a),b)}}(a),d)}}(this))};
m.jc=function(a,b,c){var d=this;a=""+A(Nl());b=le.b(Cd,$l(b));var e=wn.a(1);kn(function(a,b,e,k){return function(){var l=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.k=c;d.a=b;return d}()}(function(a,b,e){return function(a){if(1===a[1]){var b;b=d.state;b=K.a?K.a(b):K.call(null,b);b=xe.b(b,e);b=tg(b);b=c.a?c.a(b):c.call(null,b);return tl(a,b)}return null}}(a,b,e,k),a,b,e,k)}(),n=function(){var b=l.k?l.k():l.call(null);b[6]=a;return b}();return ql(n)}}(e,a,b,this));og(d.state,a,function(a,b,d){return function(e,l,n,p){e=xe.b(p,b);n=xe.b(n,b);if(pc.b(e,n))return null;l=wn.a(1);kn(function(a,
b,d,e,f,g){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:{try{for(;;){var e=a(c);if(!Ad(e,Ii)){d=e;break a}}}catch(f){if(f instanceof Object){c[5]=f;ul(c);d=Ii;break a}throw f;}d=void 0}if(!Ad(d,Ii))return d}}function c(){var a=[null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.k=
c;d.a=b;return d}()}(function(a,b){return function(a){if(1===a[1]){var d=tg(b),d=c.a?c.a(d):c.call(null,d);return tl(a,d)}return null}}(a,b,d,e,f,g),a,b,d,e,f,g)}(),k=function(){var b=h.k?h.k():h.call(null);b[6]=a;return b}();return ql(k)}}(l,e,n,a,b,d));return l}}(a,b,this));return a};m.gc=function(a,b){var c=po,d;d=this.xa;d=K.a?K.a(d):K.call(null,d);return c(d,b)};m.nc=function(a,b,c){a=oo;var d;d=this.xa;d=K.a?K.a(d):K.call(null,d);return a(d,b,c)};
m.hc=function(a,b){return je.d(this.state,Ae,new W(null,1,5,Y,[Qi],null),Mc,M([bl(b)],0))};m.qc=function(){return je.i(this.state,ze,new W(null,1,5,Y,[eh],null),Lc)};m.uc=function(a,b,c){a=qo;var d;d=this.xa;d=K.a?K.a(d):K.call(null,d);return a(d,b,c)};m.yc=function(a,b,c,d){return Io.b(this,new W(null,3,5,Y,[b,c,d],null))};m.xc=function(a,b){return je.i(this.state,ze,new W(null,2,5,Y,[Ek,qi],null),b)};m.zc=function(a,b){return je.d(this.state,Ae,new W(null,2,5,Y,[Mj,Di],null),Qf,M([b],0))};
m.Bc=function(a,b,c,d){return Jo.b(this,new W(null,3,5,Y,[b,c,d],null))};m.Ac=function(a,b){return je.i(this.state,ze,new W(null,2,5,Y,[Ek,bk],null),b)};m.oc=function(a,b,c,d){a=so;var e;e=this.xa;e=K.a?K.a(e):K.call(null,e);return a(e,b,c,d)};m.fc=function(a,b,c,d,e){return je.d(this.state,Ae,new W(null,1,5,Y,[Ti],null),Mc,M([new W(null,4,5,Y,[b,c,d,e],null)],0))};
m.lc=function(a,b,c,d,e){Ml.r?Ml.r("Adding scale object",b,c,d,e):Ml.call(null,"Adding scale object",b,c,d,e);return Ko.c(this,b,new W(null,3,5,Y,[c,d,e],null))};m.kc=function(a,b,c){return je.d(this.state,Ae,new W(null,1,5,Y,[eh],null),Mc,M([new W(null,2,5,Y,[b,c],null)],0))};
m.Dc=function(a,b,c,d,e){return je.i(this.state,Ae,new W(null,1,5,Y,[Ti],null),function(a){return function(g){var h=cg(function(){return function(a){var c=Q.c(a,0,null);Q.c(a,1,null);Q.c(a,2,null);Q.c(a,3,null);return Xd.b(b,c)}}(a),g),k=Q.c(h,0,null),h=Q.c(h,1,null),l=H(h);if(v(l)){Q.c(l,0,null);g=Q.c(l,1,null);var n=Q.c(l,2,null),l=Q.c(l,3,null);return Qd.d(k,new W(null,1,5,Y,[new W(null,4,5,Y,[b,v(c)?c:g,v(d)?d:n,v(e)?e:l],null)],null),M([I(h)],0))}return g}}(this))};
m.La=function(a,b){return gd(new Tf(null,new u(null,2,[Eh,null,Pi,null],null),null),b)?Qc.b(Jc(ue.b(Z,this),this.w),b):new ap(this.state,this.xa,this.w,Yd(Qc.b(this.s,b)),null)};m.Da=function(a,b,c){return v(Ad.b?Ad.b(Pi,b):Ad.call(null,Pi,b))?new ap(c,this.xa,this.w,this.s,null):v(Ad.b?Ad.b(Eh,b):Ad.call(null,Eh,b))?new ap(this.state,c,this.w,this.s,null):new ap(this.state,this.xa,this.w,Pc.c(this.s,b,c),null)};
m.M=function(){return E(Qd.b(new W(null,2,5,Y,[new W(null,2,5,Y,[Pi,this.state],null),new W(null,2,5,Y,[Eh,this.xa],null)],null),this.s))};m.D=function(a,b){return new ap(this.state,this.xa,b,this.s,this.o)};m.O=function(a,b){return Zc(b)?db(this,C.b(b,0),C.b(b,1)):Oa.c(Va,this,b)};
function bp(a,b){return function(){function c(a){var b=null;if(0<arguments.length){for(var b=0,c=Array(arguments.length-0);b<c.length;)c[b]=arguments[b+0],++b;b=new G(c,0)}return d.call(this,b)}function d(c){c=yg.d(c,M([xg,!0],0));return tg(S.c(a,b,c))}c.l=0;c.g=function(a){a=E(a);return d(a)};c.d=d;return c}()}
function cp(a,b){return function(){function c(a){var b=null;if(0<arguments.length){for(var b=0,c=Array(arguments.length-0);b<c.length;)c[b]=arguments[b+0],++b;b=new G(c,0)}return d.call(this,b)}function d(c){return S.c(a,b,c)}c.l=0;c.g=function(a){a=E(a);return d(a)};c.d=d;return c}()}
function dp(a){var b=new ap(V.a?V.a(Z):V.call(null,Z),V.a?V.a(null):V.call(null,null),null,null,null);Ml.a?Ml.a("Doing startup!"):Ml.call(null,"Doing startup!");var c=new Co(V.a?V.a(null):V.call(null,null),null,null,null);Do(c,a,b.state);Ml.a?Ml.a("Setting up state!"):Ml.call(null,"Setting up state!");a=b.xa;he.b?he.b(a,c):he.call(null,a,c);c=b.state;a=Ae.i(Eo,new W(null,2,5,Y,[Ek,ok],null),Mc,new u(null,3,[oj,!0,Ki,"perspective",Wi,70],null));he.b?he.b(c,a):he.call(null,c,a);return tg(Oc([fh,oh,
Gh,Ih,Ph,Rh,ui,vi,xi,Hi,Li,Si,Ui,$i,lj,qj,sj,vj,Aj,Wj,rk,Bk],[bp(Yo,b),bp(Mo,b),bp(Jo,b),bp($o,b),bp(Wo,b),bp(Io,b),bp(Ko,b),bp(Ho,b),bp(So,b),bp(Lo,b),bp(Fo,b),bp(Uo,b),bp(Zo,b),bp(Go,b),cp(Po,b),bp(To,b),cp(Vo,b),bp(Xo,b),cp(Oo,b),bp(Ro,b),bp(No,b),bp(Qo,b)]))}var ep=["renderer","core","createRenderer"],fp=ba;ep[0]in fp||!fp.execScript||fp.execScript("var "+ep[0]);for(var gp;ep.length&&(gp=ep.shift());)ep.length||void 0===dp?fp=fp[gp]?fp[gp]:fp[gp]={}:fp[gp]=dp;
})();
