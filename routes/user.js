const express = require('express');
const db = require('../db');
const router = express.Router();
const {User} = db.models;

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

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', asyncHandler(async (req, res) => {
  const user = await User.findAll();
  res.json({user})
}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res) => {

}));

module.exports = router