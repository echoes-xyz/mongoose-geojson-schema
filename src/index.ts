/**
 * GeoJSON Schemas for Mongoose
 *
 * Provides ready-made Mongoose schemas for GeoJSON types for use with mongoose schema creation.
 *
 * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *
 * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 * Copyright RideAmigos (http://rideamigos.com)
 * Updates and maintenance by Josh Kopecek (josh@echoes.xyz)
 *
 * */

import mongoose from 'mongoose';
import {
  Position
} from 'geojson';

const { Schema } = mongoose;

interface CRS {
  type: 'name' | 'link';
  properties: {
    name?: string;
    href?: string;
    type?: string;
  };
}

let crs: CRS | null | undefined = undefined;

function validateCrs(crs: CRS | null | undefined): void {
  if (typeof crs !== 'object' && crs !== null) {
    throw new mongoose.Error('Crs must be an object or null');
  }
  if (crs === null) {
    return;
  }
  if (!crs.type) {
    throw new mongoose.Error('Crs must have a type');
  }
  if (crs.type !== 'name' && crs.type !== 'link') {
    throw new mongoose.Error('Crs must be either a name or link');
  }
  if (!crs.properties) {
    throw new mongoose.Error('Crs must contain a properties object');
  }
  if (crs.type === 'name' && !crs.properties.name) {
    throw new mongoose.Error('Crs specified by name must have a name property');
  }
  if (
    (crs.type === 'link' && !crs.properties.href) ||
    (crs.type === 'link' && !crs.properties.type)
  ) {
    throw new mongoose.Error(
      'Crs specified by link must have a name and href property'
    );
  }
}

// Validator functions for schema validation
function pointValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'Point') {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    } else {
      crs = undefined;
    }
    validatePoint(value.coordinates);
    return true;
  } catch {
    return false;
  }
}

function validatePoint(coordinates: Position): void {
  // must be an array (object)
  if (typeof coordinates !== 'object') {
    throw new mongoose.Error('Point ' + coordinates + ' must be an array');
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new mongoose.Error(
      'Point' + coordinates + ' must contain two or three coordinates'
    );
  }
  // must have real numbers
  if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    throw new mongoose.Error('Point must have real numbers');
  }
  // must have two numbers
  if (
    typeof coordinates[0] !== 'number' ||
    typeof coordinates[1] !== 'number'
  ) {
    throw new mongoose.Error('Point must have two numbers');
  }
  if (!crs) {
    // longitude must be within bounds
    if (coordinates[0] > 180 || coordinates[0] < -180) {
      throw new mongoose.Error(
        'Point' +
          coordinates[0] +
          ' should be within the boundaries of longitude'
      );
    }
    // latitude must be within bounds
    if (coordinates[1] > 90 || coordinates[1] < -90) {
      throw new mongoose.Error(
        'Point' +
          coordinates[1] +
          ' should be within the boundaries of latitude'
      );
    }
  }
}

function validateMultiPoint(coordinates: Position[]): void {
  for (let i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

function multiPointValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'MultiPoint') {
      return false;
    }
    if (typeof value.coordinates !== 'object') {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    validateMultiPoint(value.coordinates);
    return true;
  } catch {
    return false;
  }
}

function validateLineString(coordinates: Position[]): void {
  for (let i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

function lineStringValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'LineString') {
      return false;
    }
    if (value.coordinates.length < 2) {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    validateLineString(value.coordinates);
    return true;
  } catch {
    return false;
  }
}

function validateMultiLineString(coordinates: Position[][]): void {
  for (let i = 0; i < coordinates.length; i++) {
    validateLineString(coordinates[i]);
  }
}

function multiLineStringValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'MultiLineString') {
      return false;
    }
    if (typeof value.coordinates !== 'object') {
      return false;
    }
    validateMultiLineString(value.coordinates);
    return true;
  } catch {
    return false;
  }
}

function arraysEqual(arr1: Position, arr2: Position): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function validatePolygon(coordinates: Position[][]): void {
  for (let i = 0; i < coordinates.length; i++) {
    // The LinearRing elements must have at least four Points
    if (coordinates[i].length < 4) {
      throw new mongoose.Error(
        'Each Polygon LinearRing must have at least four elements'
      );
    }
    // the LinearRing objects must have identical start and end values
    if (
      !arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length - 1])
    ) {
      throw new mongoose.Error(
        'Each Polygon LinearRing must have an identical first and last point'
      );
    }
    // otherwise the LinearRings must correspond to a LineString
    validateLineString(coordinates[i]);
  }
}

function polygonValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'Polygon') {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    validatePolygon(value.coordinates);
    return true;
  } catch {
    return false;
  }
}

function validateMultiPolygon(coordinates: Position[][][]): void {
  for (let i = 0; i < coordinates.length; i++) {
    validatePolygon(coordinates[i]);
  }
}

function multiPolygonValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'MultiPolygon') {
      return false;
    }
    if (typeof value.coordinates !== 'object') {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    validateMultiPolygon(value.coordinates);
    return true;
  } catch {
    return false;
  }
}

