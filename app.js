const express = require("express");
const path = require("path");
const fs = require("fs");
const Contact = require("./models/contact");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const Register = require("./models/userRegister");
const { request } = require("http");
const { response } = require("express");
const Location = require("./models/location");
const Getacab = require("./models/getacab");
mongoose.connect("mongodb://localhost/cab", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
const app = express();
const port = 80;

app.use("/static", express.static("static"));
app.use(express.urlencoded());

//PUG SPECIFIC STUFF
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// GET REQUEST
app.get("/home", (req, res) => {
  const params = {};
  res.status(200).render("home.pug", params);
});
app.get("/", (req, res) => {
  const params = {};
  res.status(200).render("index.pug", params);
});

app.get("/contact", (req, res) => {
  const params = {};
  res.status(200).render("contact.pug", params);
});
app.get("/register", (req, res) => {
  const params = {};
  res.status(200).render("register.pug", params);
});

app.get("/login", (req, res) => {
  const params = {};
  res.status(200).render("login.pug", params);
});
app.get("/dashboard", (req, res) => {
  const params = {};
  res.status(200).render("dashboard.pug", params);
});
app.get("/getacab", function (req, res) {
  Location.fetchData(function (data) {
    // console.log(data);
    res.render("getacab.pug", { locationList: data });
  });
});
app.get("/bookingrequest", function (req, res) {
  Getacab.fetchData(function (data) {
    // console.log(data);
    res.render("bookingreq.pug", { getacabList: data });
  });
});




app.get("/booking/approve", async (req, res) => {
  console.log(req.query.id);
  const booking = await Getacab.get.findByIdAndUpdate(
    req.query.id,
    { status: true },
    function (err, data) {
      if (err) throw err;
      else console.log("updated data : ", data);
    }
  );
  console.log(booking);
  res.redirect('/bookingrequest');
});

app.get("/booking/reject", async (req, res) => {
  console.log(req.query.id);
  const booking = await Getacab.get.findByIdAndUpdate(
    req.query.id,
    { status: false },
    function (err, data) {
      if (err) throw err;
      else console.log("updated data : ", data);
    }
  );
  console.log(booking);
  res.redirect('/bookingrequest');
});





// POST REQUEST

app.post("/contact", (req, res) => {
  var myData = new Contact(req.body);
  myData
    .save()
    .then(() => {
      res.render("contact.pug");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
app.post("/getacab", (req, res) => {
  var myBooking = new Getacab.get(req.body);
  console.log(myBooking);
  myBooking.save();

  Location.fetchData(function (data) {
    // console.log(data);
    res.render("getacab.pug", { locationList: data });
  });
});

app.post("/register", async (req, res) => {
  const user = await Register.findOne({ email: req.body.email });
  if (!user) {
    var myData = new Register(req.body);
    console.log(myData);
    myData
      .save()
      .then(() => {
        res.render("login.pug");
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } else {
    res.send("User Exists");
  }
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.choice;
    if (role === "admin") {
      // if (password === 'wheelbox007' && email === 'admin@wheelbox') {
      if (password === "" && email === "") {
        res.render("dashboard.pug");
      } else {
        res.render("error404.pug");
      }
    } else {
      const user = await Register.findOne({ email: email });
      if (password === user.password) {
        res.render("home.pug");
      } else {
        res.render("error404.pug");
      }
    }
  } catch (err) {
    res.render("error404.pug");
  }
});

app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
