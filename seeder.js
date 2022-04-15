const fs = require('fs');
const mongoose =require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env'});

//Load models 
const Bootcamp = require('./models/Bootcamp.model');
const Course = require('./models/Course.model');
const User = require('./models/user.model');
const Review = require('./models/Review.model');



//connect to DB
mongoose.connect('mongodb://localhost:27017/courses');

//read JSON files

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'));




//Import into DB
const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);



        console.log('data imported');
        process.exit();
    } catch (error) {
        console.log(error);
        
    }
}

//delete data
const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();


        console.log('data deleted');
        process.exit();
    } catch (error) {
        console.log(error);
        
    }
}

if(process.argv[2]=== '-i'){
    importData();

}else if(process.argv[2]==='-d'){
    deleteData();
}