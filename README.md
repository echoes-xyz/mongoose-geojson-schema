# mongoose-geojson-schema

## About
Schema definitions for GeoJSON types for use with Mongoose JS

## Usage

```
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	geoFeature:GeoJSON.Feature
});
```

## License
Copyright (c) 2014, RideAmigos. (MIT License)

See LICENSE for more info.