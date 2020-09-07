const express = require('express');
const db = require('../db');
const router = express.Router();
const {User} = db.models;
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const {check, validationResult} = require('express-validator');

// Async/await middleware
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (err) {
        err = new Error();
        err.status = 500;
        err.message = `Looks like the user you requested doesn't exist`;
        next(err);
      }
    };
  }

  const userAuthentication = async (req, res, next) => {
    let message = null;
    const credentials = auth(req);
    if (credentials) {
      const user = await User.findOne({
        where: {
          emailAddress: credentials.name
        }
      })
      const password = user.password;
      if (user) {
        const authenticated = bcrypt
          .compareSync(credentials.pass, password)
        
        if (authenticated) {
          req.currentUser = user
        }  else {
          message = `Authentication failure for Username: ${credentials.name}`
        }
      } else {
        message = `User not found for Username: ${credentials.name}`
      }
    } else {
      message = 'Auth header not found';
    }

    if (message) {
      console.warn(message)

      res.status(401).json({message: 'Access Denied'})
    } else {
      next();
    }
  }


// GET /api/users 200 - Returns the currently authenticated user
router.get('/users',asyncHandler(userAuthentication), asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json(user)
}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', [
  check('firstName')
    .exists()
    .withMessage('Please provide a value for First Name'),
  check('lastName')
    .exists()
    .withMessage('Please provide a value for Last Name'),
  check('emailAddress')
    .exists()
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists()
    .withMessage('Please provide a value for Password')
], asyncHandler(async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages})
  }

  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10)
  await User.create(user)
  res.location('/');
  res.status(201).end();
}));

module.exports = router