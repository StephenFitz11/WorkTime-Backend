const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");

const Time = require("../../models/Time");

router.get("/", auth, async (req, res) => {
  var time = {};
  var empTime = req.query.empTime;
  if (empTime) {
    time = await Time.find({ user: req.user._id })
      .populate("client", "clientCompanyName")
      .populate("user", ["firstName", "lastName"]);
  } else {
    time = await Time.find({ parent: req.user._id })
      .populate("client", "clientCompanyName")
      .populate("user", ["firstName", "lastName"]);
  }

  res.send(time);
});

router.post("/", auth, async (req, res) => {
  const { client, parent, timeMins, date, description } = req.body;
  const newTime = new Time({
    parent,
    user: req.user._id,
    client,
    timeMins,
    date,
    description
  });
  await newTime.save();
  res.send(newTime);
});

module.exports = router;
