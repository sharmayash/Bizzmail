let mongoose = require("mongoose");

// Schema Setup
let Emails = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
  owner: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("emails", Emails);
