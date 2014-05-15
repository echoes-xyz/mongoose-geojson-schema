/**
 * GeoJSON Schemas for Mongoose
 * 
 * rough GeoJSON schemas for use with mongoose schema creation
 *   
 * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *     
 * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 * Copyright RideAmigos (http://rideamigos.com)
 **/

var GeoJSON;
module.exports = GeoJSON = {}

GeoJSON.Geometry = {
  'type'     : { type: String, enum: ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"] },
  coordinates: []
}

GeoJSON.Point = {
  'type'     : { type: String, default: "Point" },
  coordinates: [
    {type: "Number"}
  ]
}

GeoJSON.MultiPoint = {
  'type'     : { type: String, default: "MultiPoint" },
  coordinates: [
    {type: "Array"}
  ]
}

GeoJSON.MultiLineString = {
  'type'     : { type: String, default: "MultiLineString" },
  coordinates: [
    {type: "Array"}
  ]
}

GeoJSON.Polygon = {
  'type'     : { type: String, default: "Polygon" },
  coordinates: [
    {type: "Array"}
  ]
}

GeoJSON.MultiPolygon = {
  'type'     : { type: String, default: "MultiPolygon" },
  coordinates: [
    {type: "Array"}
  ]
}

GeoJSON.GeometryCollection = {
  'type'    : { type: String, default: "GeometryCollection" },
  geometries: [GeoJSON.Geometry]
}

GeoJSON.Feature = {
  id        : { type: "String" },
  'type'    : { type: String, default: "Feature" },
  geometry  : GeoJSON.Geometry,
  properties: {type: "Object"}
}

GeoJSON.FeatureCollection = {
  'type'  : { type: String, default: "FeatureCollection" },
  features: [ GeoJSON.Feature ]
}

GeoJSON.requiredAddressFeature = {
  id        : { type: "String" },
  'type'    : { type: String, default: "Feature", required:true },
  geometry  : {
    'type':{type:String,default:"Point",required:true},
    coordinates:{type:"Array",required:true}
  },
  properties: {type: "Object"}
}


GeoJSON.validatePointCoordinates = function(value,message){
  "use strict";
  var msg = message || "Must provide valid coordinates for Point Geometry";
}


