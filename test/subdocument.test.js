/**
 * Tests for using GeoJSON schemas as subdocuments with required/optional
 */
'use strict';

const mongoose = require('mongoose');
const { Point, Feature, LineString } = require('../dist');

let expect;

describe('GeoJSON Schemas as Subdocuments', () => {
  before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
  });

  describe('Required subdocument', () => {
    it('should use { type: Point, required: true } syntax', () => {
      const LocationSchema = new mongoose.Schema({
        name: String,
        location: { type: Point, required: true }
      });

      const Location = mongoose.model('LocationRequired', LocationSchema);

      // Valid document
      const loc1 = new Location({
        name: 'City Hall',
        location: {
          type: 'Point',
          coordinates: [-73.97, 40.77]
        }
      });
      expect(loc1.validateSync()).to.be.undefined;

      // Missing location should fail required validation
      const loc2 = new Location({
        name: 'City Hall'
      });
      const error = loc2.validateSync();
      expect(error).to.exist;
      expect(error.errors.location).to.exist;
    });

    it('should validate GeoJSON Point structure when present', () => {
      const LocationSchema = new mongoose.Schema({
        name: String,
        location: { type: Point, required: true }
      });

      const Location = mongoose.model('LocationValidate', LocationSchema);

      // Invalid Point - missing type
      const loc = new Location({
        name: 'City Hall',
        location: {
          coordinates: [-73.97, 40.77]
        }
      });
      const error = loc.validateSync();
      expect(error).to.exist;
    });
  });

  describe('Optional subdocument', () => {
    it('should use Schema directly for optional subdocument', () => {
      const LocationSchema = new mongoose.Schema({
        name: String,
        location: Point  // optional
      });

      const Location = mongoose.model('LocationOptional', LocationSchema);

      // Valid with location
      const loc1 = new Location({
        name: 'City Hall',
        location: {
          type: 'Point',
          coordinates: [-73.97, 40.77]
        }
      });
      expect(loc1.validateSync()).to.be.undefined;

      // Valid without location (optional)
      const loc2 = new Location({
        name: 'City Hall'
      });
      expect(loc2.validateSync()).to.be.undefined;

      // Valid with null location
      const loc3 = new Location({
        name: 'City Hall',
        location: null
      });
      expect(loc3.validateSync()).to.be.undefined;
    });

    it('should validate GeoJSON structure when optional field is present', () => {
      const LocationSchema = new mongoose.Schema({
        name: String,
        location: Point
      });

      const Location = mongoose.model('LocationOptionalValidate', LocationSchema);

      // Invalid Point structure
      const loc = new Location({
        name: 'City Hall',
        location: {
          coordinates: [-73.97, 40.77]
          // missing type
        }
      });
      const error = loc.validateSync();
      expect(error).to.exist;
    });
  });

  describe('Multiple GeoJSON subdocuments', () => {
    it('should support multiple different GeoJSON schemas in one model', () => {
      const RouteSchema = new mongoose.Schema({
        name: String,
        startPoint: { type: Point, required: true },
        path: LineString,
        destination: Feature
      });

      const Route = mongoose.model('Route', RouteSchema);

      const route = new Route({
        name: 'Downtown Route',
        startPoint: {
          type: 'Point',
          coordinates: [-73.97, 40.77]
        },
        path: {
          type: 'LineString',
          coordinates: [[-73.97, 40.77], [-73.98, 40.76]]
        },
        destination: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-73.96, 40.78]
          },
          properties: {
            name: 'Times Square'
          }
        }
      });

      expect(route.validateSync()).to.be.undefined;
    });
  });

  describe('Nested subdocuments', () => {
    it('should support GeoJSON schemas nested in objects', () => {
      const LocationSchema = new mongoose.Schema({
        name: String,
        metadata: {
          primary: { type: Point, required: true },
          secondary: Point
        }
      });

      const Location = mongoose.model('LocationNested', LocationSchema);

      const loc = new Location({
        name: 'City',
        metadata: {
          primary: {
            type: 'Point',
            coordinates: [-73.97, 40.77]
          },
          secondary: {
            type: 'Point',
            coordinates: [-73.96, 40.78]
          }
        }
      });

      expect(loc.validateSync()).to.be.undefined;
    });
  });

  describe('GeoJSON type property preservation', () => {
    it('should preserve the type property value in GeoJSON data', () => {
      const LocationSchema = new mongoose.Schema({
        location: { type: Point, required: true }
      });

      const Location = mongoose.model('LocationTypePreservation', LocationSchema);

      const loc = new Location({
        location: {
          type: 'Point',
          coordinates: [-73.97, 40.77]
        }
      });

      expect(loc.validateSync()).to.be.undefined;
      
      // Verify that the GeoJSON type property is preserved
      expect(loc.location).to.exist;
      expect(loc.location.type).to.equal('Point');
      expect(loc.location.coordinates).to.deep.equal([-73.97, 40.77]);
      expect(typeof loc.location).to.equal('object');
    });

    it('should preserve type property when serialized to JSON', () => {
      const LocationSchema = new mongoose.Schema({
        location: Point
      });

      const Location = mongoose.model('LocationSerialize', LocationSchema);

      const loc = new Location({
        location: {
          type: 'Point',
          coordinates: [-73.97, 40.77]
        }
      });

      const json = loc.toJSON();
      expect(json.location.type).to.equal('Point');
      expect(json.location.coordinates).to.deep.equal([-73.97, 40.77]);
    });
  });
});
