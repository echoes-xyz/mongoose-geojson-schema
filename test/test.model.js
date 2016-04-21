'use strict';

var mongoose = require('mongoose');
var GeoJSON = require('../GeoJSON');

var TestSchema = new mongoose.Schema({
  title: String,
  test: {},
  point: mongoose.Schema.Types.Point,
  multipoint: mongoose.Schema.Types.MultiPoint,
  linestring: mongoose.Schema.Types.LineString,
  multilinestring: mongoose.Schema.Types.MultiLineString,
  // polygon: mongoose.Schema.Types.Polygon,
  // multipolygon: mongoose.Schema.Types.MultiPolygon,
  // geometrycollection: mongoose.Schema.Types.GeometryCollection,
  // feature: mongoose.Schema.Types.Feature,
  // featurecollection: mongoose.Schema.Types.FeatureCollection,
  // requireaddressfeature: GeoJSON.requiredAddressFeature
}, { typeKey: '$type', collection: 'echoes' });

module.exports = TestSchema;
