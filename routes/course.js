const express = require('express');
const db = require('../db');
const router = express.Router();
const {Course} = db.models;
const bcrypt = require('bcryptjs');
const auth = require('basic-auth')
const {User} =db.models;
const {check, validationResult} = require('express-validator');

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
router.post('/courses', asyncHandler(userAuthentication),[
  check('title')
    .exists()
    .withMessage('Please provide a value for Title'),
  check('description')
    .exists()
    .withMessage('Please provide a value for Description')
], asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages})
  }
  if (user) {
    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      userId: user.id
    });
    res.location('/courses/' + course.id);
    res.status(201).end();
  } else {
    res.status(401).json({message: 'Sorry, you do not have permission to create a new course'})
  }
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', asyncHandler(userAuthentication), [
  check('title')
    .exists()
    .withMessage('Please provide a value for Title'),
  check('description')
    .exists()
    .withMessage('Please provide a value for Description')
], asyncHandler(async (req, res) => {

  const user = req.currentUser;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({errors: errorMessages})
  }

  const course = await Course.findByPk(req.params.id)
  if (course.userId === user.id) {
    await course.update(req.body)
    res.status(204).end();
  } else {
    res.status(401).json({message: "Sorry, you don't have permission to edit this course"})
  }
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', asyncHandler(userAuthentication), asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  if (course.userId === user.id) {
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(401).json({message: "Sorry, you don't have permission to delete this course"})
  }

}));

module.exports = router;