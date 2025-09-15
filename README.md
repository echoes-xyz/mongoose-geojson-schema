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

## Usage

### JavaScript

```javascript
// requiring it modifies mongoose by side-effect
const mongoose = require('mongoose');
require('mongoose-geojson-schema');

const schema = new mongoose.Schema({
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

const db = mongoose.createConnection('localhost', 'test');
const Location = db.model('GeoJSON', schema);

const test = new Location({
	any: {
		type: "Point",
		coordinates: [-113.806458, 44.847784]
	},
	point: {
	  type: "Point",
	  coordinates: [12.123456, 13.134578]
	},
	// ...
	polygon: {
		type: "Polygon",
		coordinates: [
			[
				[12.123456, 13.1345678],
				[179.999999, -1.345],
				[12.0002, -45.4663],
				[12.123456, 13.1345678]
			]
			// ...
		]
	}
});
```

### TypeScript

```typescript
import mongoose from 'mongoose';
import 'mongoose-geojson-schema';
// or import individual types
import { Point, Polygon, Feature } from 'mongoose-geojson-schema';

interface ILocation extends mongoose.Document {
  name: string;
  location: mongoose.Schema.Types.Point;
  coverage: mongoose.Schema.Types.Polygon;
  feature: mongoose.Schema.Types.Feature;
}

const LocationSchema = new mongoose.Schema<ILocation>({
  name: { type: String, required: true },
  location: {
    type: mongoose.Schema.Types.Point,
    required: true
  },
  coverage: mongoose.Schema.Types.Polygon,
  feature: mongoose.Schema.Types.Feature
});

const Location = mongoose.model<ILocation>('Location', LocationSchema);

// Create a new location with type safety
const location = new Location({
  name: 'My Location',
  location: {
    type: 'Point',
    coordinates: [-73.97, 40.77]
  },
  coverage: {
    type: 'Polygon',
    coordinates: [[
      [-73.98, 40.76],
      [-73.96, 40.76],
      [-73.96, 40.78],
      [-73.98, 40.78],
      [-73.98, 40.76]
    ]]
  },
  feature: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-73.97, 40.77]
    },
    properties: {
      name: 'Feature Name'
    }
  }
});
```


## Testing

```
npm test
```

## See Also

 * If you are developing in TypeScript, you can load [GeoJSON Types](https://www.npmjs.com/package/@types/geojson) to validate GeoJSON objects througout your code. 

## Contributors

* [Joshua Kopecek](https://github.com/joshkopecek)
* [Mark Stosberg](https://github.com/markstos)
* [Ben Dalton](https://github.com/bendalton)

## License

Copyright (c) 2014-2016, RideAmigos. (MIT License)

See [LICENSE](./LICENSE) for more info.
