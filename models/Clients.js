const mongoose = require("mongoose");

const clientschema = new mongoose.Schema({
  clientCompanyName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true
  },
  parentCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  email: String,
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  zip: {
    type: String,
    default: ""
  },
  billRate: {
    type: Number,
    required: true,
    min: 0,
    max: 2167202
  },
  description: {
    type: String,
    maxlength: 40000
  }
});

module.exports = Client = mongoose.model("client", clientschema);
