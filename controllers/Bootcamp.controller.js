const path = require('path');
const Bootcamp = require('../models/Bootcamp.model');
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse');
const { resolveSoa } = require('dns');

const bootcampController = {
    getBootcamps : asyncHandler(async(req,res,next)=>{

        res.status(200).json(res.advanceResults);
     
    }),
    getBootcamp : asyncHandler(async(req,res,next)=>{
            const bootcamp = await Bootcamp.findById(req.params.id)
            if(!bootcamp){
                return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
            }
            res.status(200).json(bootcamp);
        
    }),
    creatBootcamp : asyncHandler(async(req,res,next)=>{
        //Add user to req.body
        req.body.user = req.user.id;

        //Check for published bootcamp
        const publishedBootcamp= await Bootcamp.findOne({user: req.user.id});

        //if the user is not an admin, they can only add one bootcamp
        if(publishedBootcamp && req.user.role !== 'admin'){
            return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`,400));
        }

        const bootcamp = await Bootcamp.create(req.body);

        res.status(200).json(bootcamp);
            
    }),
    updateBootcamp: asyncHandler(async(req,res,next)=>{
        let bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
                return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }

        //make suer user is bootcam owner
        if(bootcamp.user.toString()!== req.user.id&&req.user.role !=='admin'){
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`));
        }

        bootcamp = await Bootcamp.findOneAndUpdate(req.params.id,req.body,{
            run: true,
            runValidators: true
    });
            
        res.status(200).json(bootcamp);
    }),
    deleteBootcamp: asyncHandler(async(req,res,next)=>{  
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
                return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }

        //make suer user is bootcam owner
        if(bootcamp.user.toString()!== req.user.id&&req.user.role !=='admin'){
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`));
        }

        bootcamp.remove();
        res.status(200).json({success: true});
    }),

    // Uploadfile for bootcamp
    bootcampPhotoUpload: asyncHandler(async(req,res,next)=>{  
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        //make suer user is bootcam owner
        if(bootcamp.user.toString()!== req.user.id&&req.user.role !=='admin'){
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`));
        }

        if(!req.files){
            return next(new ErrorResponse(`Please upload a file`,404));
        }

        const file = req.files.file;

        //Make sure the file is a photo
        if(!file.mimetype.startsWith('image')){
            return next(new ErrorResponse(`Please upload an image file`,404));
        }

        //Check file size
        if(file.size> process.env.MAX_FILE_UPLOAD){
            return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`,404));
        }

        //Create custom file name
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
            if(err){
                console.log(err);
                return next(new ErrorResponse( `Problem with file upload`,500))
            }
            await Bootcamp.findByIdAndUpdate(req.params.id),{
                photo: file.name
            }

            res.status(200).json({
                success:true,
                data: file.name
            })
        });
    })

};

module.exports = bootcampController;

