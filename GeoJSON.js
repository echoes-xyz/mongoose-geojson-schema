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

var GeoJSON = {};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* @SchemaType Point
*
*/

function Point(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Point');
}

function validatePoint(coordinates) {
  // must be an array (object)
  if (typeof coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('Point', coordinates + ' should be an array');
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.SchemaType.CastError('Point', coordinates + ' should be contain two coordinates');
  }
  // longitude must be within bounds
  if (coordinates[0] > 180 || coordinates[0] < -180) {
    throw new mongoose.SchemaType.CastError('Point', coordinates[0] + ' should be within the boundaries of latitude');
  }
  // latitude must be within bounds
  if (coordinates[1] > 90 || coordinates[1] < -90) {
    throw new mongoose.SchemaType.CastError('Point', coordinates[1] + ' should be within the boundaries of latitude');
  }
}

Point.prototype = Object.create(mongoose.SchemaType.prototype);

Point.prototype.cast = function(point) {
  if (!point.type) {
    throw new mongoose.SchemaType.CastError('Point must have a type');
  }
  // type must be Point
  if (point.type !== 'Point') {
    throw new mongoose.SchemaType.CastError('Point type must be Point');
  }
  validatePoint(point.coordinates);
  return point;
};

mongoose.Schema.Types.Point = Point;

/**
* @SchemaType MultiPoint
*
*/

function MultiPoint(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiPoint');
}

function validateMultiPoint(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

MultiPoint.prototype = Object.create(mongoose.SchemaType.prototype);

MultiPoint.prototype.cast = function(multipoint) {
  // must be an array (object)
  if (typeof multipoint.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('MultiPoint should be an array');
  }
  if (!multipoint.type) {
    throw new mongoose.SchemaType.CastError('MultiPoint must have a type');
  }
  // type must be MultiPoint
  if (multipoint.type !== 'MultiPoint') {
    throw new mongoose.SchemaType.CastError('MultiPoint type must be MultiPoint');
  }
  validateMultiPoint(multipoint.coordinates);
  return multipoint;
};

mongoose.Schema.Types.MultiPoint = MultiPoint;

/**
* @SchemaType LineString
*
*/

function LineString(key, options) {
  mongoose.SchemaType.call(this, key, options, 'LineString');
}

function validateLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

LineString.prototype = Object.create(mongoose.SchemaType.prototype);

LineString.prototype.cast = function(linestring) {
  if (!linestring.type) {
    throw new mongoose.SchemaType.CastError('LineString must have a type');
  }
  // type must be LineString
  if (linestring.type !== 'LineString') {
    throw new mongoose.SchemaType.CastError('LineString type must be LineString');
  }
  // must have at least two Points
  if (linestring.coordinates.length < 2) {
    throw new mongoose.SchemaType.CastError('LineString type must have at least two Points');
  }
  validateLineString(linestring.coordinates);
  return linestring;
};

mongoose.Schema.Types.LineString = LineString;

/**
* @SchemaType MultiLineString
*
*/

function MultiLineString(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiLineString');
}

function validateMultiLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validateLineString(coordinates[i]);
  }
}

MultiLineString.prototype = Object.create(mongoose.SchemaType.prototype);

MultiLineString.prototype.cast = function(multilinestring) {
  // must be an array (object)
  if (typeof multilinestring.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('MultiLineString should be an array');
  }
  if (!multilinestring.type) {
    throw new mongoose.SchemaType.CastError('MultiLineString', multilinestring.type + ' must have a type');
  }
  // type must be MultiLineString
  if (multilinestring.type !== 'MultiLineString') {
    throw new mongoose.SchemaType.CastError('MultiLineString type must be MultiLineString');
  }
  validateMultiLineString(multilinestring.coordinates);
  return multilinestring;
};

mongoose.Schema.Types.MultiLineString = MultiLineString;

/**
* @SchemaType Polygon
*
*/

function Polygon(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Polygon');
}

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
    // The LinearRing elements should have at least four Points
    if (coordinates[i].length < 4) {
      throw new mongoose.SchemaType.CastError('Each Polygon LinearRing should have at least four elements');
    }
    // the LinearRing objects should have identical start and end values
    if (!arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length-1])) {
      throw new mongoose.SchemaType.CastError('Each Polygon LinearRing should have an identical first and last point');
    }
    // otherwise the LinearRings should correspond to a LineString
    validateLineString(coordinates[i]);
  }
}