function validateGeometry(geometry: any): void {
  switch (geometry.type) {
    case 'Point':
      validatePoint(geometry.coordinates);
      break;
    case 'MultiPoint':
      validateMultiPoint(geometry.coordinates);
      break;
    case 'LineString':
      validateLineString(geometry.coordinates);
      break;
    case 'MultiLineString':
      validateMultiLineString(geometry.coordinates);
      break;
    case 'Polygon':
      validatePolygon(geometry.coordinates);
      break;
    case 'MultiPolygon':
      validateMultiPolygon(geometry.coordinates);
      break;
    default:
      throw new mongoose.Error('Geometry must have a valid type');
  }
}

function geometryValidator(value: any): boolean {
  try {
    if (!value.type) {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    
    switch (value.type) {
      case 'Point':
        validatePoint(value.coordinates);
        break;
      case 'MultiPoint':
        validateMultiPoint(value.coordinates);
        break;
      case 'LineString':
        validateLineString(value.coordinates);
        break;
      case 'MultiLineString':
        validateMultiLineString(value.coordinates);
        break;
      case 'Polygon':
        validatePolygon(value.coordinates);
        break;
      case 'MultiPolygon':
        validateMultiPolygon(value.coordinates);
        break;
      default:
        return false;
    }
    return true;
  } catch {
    return false;
  }
}

function geometryCollectionValidator(value: any): boolean {
  try {
    if (typeof value.geometries !== 'object') {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    for (let i = 0; i < value.geometries.length; i++) {
      if (!geometryValidator(value.geometries[i])) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function featureValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'Feature') {
      return false;
    }
    if (!value.geometry) {
      return false;
    }
    if (!value.properties) {
      return false;
    }
    if (value.crs) {
      crs = value.crs;
      validateCrs(crs);
    }
    return geometryValidator(value.geometry);
  } catch {
    return false;
  }
}

function featureCollectionValidator(value: any): boolean {
  try {
    if (!value.type || value.type !== 'FeatureCollection') {
      return false;
    }
    if (!value.features) {
      return false;
    }
    for (let i = 0; i < value.features.length; i++) {
      if (!featureValidator(value.features[i])) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

// Schema definitions
export const Point = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(value: Position) {
        try {
          validatePoint(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid Point coordinates'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const MultiPoint = new Schema({
  type: {
    type: String,
    enum: ['MultiPoint'],
    required: true
  },
  coordinates: {
    type: [[Number]],
    required: true,
    validate: {
      validator: function(value: Position[]) {
        try {
          validateMultiPoint(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid MultiPoint coordinates'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const LineString = new Schema({
  type: {
    type: String,
    enum: ['LineString'],
    required: true
  },
  coordinates: {
    type: [[Number]],
    required: true,
    validate: {
      validator: function(value: Position[]) {
        try {
          if (value.length < 2) {
            return false;
          }
          validateLineString(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid LineString coordinates'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const MultiLineString = new Schema({
  type: {
    type: String,
    enum: ['MultiLineString'],
    required: true
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
    validate: {
      validator: function(value: Position[][]) {
        try {
          validateMultiLineString(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid MultiLineString coordinates'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const Polygon = new Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
    validate: {
      validator: function(value: Position[][]) {
        try {
          validatePolygon(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid Polygon coordinates'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const MultiPolygon = new Schema({
  type: {
    type: String,
    enum: ['MultiPolygon'],
    required: true
  },
  coordinates: {
    type: [[[[Number]]]],
    required: true,
    validate: {
      validator: function(value: Position[][][]) {
        try {
          validateMultiPolygon(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid MultiPolygon coordinates'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const Geometry = new Schema({
  type: {
    type: String,
    enum: ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'],
    required: true
  },
  coordinates: {
    type: Schema.Types.Mixed,
    required: true
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { 
  _id: false,
  discriminatorKey: 'type'
});

// Add validation at the document level
Geometry.path('coordinates').validate(function(this: any) {
  return geometryValidator(this.toObject());
}, 'Invalid Geometry');

export const GeometryCollection = new Schema({
  type: {
    type: String,
    enum: ['GeometryCollection'],
    required: true
  },
  geometries: {
    type: [Schema.Types.Mixed],
    required: true,
    validate: {
      validator: function(value: any[]) {
        try {
          for (let i = 0; i < value.length; i++) {
            if (!geometryValidator(value[i])) {
              return false;
            }
          }
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid GeometryCollection geometries'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const Feature = new Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true
  },
  geometry: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: geometryValidator,
      message: 'Invalid Feature geometry'
    }
  },
  properties: {
    type: Schema.Types.Mixed,
    required: true
  },
  id: {
    type: Schema.Types.Mixed,
    required: false
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

export const FeatureCollection = new Schema({
  type: {
    type: String,
    enum: ['FeatureCollection'],
    required: true
  },
  features: {
    type: [Schema.Types.Mixed],
    required: true,
    validate: {
      validator: function(value: any[]) {
        try {
          for (let i = 0; i < value.length; i++) {
            if (!featureValidator(value[i])) {
              return false;
            }
          }
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid FeatureCollection features'
    }
  },
  crs: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false });

// GeoJSON as a discriminated union
export const GeoJSON = new Schema({
  type: {
    type: String,
    enum: ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'Geometry', 'GeometryCollection', 'Feature', 'FeatureCollection'],
    required: true
  }
}, { 
  _id: false,
  discriminatorKey: 'type'
});
