# mongoose-geojson-schema

## About

Schema definitions for GeoJSON types for use with [Mongoose JS](http://mongoosejs.com/), a mongodb object model.

The [GeoJSON Schema](http://geojson.org/) specifies geospatial data types for use in JSON-based projects. This package aims to make those data types available to those wanting to employ them in a [mongoose schema](http://mongoosejs.com), with validation following the strict guidelines available on the GeoJSON website. The following data types are available:
* Point
* MultiPoint
* LineString
* MultiLineString
* Polygon
* MultiPolygon

and the following super types:

* Geometry
* GeometryCollection
* Feature
* FeatureCollection

### Coordinate Reference Systems

Following the GeoJSON spec, we assume a default coordinate reference system
(CRS) of the WGS84 datum. That is, coordinates are validated to represent
longitude and latitude units of decimal degrees.

If you wish to disable this validation, set the `crs` property to a `null` or alternate
value [following the GeoJSON spec for Coordinate Reference Sytems](http://geojson.org/geojson-spec.html#coordinate-reference-system-objects)

## Installation

First install [node.js](http://nodejs.org/), [mongodb](https://www.mongodb.org/downloads) and [mongoose](https://www.npmjs.com/package/mongoose)

```
$ npm install mongoose-geojson-schema --save
```

## Usage v2.x

```javascript
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	any: mongoose.Schema.Types.GeoJSON,
	point: mongoose.Schema.Types.Point,
  multipoint: mongoose.Schema.Types.MultiPoint,
  linestring: mongoose.Schema.Types.LineString,
  multilinestring: mongoose.Schema.Types.MultiLineString,
  polygon: mongoose.Schema.Types.Polygon,
  multipolygon: mongoose.Schema.Types.MultiPolygon,
  geometry: mongoose.Schema.Types.Geometry,
  geometrycollection: mongoose.Schema.Types.GeometryCollection,
  feature: mongoose.Schema.Types.Feature,
  featurecollection: mongoose.Schema.Types.FeatureCollection
});

var db = mongoose.createConnection('localhost', 'test');
var model = db.model('GeoJSON', schema);

var test = new GeoJSON({
	any: {
		type: "Point",
		point: [-113.806458, 44.847784]
	},
	point: {
	  type: "Point",
	  coordinates: [12.123456, 13.134578]
	},
	...
	polygon: {
		type: "Polygon",
		coordinates: [
			[
				[12.123456, 13.1345678],
				[179.999999, -1.345],
				[12.0002, -45.4663],
				[12.123456, 13.1345678]
			],
			...
	}
});

```

## Usage v1.x

```javascript
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	point: mongoose.Schema.Types.Point,
	multipoint: mongoose.Schema.Types.MultiPoint,
	linestring: mongoose.Schema.Types.LineString,
	multilinestring: mongoose.Schema.Types.MultiLineString,
	polygon: mongoose.Schema.Types.Polygon,
	multipolygon: mongoose.Schema.Types.MultiPolygon,
	geometry: mongoose.Schema.Types.Geometry,
	geometrycollection: mongoose.Schema.Types.GeometryCollection,
	feature: mongoose.Schema.Types.Feature,
	featurecollection: mongoose.Schema.Types.FeatureCollection
});

var db = mongoose.createConnection('localhost', 'test');
var model = db.model('GeoJSON', schema);

var test = new GeoJSON({
	point: {
	  type: "Point",
	  coordinates: [12.123456, 13.134578]
	},
	...
	polygon: {
		type: "Polygon",
		coordinates: [
			[
				[12.123456, 13.1345678],
				[179.999999, -1.345],
				[12.0002, -45.4663],
				[12.123456, 13.1345678]
			],
			...
	}
});

```

## Usage v0.x

```javascript
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	geoFeature:GeoJSON.Feature
});
```

## Testing

```
npm test
```

## Contributors

[Ben Dalton](https://github.com/bendalton), [Mark Stosberg](https://github.com/markstos), [Joshua Kopecek](https://github.com/joshkopecek)

## License

Copyright (c) 2014-2016, RideAmigos. (MIT License)

See [LICENSE](./LICENSE) for more info.
