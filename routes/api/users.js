const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { check, validationResult, body } = require("express-validator/check");
const auth = require("../../middleware/auth");

const User = require("../../models/Users");

router.post(
  "/",
  [check("email", "Please enter a valid email address!").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("That email has already been registered.");
    }

    const {
      companyName,
      firstName,
      lastName,
      phone,
      email,
      password
    } = req.body;

    var user = new User({
      companyName,
      firstName,
      lastName,
      phone,
      email,
      password,
      userType: "Company",
      loginCount: 0,
      startDate: Date.now()
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = user.generateAuthToken();

    user.emailNewUser(user.email, 1);

    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(token);
  }
);

router.put("/", auth, async (req, res) => {
  const { companyName, firstName, lastName, address, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      companyName: companyName,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phone: phone
    },
    {
      new: true
    }
  );

  if (!user) {
    return res.status(404).send("Invalid token for operation");
  }

  res.send(_.pick(user, "_id"));
});

router.put(
  "/changeEmail",
  [check("email", "Email is not a valid email.").isEmail()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send("Invalid token for operation");
    }

    if (email === user.email) {
      return res
        .status(404)
        .send("The new email and the old email are the same.");
    }

    const userCheck = await User.findOne({ email: email });
    if (userCheck) {
      return res.status(404).send("An account with that email already exists");
    }

    user.email = email;
    user.emailNewUser(email, 2);

    result = await user.save();

    res.json(result);
  }
);

// TODO: Implement error if newPassword and current password are the same
//  Learn more about bcrypt
router.put(
  "/changePassword",
  [
    check("newPassword", "Password must be 8 characters long").isLength({
      min: 8
    })
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, newPassword } = req.body;

    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("Invalid token for operation");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Current password is not correct.");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.send("Password sucessfully changed");
  }
);

module.exports = router;
