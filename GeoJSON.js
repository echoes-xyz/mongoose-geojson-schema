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
var crs = {};

function validateCrs(crs) {
  if (typeof crs !== 'object' && crs !== null) {
    throw new mongoose.SchemaType.CastError('Crs must be an object or null');
  }
  if (crs === null) {
    return;
  }
  if (!crs.type) {
    throw new mongoose.SchemaType.CastError('Crs must have a type');
  }
  if (crs.type !== 'name' && crs.type !== 'link') {
    throw new mongoose.SchemaType.CastError('Crs must be either a name or link');
  }
  if (!crs.properties) {
    throw new mongoose.SchemaType.CastError('Crs must contain a properties object');
  }
  if (crs.type === 'name' && !crs.properties.name) {
    throw new mongoose.SchemaType.CastError('Crs specified by name must have a name property');
  }
  if (crs.type === 'link' && !crs.properties.href || crs.type === 'link' && !crs.properties.type) {
    throw new mongoose.SchemaType.CastError('Crs specified by link must have a name and href property');
  }
}

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
    throw new mongoose.SchemaType.CastError('Point' + coordinates + ' must be an array');
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.SchemaType.CastError('Point' + coordinates + ' must contain two coordinates');
  }
  // longitude must be within bounds
  if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    throw new mongoose.SchemaType.CastError('Point must have two numbers');
  }
  if (!crs) {
    // longitude must be within bounds
    if (coordinates[0] > 180 || coordinates[0] < -180) {
      throw new mongoose.SchemaType.CastError('Point', coordinates[0] + ' should be within the boundaries of latitude');
    }
    // latitude must be within bounds
    if (coordinates[1] > 90 || coordinates[1] < -90) {
      throw new mongoose.SchemaType.CastError('Point', coordinates[1] + ' should be within the boundaries of latitude');
    }
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
  // check for crs
  if (point.crs) {
    crs = point.crs;
    validateCrs(crs);
  } else crs = undefined;
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
    throw new mongoose.SchemaType.CastError('MultiPoint must be an array');
  }
  if (!multipoint.type) {
    throw new mongoose.SchemaType.CastError('MultiPoint must have a type');
  }
  // type must be MultiPoint
  if (multipoint.type !== 'MultiPoint') {
    throw new mongoose.SchemaType.CastError('MultiPoint type must be MultiPoint');
  }
  // check for crs
  if (multipoint.crs) {
    crs = multipoint.crs;
    validateCrs(crs);
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
  // check for crs
  if (linestring.crs) {
    crs = linestring.crs;
    validateCrs(crs);
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
    throw new mongoose.SchemaType.CastError('MultiLineString must be an array');
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
    // The LinearRing elements must have at least four Points
    if (coordinates[i].length < 4) {
      throw new mongoose.SchemaType.CastError('Each Polygon LinearRing must have at least four elements');
    }
    // the LinearRing objects must have identical start and end values
    if (!arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length-1])) {
      throw new mongoose.SchemaType.CastError('Each Polygon LinearRing must have an identical first and last point');
    }
    // otherwise the LinearRings must correspond to a LineString
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
  // check for crs
  if (polygon.crs) {
    crs = polygon.crs;
    validateCrs(crs);
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
    throw new mongoose.SchemaType.CastError('MultiPolygon must be an array');
  }
  if (!multipolygon.type) {
    throw new mongoose.SchemaType.CastError('MultiPolygon must have a type');
  }
  // type must be Polygon
  if (multipolygon.type !== 'MultiPolygon') {
    throw new mongoose.SchemaType.CastError('MultiPolygon type must be MultiPolygon');
  }
  // check for crs
  if (multipolygon.crs) {
    crs = multipolygon.crs;
    validateCrs(crs);
  }
  validateMultiPolygon(multipolygon.coordinates);
  return multipolygon;
};

mongoose.Schema.Types.MultiPolygon = MultiPolygon;

/**
* @SchemaType Geometry
*
*/

function Geometry(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Geometry');
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

Geometry.prototype = Object.create(mongoose.SchemaType.prototype);

Geometry.prototype.cast = function(geometry) {
  // console.log(geometry);
  // must be an array (object)
  if (!geometry.type) {
    throw new mongoose.SchemaType.CastError('Geometry must must have a type');
  }
  // check for crs
  if (geometry.crs) {
    crs = geometry.crs;
    validateCrs(crs);
  }
  validateGeometry(geometry);
  return geometry;
};

mongoose.Schema.Types.Geometry = Geometry;

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

GeometryCollection.prototype = Object.create(mongoose.SchemaType.prototype);

GeometryCollection.prototype.cast = function(geometrycollection) {
  // must be an array (object)
  if (typeof geometrycollection.geometries !== 'object') {
    throw new mongoose.SchemaType.CastError('GeometryCollection must be an array');
  }
  // check for crs
  if (geometrycollection.crs) {
    crs = geometrycollection.crs;
    validateCrs(crs);
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
  // check for crs
  if (feature.crs) {
    crs = feature.crs;
    validateCrs(crs);
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
  // check for crs
  if (featurecollection.crs) {
    crs = featurecollection.crs;
    validateCrs(crs);
  }
  validateFeatureCollection(featurecollection);
  return featurecollection;
};

mongoose.Schema.Types.FeatureCollection = FeatureCollection;
