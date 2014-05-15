/**
 * Tests for GeoJSON Schemas
  *
 */
"use strict";

var chai = require('chai')
    , expect = chai.expect
    , mongoose = require('mongoose')
    , ObjectId = mongoose.Types.ObjectId
    , GeoJSON = require('../GeoJSON');


describe("GeoJSON Schema", function () {

  before(function () {
    mongoose.connect("mongodb://localhost/test")
  })

  describe("structure", function () {

    it("should have a test", function () {
      expect(1).to.equal(1)
    })

  })



})

