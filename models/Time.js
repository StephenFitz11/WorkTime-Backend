const mongoose = require("mongoose");

const billedtimeSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  timeMins: {
    type: Number,
    required: true,
    min: 0
  },
  date: Date,
  description: { type: String, maxlength: 400 }
});

module.exports = Time = mongoose.model("time", billedtimeSchema);
