'use strict';

var mongoose = require('mongoose');
const {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Geometry,
  GeometryCollection,
  Feature,
  FeatureCollection
} = require('../dist');

var TestSchema = new mongoose.Schema({
  title: String,
  test: {},
  point: Point,
  multipoint: MultiPoint,
  linestring: LineString,
  multilinestring: MultiLineString,
  polygon: Polygon,
  multipolygon: MultiPolygon,
  geometry: Geometry,
  geometrycollection: GeometryCollection,
  feature: Feature,
  featurecollection: FeatureCollection
}, { collection: 'echoes' });

module.exports = TestSchema;
