/**
 * Tests for GeoJSON Schemas
  *
 */
'use strict';

var chai = require('chai'),
  expect = chai.expect,
	mongoose = require('bluebird').promisifyAll(require('mongoose')),
	ObjectId = mongoose.Types.ObjectId,
	geoJSONSchema = require('./test.model');

describe("GeoJSON Schema", function () {

  var db = mongoose.createConnection('localhost', 'test');
  var GeoJSON = db.model('GeoJSON', geoJSONSchema);
  var pointData;
  var multiPointData;
  var lineStringData;
  var multiLineStringData;
  var polygonData;
  var multiPolygonData;
  var geometryData;
  var geometryCollectionData;
  var featureData;
  var featureCollectionData;

  before(function () {
    GeoJSON.find({}).removeAsync().then();
  });

  describe("Point", function () {

    beforeEach(function() {
      pointData = {
        title: "A test object",
        point: {
          type: "Point",
          coordinates: [12.123456, 13.134578]
        }
      };
    });

    it("should return a valid Point", function () {
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should pass with a crs name object", function () {
      pointData.point.crs = {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      };
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should pass with a crs link object", function () {
      pointData.point.crs = {
        type: "link",
        properties: {
          href: "http://example.com/crs/42",
          type: "proj4"
        }
      };
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should pass with a crs object and funky coordinates", function () {
      pointData.point.coordinates[0] = 519170358981.4272;
      pointData.point.coordinates[1] = 862072816114.0736;
      pointData.point.crs = {
        type: "link",
        properties: {
          href: "http://example.com/crs/42",
          type: "proj4"
        }
      };
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed crs object", function () {
      pointData.point.crs = {
        type: "name",
        properties: {
          href: "http://example.com/crs/42",
          type: "proj4"
        }
      };
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.reason.message).to.contain('Crs specified by name must have a name property');
    });

    it("should fail with coordinates out of range", function () {
      pointData.point.coordinates[0] = 12345349884848;
      pointData.point.coordinates[1] = 945873487236745;
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.reason.message).to.contain('should be within the boundaries of longitude');
    });

    it("should fail with a badly formed Point", function () {
      pointData.point.coordinates[2] = 12345349884848;
      pointData.point.coordinates[3] = 945873487236745;
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.reason.message).to.contain('must contain two or three coordinates');
    });

    it("should fail when Point is not described as a Point", function () {
      pointData.point.type = "Square";
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.reason.message).to.contain('Square is not a valid GeoJSON typ');
    });

  });

  describe("MultiPoint", function () {

    beforeEach(function() {
      multiPointData = {
        title: "A test object",
        multipoint: {
          type: "MultiPoint",
          coordinates: [
            [12.123456, 13.1345678],
            [179.999999, -1.345]
          ]
        }
      };
    });

    it("should return a valid MultiPoint", function () {
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed MultiPoint", function () {
      multiPointData.multipoint.coordinates[0][2] = 12345349884848;
      multiPointData.multipoint.coordinates[0][3] = 945783478942;
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipoint.reason.message).to.contain('must contain two or three coordinates');
    });

    it("should fail when MultiPoint is not described as a MultiPoint", function () {
      multiPointData.multipoint.type = "Square";
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipoint.reason.message).to.contain('Square is not a valid GeoJSON typ');
    });

  });

  describe("LineString", function () {

    beforeEach(function() {
      lineStringData = {
        title: "A test object",
        linestring: {
          type: "LineString",
          coordinates: [
            [12.123456, 13.1345678],
            [179.999999, -1.345],
            [12.0002, -45.4663]
          ]
        },
      };
    });

    it("should return a valid LineString", function () {
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed LineString", function () {
      lineStringData.linestring.coordinates[0][2] = 12345349884848;
      lineStringData.linestring.coordinates[0][3] = 9845674598;
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.linestring.reason.message).to.contain('must contain two or three coordinates');
    });

    it("should fail when LineString is not described as a LineString", function () {
      lineStringData.linestring.type = "Square";
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.linestring.reason.message).to.contain('Square is not a valid GeoJSON typ');
    });

    it("should fail when LineString only has one LineString", function () {
      lineStringData.linestring.coordinates = lineStringData.linestring.coordinates.splice(0,1);
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.linestring.reason.message).to.contain('LineString type must have at least two Points');
    });

  });


  describe("MultiLineString", function () {

    beforeEach(function() {
      multiLineStringData = {
        title: "A test object",
        multilinestring: {
          type: "MultiLineString",
          coordinates: [
            [
              [12.123456, 13.1345678],
              [179.999999, -1.345],
              [12.0002, -45.4663]
            ],
            [
              [-18.557355640716, -34.977342274495],
              [78.622248642436, 47.139451260278],
              [25.695557555042, -28.71830527611]
            ]
          ]
        },
      };
    });

    it("should return a valid MultiLineString", function () {
      var geoJSON = new GeoJSON(multiLineStringData);
      expect(geoJSON.validateSync()).to.be.an('undefined');
    });

    it("should fail with a badly formed MultiLineString", function () {
      multiLineStringData.multilinestring.coordinates[0][0][2] = 12345349884848;
      multiLineStringData.multilinestring.coordinates[0][0][3] = 9845674598;
      var geoJSON = new GeoJSON(multiLineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.multilinestring.reason.message).to.contain('must contain two or three coordinates');
    });

    it("should fail when MultiLineString is not described as a MultiLineString", function () {
      multiLineStringData.multilinestring.type = "Square";
      var geoJSON = new GeoJSON(multiLineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors.multilinestring.reason.message).to.contain('Square is not a valid GeoJSON type');
    });

  });


  describe("Polygon", function () {

    beforeEach(function() {
      polygonData = {
        title: "A test object",
        polygon: {
          type: "Polygon",
          coordinates: [
            [
              [12.123456, 13.1345678],
              [179.999999, -1.345],
              [12.0002, -45.4663],
              [12.123456, 13.1345678]
            ],
            [
              [11.516862326077, 44.404681927713],
              [-22.655581167273, 60.740525317723],
              [79.68631037962, -44.541454554788],
              [11.516862326077, 44.404681927713]
            ]
          ]
        }
      };
    });

    it("should return a valid Polygon", function () {
      var geoJSON = new GeoJSON(polygonData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed Polygon", function () {
      polygonData.polygon.coordinates[0][2] = 12345349884848;
      polygonData.polygon.coordinates[0][3] = 9845674598;
      var geoJSON = new GeoJSON(polygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.polygon.reason.message).to.contain('Each Polygon LinearRing must have an identical first and last point');
    });

    it("should fail when Polygon is not described as a Polygon", function () {
      polygonData.polygon.type = "Square";
      var geoJSON = new GeoJSON(polygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.polygon.reason.message).to.contain('Square is not a valid GeoJSON type');
    });

  });

  describe("MultiPolygon", function () {

    beforeEach(function() {
      multiPolygonData = {
        title: "A test object",
        multipolygon: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [12.123456, 13.1345678],
                [179.999999, -1.345],
                [12.0002, -45.4663],
                [12.123456, 13.1345678]
              ],
              [
                [11.516862326077, 44.404681927713],
                [-22.655581167273, 60.740525317723],
                [79.68631037962, -44.541454554788],
                [11.516862326077, 44.404681927713]
              ]
            ],
            [
              [
                [27.915305121762, -38.36709506268],
                [34.937754378159, -77.592500824291],
                [60.951818176988, 8.8275726972276],
                [27.915305121762, -38.36709506268]
              ],
              [
                [0.28592176283054, -4.8668219497739],
                [75.183570853054, -72.778626895872],
                [18.020903695384, 13.023794574208],
                [0.28592176283054, -4.8668219497739]
              ]
            ]
          ]
        }
      };
    });

    it("should return a valid MultiPolygon", function () {
      var geoJSON = new GeoJSON(multiPolygonData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed MultiPolygon", function () {
      multiPolygonData.multipolygon.coordinates[0][0][2] = 12345349884848;
      multiPolygonData.multipolygon.coordinates[0][0][3] = 9845674598;
      var geoJSON = new GeoJSON(multiPolygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipolygon.reason.message).to.contain('Each Polygon LinearRing must have an identical first and last point');
    });

    it("should fail when MultiPolygon is not described as a MultiPolygon", function () {
      multiPolygonData.multipolygon.type = "Square";
      var geoJSON = new GeoJSON(multiPolygonData);
      var error = geoJSON.validateSync();
      expect(error.errors.multipolygon.reason.message).to.contain('Square is not a valid GeoJSON type');
    });

  });

  describe("Geometry", function () {

    beforeEach(function() {
      geometryData = {
        title: "A test object",
        geometry: {
          type: "LineString",
          coordinates: [
            [12.123456, 13.1345678],
            [179.999999, -1.345],
            [12.0002, -45.4663]
          ]
        }
      };
    });

    it("should return a valid Geometry with LineString", function () {
      var geoJSON = new GeoJSON(geometryData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should return a valid Geometry with MultiPoint", function () {
      geometryData.geometry = {
        type: "MultiLineString",
        coordinates: [
          [
            [12.123456, 13.1345678],
            [179.999999, -1.345],
            [12.0002, -45.4663]
          ],
          [
            [11.516862326077, 44.404681927713],
            [-22.655581167273, 60.740525317723],
            [79.68631037962, -44.541454554788]
          ]
        ]
      };
      var geoJSON = new GeoJSON(geometryData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed Geometry", function () {
      geometryData.geometry.coordinates[0][2] = 12345349884848;
      geometryData.geometry.coordinates[0][3] = 9845674598;
      var geoJSON = new GeoJSON(geometryData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometry.reason.message).to.contain('must contain two or three coordinates');
    });

    it("should fail when a geometry is not described correctly", function () {
      geometryData.geometry.type = "Square";
      var geoJSON = new GeoJSON(geometryData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometry.reason.message).to.contain('Geometry must have a valid type');
    });

  });

  describe("GeometryCollection", function () {

    beforeEach(function() {
      geometryCollectionData = {
        title: "A test object",
        geometrycollection: {
          type: "GeometryCollection",
          geometries: [
            {
              type: "Point",
              coordinates: [12.123456, 13.134578]
            },
            {
              type: "MultiPoint",
              coordinates: [
                [12.123456, 13.1345678],
                [179.999999, -1.345]
              ]
            },
            {
              type: "LineString",
              coordinates: [
                [12.123456, 13.1345678],
                [179.999999, -1.345],
                [12.0002, -45.4663]
              ]
            },
            {
              type: "MultiLineString",
              coordinates: [
                [
                  [12.123456, 13.1345678],
                  [179.999999, -1.345],
                  [12.0002, -45.4663]
                ],
                [
                  [11.516862326077, 44.404681927713],
                  [-22.655581167273, 60.740525317723],
                  [79.68631037962, -44.541454554788]
                ]
              ]
            },
            {
              type: "Polygon",
              coordinates: [
                [
                  [12.123456, 13.1345678],
                  [179.999999, -1.345],
                  [12.0002, -45.4663],
                  [12.123456, 13.1345678]
                ],
                [
                  [11.516862326077, 44.404681927713],
                  [-22.655581167273, 60.740525317723],
                  [79.68631037962, -44.541454554788],
                  [11.516862326077, 44.404681927713]
                ]
              ]
            },
            {
              type: "MultiPolygon",
              coordinates: [
                [
                  [
                    [12.123456, 13.1345678],
                    [179.999999, -1.345],
                    [12.0002, -45.4663],
                    [12.123456, 13.1345678]
                  ],
                  [
                    [11.516862326077, 44.404681927713],
                    [-22.655581167273, 60.740525317723],
                    [79.68631037962, -44.541454554788],
                    [11.516862326077, 44.404681927713]
                  ]
                ],
                [
                  [
                    [27.915305121762, -38.36709506268],
                    [34.937754378159, -77.592500824291],
                    [60.951818176988, 8.8275726972276],
                    [27.915305121762, -38.36709506268]
                  ],
                  [
                    [0.28592176283054, -4.8668219497739],
                    [75.183570853054, -72.778626895872],
                    [18.020903695384, 13.023794574208],
                    [0.28592176283054, -4.8668219497739]
                  ]
                ]
              ]
            }
          ]
        }
      };
    });

    it("should return a valid GeometryCollection", function () {
      var geoJSON = new GeoJSON(geometryCollectionData);
      var error = geoJSON.validateSync();
      if (error) console.log(error);
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed GeometryCollection", function () {
      geometryCollectionData.geometrycollection.geometries[0].coordinates[2] = 12345349884848;
      geometryCollectionData.geometrycollection.geometries[0].coordinates[3] = 9845674598;
      var geoJSON = new GeoJSON(geometryCollectionData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometrycollection.reason.message).to.contain('must contain two or three coordinates');
    });

    it("should fail when a geometry is not described correctly", function () {
      geometryCollectionData.geometrycollection.geometries[0].type = "Square";
      var geoJSON = new GeoJSON(geometryCollectionData);
      var error = geoJSON.validateSync();
      expect(error.errors.geometrycollection.reason.message).to.contain('Geometry must have a valid type');
    });

  });

  describe("Feature", function () {

    beforeEach(function() {
      featureData = {
        title: "A test object",
        feature: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [12.123456, 13.1345678],
                [179.999999, -1.345],
                [12.0002, -45.4663],
                [12.123456, 13.1345678]
              ],
              [
                [11.516862326077, 44.404681927713],
                [-22.655581167273, 60.740525317723],
                [79.68631037962, -44.541454554788],
                [11.516862326077, 44.404681927713]
              ]
            ]
          },
          properties: {
            property1: "How nice."
          }
        }
      };
    });

    it("should return a valid Feature", function () {
      var geoJSON = new GeoJSON(featureData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed Feature", function () {
      featureData.feature.geometry.coordinates[0][0][2] = 12345349884848;
      featureData.feature.geometry.coordinates[0][0][3] = 9845674598;
      var geoJSON = new GeoJSON(featureData);
      var error = geoJSON.validateSync();
      expect(error.errors.feature.reason.message).to.contain('Each Polygon LinearRing must have an identical first and last point');
    });

    it("should fail when a geometry is not described correctly", function () {
      featureData.feature.geometry.type = "Square";
      var geoJSON = new GeoJSON(featureData);
      var error = geoJSON.validateSync();
      expect(error.errors.feature.reason.message).to.contain('Geometry must have a valid type');
    });

  });

  describe("FeatureCollection", function () {

    beforeEach(function() {
      featureCollectionData = {
        title: "A test object",
        featurecollection: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [12.123456, 13.1345678],
                    [179.999999, -1.345],
                    [12.0002, -45.4663],
                    [12.123456, 13.1345678]
                  ],
                  [
                    [11.516862326077, 44.404681927713],
                    [-22.655581167273, 60.740525317723],
                    [79.68631037962, -44.541454554788],
                    [11.516862326077, 44.404681927713]
                  ]
                ]
              },
              properties: {
                property1: "How nice."
              }
            }
          ]
        }
      };
    });

    it("should return a valid FeatureCollection", function () {
      var geoJSON = new GeoJSON(featureCollectionData);
      var error = geoJSON.validateSync();
      expect(error).to.be.an('undefined');
    });

    it("should fail with a badly formed FeatureCollection", function () {
      featureCollectionData.featurecollection.features[0].geometry.coordinates[0][0][2] = 12345349884848;
      featureCollectionData.featurecollection.features[0].geometry.coordinates[0][0][3] = 9845674598;
      var geoJSON = new GeoJSON(featureCollectionData);
      var error = geoJSON.validateSync();
      expect(error.errors.featurecollection.reason.message).to.contain('Each Polygon LinearRing must have an identical first and last point');
    });

    it("should fail when a geometry is not described correctly", function () {
      featureCollectionData.featurecollection.features[0].geometry.type = "Square";
      var geoJSON = new GeoJSON(featureCollectionData);
      var error = geoJSON.validateSync();
      expect(error.errors.featurecollection.reason.message).to.contain('Geometry must have a valid type');
    });

  });

});
