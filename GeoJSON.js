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

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crs = {};

function validateCrs(crs) {
  if (typeof crs !== 'object' && crs !== null) {
    throw new mongoose.Error('Crs must be an object or null');
  }
  if (crs === null) {
    return;
  }
  if (!crs.type) {
    throw new mongoose.Error('Crs must have a type');
  }
  if (crs.type !== 'name' && crs.type !== 'link') {
    throw new mongoose.Error('Crs must be either a name or link');
  }
  if (!crs.properties) {
    throw new mongoose.Error('Crs must contain a properties object');
  }
  if (crs.type === 'name' && !crs.properties.name) {
    throw new mongoose.Error('Crs specified by name must have a name property');
  }
  if (crs.type === 'link' && !crs.properties.href || crs.type === 'link' && !crs.properties.type) {
    throw new mongoose.Error('Crs specified by link must have a name and href property');
  }
}

/**
* @SchemaType GeoJSON
*
*/

function GeoJSON(key, options) {
  mongoose.SchemaType.call(this, key, options, 'GeoJSON');
}

GeoJSON.prototype = Object.create(mongoose.SchemaType.prototype);

GeoJSON.prototype.cast = function(geojson) {
  if (!geojson.type) {
    throw new mongoose.Error('GeoJSON objects must have a type');
  }
  switch (geojson.type) {
    case 'Point':
      validatePointObject(geojson);
      break;
    case 'MultiPoint':
      validateMultiPointObject(geojson);
      break;
    case 'LineString':
      validateLineStringObject(geojson);
      break;
    case 'MultiLineString':
      validateMultiLineStringObject(geojson);
      break;
    case 'Polygon':
      validatePolygonObject(geojson);
      break;
    case 'MultiPolygon':
      validateMultiPolygonObject(geojson);
      break;
    case 'Geometry':
      validateGeometryObject(geojson);
      break;
    case 'GeometryCollection':
      validateGeometryCollectionObject(geojson);
      break;
    case 'Feature':
      validateFeatureObject(geojson);
      break;
    case 'FeatureCollection':
      validateFeatureCollectionObject(geojson);
      break;
    default:
      throw new mongoose.Error(geojson.type + ' is not a valid GeoJSON type');

  }
  return geojson;
};

Schema.Types.GeoJSON = GeoJSON;

/**
* @SchemaType Point
*
*/

function validatePoint(coordinates) {
  // must be an array (object)
  if (typeof coordinates !== 'object') {
    throw new mongoose.Error('Point ' + coordinates + ' must be an array');
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.Error('Point' + coordinates + ' must contain two or three coordinates');
  }
  // longitude must be within bounds
  if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    throw new mongoose.Error('Point must have two numbers');
  }
  if (!crs) {
    // longitude must be within bounds
    if (coordinates[0] > 180 || coordinates[0] < -180) {
      throw new mongoose.Error('Point' + coordinates[0] + ' should be within the boundaries of latitude');
    }
    // latitude must be within bounds
    if (coordinates[1] > 90 || coordinates[1] < -90) {
      throw new mongoose.Error('Point' + coordinates[1] + ' should be within the boundaries of latitude');
    }
  }
}

function validatePointObject(point) {
  if (!point.type) {
    throw new mongoose.Error('Point', point.type, 'point.type');
  }
  // check for crs
  if (point.crs) {
    crs = point.crs;
    validateCrs(crs);
  } else {
    crs = undefined;
  }
  validatePoint(point.coordinates);
  return point;
}

/**
* @SchemaType MultiPoint
*
*/

function validateMultiPoint(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

function validateMultiPointObject(multipoint) {
  // must be an array (object)
  if (typeof multipoint.coordinates !== 'object') {
    throw new mongoose.Error('MultiPoint must be an array');
  }
  // check for crs
  if (multipoint.crs) {
    crs = multipoint.crs;
    validateCrs(crs);
  }
  validateMultiPoint(multipoint.coordinates);
  return multipoint;
}

/**
* @SchemaType LineString
*
*/

function validateLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

function validateLineStringObject(linestring) {
  // must have at least two Points
  if (linestring.coordinates.length < 2) {
    throw new mongoose.Error('LineString type must have at least two Points');
  }
  // check for crs
  if (linestring.crs) {
    crs = linestring.crs;
    validateCrs(crs);
  }
  validateLineString(linestring.coordinates);
  return linestring;
}

/**
* @SchemaType MultiLineString
*
*/

function validateMultiLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validateLineString(coordinates[i]);
  }
}

