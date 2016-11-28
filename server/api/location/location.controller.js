'use strict';

var P = require('bluebird');
var fs = P.promisifyAll(require('fs'));

function removeJSONfromString(array) {
  if (array) {
    return array.map(function (fileName) { return fileName.split('.')[0]; });
  }
}

function getNeighborhoodNames(json) {
  if (json) {
    return json.neighborhoods.map(function (el) { return el.name; });
  }
}

function removeHiddenFiles(files) {
  if (files) {
    return files.filter(function (el) { return (el && el.charAt(0) !== '.'); });
  }
}

function capitalizeFirstLetter(str) {
  var firstChar = str.charAt(0);
  if (firstChar === 'i') {
    return 'İ' + str.slice(1);
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

export function listCities(req, res) {
  fs.readdirAsync(__dirname + '/../../cities/')
    .then(removeHiddenFiles)
    .then(responseWithResult(res));
}

export function listDistricts(req, res) {
  var city = decodeURIComponent(capitalizeFirstLetter(req.params.city));
  fs.readdirAsync(__dirname + '/../../cities/' + city)
  .then(removeHiddenFiles)
  .then(removeJSONfromString)
  .then(responseWithResult(res))
  .catch(handleError(res));
}

export function listNeighborhoods(req, res) {
  var city = decodeURIComponent(capitalizeFirstLetter(req.params.city));
  var districts = req.body.districts.map(function (d) {
    return decodeURIComponent(capitalizeFirstLetter(d));
  });

  return Promise.all(districts.map(function (d) {
    return fs.readFileAsync(__dirname + '/../../cities/' + city + '/' + d + '.json')
    .then(JSON.parse)
    .then(getNeighborhoodNames)
    .then(function (ns) {
      return {
        district: d,
        neighborhoods: ns
      };
    })
    .catch(handleError(res));
  }))
  .then(function (results) {
    if (results) return results;
  }, function (error) {
    if (error) return null;
  })
  .then(responseWithResult(res))
  .catch(handleError(res));
}
