const Review = require('../models/Review.model');
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp.model');


    //GET api/v1/reviews
    //GET api/v1/bootcamp/:bootcampId/reviews
    exports.getReviews = asyncHandler(async(req,res,next)=>{
        if(req.params.bootcampId){
            const reviews = await Review.find({bootcamp: req.params.bootcampId});
            res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        }else {
            res.status(200).json(res.advanceResults);
        }
    });
    //single review
    //GET api/v1/reviews/:id
    exports.getReview = asyncHandler(async(req,res,next)=>{
        const review = await Review.findById(req.params.id).populate({
            path:'bootcamp',
            select: 'name description'
        });
        if(!review){
            return next(new ErrorResponse(`No review found with the id ${req.params.id}`,404));
        }

        res. status(200).json({
            success:true,
            data:review
        })
    });
    //add review
    //POST api/v1/bootcamp/:bootcampId/reviews
    //Private
    exports.addReview = asyncHandler(async(req,res,next)=>{
        req.body.bootcamp = req.params.bootcampId;

        req.body.user = req.user.id;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if(!bootcamp){
            return next(new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`))
        }
        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        })
    });