'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  created_at: Date
});

module.exports = mongoose.model('Contact', ContactSchema);
