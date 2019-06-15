const mongoose = require("mongoose");

const clientschema = new mongoose.Schema({
  clientCompanyName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true
  },
  aliasName: {
    type: String,
    minlength: 3,
    maxlength: 255
  },
  parentCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  contact: {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 255
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true
    },
    phone: {
      type: String,
      minlength: 3,
      maxlength: 255,
      default: ""
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 255
    },
    address: {
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
      country: {
        type: String,
        default: ""
      }
    }
  },
  projects: {
    type: [
      new mongoose.Schema({
        projectName: {
          type: String,
          minlength: 2,
          maxlength: 255,
          default: ""
        },
        projectBillRate: {
          type: Number,
          min: 0
        }
      })
    ]
  }
});

module.exports = Client = mongoose.model("client", clientschema);
