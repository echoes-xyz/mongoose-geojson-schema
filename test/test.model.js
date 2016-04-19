'use strict';

var mongoose = require('mongoose');
var GeoJSON = require('../GeoJSON');

var TestSchema = new mongoose.Schema({
  title: String,
  test: {},
  point: GeoJSON.Point,
  multipoint: GeoJSON.MultiPoint,
  linestring: GeoJSON.LineString,
  multilinestring: GeoJSON.MultiLineString,
  polygon: GeoJSON.Polygon,
  multipolygon: GeoJSON.MultiPolygon,
  geometrycollection: GeoJSON.GeometryCollection,
  // feature: GeoJSON.Feature,
  // featurecollection: GeoJSON.FeatureCollection,
  // requireaddressfeature: GeoJSON.requiredAddressFeature
}, { typeKey: '$type', collection: 'echoes' });

module.exports = TestSchema;