Polygon.prototype = Object.create(mongoose.SchemaType.prototype);

Polygon.prototype.cast = function(polygon) {
  if (!polygon.type) {
    throw new mongoose.SchemaType.CastError('Polygon', polygon.type + ' must have a type');
  }
  // type must be Polygon
  if (polygon.type !== 'Polygon') {
    throw new mongoose.SchemaType.CastError('Polygon type must be Polygon');
  }
  validatePolygon(polygon.coordinates);
  return polygon;
};

mongoose.Schema.Types.Polygon = Polygon;

/**
* @SchemaType MultiPolygon
*
*/

function MultiPolygon(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiPolygon');
}

function validateMultiPolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePolygon(coordinates[i]);
  }
}

MultiPolygon.prototype = Object.create(mongoose.SchemaType.prototype);

MultiPolygon.prototype.cast = function(multipolygon) {
  // must be an array (object)
  if (typeof multipolygon.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('MultiPolygon should be an array');
  }
  if (!multipolygon.type) {
    throw new mongoose.SchemaType.CastError('MultiPolygon must have a type');
  }
  // type must be Polygon
  if (multipolygon.type !== 'MultiPolygon') {
    throw new mongoose.SchemaType.CastError('MultiPolygon type must be MultiPolygon');
  }
  validateMultiPolygon(multipolygon.coordinates);
  return multipolygon;
};

mongoose.Schema.Types.MultiPolygon = MultiPolygon;

/**
* @SchemaType GeometryCollection
*
*/

function GeometryCollection(key, options) {
  mongoose.SchemaType.call(this, key, options, 'GeometryCollection');
}

function validateGeometries(geometries) {
  for (var i = 0; i < geometries.length; i++) {
    validateGeometry(geometries[i]);
  }
}

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
    throw new mongoose.SchemaType.CastError('Geometry must have a valid type');
  }
}

GeometryCollection.prototype = Object.create(mongoose.SchemaType.prototype);

GeometryCollection.prototype.cast = function(geometrycollection) {
  // must be an array (object)
  if (typeof geometrycollection.geometries !== 'object') {
    throw new mongoose.SchemaType.CastError('GeometryCollection should be an array');
  }
  validateGeometries(geometrycollection.geometries);
  return geometrycollection;
};

mongoose.Schema.Types.GeometryCollection = GeometryCollection;

/**
* @SchemaType Feature
*
*/

function Feature(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Feature');
}

function validateFeature(feature) {
  if (!feature.type) {
    throw new mongoose.SchemaType.CastError('Feature must have a type');
  }
  // type must be Feature
  if (feature.type !== 'Feature') {
    throw new mongoose.SchemaType.CastError('Feature type must be Feature');
  }
  if (!feature.geometry) {
    throw new mongoose.SchemaType.CastError('Feature must have a geometry');
  }
  validateGeometry(feature.geometry);
}

Feature.prototype = Object.create(mongoose.SchemaType.prototype);

Feature.prototype.cast = function(feature) {
  validateFeature(feature);
  return feature;
};

mongoose.Schema.Types.Feature = Feature;

/**
* @SchemaType FeatureCollection
*
*/

function FeatureCollection(key, options) {
  mongoose.SchemaType.call(this, key, options, 'FeatureCollection');
}

function validateFeatureCollection(featurecollection) {
  for (var i = 0; i < featurecollection.features.length; i++) {
    validateFeature(featurecollection.features[i]);
  }
  return featurecollection;
}

FeatureCollection.prototype = Object.create(mongoose.SchemaType.prototype);

FeatureCollection.prototype.cast = function(featurecollection) {
  if (!featurecollection.type) {
    throw new mongoose.SchemaType.CastError('FeatureCollection must have a type');
  }
  // type must be Polygon
  if (featurecollection.type !== 'FeatureCollection') {
    throw new mongoose.SchemaType.CastError('FeatureCollection type must be FeatureCollection');
  }
  if (!featurecollection.features) {
    throw new mongoose.SchemaType.CastError('FeatureCollections must have a features object');
  }
  validateFeatureCollection(featurecollection);
  return featurecollection;
};

mongoose.Schema.Types.FeatureCollection = FeatureCollection;
