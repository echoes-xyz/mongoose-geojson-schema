# mongoose-geojson-schema

## About
Schema definitions for GeoJSON types for use with Mongoose JS.

The [GeoJSON Schema](http://geojson.org/) specifies geospatial data types for use in various JSON-based projects. This package aims to make those data types available to those wanting to employ them in a [mongoose schema](http://mongoosejs.com), with validation following the strict guidelines available on the GeoJSON website. The following data types are available:
* Point
* MultiPoint
* LineString
* MultiLineString
* Polygon
* MultiPolygon

and the following super types

* Geometry
* GeometryCollection
* Feature
* FeatureCollection

## Usage
v0.x
``` javascript
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	geoFeature:GeoJSON.Feature
});
```
v1.x
``` javascript
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

## Testing
```
grunt
```
or
```
npm test
```

## License
Copyright (c) 2014, RideAmigos. (MIT License)

See LICENSE for more info.
