'use strict';

var express = require('express');
var controller = require('./location.controller');

var router = express.Router();

router.get('/', controller.listCities);
router.get('/:city/', controller.listDistricts);
router.post('/:city', controller.listNeighborhoods);

module.exports = router;
