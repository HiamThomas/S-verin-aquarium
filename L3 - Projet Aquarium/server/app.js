/**
 * @author Séverin PONCIN
 * @author Charles PTACEK
 */
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { Client } = require("pg");
const fs = require("fs");
let sqlInformation = JSON.parse(fs.readFileSync("./sql-information.json"));
const client = new Client(sqlInformation);
client.connect();

const apiConnexionRouter = require("./routes/api_connection.js")(client);
const apiFishRouter = require("./routes/api_fish.js")(client);
const apiBackgroundRouter = require("./routes/api_backgrounds.js")(client);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "grehjznejzkhgjrez",
    saveUninitialized: false,
    resave: false,
  })
);

app.all("/aquarium/*", function (req, res, next) {
  if (req.session.user !== undefined || req.url.includes("components")) {
    next();
  } else {
    res.status(401).json({ message: "Error not access" });
  }
});

app.use(
  "/aquarium/",
  express.static(path.join(__dirname, "../client/private"))
);

app.use(express.static(path.join(__dirname, "../client/public")));

app.use("/api/", apiConnexionRouter, apiFishRouter, apiBackgroundRouter);

app.all("*", function (req, res, next) {
  res.redirect("/");
});

module.exports = app;
