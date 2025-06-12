// models/userModel.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Job = require("./jobModel.js");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["seeker", "recruiter"],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  countryCode : {
    type : Number,
    required : true
  },
  phone: {
    type: Number,
    required: true
  },
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }
  ],
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }
  ]
});

userSchema.plugin(passportLocalMongoose); // adds username, hash, salt, and useful methods

module.exports = mongoose.model("User", userSchema);
