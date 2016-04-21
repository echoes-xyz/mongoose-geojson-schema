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
    throw new mongoose.SchemaType.CastError('GeoJSON.Point', coordinates + ' should be an array');
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.SchemaType.CastError('GeoJSON.Point', coordinates + ' should be contain two coordinates');
  }
  // longitude must be within bounds
  if (coordinates[0] > 180 || coordinates[0] < -180) {
    throw new mongoose.SchemaType.CastError('GeoJSON.Point', coordinates[0] + ' should be within the boundaries of latitude');
  }
  // latitude must be within bounds
  if (coordinates[1] > 90 || coordinates[1] < -90) {
    throw new mongoose.SchemaType.CastError('GeoJSON.Point', coordinates[1] + ' should be within the boundaries of latitude');
  }
}

Point.prototype = Object.create(mongoose.SchemaType.prototype);

Point.prototype.cast = function(point) {
  if (!point.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.Point should have a type');
  }
  // type must be Point
  if (point.type !== 'Point') {
    throw new mongoose.SchemaType.CastError('GeoJSON.Point type must be Point');
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

function validateMultiPoint(multipoint) {
  if (multipoint.coordinates.length < 2) {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPoint must have at least 2 points');
  }
  for (var i = 0; i < multipoint.coordinates.length; i++) {
    validatePoint(multipoint.coordinates[i]);
  }
}

MultiPoint.prototype = Object.create(mongoose.SchemaType.prototype);

MultiPoint.prototype.cast = function(multipoint) {
  // must be an array (object)
  if (typeof multipoint.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPoint should be an array');
  }
  if (!multipoint.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPoint should have a type');
  }
  // type must be MultiPoint
  if (multipoint.type !== 'MultiPoint') {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPoint type must be MultiPoint');
  }
  validateMultiPoint(multipoint);
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

function validateLineString(linestring) {
  for (var i = 0; i < linestring.length; i++) {
    validatePoint(linestring[i]);
  }
  return linestring;
}

LineString.prototype = Object.create(mongoose.SchemaType.prototype);

LineString.prototype.cast = function(point) {
  if (!linestring.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.LineString should have a type');
  }
  // type must be LineString
  if (linestring.type !== 'LineString') {
    throw new mongoose.SchemaType.CastError('GeoJSON.LineString type must be LineString');
  }
  // must have at least two Points
  if (linestring.length < 2) {
    throw new mongoose.SchemaType.CastError('GeoJSON.LineString type must have at least two Points');
  }
  validateLineString(point);
  return point;
};

mongoose.Schema.Types.LineString = LineString;

/**
 * @SchemaType MultiLineString
 *
 */

function MultiLineString(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiLineString');
}

function validateMultiLineString(multilinestring) {
  for (var i = 0; i < multilinestring.length; i++) {
    validateLineString(multilinestring[i]);
  }
  return multilinestring;
}

MultiLineString.prototype = Object.create(mongoose.SchemaType.prototype);

MultiLineString.prototype.cast = function(multilinestring) {
  // must be an array (object)
  if (typeof multilinestring.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiLineString should be an array');
  }
  if (!multilinestring.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiLineString', multilinestring.type + ' should have a type');
  }
  // type must be MultiLineString
  if (multilinestring.type !== 'MultiLineString') {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiLineString type must be MultiLineString');
  }
  validateMultiLineString(multilinestring);
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

function validatePolygon(polygon) {
  for (var i = 0; i < polygon.length; i++) {
    // The LinearRing elements should have at least four Points
    if (polygon[i].length < 4) {
      throw new mongoose.SchemaType.CastError('Each GeoJSON.Polygon LinearRing should have at least four elements');
    }
    // the LinearRing objects should have identical start and end values
    if (polygon[i][0] !== polygon[i][polygon.length-1]) {
      throw new mongoose.SchemaType.CastError('Each GeoJSON.Polygon LinearRing should have an identical first and last point');
    }
    for (var j = 0; j < polygon[i].length; j++) {
      // otherwise the LinearRings should correspond to a LineString
      validateLineString(polygon[i][j]);
    }
  }
  return polygon;
}

Polygon.prototype = Object.create(mongoose.SchemaType.prototype);

Polygon.prototype.cast = function(polygon) {
  if (!polygon.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.Polygon', polygon.type + ' should have a type');
  }
  // type must be Polygon
  if (polygon.type !== 'Polygon') {
    throw new mongoose.SchemaType.CastError('GeoJSON.Polygon type must be Polygon');
  }
  validatePolygon(polygon);
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

function validateMultiPolygon(multipolygon) {
  for (var i = 0; i < multipolygon.length; i++) {
    validatePolygon(multipolygon[i]);
  }
  return multipolygon;
}

MultiPolygon.prototype = Object.create(mongoose.SchemaType.prototype);

MultiPolygon.prototype.cast = function(polygon) {
  // must be an array (object)
  if (typeof multipolygon.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPolygon should be an array');
  }
  if (!multipolygon.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPolygon should have a type');
  }
  // type must be Polygon
  if (multipolygon.type !== 'MultiPolygon') {
    throw new mongoose.SchemaType.CastError('GeoJSON.MultiPolygon type must be MultiPolygon');
  }
  validateMultiPolygon(polygon);
  return polygon;
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
  for (var i = 0; i < geometry.length; i++) {
    switch (geometry[i].type) {
      case 'Point':
        validatePoint(geometry[i]);
        break;
      case 'MultiPoint':
        validateMultiPoint(geometry[i]);
        break;
      case 'LineString':
        validateLineString(geometry[i]);
        break;
      case 'MultiLineString':
        validateMultiLineString(geometry[i]);
        break;
      case 'Polygon':
        validatePolygon(geometry[i]);
        break;
      case 'MultiPolygon':
        validateMultiPolygon(geometry[i]);
        break;
      default:
        return false;
    }
  }
  return true;
}

Geometry.prototype = Object.create(mongoose.SchemaType.prototype);

Geometry.prototype.cast = function(geometry) {
  // must be an array (object)
  if (typeof geometry.coordinates !== 'object') {
    throw new mongoose.SchemaType.CastError('GeoJSON.Geometry should be an array');
  }
  if (!geometry.type) {
    throw new mongoose.SchemaType.CastError('GeoJSON.Geometry should have a type');
  }
  // type must be Polygon
  if (geometry.type !== 'Geometry') {
    throw new mongoose.SchemaType.CastError('GeoJSON.Geometry type must be Geometry');
  }
  validateGeometry(geometry);
  return geometry;
};

mongoose.Schema.Types.Geometry = Geometry;

/**
 * @SchemaType Feature
 *
 */

function Feature(key, options) {
   mongoose.SchemaType.call(this, key, options, 'Feature');
}

 function validateFeature(feature) {
   for (var i = 0; i < feature.length; i++) {
     if (!feature[i].geometry) {
       throw new mongoose.SchemaType.CastError('GeoJSON.Features must contain a geometry object');
     }
     validateGeometry(feature[i].geometry);
   }
   return feature;
 }

 Feature.prototype = Object.create(mongoose.SchemaType.prototype);

 Feature.prototype.cast = function(feature) {
   if (!feature.type) {
     throw new mongoose.SchemaType.CastError('GeoJSON.Feature should have a type');
   }
   // type must be Polygon
   if (feature.type !== 'Feature') {
     throw new mongoose.SchemaType.CastError('GeoJSON.Feature type must be Feature');
   }
   validateFeature(feature);
   return feature;
 };

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
     throw new mongoose.SchemaType.CastError('GeoJSON.FeatureCollection should have a type');
   }
   // type must be Polygon
   if (featurecollection.type !== 'FeatureCollection') {
     throw new mongoose.SchemaType.CastError('GeoJSON.FeatureCollection type must be FeatureCollection');
   }
   if (!featurecollection.features) {
     throw new mongoose.SchemaType.CastError('GeoJSON.FeatureCollections must have a features object');
   }
   validateFeatureCollection(featurecollection);
   return featurecollection;
 };
