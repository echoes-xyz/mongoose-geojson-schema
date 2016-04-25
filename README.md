# mongoose-geojson-schema

## About
Schema definitions for GeoJSON types for use with Mongoose JS

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
  geometrycollection: mongoose.Schema.Types.GeometryCollection,
  feature: mongoose.Schema.Types.Feature,
  featurecollection: mongoose.Schema.Types.FeatureCollection
});
```

## Testing
```
grunt
```

## License
Copyright (c) 2014, RideAmigos. (MIT License)

See LICENSE for more info.
