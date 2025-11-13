/**
 * Tests for TypeScript exports and schema usability
 */
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

let expect;

describe('Module Exports', () => {
  before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
  });

  describe('Schema exports', () => {
    it('should export all GeoJSON type schemas', () => {
      const exports = require('../dist');
      expect(exports.GeoJSON).to.be.instanceOf(Schema);
      expect(exports.Point).to.be.instanceOf(Schema);
      expect(exports.MultiPoint).to.be.instanceOf(Schema);
      expect(exports.LineString).to.be.instanceOf(Schema);
      expect(exports.MultiLineString).to.be.instanceOf(Schema);
      expect(exports.Polygon).to.be.instanceOf(Schema);
      expect(exports.MultiPolygon).to.be.instanceOf(Schema);
      expect(exports.Geometry).to.be.instanceOf(Schema);
      expect(exports.GeometryCollection).to.be.instanceOf(Schema);
      expect(exports.Feature).to.be.instanceOf(Schema);
      expect(exports.FeatureCollection).to.be.instanceOf(Schema);
    });
  });

  describe('Schema usability', () => {
    it('should allow importing and using schemas in models', () => {
      const { Point, Feature } = require('../dist');
      
      // Should be able to use schemas as subdocuments
      const parentSchema = new Schema({
        location: Point,
        data: Feature
      });
      
      expect(parentSchema.path('location')).to.exist;
      expect(parentSchema.path('data')).to.exist;
    });

    it('should have Feature with required properties', () => {
      const { Feature } = require('../dist');
      const featureSchema = Feature;
      
      // Feature should have properties field as required
      const propertiesPath = featureSchema.path('properties');
      expect(propertiesPath).to.exist;
      expect(propertiesPath.isRequired).to.be.true;
    });
  });
});
