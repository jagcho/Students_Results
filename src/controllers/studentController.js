const studentModel = require("../models/studentModel");


//Api to store Students details in Database
const createStudents = async (req, res) => {
  try {
    const { student_name, standard } = req.body;

    if (!student_name)
      return res
        .status(400)
        .send({ status: false, message: "student_name is required" });

    if (!/^([a-zA-Z]+)$/.test(student_name))
      return res
        .status(400)
        .send({ status: false, message: "student_name is invalid" });

    if (!standard)
      return res
        .status(400)
        .send({ status: false, message: "standard is required" });

    if (!/^[0-9]{1,2}$/.test(standard))
      return res
        .status(400)
        .send({ status: false, message: "standard is invalid" });

    //save
    const student = await new studentModel({
      student_name,
      standard,
    }).save();

    res.status(201).send({
      success: true,
      message: "student saved Successfully",
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in saving",
      error,
    });
  }
};

//Api to get students according to Pagination (filter)
const getStudentByPagination = async (req, res) => {
  try {
    let data = req.query;

    let { student_name, standard, student_id, size , order} = data;

    const filter = {};

    if (student_name) {
      filter.student_name = student_name;
    }

    if (standard) {
      filter.standard = standard;
    }

    if (student_id) {
      filter._id = student_id;
    }

    if (!size) {
      size = 5;
    }
    const limit = parseInt(size);
    const Order =parseInt(order)
    const fetchStudents = await studentModel
      .find(filter)
      .sort({ standard: Order })
      .limit(limit);

    return res.status(201).send({
      size,
      Info: fetchStudents,
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

module.exports = { createStudents ,getStudentByPagination};
