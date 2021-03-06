const Course = require('../models/Course.model');
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp.model');


const courseController = {
    //GET api/v1/courses
    //GET api/v1/bootcamp/:bootcampId/courses
    getCourses : asyncHandler(async(req,res,next)=>{
        if(req.params.bootcampId){
            const courses= await Course.find({bootcamp: req.params.bootcampId});
            res.status(200).json({
                success: true,
                count: courses.length,
                data: courses
            });
        }else {
            res.status(200).json(res.advanceResults);
        }
    }),
    //GET single course
    //GET api/v1/course/:id
    getCourse : asyncHandler(async(req,res,next)=>{
        const course= await Course.findById(req.params.id).populate({
                path:'bootcamp',
                select:'name description'
            });
        if(!course){
            return next(new ErrorResponse(`No course with the id ${req.params.id}`),404);
        }
        res.status(200).json({
            success: true,
            data: course
        });
    }),
    //POST add course
    //POST api/v1/bootcamp/:bootcampId/courses
    // private
    addCourse : asyncHandler(async(req,res,next)=>{
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if(!bootcamp){
            return next(new ErrorResponse(`No course with the id ${req.params.bootcampId}`),404);
        }

        //make sure user is course owner
        if(bootcamp.user.toString()!== req.user.id&&req.user.role !=='admin'){
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to 
            bootcamp ${bootcamp._id}`),401);
        };

        const course = await Course.create(req.body)
        res.status(200).json({
            success: true,
            data: course
        });
    }),
    //POST updatecourse
    //PUT api/v1/courses:id
    // private
    updateCourse : asyncHandler(async(req,res,next)=>{
        let course = await Course.findById(req.params.id);
        if(!course){
            return next(new ErrorResponse(`No course with the id ${req.params.id}`),404);
        }
        //make sure user is course owner
        if(course.user.toString()!== req.user.id&&req.user.role !=='admin'){
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update the course to 
            bootcamp ${bootcamp._id}`),401);
        }

        course = await Course.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: course
        });
    }),
    //DELETE updatecourse
    //DELETE api/v1/courses:id
    // private
    deleteCourse : asyncHandler(async(req,res,next)=>{
        const course = await Course.findById(req.params.id);
        if(!course){
            return next(new ErrorResponse(`No course with the id ${req.params.id}`),404);
        }
         //make sure user is course owner
         if(course.user.toString()!== req.user.id&&req.user.role !=='admin'){
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete the course to 
            bootcamp ${bootcamp._id}`),401);
        }
        await course.remove();
        res.status(200).json({
            success: true
        });
    }),
};
module.exports = courseController;