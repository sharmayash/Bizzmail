const express = require("express"),
  router = express.Router();

const User = require("../models/User");
const Email = require("../models/Email");

// get index page

// router.get("/", (req, res) => {
//   res.render("sent");
// });

// find all mails --- sent route

router.get("/", (req, res) => {
  User.findOne({ isLoggedIn: true }, (err, user) => {
    if (err) throw err;

    User.find({}, (err, allUser) => {
      if (err) throw err;

      Email.find({}, (err, mails) => {
        if (err) throw err;

        if (user && allUser && mails) {
          res.render("sent", {
            mails: mails,
            currentUser: user.email,
            allUser: allUser
          });
        } else {
          res.render("sent");
        }
      });
    });
  });
});

module.exports = router;
