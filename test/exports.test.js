/**
 * Tests for TypeScript exports and type registration
 */
'use strict';

const mongoose = require('mongoose');

let expect;

describe('Module Exports', () => {
  before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
  });

  describe('Class exports', () => {
    it('should export all GeoJSON type classes', () => {
      const exports = require('../dist');
      expect(exports.GeoJSON).to.be.a('function');
      expect(exports.Point).to.be.a('function');
      expect(exports.MultiPoint).to.be.a('function');
      expect(exports.LineString).to.be.a('function');
      expect(exports.MultiLineString).to.be.a('function');
      expect(exports.Polygon).to.be.a('function');
      expect(exports.MultiPolygon).to.be.a('function');
      expect(exports.Geometry).to.be.a('function');
      expect(exports.GeometryCollection).to.be.a('function');
      expect(exports.Feature).to.be.a('function');
      expect(exports.FeatureCollection).to.be.a('function');
    });
  });

  describe('Type registration', () => {
    before(() => {
      // Ensure the module is loaded to register types
      require('../dist');
    });

    it('should register types on mongoose.Schema.Types', () => {
      expect(mongoose.Schema.Types.GeoJSON).to.be.a('function');
      expect(mongoose.Schema.Types.Point).to.be.a('function');
      expect(mongoose.Schema.Types.MultiPoint).to.be.a('function');
      expect(mongoose.Schema.Types.LineString).to.be.a('function');
      expect(mongoose.Schema.Types.MultiLineString).to.be.a('function');
      expect(mongoose.Schema.Types.Polygon).to.be.a('function');
      expect(mongoose.Schema.Types.MultiPolygon).to.be.a('function');
      expect(mongoose.Schema.Types.Geometry).to.be.a('function');
      expect(mongoose.Schema.Types.GeometryCollection).to.be.a('function');
      expect(mongoose.Schema.Types.Feature).to.be.a('function');
      expect(mongoose.Schema.Types.FeatureCollection).to.be.a('function');
    });

    it('should register types on mongoose.Types', () => {
      expect(mongoose.Types.GeoJSON).to.be.a('function');
      expect(mongoose.Types.Point).to.be.a('function');
      expect(mongoose.Types.MultiPoint).to.be.a('function');
      expect(mongoose.Types.LineString).to.be.a('function');
      expect(mongoose.Types.MultiLineString).to.be.a('function');
      expect(mongoose.Types.Polygon).to.be.a('function');
      expect(mongoose.Types.MultiPolygon).to.be.a('function');
      expect(mongoose.Types.Geometry).to.be.a('function');
      expect(mongoose.Types.GeometryCollection).to.be.a('function');
      expect(mongoose.Types.Feature).to.be.a('function');
      expect(mongoose.Types.FeatureCollection).to.be.a('function');
    });
  });
});
