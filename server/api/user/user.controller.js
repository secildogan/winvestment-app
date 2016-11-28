'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
var _ = require('lodash');
var mailer = require('../../components/mailer');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
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

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
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

/**
 * Get list of users
 * restriction: 'admin'
 */
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

  User.find(query, '-salt -hashedPassword')
    .skip(skip)
    .limit(count)
    .populate('by')
    .execAsync()
    .then(function (items) {
      User.countAsync(query)
        .then(function (found) {
          res.status(200).send({ count, found, page, items });
        }).catch(handleError(res));
    }).catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.created_at = new Date();
  newUser.saveAsync()
    .spread(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
      const obj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
      }

      mailer.send('user_signup', { to: req.body.email, obj });
      res.json({ token: token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

// Updates an existing User in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  User.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};


// Updates an existing User in the DB
exports.updateSelf = function(req, res) {
  User.findByIdAsync(req.user._id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(function() {
            const obj = {
              email: req.user.email,
              password: newPass
            }

            mailer.send('user_change_password', { to: req.user.email, obj });
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -hashedPassword')
    .then(function(user) { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
