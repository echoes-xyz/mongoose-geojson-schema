/**
 * Tests for GeoJSON Schemas
  *
 */
'use strict';

var chai = require('chai'),
  expect = chai.expect,
	mongoose = require('bluebird').promisifyAll(require('mongoose')),
	ObjectId = mongoose.Types.ObjectId,
	GeoJSON = require('../GeoJSON'),
	geoJSONSchema = require('./test.model');

describe("GeoJSON Schema", function () {

  var db = mongoose.createConnection('localhost', 'test');
  var GeoJSON = db.model('GeoJSON', geoJSONSchema);

  before(function () {
    GeoJSON.find({}).removeAsync().then();
  });

  describe("GeoJSON Point", function () {
    var pointData;

    beforeEach(function() {
      pointData = {
        title: "A test GeoJSON object",
        point: {
          type: "Point",
          coordinates: [12.123456, 13.134578]
        },
        multilinestring: {
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
        },
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
        },
        geometrycollection: {
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
            // {
            //   type: "Polygon",
            //   coordinates: [
            //     [
            //       [12.123456, 13.1345678],
            //       [179.999999, -1.345],
            //       [12.0002, -45.4663],
            //       [12.123456, 13.1345678]
            //     ],
            //     [
            //       [11.516862326077, 44.404681927713],
            //       [-22.655581167273, 60.740525317723],
            //       [79.68631037962, -44.541454554788],
            //       [11.516862326077, 44.404681927713]
            //     ]
            //   ]
            // },
            // {
            //   type: "MultiPolygon",
            //   coordinates: [
            //     [
            //       [
            //         [12.123456, 13.1345678],
            //         [179.999999, -1.345],
            //         [12.0002, -45.4663],
            //         [12.123456, 13.1345678]
            //       ],
            //       [
            //         [11.516862326077, 44.404681927713],
            //         [-22.655581167273, 60.740525317723],
            //         [79.68631037962, -44.541454554788],
            //         [11.516862326077, 44.404681927713]
            //       ]
            //     ],
            //     [
            //       [
            //         [27.915305121762, -38.36709506268],
            //         [34.937754378159, -77.592500824291],
            //         [60.951818176988, 8.8275726972276],
            //         [27.915305121762, -38.36709506268]
            //       ],
            //       [
            //         [0.28592176283054, -4.8668219497739],
            //         [75.183570853054, -72.778626895872],
            //         [18.020903695384, 13.023794574208],
            //         [0.28592176283054, -4.8668219497739]
            //       ]
            //     ]
            //   ]
            // }
          ]
        }
      };
    });

    it("should return a valid Point", function (done) {
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      if (error) {
        // console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed Point", function (done) {
      pointData.point.coordinates[2] = 12345349884848;
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.message).to.contain('Cast to Point failed for value');
      done();
    });

    it("should fail with a badly formed Point", function (done) {
      pointData.point.coordinates[2] = 12345349884848;
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.message).to.contain('Cast to Point failed for value');
      done();
    });

    it("should fail when Point is not described as a Point", function (done) {
      pointData.point.type = "Square";
      var geoJSON = new GeoJSON(pointData);
      var error = geoJSON.validateSync();
      expect(error.errors.point.message).to.contain('Cast to Point failed for value');
      done();
    });

  });

  xdescribe("GeoJSON MultiPoint", function () {
    var multiPointData;

    beforeEach(function() {
      multiPointData = {
        title: "A test GeoJSON object",
        multipoint: {
          type: "MultiPoint",
          coordinates: [
            [12.123456, 13.1345678],
            [179.999999, -1.345]
          ]
        }
      };
    });

    it("should return a valid MultiPoint", function (done) {
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed MultiPoint", function (done) {
      multiPointData.point.coordinates[0][2] = 12345349884848;
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error.errors['point.coordinates'].message).to.contain('is not a correctly formed GeoJson MultiPoint object');
      done();
    });

    it("should fail when MultiPoint is not described as a MultiPoint", function (done) {
      multiPointData.point.type = "Square";
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      expect(error.errors['point.type'].message).to.contain('is not a valid enum value for path');
      done();
    });

    xit("should fail when LineString only has one MultiPoint", function (done) {
      multiPointData.linestring.coordinates = multiPointData.linestring.coordinates.splice(0,1);
      // console.log(multiPointData);
      var geoJSON = new GeoJSON(multiPointData);
      var error = geoJSON.validateSync();
      // console.log(error);
      expect(error.errors['point.type'].message).to.contain('Square must be MultiPoint');
      done();
    });

  });

  xdescribe("GeoJSON LineString", function () {
    var lineStringData;

    beforeEach(function() {
      lineStringData = {
        title: "A test GeoJSON object",
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

    it("should return a valid LineString", function (done) {
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      if (error) {
        console.log(error);
        done(error);
      } else {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    it("should fail with a badly formed LineString", function (done) {
      lineStringData.point.coordinates[0][2] = 12345349884848;
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors['point.coordinates'].message).to.contain('is not a correctly formed GeoJson LineString object');
      done();
    });

    it("should fail when LineString is not described as a LineString", function (done) {
      lineStringData.point.type = "Square";
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      expect(error.errors['point.type'].message).to.contain('is not a valid enum value for path');
      done();
    });

    xit("should fail when LineString only has one LineString", function (done) {
      lineStringData.linestring.coordinates = lineStringData.linestring.coordinates.splice(0,1);
      // console.log(lineStringData);
      var geoJSON = new GeoJSON(lineStringData);
      var error = geoJSON.validateSync();
      // console.log(error);
      expect(error.errors['point.type'].message).to.contain('Square must be LineString');
      done();
    });

  });



});
