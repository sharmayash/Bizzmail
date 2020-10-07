const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const cheerio = require("cheerio");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
const { check, validationResult } = require("express-validator");

// db schema models

const User = require("../models/User");
const Email = require("../models/Email");

// get index page

router.get("/", (req, res) => {
  User.find({}, (err, allUser) => {
    if (err) console.log("no user exist"); // no user exist

    // if user exist then find one whose's logged in

    User.findOne({ isLoggedIn: true }, (err, user) => {
      if (err) throw err; // no any user is logged in
      // else send logged in user
      if (user && allUser) {
        res.render("index", {
          currentUser: user.email,
          allUser: allUser
        });
      } else {
        res.render("index");
      }
    });
  });
});

// compose or send email routes using nodemailer

router.post(
  "/",
  [
    check("emailTo")
      .isEmail()
      .withMessage("Email Not Correct"),
    check("subject")
      .isLength({ min: 1 })
      .withMessage("Subject is Empty"),
    check("message")
      .isLength({ min: 1 })
      .withMessage("Message is Empty")
  ],
  (req, res) => {
    let { subject, emailTo, message } = req.body;

    var output;

    if (message.includes("img")) {
      const $ = cheerio.load(message);
      $("img").addClass("responsive-img");
      output = $.html();
    } else {
      output = message;
    }

    User.find({}, (err, allUser) => {
      if (err) throw err;

      User.findOne({ isLoggedIn: true }, (err, user) => {
        if (err) throw err;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).render("index", {
            mssg: errors.array()[0].msg,
            currentUser: user.email,
            allUser: allUser
          });
        }

        let newMail = {
          email: emailTo,
          subject: subject,
          message: output,
          owner: user._id
        };

        let transporter = nodemailer.createTransport({
          service: "gmail",
          host: user.smtpHost,
          // port: 587,
          // secure: false,
          auth: {
            user: user.email,
            pass: user.password
          }
        });

        transporter.use("compile", inlineBase64({ cidPrefix: "inlineImg" }));

        let mailOptions = {
          from: user.email, // sender address
          to: emailTo, // list of receivers
          subject: subject, // Subject line
          html: output // html body
        };

        transporter.sendMail(mailOptions, (err, success) => {
          if (err)
            res.render("index", {
              mssg: err,
              currentUser: user.email,
              allUser: allUser
            });

          // send mail data to database

          Email.create(newMail, (err, newEmail) => {
            if (err) {
              console.log(`db not connected
            ${err}
            `);
            } else {
              User.findOne({ isLoggedIn: true })
                .populate("sentMails")
                .exec((err, userUpdate) => {
                  if (err) console.log(err);
                  userUpdate.sentMails.push(newEmail);
                  userUpdate.save();
                });
              res.render("index", {
                mssg: `Last e-mail sent to ${emailTo}`,
                currentUser: user.email,
                allUser: allUser
              });
            }
          });
        });
      });
    });
  }
);

// add user to db

router.post("/newuser", (req, res) => {
  const { userEmail, ePass, hostName, hostName2 } = req.body;

  const newUser = {
    email: userEmail,
    password: ePass,
    imapHost: hostName,
    smtpHost: hostName2,
    isLoggedIn: true
  };

  // first remove the default user
  User.updateMany({}, { isLoggedIn: false }, (err, allUser) => {
    if (err) throw err;

    console.log("Adding New User");
  });

  // Add a user to db

  User.create(newUser, err => {
    if (err) throw err;

    console.log("New User Added");
    res.redirect("/");
  });
});

// set Default User

router.post("/setDefault", (req, res) => {
  let badgeId = req.body.id;

  User.updateMany({}, { isLoggedIn: false }).then(() => {
    User.findById(badgeId, (err, updatedUser) => {
      if (err) console.log(err);

      updatedUser.isLoggedIn = true;
      updatedUser.save(() =>
        res.send(`Default User set to: ${updatedUser.email}`)
      );
    });
  });
});

// remove a user

router.post("/removeUser", (req, res) => {
  let userId = req.body.id;

  User.findByIdAndRemove(userId, (err, removedUser) => {
    if (err) console.log(err);

    res.send(`${removedUser.email} is removed .`);
  });
});

module.exports = router;
