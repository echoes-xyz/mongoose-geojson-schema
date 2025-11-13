# Migration Guide: Schema-Based API

## Overview

This is a breaking change that migrates `mongoose-geojson-schema` from custom `SchemaType` classes to ready-made Mongoose `Schema` objects. This provides better composability and follows standard Mongoose patterns.

## Key Changes

### 1. Import Pattern

**Old (SchemaType-based):**
```typescript
const mongoose = require('mongoose');
require('mongoose-geojson-schema'); // Registers types globally

const schema = new mongoose.Schema({
  location: mongoose.Schema.Types.Point,
  feature: mongoose.Schema.Types.Feature
});
```

**New (Schema-based):**
```typescript
import { Point, Feature } from 'mongoose-geojson-schema';

const schema = new mongoose.Schema({
  location: Point,
  feature: Feature
});
```

### 2. Feature.properties is Now Required

The `properties` field in a Feature is now **mandatory** per the GeoJSON spec:

```typescript
import { Feature } from 'mongoose-geojson-schema';

const featureData = {
  type: 'Feature',
  geometry: { /* ... */ },
  properties: { /* Must be present */ }  // <-- Required
};
```

### 3. Extending Schemas

To add custom properties to a schema, create a new schema and combine it:

```typescript
import { Feature } from 'mongoose-geojson-schema';

// Create a new schema by extending the Feature schema
const MyFeatureSchema = new mongoose.Schema({
  ...Feature.obj,
  customField: { type: String, required: true }
});

// Or add to existing schema definition
const MyFeatureSchema = new mongoose.Schema({
  ...Feature.obj,
  metadata: {
    createdBy: String,
    createdAt: Date
  }
});
```

### 4. No Global Type Registration

The new approach does not globally register types. Import the schemas where you need them:

```typescript
// ❌ No longer works
const schema = new mongoose.Schema({
  point: mongoose.Schema.Types.Point
});

// ✅ Import and use directly
import { Point } from 'mongoose-geojson-schema';

const schema = new mongoose.Schema({
  point: Point
});
```

## Available Exports

All GeoJSON types are now exported as Schema objects:

- `Point`
- `MultiPoint`
- `LineString`
- `MultiLineString`
- `Polygon`
- `MultiPolygon`
- `Geometry`
- `GeometryCollection`
- `Feature` (with mandatory `properties`)
- `FeatureCollection`
- `GeoJSON` (discriminated union)

## Benefits

1. **Standard Mongoose patterns**: Uses composition instead of custom types
2. **Better IDE support**: Direct Schema imports provide better autocomplete
3. **More flexible**: Schemas can be extended using standard Mongoose methods
4. **Explicit dependencies**: No hidden global registrations
5. **TypeScript friendly**: Direct imports with proper type support

## Example Usage

```typescript
import { Feature, Point } from 'mongoose-geojson-schema';

// Create a model with GeoJSON subdocuments
const LocationSchema = new mongoose.Schema({
  name: String,
  primaryLocation: Point,
  landmark: Feature
}, { collection: 'locations' });

const Location = mongoose.model('Location', LocationSchema);

// Create a document
const doc = new Location({
  name: 'City Hall',
  primaryLocation: {
    type: 'Point',
    coordinates: [-73.9857, 40.7484]
  },
  landmark: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484]
    },
    properties: {
      description: 'Historic city hall building'
    }
  }
});

await doc.validate(); // Validates GeoJSON structure
await doc.save();
```

## Breaking Changes Summary

| Aspect | Old | New |
|--------|-----|-----|
| Import | Require module, use `mongoose.Schema.Types.*` | Import schemas directly |
| Type definition | SchemaType classes | Mongoose Schema objects |
| Feature.properties | Optional | Required |
| Global registration | Yes | No |
| Extensibility | Limited | Full Schema composition |
