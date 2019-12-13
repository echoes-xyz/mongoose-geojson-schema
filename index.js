/**
 * GeoJSON Schemas for Mongoose
 *
 * rough GeoJSON schemas for use with mongoose schema creation
 *
 * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *
 * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 * Copyright RideAmigos (http://rideamigos.com)
 *
 * */

let mongoose = require('mongoose')
let { Schema } = mongoose
var Types = mongoose.Types
var crs = {}

function validateCrs(crs) {
  if (typeof crs !== 'object' && crs !== null) {
    throw new mongoose.Error('Crs must be an object or null')
  }
  if (crs === null) {
    return
  }
  if (!crs.type) {
    throw new mongoose.Error('Crs must have a type')
  }
  if (crs.type !== 'name' && crs.type !== 'link') {
    throw new mongoose.Error('Crs must be either a name or link')
  }
  if (!crs.properties) {
    throw new mongoose.Error('Crs must contain a properties object')
  }
  if (crs.type === 'name' && !crs.properties.name) {
    throw new mongoose.Error('Crs specified by name must have a name property')
  }
  if (
    (crs.type === 'link' && !crs.properties.href) ||
    (crs.type === 'link' && !crs.properties.type)
  ) {
    throw new mongoose.Error(
      'Crs specified by link must have a name and href property'
    )
  }
}

/**
 * @SchemaType GeoJSON
 *
 */

function GeoJSON(key, options) {
  mongoose.SchemaType.call(this, key, options, 'GeoJSON')
}

GeoJSON.schemaName = 'GeoJSON'

GeoJSON.prototype = Object.create(mongoose.SchemaType.prototype)
GeoJSON.prototype.constructor = GeoJSON

GeoJSON.prototype.cast = function(geojson) {
  if (!geojson.type) {
    throw new mongoose.Error('GeoJSON objects must have a type')
  }

  var TypeClass = mongoose.Schema.Types[geojson.type]
  if (!TypeClass) {
    throw new mongoose.Error(geojson.type + ' is not a valid GeoJSON type')
  }

  return TypeClass.prototype.cast.apply(this, arguments)
}

Schema.Types.GeoJSON = GeoJSON
Types.GeoJSON = GeoJSON

/**
 * @SchemaType Point
 *
 */

function Point(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Point')
}

Point.schemaName = 'Point'

function validatePoint(coordinates) {
  // must be an array (object)
  if (typeof coordinates !== 'object') {
    throw new mongoose.Error('Point ' + coordinates + ' must be an array')
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.Error(
      'Point' + coordinates + ' must contain two or three coordinates'
    )
  }
  // must have real numbers
  if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    throw new mongoose.Error('Point must have real numbers')
  }
  // must have two numbers
  if (
    typeof coordinates[0] !== 'number' ||
    typeof coordinates[1] !== 'number'
  ) {
    throw new mongoose.Error('Point must have two numbers')
  }
  if (!crs) {
    // longitude must be within bounds
    if (coordinates[0] > 180 || coordinates[0] < -180) {
      throw new mongoose.Error(
        'Point' +
          coordinates[0] +
          ' should be within the boundaries of longitude'
      )
    }
    // latitude must be within bounds
    if (coordinates[1] > 90 || coordinates[1] < -90) {
      throw new mongoose.Error(
        'Point' +
          coordinates[1] +
          ' should be within the boundaries of latitude'
      )
    }
  }
}

Point.prototype = Object.create(mongoose.SchemaType.prototype)
Point.prototype.constructor = Point

Point.prototype.cast = function(point) {
  if (!point.type) {
    throw new mongoose.Error('Point', point.type, 'point.type')
  }
  // type must be Point
  if (point.type !== 'Point') {
    throw new mongoose.Error(point.type + ' is not a valid GeoJSON type')
  }
  // check for crs
  if (point.crs) {
    crs = point.crs
    validateCrs(crs)
  } else {
    crs = undefined
  }
  validatePoint(point.coordinates)
  return point
}

Schema.Types.Point = Point
Types.Point = Point

/**
 * @SchemaType MultiPoint
 *
 */

function MultiPoint(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiPoint')
}

MultiPoint.schemaName = 'MultiPoint'

function validateMultiPoint(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i])
  }
}

MultiPoint.prototype = Object.create(mongoose.SchemaType.prototype)
MultiPoint.prototype.constructor = MultiPoint

MultiPoint.prototype.cast = function(multipoint) {
  // must be an array (object)
  if (typeof multipoint.coordinates !== 'object') {
    throw new mongoose.Error('MultiPoint must be an array')
  }
  if (!multipoint.type) {
    throw new mongoose.Error('MultiPoint must have a type')
  }
  // type must be MultiPoint
  if (multipoint.type !== 'MultiPoint') {
    throw new mongoose.Error(multipoint.type + ' is not a valid GeoJSON type')
  }
  // check for crs
  if (multipoint.crs) {
    crs = multipoint.crs
    validateCrs(crs)
  }
  validateMultiPoint(multipoint.coordinates)
  return multipoint
}

