const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect("mongodb://localhost:27017/courses");
            // userNewUrlParse : true,
            // userCreatIndex: true,
            // userFindAndModify: false,
            // userUnifiedTopology: true
        console.log('Connect successfully!'.green.bold);
    } catch (error) {
        console.log("Connect fail...");
    }
};

module.exports = {connect};