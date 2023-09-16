const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { expressjwt: exjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");
const userroutes = require("./routes/userroute");

const app = express();
const PORT = 3000;

require("dotenv").config();
const mongoose = require("mongoose");
const mongoString = process.env.URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const jwtMW = exjwt({
  secret: "keyboard cat 4 ever",
  algorithms: ["HS256"],
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/hello", (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send("<h1>Hello!</h1>");
});
app.post("/signup", userroutes.signup);
app.post("/login", userroutes.login);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