Schema.Types.MultiPoint = MultiPoint
Types.MultiPoint = MultiPoint

/**
 * @SchemaType LineString
 *
 */

function LineString(key, options) {
  mongoose.SchemaType.call(this, key, options, 'LineString')
}

LineString.schemaName = 'LineString'

function validateLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i])
  }
}

LineString.prototype = Object.create(mongoose.SchemaType.prototype)
LineString.prototype.constructor = LineString

LineString.prototype.cast = function(linestring) {
  if (!linestring.type) {
    throw new mongoose.Error('LineString must have a type')
  }
  // type must be LineString
  if (linestring.type !== 'LineString') {
    throw new mongoose.Error(linestring.type + ' is not a valid GeoJSON type')
  }
  // must have at least two Points
  if (linestring.coordinates.length < 2) {
    throw new mongoose.Error('LineString type must have at least two Points')
  }
  // check for crs
  if (linestring.crs) {
    crs = linestring.crs
    validateCrs(crs)
  }
  validateLineString(linestring.coordinates)
  return linestring
}

Schema.Types.LineString = LineString
Types.LineString = LineString

/**
 * @SchemaType MultiLineString
 *
 */

function MultiLineString(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiLineString')
}

MultiLineString.schemaName = 'MultiLineString'

function validateMultiLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validateLineString(coordinates[i])
  }
}

MultiLineString.prototype = Object.create(mongoose.SchemaType.prototype)
MultiLineString.prototype.constructor = MultiLineString

MultiLineString.prototype.cast = function(multilinestring) {
  // must be an array (object)
  if (typeof multilinestring.coordinates !== 'object') {
    throw new mongoose.Error('MultiLineString must be an array')
  }
  if (!multilinestring.type) {
    throw new mongoose.Error(
      'MultiLineString',
      multilinestring.type + ' must have a type'
    )
  }
  // type must be MultiLineString
  if (multilinestring.type !== 'MultiLineString') {
    throw new mongoose.Error(
      multilinestring.type + ' is not a valid GeoJSON type'
    )
  }
  validateMultiLineString(multilinestring.coordinates)
  return multilinestring
}

Schema.Types.MultiLineString = MultiLineString
Types.MultiLineString = MultiLineString

/**
 * @SchemaType Polygon
 *
 */

function Polygon(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Polygon')
}

Polygon.schemaName = 'Polygon'

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  for (var i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

function validatePolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    // The LinearRing elements must have at least four Points
    if (coordinates[i].length < 4) {
      throw new mongoose.Error(
        'Each Polygon LinearRing must have at least four elements'
      )
    }
    // the LinearRing objects must have identical start and end values
    if (
      !arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length - 1])
    ) {
      throw new mongoose.Error(
        'Each Polygon LinearRing must have an identical first and last point'
      )
    }
    // otherwise the LinearRings must correspond to a LineString
    validateLineString(coordinates[i])
  }
}

Polygon.prototype = Object.create(mongoose.SchemaType.prototype)
Polygon.prototype.constructor = Polygon

Polygon.prototype.cast = function(polygon) {
  if (!polygon.type) {
    throw new mongoose.Error('Polygon', polygon.type + ' must have a type')
  }
  // type must be Polygon
  if (polygon.type !== 'Polygon') {
    throw new mongoose.Error(polygon.type + ' is not a valid GeoJSON type')
  }
  // check for crs
  if (polygon.crs) {
    crs = polygon.crs
    validateCrs(crs)
  }
  validatePolygon(polygon.coordinates)
  return polygon
}

Schema.Types.Polygon = Polygon
Types.Polygon = Polygon

/**
 * @SchemaType MultiPolygon
 *
 */

function MultiPolygon(key, options) {
  mongoose.SchemaType.call(this, key, options, 'MultiPolygon')
}

MultiPolygon.schemaName = 'MultiPolygon'

function validateMultiPolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePolygon(coordinates[i])
  }
}

MultiPolygon.prototype = Object.create(mongoose.SchemaType.prototype)
MultiPolygon.prototype.constructor = MultiPolygon

MultiPolygon.prototype.cast = function(multipolygon) {
  // must be an array (object)
  if (typeof multipolygon.coordinates !== 'object') {
    throw new mongoose.Error('MultiPolygon must be an array')
  }
  if (!multipolygon.type) {
    throw new mongoose.Error('MultiPolygon must have a type')
  }
  // type must be Polygon
  if (multipolygon.type !== 'MultiPolygon') {
    throw new mongoose.Error(multipolygon.type + ' is not a valid GeoJSON type')
  }
  // check for crs
  if (multipolygon.crs) {
    crs = multipolygon.crs
    validateCrs(crs)
  }
  validateMultiPolygon(multipolygon.coordinates)
  return multipolygon
}

