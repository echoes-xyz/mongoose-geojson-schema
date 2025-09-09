import * as mongoose from 'mongoose';
import {
  GeoJSON,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Geometry,
  GeometryCollection,
  Feature,
  FeatureCollection
} from 'geojson';


// Mongoose SchemaType classes
declare class GeoJSONSchemaType extends mongoose.SchemaType {
  static schemaName: 'GeoJSON';
  constructor(key: string, options?: any);
  cast(val: any): GeoJSON;
}

declare class PointSchemaType extends mongoose.SchemaType {
  static schemaName: 'Point';
  constructor(key: string, options?: any);
  cast(val: any): Point;
}

declare class MultiPointSchemaType extends mongoose.SchemaType {
  static schemaName: 'MultiPoint';
  constructor(key: string, options?: any);
  cast(val: any): MultiPoint;
}

declare class LineStringSchemaType extends mongoose.SchemaType {
  static schemaName: 'LineString';
  constructor(key: string, options?: any);
  cast(val: any): LineString;
}

declare class MultiLineStringSchemaType extends mongoose.SchemaType {
  static schemaName: 'MultiLineString';
  constructor(key: string, options?: any);
  cast(val: any): MultiLineString;
}

declare class PolygonSchemaType extends mongoose.SchemaType {
  static schemaName: 'Polygon';
  constructor(key: string, options?: any);
  cast(val: any): Polygon;
}

declare class MultiPolygonSchemaType extends mongoose.SchemaType {
  static schemaName: 'MultiPolygon';
  constructor(key: string, options?: any);
  cast(val: any): MultiPolygon;
}

declare class GeometrySchemaType extends mongoose.SchemaType {
  static schemaName: 'Geometry';
  constructor(key: string, options?: any);
  cast(val: any): Geometry;
}

declare class GeometryCollectionSchemaType extends mongoose.SchemaType {
  static schemaName: 'GeometryCollection';
  constructor(key: string, options?: any);
  cast(val: any): GeometryCollection;
}

declare class FeatureSchemaType extends mongoose.SchemaType {
  static schemaName: 'Feature';
  constructor(key: string, options?: any);
  cast(val: any): Feature;
}

declare class FeatureCollectionSchemaType extends mongoose.SchemaType {
  static schemaName: 'FeatureCollection';
  constructor(key: string, options?: any);
  cast(val: any): FeatureCollection;
}

// Module augmentation for mongoose Schema.Types
declare module 'mongoose' {
  namespace Schema {
    namespace Types {
      const GeoJSON: typeof GeoJSONSchemaType;
      const Point: typeof PointSchemaType;
      const MultiPoint: typeof MultiPointSchemaType;
      const LineString: typeof LineStringSchemaType;
      const MultiLineString: typeof MultiLineStringSchemaType;
      const Polygon: typeof PolygonSchemaType;
      const MultiPolygon: typeof MultiPolygonSchemaType;
      const Geometry: typeof GeometrySchemaType;
      const GeometryCollection: typeof GeometryCollectionSchemaType;
      const Feature: typeof FeatureSchemaType;
      const FeatureCollection: typeof FeatureCollectionSchemaType;
    }
  }

  namespace Types {
    const GeoJSON: typeof GeoJSONSchemaType;
    const Point: typeof PointSchemaType;
    const MultiPoint: typeof MultiPointSchemaType;
    const LineString: typeof LineStringSchemaType;
    const MultiLineString: typeof MultiLineStringSchemaType;
    const Polygon: typeof PolygonSchemaType;
    const MultiPolygon: typeof MultiPolygonSchemaType;
    const Geometry: typeof GeometrySchemaType;
    const GeometryCollection: typeof GeometryCollectionSchemaType;
    const Feature: typeof FeatureSchemaType;
    const FeatureCollection: typeof FeatureCollectionSchemaType;
  }
}

// Re-export the types for convenience
export {
  GeoJSONSchemaType as GeoJSON,
  PointSchemaType as Point,
  MultiPointSchemaType as MultiPoint,
  LineStringSchemaType as LineString,
  MultiLineStringSchemaType as MultiLineString,
  PolygonSchemaType as Polygon,
  MultiPolygonSchemaType as MultiPolygon,
  GeometrySchemaType as Geometry,
  GeometryCollectionSchemaType as GeometryCollection,
  FeatureSchemaType as Feature,
  FeatureCollectionSchemaType as FeatureCollection
};
