module.exports = () => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const mongoose = require("mongoose");

  const app = express();

  // middlewares

  mongoose.connect("mongodb://localhost/bizzmail", { useNewUrlParser: true });
  mongoose.set("useFindAndModify", false);
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/views/");
  app.use(express.static(__dirname + "/public"));

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: false,
      parameterLimit: 50000
    })
  );

  // require routes

  let homeRoute = require("./routes/compose");
  let sentRoute = require("./routes/sent");
  let inboxRoute = require("./routes/inbox");

  app.use("/", homeRoute);
  app.use("/sent", sentRoute);
  app.use("/inbox", inboxRoute);

  // listen to server

  let port = 3001 || process.env.PORT;

  app.listen(port, () => console.log(`server started on port ${port}`));
};
