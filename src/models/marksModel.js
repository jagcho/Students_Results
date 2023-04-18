const mongoose = require('mongoose')

//schema replica of document in database
const marksSchema = new mongoose.Schema({
    student_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"students"
    },
    subject_name:{
        type:String,
        required:true
    },
    marks:{
        type:String,
        required:true
    },
    test_date:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('marks',marksSchema)