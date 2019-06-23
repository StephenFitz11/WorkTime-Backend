const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    minlength: 3,
    maxlength: 255
  },
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true
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
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true
  },
  phone: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 255,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  loginCount: {
    type: Number,
    required: true
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client"
    }
  ],
  parentCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  startDate: Date,
  dayRate: {
    type: Number,
    min: 0,
    max: 50000,
    required: function() {
      if (this.userType === "Employee") {
        return true;
      }
      return false;
    }
  }
});

// TODO: Change the token timer before production.

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      userType: this.userType,
      parent: this.parentCompany,
      name: this.firstName
    },
    config.get("jwtPrivateKey"),
    { expiresIn: 36000000 }
  );
  return token;
};

// TODO: Connect this to gmail.
userSchema.methods.emailNewUser = async function(email, type, msg) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  // Switch case type sends:
  // 1 = Account created
  // 2 = Email Changed
  // 3 = Password Changed
  msg = msg || "";
  switch (type) {
    case 1:
      var info = await transporter.sendMail({
        from: "WorkTime@noreply.com",
        to: email,
        subject: "Account created",
        text: "Your account has been created! Please login." + msg
      });
      break;
    case 2:
      var info = await transporter.sendMail({
        from: "WorkTime@noreply.com",
        to: email,
        subject: "Account changed",
        text: "You email has been changed on your WorkTime Account"
      });
      break;
    case 3:
      var info = await transporter.sendMail({
        from: "WorkTime@noreply.com",
        to: email,
        subject: "Account changed",
        text: "You password has been changed on your WorkTime Account"
      });
      break;
    default:
      break;
  }

  console.log("Email Sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

const User = mongoose.model("user", userSchema);

module.exports = User;