Schema.Types.MultiPolygon = MultiPolygon
Types.MultiPolygon = MultiPolygon

/**
 * @SchemaType Geometry
 *
 */

function Geometry(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Geometry')
}

Geometry.schemaName = 'Geometry'

function validateGeometry(geometry) {
  switch (geometry.type) {
    case 'Point':
      validatePoint(geometry.coordinates)
      break
    case 'MultiPoint':
      validateMultiPoint(geometry.coordinates)
      break
    case 'LineString':
      validateLineString(geometry.coordinates)
      break
    case 'MultiLineString':
      validateMultiLineString(geometry.coordinates)
      break
    case 'Polygon':
      validatePolygon(geometry.coordinates)
      break
    case 'MultiPolygon':
      validateMultiPolygon(geometry.coordinates)
      break
    default:
      throw new mongoose.Error('Geometry must have a valid type')
  }
}

Geometry.prototype = Object.create(mongoose.SchemaType.prototype)
Geometry.prototype.constructor = Geometry

Geometry.prototype.cast = function(geometry) {
  // must be an array (object)
  if (!geometry.type) {
    throw new mongoose.Error('Geometry must must have a type')
  }
  // check for crs
  if (geometry.crs) {
    crs = geometry.crs
    validateCrs(crs)
  }
  validateGeometry(geometry)
  return geometry
}

Schema.Types.Geometry = Geometry
Types.Geometry = Geometry

/**
 * @SchemaType GeometryCollection
 *
 */

function GeometryCollection(key, options) {
  mongoose.SchemaType.call(this, key, options, 'GeometryCollection')
}

GeometryCollection.schemaName = 'GeometryCollection'

function validateGeometries(geometries) {
  for (var i = 0; i < geometries.length; i++) {
    validateGeometry(geometries[i])
  }
}

GeometryCollection.prototype = Object.create(mongoose.SchemaType.prototype)
GeometryCollection.prototype.constructor = GeometryCollection

GeometryCollection.prototype.cast = function(geometrycollection) {
  // must be an array (object)
  if (typeof geometrycollection.geometries !== 'object') {
    throw new mongoose.Error('GeometryCollection must be an array')
  }
  // check for crs
  if (geometrycollection.crs) {
    crs = geometrycollection.crs
    validateCrs(crs)
  }
  validateGeometries(geometrycollection.geometries)
  return geometrycollection
}

Schema.Types.GeometryCollection = GeometryCollection
Types.GeometryCollection = GeometryCollection

/**
 * @SchemaType Feature
 *
 */

function Feature(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Feature')
}

Feature.schemaName = 'Feature'

function validateFeature(feature) {
  if (!feature.type) {
    throw new mongoose.Error('Feature must have a type')
  }
  // type must be Feature
  if (feature.type !== 'Feature') {
    throw new mongoose.Error(feature.type + ' is not a valid GeoJSON type')
  }
  if (!feature.geometry) {
    throw new mongoose.Error('Feature must have a geometry')
  }
  // check for crs
  if (feature.crs) {
    crs = feature.crs
    validateCrs(crs)
  }
  validateGeometry(feature.geometry)
}

Feature.prototype = Object.create(mongoose.SchemaType.prototype)
Feature.prototype.constructor = Feature

Feature.prototype.cast = function(feature) {
  validateFeature(feature)
  return feature
}

Schema.Types.Feature = Feature
Types.Feature = Feature

/**
 * @SchemaType FeatureCollection
 *
 */

function FeatureCollection(key, options) {
  mongoose.SchemaType.call(this, key, options, 'FeatureCollection')
}

FeatureCollection.schemaName = 'FeatureCollection'

function validateFeatureCollection(featurecollection) {
  for (var i = 0; i < featurecollection.features.length; i++) {
    validateFeature(featurecollection.features[i])
  }
  return featurecollection
}

FeatureCollection.prototype = Object.create(mongoose.SchemaType.prototype)
FeatureCollection.prototype.constructor = FeatureCollection

FeatureCollection.prototype.cast = function(featurecollection) {
  if (!featurecollection.type) {
    throw new mongoose.Error('FeatureCollection must have a type')
  }
  // type must be Polygon
  if (featurecollection.type !== 'FeatureCollection') {
    throw new mongoose.Error(
      featurecollection.type + ' is not a valid GeoJSON type'
    )
  }
  if (!featurecollection.features) {
    throw new mongoose.Error('FeatureCollections must have a features object')
  }
  // check for crs
  if (featurecollection.crs) {
    crs = featurecollection.crs
    validateCrs(crs)
  }
  validateFeatureCollection(featurecollection)
  return featurecollection
}

Schema.Types.FeatureCollection = FeatureCollection
Types.FeatureCollection = FeatureCollection
