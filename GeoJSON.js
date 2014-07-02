/**
 *  * GeoJSON Schemas for Mongoose
 *   *
 *    * rough GeoJSON schemas for use with mongoose schema creation
 *     *
 *      * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *       *
 *        * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 *         * Copyright RideAmigos (http://rideamigos.com)
 *          */

var GeoJSON;
module.exports = GeoJSON = {};

GeoJSON.Geometry = {
	'type': { type: String, required: true, enum: ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"] },
	coordinates: []
}

GeoJSON.Point = {
	'type': { type: String, required: true, default: "Point" },
	coordinates: []
};

GeoJSON.MultiPoint = {
	'type': { type: String, required: true, default: "MultiPoint" },
	coordinates: []
};

GeoJSON.MultiLineString = {
	'type': { type: String, required: true, default: "MultiLineString" },
	coordinates: []
}

GeoJSON.Polygon = {
	'type': { type: String, required: true, default: "Polygon" },
	coordinates: []
};

GeoJSON.MultiPolygon = {
	'type': { type: String, required: true, default: "MultiPolygon" },
	coordinates: []
};

GeoJSON.GeometryCollection = {
	'type': { type: String, required: true, default: "GeometryCollection" },
	geometries: [GeoJSON.Geometry]
};

GeoJSON.Feature = {
	id: String,
	'type': { type: String, required: true, default: "Feature" },
	geometry: GeoJSON.Geometry,
	properties: Object
};

GeoJSON.FeatureCollection = {
	'type': { type: String, required: true, default: "FeatureCollection" },
	features: [ GeoJSON.Feature ]
};


