let mongoose = require("mongoose");

// Schema Setup
let Users = new mongoose.Schema({
  email: String,
  password: String,
  imapHost: String,
  smtpHost: String,
  sentMails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "emails"
    }
  ],
  inboxMails: Array,
  isLoggedIn: Boolean
});

module.exports = mongoose.model("users", Users);
