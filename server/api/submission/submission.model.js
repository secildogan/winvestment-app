'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
  created_at: Date,
  by: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  admin_notes: String,
  user_notes: String,
  city: String,
  districts: [String],
  neighborhoods: Object,
  realty_types: [String],
  room_counts: [String],
  building_ages: [String],
  floors: [String],
  building_types: [String],
  musts: [String],
  bank: String,
  related_links: [String],
  price: {
    min: Number,
    max: Number
  },
  area: {
    min: Number,
    max: Number
  },
  dates: {
    min: Date,
    max: Date
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
