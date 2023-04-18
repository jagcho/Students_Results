const marksModel = require("../models/marksModel");
const studentModel = require("../models/studentModel");
const mongoose = require("mongoose");

// Api to Store marks in Database
const createmarks = async (req, res) => {
  try {
    const { student_id, subject_name, marks, test_date } = req.body;

    //checks if student_id has valid format

    if (!mongoose.Types.ObjectId.isValid(student_id))
      return res
        .status(400)
        .send({ status: false, message: "student_id is invalid" });

    if (!subject_name)
      return res
        .status(400)
        .send({ status: false, message: "subject_name is required" });

    if (!/^([a-zA-Z]+)$/.test(subject_name))
      return res
        .status(400)
        .send({ status: false, message: "subject_name is invalid" });

    if (!marks)
      return res
        .status(400)
        .send({ status: false, message: "marks is required" });

    if (!/^[0-9]{1,3}$/.test(marks))
      return res
        .status(400)
        .send({ status: false, message: "marks is invalid" });

    if (!test_date)
      return res
        .status(400)
        .send({ status: false, message: "marks is required" });

    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(test_date))
      return res.status(400).send({
        status: false,
        message: "date format should be in YYYY-MM-DD",
      });

    //save
    const student = await new marksModel({
      student_id,
      subject_name,
      marks,
      test_date,
    }).save();

    res.status(201).send({
      success: true,
      message: "marks saved Successfully",
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

// Api to get calculated final results of student.
const getResults = async (req, res) => {
  try {
    let data = req.query;

    let { student_id } = data;

    let filter = {};

    if (student_id) {
      filter.student_id = student_id;
    }

    const fetchResults = await marksModel.find(filter).populate("student_id");

    let collectedMarks = fetchResults.map((ele) => parseInt(ele.marks));

    let totalMarks = collectedMarks.reduce((a, b) => {
      return a + b;
    });

    let percentage = (totalMarks / collectedMarks.length).toFixed(2);
    let percentageSymbol =
      (totalMarks / collectedMarks.length).toFixed(2) + "%";

    let finalResult = {};

    finalResult.student_name = fetchResults[0].student_id.student_name;
    finalResult.percentage = percentageSymbol;

    let Grades = {
      fail: percentage < 35,
      "second-class": percentage > 35 && percentage < 60,
      "first-class": percentage > 60 && percentage < 85,
      distinction: percentage > 85,
    };

    let key = Object.keys(Grades).find((key) => Grades[key] === true);

    finalResult.Class = key;

    let subName = fetchResults.map((ele) => ele.subject_name);
    let marks = fetchResults.map((ele) => ele.marks);

    let marks_Details = {};

    subName.forEach((cur_ele, i) => {
      marks_Details[cur_ele] = marks[i];
      return marks_Details;
    });

    finalResult.marks_Details = marks_Details;

    return res.status(201).send({
      Results: finalResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in fetch",
      error,
    });
  }
};

module.exports = { createmarks, getResults };
