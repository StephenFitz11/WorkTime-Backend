const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult, body } = require("express-validator/check");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const generator = require("generate-password");
const company = require("../../middleware/company");
const auth = require("../../middleware/auth");

const User = require("../../models/Users");

router.get("/:id", [auth, company], async (req, res) => {
  try {
    const employee = await User.findById(req.params.id || req.user._id)
      .populate("clients", ["clientCompanyName"])
      .select("-password");
    res.send(employee);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.get("/", [auth, company], async (req, res) => {
  results = await User.find({ parentCompany: req.user._id }).select(
    "-password"
  );

  if (!results) {
    return res.status(404).send("No employees found");
  }
  res.send(results);
});

const checkArray = [
  check("email", "Please enter a valid email address!").isEmail()
];

router.post("/", checkArray, [auth, company], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("That email has already been registered.");
  }

  const {
    companyName,
    firstName,
    lastName,
    address,
    phone,
    email,
    dayRate,
    description,
    clients
  } = req.body;

  // TODO: DELETE BEFORE PRODUCTION
  const password = "password";

  // TODO: ENABLE BEFORE PRODUCTION
  // const password = generator.generate({
  //   length: 10,
  //   numbers: true,
  //   uppercase: true
  // });

  console.log(password);

  let newUser = new User({
    companyName,
    firstName,
    lastName,
    address,
    phone,
    email,
    password,
    description,
    dayRate,
    startDate: Date.now(),
    userType: "Employee",
    loginCount: 0,
    parentCompany: req.user._id,
    clients
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  await newUser.save();

  msg =
    "Your temporary login password is:  " +
    password +
    " please change your password in the account settings";
  newUser.emailNewUser(email, 1, msg);

  res.send(
    _.pick(
      newUser,
      "_id",
      "companyName",
      "firstName",
      "loginCount",
      "parentCompany"
    )
  );
});

router.put("/", [auth, company], async (req, res) => {
  const {
    empId,
    companyName,
    firstName,
    lastName,
    phone,
    email,
    dayRate,
    description,
    clients
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(empId)) {
    return res.status(400).send("Object IDs are not valid");
  }

  const user = await User.findOneAndUpdate(
    { _id: empId },
    {
      companyName,
      firstName,
      lastName,
      phone,
      email,
      dayRate,
      description,
      clients
    }
  );

  if (!user) {
    return res.status(404).send("Cannot find user by that ID");
  }

  res.send(user);
});

router.delete("/:id", [auth, company], async (req, res) => {
  console.log(req.params.id);

  const user = await User.findOneAndRemove({ _id: req.params.id });
  if (!user) {
    return res.status(404).send("User with that ID not found");
  }

  res.json(user);
});

module.exports = router;
