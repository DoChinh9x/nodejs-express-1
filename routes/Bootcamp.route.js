const express = require('express');
const bootcampController = require('../controllers/Bootcamp.controller');
const courseRouter = require('./course.route');
const reviewRouter = require('./review.route');
const Bootcamp = require('../models/Bootcamp.model');
const advanceResults = require('../middlewares/advanceResults');
const {protect,authorize} = require('../middlewares/auth');
const router = express.Router();


router.get('/', advanceResults(Bootcamp,'courses'), bootcampController.getBootcamps);
router.get('/:id',bootcampController.getBootcamp);
router.post('/',protect,authorize('publisher','admin'),bootcampController.creatBootcamp);
router.put('/:id',protect,authorize('publisher','admin'),bootcampController.updateBootcamp);
router.delete('/:id',protect,bootcampController.deleteBootcamp);
router.put('/:id/photo',protect,authorize('publisher','admin'),bootcampController.bootcampPhotoUpload);

router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',reviewRouter);


module.exports = router;