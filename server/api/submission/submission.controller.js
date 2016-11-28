/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/submissions              ->  index
 * POST    /api/submissions              ->  create
 * GET     /api/submissions/:id          ->  show
 * PUT     /api/submissions/:id          ->  update
 * DELETE  /api/submissions/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Submission = require('./submission.model');
var mailer = require('../../components/mailer');

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

function checkHasRights(req, res) {
  return function (entity) {
    if (!entity) return entity;

    let by = entity.by;
    if (by._id) {
      by = by._id;
    }

    by = `${by}`;

    if (by !== `${req.user._id}` && req.user.role !== 'admin') {
      res.status(403).end();
      return null;
    }

    return entity;
  }
}

// Gets a list of Submissions
exports.index = function(req, res) {
  const q = req.query;
  const count = parseInt(q.count, 10) || 12; // 12 per request by default
  const page = parseInt(q.page, 10) || 1;
  const skip = count * (page - 1);
  const query = { $and: [] };
  let arr;
  let obj;

  if (q.count) { delete q.count; }
  if (q.page) { delete q.page; }

  for (const i in q) {
    if (q.hasOwnProperty(i)) {
      if (_.isArray(q[i])) {
        const l = q[i].length;
        arr = [];
        for (let j = 0; j < l; j++) {
          obj = {};
          obj[i] = q[i][j];
          arr.push(obj);
        }
        query.$and.push({ $or: arr });
      } else {
        obj = {};
        obj[i] = q[i];
        query.$and.push(obj);
      }
    }
  }

  if (query.$and.length === 0) {
    delete query.$and;
  }

  Submission.find(query)
    .sort('-created_at')
    .skip(skip)
    .limit(count)
    .populate('by', '-salt -hashedPassword')
    .execAsync()
    .then(function (items) {
      Submission.countAsync(query)
        .then(function (found) {
          res.status(200).send({ count, found, page, items });
        }).catch(handleError(res));
    }).catch(handleError(res));
};

// Gets a single Submission from the DB
exports.show = function(req, res) {
  Submission.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(checkHasRights(req, res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Submission in the DB
exports.create = function(req, res) {
  req.body.by = req.user._id;
  req.body.created_at = new Date();

  Submission.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .then(() => {
      mailer.send('submission_create_user', { to: req.user.email });

      const obj = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      }

      mailer.send('submission_create_admin', { to: process.env.MAILER_FROM_EMAIL, obj });
    })
    .catch(handleError(res));
};

// Updates an existing Submission in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Submission.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Submission from the DB
exports.destroy = function(req, res) {
  Submission.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
