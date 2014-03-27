/**
 *  * GeoJSON Schemas for Mongoose
 *   *
 *    * rough GeoJSON schemas for use with mongoose schema creation
 *     *
 *      * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *       *
 *        * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 *         * Copyright RideAmigos (http://rideamigos.com)
 *          */

var GeoJSON;
module.exports = GeoJSON = {}

GeoJSON.Geometry = {
    'type': { type: String, required: true, enum:["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"] },
      coordinates:[{type:"Mixed"}]
}

GeoJSON.Point = {
    'type': { type: String, required: true, default:"Point" },
      coordinates:[{type:"Number"}]
}

GeoJSON.MultiPoint = {
    'type': { type: String, required: true, default:"MultiPoint" },
      coordinates:[{type:"Array"}]
}

GeoJSON.MultiLineString = {
    'type': { type: String, required: true, default:"MultiLineString" },
      coordinates:[{type:"Array"}]
}

GeoJSON.Polygon = {
    'type': { type: String, required: true, default:"Polygon" },
      coordinates:[{type:"Array"}]
}

GeoJSON.MultiPolygon = {
    'type': { type: String, required: true, default:"MultiPolygon" },
      coordinates:[{type:"Array"}]
}

GeoJSON.GeometryCollection = {
    'type': { type: String, required: true, default:"GeometryCollection" },
      geometries:[GeoJSON.Geometry]
}

GeoJSON.Feature = {
    id:{type:"String"},
      'type': { type: String, required: true, default:"Feature" },
        geometry:GeoJSON.Geometry,
          properties:{type:"Object"}
}

GeoJSON.FeatureCollection = {
    'type': { type: String, required: true, default:"FeatureCollection" },
      features: [ GeoJSON.Feature ]
}


