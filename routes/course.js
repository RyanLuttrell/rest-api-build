const express = require('express');
const db = require('../db');
const router = require = express.Router();
const {Course} = db.models;

// Async/await middleware
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (err) {
        err = new Error();
        err.status = 500;
        err.message = `Looks like the course you requested doesn't exist`;
        next(err);
      }
    };
  }

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();
  res.status(200).json(courses);
}));

// GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  res.status(200).json(course);
}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', asyncHandler(async (req, res) => {
  const course = await Course.create({
    title: req.body.title,
    description: req.body.description,
    estimatedTime: req.body.estimatedTime,
    materialsNeeded: req.body.materialsNeeded
  });
  res.status(201);
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', asyncHandler(async (req, res) => {

}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', asyncHandler(async (req, res) => {

}));

module.exports = router;