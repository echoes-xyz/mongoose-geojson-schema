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
module.exports = GeoJSON = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function validatePoint(array) {
  if (!array) { return false; }
  // A point should be exactly two items
  if (array.length !== 2) { return false; }
  // longitude should be first - mongo schema
  if (array[0] > 180 || array[0] < -180) { return false; }
  // latitude
  if (array[1] > 85 || array[1] < -85.05115) { return false; }
  return true;
}

function validateMultiPoint(array) {
  if (!array) { return false; }
  for (var i = 0; i < array.length; i++) {
    // A point should be exactly two items
    if (array[i].length !== 2) { return false; }
    // longitude should be first - mongo schema
    if (array[i][0] > 180 || array[0] < -180) { return false; }
    // latitude
    if (array[i][1] > 85 || array[1] < -85.05115) { return false; }
  }
  return true;
}

function validateLineString(array) {
  if (!array) { return false; }
  for (var i = 0; i < array.length; i++) {
    if (typeof array[i] !== 'object') { return false; }
    // A point should be exactly two items
    if (array[i].length !== 2) { return false; }
    // longitude should be first - mongo schema
    if (array[i][0] > 180 || array[0] < -180) { return false; }
    // latitude
    if (array[i][1] > 85 || array[1] < -85.05115) { return false; }
  }
  return true;
}

function validateMultiLineString(array) {
  if (!array) { return false; }
  // longitude should be first - mongo schema
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++) {
      // A point should be exactly two items
      if (array[i][j].length !== 2) { return false; }
      // longitude should be first - mongo schema
      if (array[i][j][0] > 180 || array[0] < -180) { return false; }
      // latitude
      if (array[i][j][1] > 85 || array[1] < -85.05115) { return false; }
    }
  }
  return true;
}

function validatePolygon(array) {
  if (!array) { return false; }
  // A point should be exactly two items
  if (array.length < 2) { return false; }
  for (var i = 0; i < array.length; i++) {
    // The LinearRing elements should have at least four Points
    if (array[i].length < 4) { return false; }
    // the LinearRing objects should have identical start and end values
    if (array[i][0] !== array[i][array.length-1]) { return false; }
    for (var j = 0; j < array[i].length; j++) {
      // A point should be exactly two items
      if (array[i][j].length !== 2) { return false; }
      // longitude should be first - mongo schema
      if (array[i][j][0] > 180 || array[0] < -180) { return false; }
      // latitude
      if (array[i][j][1] > 85 || array[1] < -85.05115) { return false; }
    }
  }
  return true;
}

function validateMultiPolygon(array) {
  if (!array) { return false; }
  for (var i = 0; i < array.length; i++) {
    // A LinearRing should have more than two items
    if (array[i].length < 2) { return false; }
    for (var j = 0; j < array.length; j++) {
      // The LinearRing elements should have at least four Points
      if (array[i][j].length < 4) { return false; }
      // the LinearRing objects should have identical start and end values
      if (array[i][j][0] !== array[i][j][array.length-1]) { return false; }
      for (var k = 0; k < array[i][j].length; k++) {
        // A point should be exactly two items
        if (array[i][j][k].length !== 2) { return false; }
        // longitude should be first - mongo schema
        if (array[i][j][k][0] > 180 || array[0] < -180) { return false; }
        // latitude
        if (array[i][j][k][1] > 85 || array[1] < -85.05115) { return false; }
      }
    }
  }
  return true;
}

function validateGeometry(array) {
  if (!array) { return false; }
  for (var i = 0; i < array.length; i++) {
    if (!array[i].type) { return false; }
    switch (array[i].type) {
      case 'Point':
        if (!validatePoint(array[i].coordinates)) { return false; }
        break;
      case 'MultiPoint':
        if (!validateMultiPoint(array[i].coordinates)) { return false; }
        break;
      case 'LineString':
        if (!validateLineString(array[i].coordinates)) { return false; }
        break;
      case 'MultiLineString':
        if (!validateMultiLineString(array[i].coordinates)) { return false; }
        break;
      case 'Polygon':
        if (!validatePolygon(array[i].coordinates)) { return false; }
        break;
      case 'MultiPolygon':
        if (!validateMultiPolygon(array[i].coordinates)) { return false; }
        break;
      default:
        return false;
    }
  }
  return true;
}

GeoJSON.Point = {
  type: {
    $type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    $type: [Number],
    validate: {
      validator: validatePoint,
      message: "{VALUE} is not a correctly formed GeoJson Point object"
    }
  }
};

GeoJSON.MultiPoint = {
  type: {
    $type: String,
    enum: ["MultiPoint"],
    default: "MultiPoint"
  },
  coordinates: [{
    $type: [Number],
    validate: {
      validator: validateMultiPoint,
      message: "{VALUE} is not a correctly formed GeoJson MultiPoint object"
    }
  }]
};

// @TODO find a way to test nested arrays
GeoJSON.LineString = {
  type: {
    $type: String,
    enum: ["LineString"],
    default: "LineString"
  },
  coordinates: [{
    $type: [Number],
    validate: {
      validator: validateLineString,
      message: "{VALUE} is not a correctly formed GeoJson LineString object"
    }
  }]
};

GeoJSON.MultiLineString = {
  type: {
    $type: String,
    enum: ["MultiLineString"],
    default: "MultiLineString"
  },
  coordinates: [{
    $type: [[Number]],
    validate: {
      validator: validateMultiLineString,
      message: "{VALUE} is not a correctly formed GeoJson MultiLineString object"
    }
  }]
};

// @TODO must test that the first ring is the exterior ring
GeoJSON.Polygon = {
  type: {
    $type: String,
    enum: ["Polygon"],
    default: "Polygon"
  },
  coordinates: [{
    $type: [[Number]],
    validate: {
      validator: validatePolygon,
      message: "{VALUE} is not a correctly formed GeoJson Polygon object"
    }
  }]
};

GeoJSON.MultiPolygon = {
  type: {
    $type: String,
    enum: ["MultiPolygon"],
    default: "MultiPolygon"
  },
  coordinates: [{
    $type: [[[Number]]],
    validate: {
      validator: validateMultiPolygon,
      message: "{VALUE} is not a correctly formed GeoJson MultiPolygon object"
    }
  }]
};

GeoJSON.GeometryCollection = {
  type: {
    $type: String,
    default: "GeometryCollection"
  },
  geometries: {
    $type: [Schema.Types.Mixed],
    validate: {
      validator: validateGeometry
    }
  }
};

GeoJSON.Feature = {
  id        : { type: "String" },
  'type'    : { type: String, default: "Feature" },
  geometry  : GeoJSON.Geometry,
  properties: {type: "Object"}
};

GeoJSON.FeatureCollection = {
  'type'  : { type: String, default: "FeatureCollection" },
  features: [ GeoJSON.Feature ]
};

GeoJSON.requiredAddressFeature = {
  id        : { type: "String" },
  'type'    : { type: String, default: "Feature", required:true },
  geometry  : {
    'type':{type:String,default:"Point",required:true},
    coordinates:{type:"Array",required:true}
  },
  properties: {type: "Object"}
};


GeoJSON.validatePointCoordinates = function(value,message){
  "use strict";
  var msg = message || "Must provide valid coordinates for Point Geometry";
};
