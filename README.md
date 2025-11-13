# mongoose-geojson-schema

Schema definitions for GeoJSON types for use with [Mongoose JS](http://mongoosejs.com/), a MongoDB object model.

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

## Usage

Import the GeoJSON schemas and use them as subdocuments in your Mongoose schemas:

- **Required subdocument**: Use `{ type: SchemaName, required: true }` syntax
- **Optional subdocument**: Use `SchemaName` directly


### JavaScript

```javascript
import mongoose from 'mongoose';
import { Point, Polygon, Feature } from 'mongoose-geojson-schema';

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  point: { type: Point, required: true },
  polygon: Polygon,
  feature: Feature
});

const Location = mongoose.model('Location', LocationSchema);

// Create a new location
const location = new Location({
  name: 'Downtown District',
  point: {
    type: 'Point',
    coordinates: [-73.97, 40.77]
  },
  polygon: {
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
      description: 'City center landmark'
    }
  }
});

await location.validate();
await location.save();
```

### TypeScript

```typescript
import mongoose from 'mongoose';
import { Point, Polygon, Feature } from 'mongoose-geojson-schema';
import type { Feature as GeoJSONFeature } from 'geojson';

interface ILocation extends mongoose.Document {
  name: string;
  point: any;
  polygon?: any;
  feature?: GeoJSONFeature;
}

const LocationSchema = new mongoose.Schema<ILocation>({
  name: { type: String, required: true },
  point: { type: Point, required: true },
  polygon: Polygon,
  feature: Feature
});

const Location = mongoose.model<ILocation>('Location', LocationSchema);

const location = new Location({
  name: 'My Location',
  point: {
    type: 'Point',
    coordinates: [-73.97, 40.77]
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

### Extending Schemas

Extend any GeoJSON schema by spreading its definition and adding custom fields. 
For Feature, the recommended approach is to extend the `properties` field:

```typescript
import mongoose from 'mongoose';
import { Feature } from 'mongoose-geojson-schema';

// Define a schema for your custom properties
const POIPropertiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['restaurant', 'hotel', 'park']
    },
    rating: { type: Number, min: 0, max: 5 }
  },
  { _id: false }
);

// Create a Feature with typed properties
const POIFeatureSchema = new mongoose.Schema(
  {
    ...Feature.obj,
    properties: POIPropertiesSchema  // Override with typed schema
  },
  { _id: false }
);
```

- See Migration Guide: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- See more extension patterns: [EXTENSION_EXAMPLE.md](./EXTENSION_EXAMPLE.md)


## Testing

```
npm test
```

## See Also

- [GeoJSON Types](https://www.npmjs.com/package/@types/geojson) for TypeScript type definitions
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for upgrading from v2
- [EXTENSION_EXAMPLE.md](./EXTENSION_EXAMPLE.md) for advanced usage patterns

## Contributors

* [Joshua Kopecek](https://github.com/joshkopecek)
* [Mark Stosberg](https://github.com/markstos)
* [Ben Dalton](https://github.com/bendalton)

## License

Copyright (c) 2014-2016, RideAmigos. (MIT License)

See [LICENSE](./LICENSE) for more info.
