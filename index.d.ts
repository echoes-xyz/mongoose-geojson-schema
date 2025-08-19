import * as mongoose from 'mongoose';

// GeoJSON Coordinate Reference System types
export interface CrsName {
  type: 'name';
  properties: {
    name: string;
  };
}

export interface CrsLink {
  type: 'link';
  properties: {
    href: string;
    type: string;
  };
}

export type Crs = CrsName | CrsLink;

// GeoJSON coordinate types
export type Position = [number, number] | [number, number, number]; // [longitude, latitude, altitude?]

// GeoJSON Geometry Objects
export interface Point {
  type: 'Point';
  coordinates: Position;
  crs?: Crs;
}

export interface MultiPoint {
  type: 'MultiPoint';
  coordinates: Position[];
  crs?: Crs;
}

export interface LineString {
  type: 'LineString';
  coordinates: Position[];
  crs?: Crs;
}

export interface MultiLineString {
  type: 'MultiLineString';
  coordinates: Position[][];
  crs?: Crs;
}

export interface Polygon {
  type: 'Polygon';
  coordinates: Position[][];
  crs?: Crs;
}

export interface MultiPolygon {
  type: 'MultiPolygon';
  coordinates: Position[][][];
  crs?: Crs;
}

export type GeometryObject = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;

export interface Geometry {
  type: 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';
  coordinates: Position | Position[] | Position[][] | Position[][][];
  crs?: Crs;
}

export interface GeometryCollection {
  type: 'GeometryCollection';
  geometries: GeometryObject[];
  crs?: Crs;
}

// GeoJSON Feature Objects
export interface Feature<G extends GeometryObject = GeometryObject, P = any> {
  type: 'Feature';
  geometry: G;
  properties?: P;
  id?: string | number;
  crs?: Crs;
}

export interface FeatureCollection<G extends GeometryObject = GeometryObject, P = any> {
  type: 'FeatureCollection';
  features: Feature<G, P>[];
  crs?: Crs;
}

// GeoJSON type that can be any valid GeoJSON object
export type GeoJSON = GeometryObject | GeometryCollection | Feature | FeatureCollection;

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