function validateMultiLineStringObject(multilinestring) {
  // must be an array (object)
  if (typeof multilinestring.coordinates !== 'object') {
    throw new mongoose.Error('MultiLineString must be an array');
  }
  validateMultiLineString(multilinestring.coordinates);
  return multilinestring;
}

/**
* @SchemaType Polygon
*
*/

function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length) return false;
  for(var i = arr1.length; i--;) {
    if(arr1[i] !== arr2[i])
    return false;
  }
  return true;
}

function validatePolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    // The LinearRing elements must have at least four Points
    if (coordinates[i].length < 4) {
      throw new mongoose.Error('Each Polygon LinearRing must have at least four elements');
    }
    // the LinearRing objects must have identical start and end values
    if (!arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length-1])) {
      throw new mongoose.Error('Each Polygon LinearRing must have an identical first and last point');
    }
    // otherwise the LinearRings must correspond to a LineString
    validateLineString(coordinates[i]);
  }
}

function validatePolygonObject(polygon) {
  // check for crs
  if (polygon.crs) {
    crs = polygon.crs;
    validateCrs(crs);
  }
  validatePolygon(polygon.coordinates);
  return polygon;
}

/**
* @SchemaType MultiPolygon
*
*/

function validateMultiPolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePolygon(coordinates[i]);
  }
}

function validateMultiPolygonObject(multipolygon) {
  // must be an array (object)
  if (typeof multipolygon.coordinates !== 'object') {
    throw new mongoose.Error('MultiPolygon must be an array');
  }
  // check for crs
  if (multipolygon.crs) {
    crs = multipolygon.crs;
    validateCrs(crs);
  }
  validateMultiPolygon(multipolygon.coordinates);
  return multipolygon;
}

/**
* @SchemaType Geometry
*
*/

function validateGeometry(geometry) {
  switch (geometry.type) {
    case 'Point':
    validatePoint(geometry.coordinates);
    break;
    case 'MultiPoint':
    validateMultiPoint(geometry.coordinates);
    break;
    case 'LineString':
    validateLineString(geometry.coordinates);
    break;
    case 'MultiLineString':
    validateMultiLineString(geometry.coordinates);
    break;
    case 'Polygon':
    validatePolygon(geometry.coordinates);
    break;
    case 'MultiPolygon':
    validateMultiPolygon(geometry.coordinates);
    break;
    default:
    throw new mongoose.Error('Geometry must have a valid type');
  }
}

function validateGeometryObject(geometry) {
  // console.log(geometry);
  // must be an array (object)
  if (!geometry.type) {
    throw new mongoose.Error('Geometry must must have a type');
  }
  // check for crs
  if (geometry.crs) {
    crs = geometry.crs;
    validateCrs(crs);
  }
  validateGeometry(geometry);
  return geometry;
}

/**
* @SchemaType GeometryCollection
*
*/

function validateGeometries(geometries) {
  for (var i = 0; i < geometries.length; i++) {
    validateGeometry(geometries[i]);
  }
}

function validateGeometryCollectionObject(geometrycollection) {
  // must be an array (object)
  if (typeof geometrycollection.geometries !== 'object') {
    throw new mongoose.Error('GeometryCollection must be an array');
  }
  // check for crs
  if (geometrycollection.crs) {
    crs = geometrycollection.crs;
    validateCrs(crs);
  }
  validateGeometries(geometrycollection.geometries);
  return geometrycollection;
}

/**
* @SchemaType Feature
*
*/

function validateFeature(feature) {
  if (!feature.geometry) {
    throw new mongoose.Error('Feature must have a geometry');
  }
  // check for crs
  if (feature.crs) {
    crs = feature.crs;
    validateCrs(crs);
  }
  validateGeometry(feature.geometry);
}

function validateFeatureObject(feature) {
  validateFeature(feature);
  return feature;
}

/**
* @SchemaType FeatureCollection
*
*/

function validateFeatureCollection(featurecollection) {
  for (var i = 0; i < featurecollection.features.length; i++) {
    validateFeature(featurecollection.features[i]);
  }
  return featurecollection;
}

function validateFeatureCollectionObject(featurecollection) {
  if (!featurecollection.features) {
    throw new mongoose.Error('FeatureCollections must have a features object');
  }
  // check for crs
  if (featurecollection.crs) {
    crs = featurecollection.crs;
    validateCrs(crs);
  }
  validateFeatureCollection(featurecollection);
  return featurecollection;
}
