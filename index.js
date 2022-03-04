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

class GeoJSON extends mongoose.SchemaType {
  static schemaName = 'GeoJSON'

  constructor (key, options) {
    super(key, options, 'GeoJSON')
  }
  cast (geojson) {
    if (!geojson.type) {
      throw new mongoose.Error('GeoJSON objects must have a type')
    }

    var TypeClass = mongoose.Schema.Types[geojson.type]
    if (!TypeClass) {
      throw new mongoose.Error(geojson.type + ' is not a valid GeoJSON type')
    }

    return TypeClass.prototype.cast.apply(this, arguments)
  }
}

class Point extends mongoose.SchemaType {
  static schemaName = 'Point'

  constructor (key, options) {
    super(key, options, 'Point')
  }

  cast (point) {
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
}

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

class MultiPoint extends mongoose.SchemaType {
  static schemaName = 'MultiPoint'

  constructor (key, options) {
    super(key, options, 'MultiPoint')
  }

  cast (multipoint) {
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
}

function validateMultiPoint(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i])
  }
}

class LineString extends mongoose.SchemaType {
  static schemaName = 'LineString'

  constructor (key, options) {
    super(key, options, 'LineString')
  }

  cast (linestring) {
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
}

function validateLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i])
  }
}

class MultiLineString extends mongoose.SchemaType {
  static schemaName = 'MultiLineString'

  constructor (key, options) {
    super(key, options, 'MultiLineString')
  }

  cast (multilinestring) {
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
}

function validateMultiLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validateLineString(coordinates[i])
  }
}

class Polygon extends mongoose.SchemaType {
  static schemaName = 'Polygon'

  constructor (key, options) {
    super(key, options, 'Polygon')
  }

  cast (polygon) {
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
}

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

class MultiPolygon extends mongoose.SchemaType {
  static schemaName = 'MultiPolygon'

  constructor (key, options) {
    super(key, options, 'MultiPolygon')
  }

  cast (multipolygon) {
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
}

function validateMultiPolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePolygon(coordinates[i])
  }
}

class Geometry extends mongoose.SchemaType {
  static schemaName = 'Geometry'

  constructor (key, options) {
    super(key, options, 'Geometry')
  }

  cast (geometry) {
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
}

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

class GeometryCollection extends mongoose.SchemaType {
  static schemaName = 'GeometryCollection'

  constructor (key, options) {
    super(key, options, 'GeometryCollection')
  }

  cast (geometrycollection) {
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
}

function validateGeometries(geometries) {
  for (var i = 0; i < geometries.length; i++) {
    validateGeometry(geometries[i])
  }
}

class Feature extends mongoose.SchemaType {
  static schemaName = 'Feature'

  constructor (key, options) {
    super(key, options, 'Feature')
  }

  cast (feature) {
    validateFeature(feature)
    return feature
  }
}

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

class FeatureCollection extends mongoose.SchemaType {
  static schemaName = 'FeatureCollection'

  constructor (key, options) {
    super(key, options, 'FeatureCollection')
  }

  cast (featurecollection) {
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
}

function validateFeatureCollection(featurecollection) {
  for (var i = 0; i < featurecollection.features.length; i++) {
    validateFeature(featurecollection.features[i])
  }
  return featurecollection
}

Schema.Types.Feature = Feature
Schema.Types.FeatureCollection = FeatureCollection
Schema.Types.GeoJSON = GeoJSON
Schema.Types.Geometry = Geometry
Schema.Types.GeometryCollection = GeometryCollection
Schema.Types.LineString = LineString
Schema.Types.MultiLineString = MultiLineString
Schema.Types.MultiPoint = MultiPoint
Schema.Types.MultiPolygon = MultiPolygon
Schema.Types.Point = Point
Schema.Types.Polygon = Polygon

Types.Feature = Feature
Types.FeatureCollection = FeatureCollection
Types.GeoJSON = GeoJSON
Types.Geometry = Geometry
Types.GeometryCollection = GeometryCollection
Types.LineString = LineString
Types.MultiLineString = MultiLineString
Types.MultiPoint = MultiPoint
Types.MultiPolygon = MultiPolygon
Types.Point = Point
Types.Polygon = Polygon