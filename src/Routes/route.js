const express=require('express');
const { createStudents, getStudentByPagination } = require('../controllers/studentController');
const { createmarks, getResults } = require('../controllers/marksController');

//router instance from express
const router=express.Router()


//Routes with endpoints
router.post('/student',createStudents);

router.post('/marks',createmarks);

router.get('/students',getStudentByPagination);

router.get('/fetch_results',getResults)





module.exports = router