const express = require('express');
const db = require('../db');
const router = require = express.Router();
const {Course} = db.models.Course;

// Async/await middleware
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (err) {
        err = new Error();
        err.status = 500;
        err.message = `Looks like the book you requested doesn't exist`;
        next(err);
      }
    };
  }

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {

}));

// GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {

}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', asyncHandler(async (req, res) => {

}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', asyncHandler(async (req, res) => {

}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', asyncHandler(async (req, res) => {

}));

module.exports = router;