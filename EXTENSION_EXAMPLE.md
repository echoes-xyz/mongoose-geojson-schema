# Extending GeoJSON Schemas

## Extending Feature Properties (Recommended)

The standard GeoJSON way to add custom data is to extend the `properties` object. This keeps your data within the GeoJSON spec:

### Example 1: Schema with Typed Properties

```typescript
import mongoose from 'mongoose';
import { Feature } from 'mongoose-geojson-schema';

// Define a schema for your properties
const POIPropertiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['restaurant', 'hotel', 'park', 'museum']
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    description: String,
    website: String
  },
  { _id: false }
);

// Extend Feature with typed properties
const POIFeatureSchema = new mongoose.Schema(
  {
    ...Feature.obj,
    properties: POIPropertiesSchema  // Override with typed schema
  },
  { _id: false }
);

const PlaceSchema = new mongoose.Schema({
  name: String,
  poi: POIFeatureSchema
});

const Place = mongoose.model('Place', PlaceSchema);

// Usage
const place = new Place({
  name: 'Great Restaurant',
  poi: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484]
    },
    properties: {
      name: 'Luigi\'s Pizza',
      category: 'restaurant',
      rating: 4.8,
      description: 'Best pizza in town',
      website: 'https://luigis.example.com'
    }
  }
});
```

### Example 2: Complex Nested Properties

```typescript
import mongoose from 'mongoose';
import { Feature } from 'mongoose-geojson-schema';

// Define complex properties with nested structures
const ReviewedLocationPropertiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    reviewed: {
      type: Boolean,
      default: false
    },
    metadata: {
      reviewedBy: String,
      reviewDate: Date,
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      source: {
        type: String,
        enum: ['gps', 'wifi', 'manual', 'crowdsourced']
      }
    }
  },
  { _id: false }
);

const ReviewedLocationSchema = new mongoose.Schema(
  {
    ...Feature.obj,
    properties: ReviewedLocationPropertiesSchema
  },
  { _id: false }
);

const LocationHistorySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: Date,
  location: ReviewedLocationSchema
});
```

### Example 3: Factory Function for Reusable Property Schemas

```typescript
import mongoose from 'mongoose';
import { Feature } from 'mongoose-geojson-schema';

// Create a factory function for consistent property schemas
function createFeatureWithProperties(propertySchema) {
  return new mongoose.Schema(
    {
      ...Feature.obj,
      properties: propertySchema
    },
    { _id: false }
  );
}

// Define specific property schemas
const EventPropertiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eventType: String,
    duration: Number,
    capacity: Number,
    tags: [String]
  },
  { _id: false }
);

const VenuePropertiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    venueType: String,
    accessibility: Boolean,
    parking: Boolean,
    website: String
  },
  { _id: false }
);

// Use the factory
const EventFeatureSchema = createFeatureWithProperties(EventPropertiesSchema);
const VenueFeatureSchema = createFeatureWithProperties(VenuePropertiesSchema);
```

## Important Notes

1. **Feature.properties is Required**: The base Feature schema requires the `properties` field. This is per the GeoJSON specification. All custom data should go in `properties`, not at the top level of the Feature.

2. **Schema Spreading**: When extending, use `...Feature.obj` to access the schema definition object.

3. **Properties Override**: To add typed properties, override the `properties` field with your own schema:
   ```typescript
   properties: YourPropertiesSchema  // Replaces the default Mixed type
   ```

4. **Validators in Properties**: Add custom validators to property fields:

```typescript
const PropertiesSchema = new mongoose.Schema(
  {
    importance: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          return v > 0 && v <= 10;
        },
        message: 'Importance must be between 1 and 10'
      }
    }
  },
  { _id: false }
);

const CustomFeatureSchema = new mongoose.Schema(
  {
    ...Feature.obj,
    properties: PropertiesSchema
  },
  { _id: false }
);
```

5. **Type Safety with TypeScript**: Define property interfaces:

```typescript
interface POIProperties {
  name: string;
  category: 'restaurant' | 'hotel' | 'park' | 'museum';
  rating?: number;
}

const POIPropertiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 }
  },
  { _id: false }
);

const POIFeatureSchema = new mongoose.Schema(
  {
    ...Feature.obj,
    properties: POIPropertiesSchema
  },
  { _id: false }
);
```

## Extending Other Geometry Types

You can also extend other geometry types using the same pattern:

```typescript
import { Point, LineString } from 'mongoose-geojson-schema';

// Extend Point with additional fields
const GPSPointSchema = new mongoose.Schema(
  {
    ...Point.obj,
    altitude: Number,
    accuracy: Number
  },
  { _id: false }
);

// Extend LineString with metadata
const RouteSchema = new mongoose.Schema(
  {
    ...LineString.obj,
    routeName: String,
    distance: Number
  },
  { _id: false }
);
```
