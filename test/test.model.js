'use strict';

var mongoose = require('mongoose');
var GeoJSON = require('../GeoJSON');

var TestSchema = new mongoose.Schema({
  title: String,
  test: {},
  point: mongoose.Schema.Types.GeoJSON,
  multipoint: mongoose.Schema.Types.GeoJSON,
  linestring: mongoose.Schema.Types.GeoJSON,
  multilinestring: mongoose.Schema.Types.GeoJSON,
  polygon: mongoose.Schema.Types.GeoJSON,
  multipolygon: mongoose.Schema.Types.GeoJSON,
  geometry: mongoose.Schema.Types.GeoJSON,
  geometrycollection: mongoose.Schema.Types.GeoJSON,
  feature: mongoose.Schema.Types.GeoJSON,
  featurecollection: mongoose.Schema.Types.GeoJSON,
  // requireaddressfeature: GeoJSON.requiredAddressFeature
}, { typeKey: '$type', collection: 'echoes' });

module.exports = TestSchema;
