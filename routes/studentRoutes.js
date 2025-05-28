const express = require("express");
const router = express.Router();

const { registerStudent } = require("../controllers/studentController");
const { route } = require("./userRoutes");

router.post("/register", registerStudent);

router.get();

module.exports = router;
