On this branch, we going to experiment with a breaking change.

Until now, this project has supplied custom GeoJSON types for Mongoose.

But maybe this isn't the best way. We are going to explore the idea
of supplying ready-made sub-documents instead.

The idea is that we end up with a similar syntax for users of this module,
like this:

```typescript
import { Point } from 'mongoose-geojson-schema';

const parentSchema = new Schema({
  // Providing GeoJSON schema.
  child: Point
});
```

In the new version, Feature.properties should be mandatory, to follow the spec.

Since we are making a breaking change, consider how a user might for example
add sub specific `property` fields as required to extend the schema that we
return. Could they do something like this:

```typescript
import { Feature as MyFeature } from 'mongoose-geojson-schema';

MyFeature.properties = {
  someField: { required : true },
};

const parentSchema = new Schema({
  // Providing GeoJSON schema.
  child: MyFeature
});
```
We would like the for the resulting syntax to be similar, but full backwards
compatibility is not required.
