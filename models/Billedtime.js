const mongoose = require("mongoose");

const billedtimeSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client"
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  timeworked: {
    type: Number,
    required: true,
    min: 0
  },
  expenses: [
    {
      expense: {
        type: Number,
        min: 0
      },
      note: {
        type: String,
        minlength: 2,
        maxlength: 255,
        default: ""
      }
    }
  ]
});

module.exports = Billedtime = mongoose.model("billedtime", billedtimeSchema);
