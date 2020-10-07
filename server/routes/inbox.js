const express = require("express");
const router = express.Router();
const inbox = require("inbox");
const { simpleParser } = require("mailparser");

// db schema models

const User = require("../models/User");

// receive email in inbox and then get/render inbox page

router.get("/", (req, res) => {
  User.findOne({ isLoggedIn: true }, (err, user) => {
    if (err) throw err;

    var client = inbox.createConnection(false, user.imapHost, {
      secureConnection: true,
      auth: {
        user: user.email,
        pass: user.password
      }
    });

    console.log("user found and config added");

    client.connect();

    client.on("connect", function() {
      console.log("Connecting to client");
      client.openMailbox("INBOX", function(error, info) {
        if (error) throw error;

        client.listMessages(-100, function(err, messages) {
          if (err) throw err;

          console.log("Listing Messages");

          User.find({}, (err, allUser) => {
            if (err) throw err;

            if (messages && user && allUser) {
              res.render("inbox", {
                mails: messages,
                currentUser: user.email,
                allUser: allUser
              });
            } else {
              res.render("inbox");
            }
          });
        });
      });
    });
  });
});

// open message in inbox

router.post("/openMsg", (req, res) => {
  let uid = req.body.uid;

  User.findOne({ isLoggedIn: true }, (err, user) => {
    var client = inbox.createConnection(false, user.imapHost, {
      secureConnection: true,
      auth: {
        user: user.email,
        pass: user.password
      }
    });
    console.log("user found");

    client.connect();

    client.on("connect", function() {
      console.log("Connecting to client");
      client.openMailbox("INBOX", function(error, info) {
        if (error) throw error;

        client.listMessages(-100, function(err, messages) {
          if (err) console.log(err);

          console.log("Listing Messages");
          let msgStream = client.createMessageStream(uid);
          
          simpleParser(msgStream)
            .then(mail_object => {
              console.log("loading message");
              res.render("inbox", {
                mails: messages,
                mailBody: mail_object
              });
            })
            .catch(err => alert(err));
        });
      });
    });
  });
});

module.exports = router;
