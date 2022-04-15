const express = require('express');
const advanceResults = require('../middlewares/advanceResults');
const Review = require('../models/Review.model');
const {protect,authorize} = require('../middlewares/auth');
const { getReviews, getReview, addReview } = require('../controllers/review.controller');
const router = express.Router({mergeParams: true});


router.get('/',advanceResults(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews);

router.get('/:id',getReview);
router.post('/',protect,authorize('admin','user'),addReview);

module.exports = router;