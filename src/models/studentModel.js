const mongoose = require('mongoose')

//schema replica of document in database
const studentSchema = new mongoose.Schema({
    student_name:{
        type:String,
        required:true
    },
    standard:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('students',studentSchema)