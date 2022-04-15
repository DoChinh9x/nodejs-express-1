const express = require('express');
const Course = require('../models/Course.model');
const advanceResults = require('../middlewares/advanceResults');
const courseController = require('../controllers/course.controller');
const {protect} = require('../middlewares/auth');
const router = express.Router({mergeParams: true});

router.get('/',advanceResults(Course,{
    path:'bootcamp',
    select:'name description'
}),courseController.getCourses);
router.get('/:id',courseController.getCourse);
router.post('/',protect,courseController.addCourse);
router.put('/:id',protect,courseController.updateCourse);
router.delete('/:id',protect,courseController.deleteCourse);

module.exports = router;