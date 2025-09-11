/**
 * GeoJSON Schemas for Mongoose
 *
 * rough GeoJSON schemas for use with mongoose schema creation
 *
 * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *
 * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 * Copyright RideAmigos (http://rideamigos.com)
 * Updates and maintenance by Josh Kopecek (josh@echoes.xyz)
 *
 * */
import mongoose from 'mongoose';
import { GeoJSON as GeoJSONType, Point as PointType, MultiPoint as MultiPointType, LineString as LineStringType, MultiLineString as MultiLineStringType, Polygon as PolygonType, MultiPolygon as MultiPolygonType, Geometry as GeometryType, GeometryCollection as GeometryCollectionType, Feature as FeatureType, FeatureCollection as FeatureCollectionType } from 'geojson';
declare class GeoJSON extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(geojson: any): GeoJSONType;
}
declare class Point extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(point: any): PointType;
}
declare class MultiPoint extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(multipoint: any): MultiPointType;
}
declare class LineString extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(linestring: any): LineStringType;
}
declare class MultiLineString extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(multilinestring: any): MultiLineStringType;
}
declare class Polygon extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(polygon: any): PolygonType;
}
declare class MultiPolygon extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(multipolygon: any): MultiPolygonType;
}
declare class Geometry extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(geometry: any): GeometryType;
}
declare class GeometryCollection extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(geometrycollection: any): GeometryCollectionType;
}
declare class Feature extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(feature: any): FeatureType;
}
declare class FeatureCollection extends mongoose.SchemaType {
    static schemaName: string;
    constructor(key: string, options?: any);
    cast(featurecollection: any): FeatureCollectionType;
}
export { GeoJSON, Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, Geometry, GeometryCollection, Feature, FeatureCollection };
//# sourceMappingURL=index.d.ts.map