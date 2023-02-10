const express = require("express"); //modul express
const app = express(); //function express
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const fs = require("fs");
const fungsi = require("./fungsi");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

//Get data from JSON
// app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Method Override
app.use(methodOverride("__method"));
//Lib body parser

//Flash & Session
app.use(flash());
app.use(
  session({
    secret: "rizkir",
    saveUninitialized: true,
    resave: true,
  })
);

// Miiddleware Third-Party Morgan
app.use(morgan("dev"));

// Middleware xpress Static
app.use(express.static("public"));

//Set modul expressLayouts
app.use(expressLayouts);
app.set("layout", "./layout/fullLayout");

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

//set EJS
app.set("view engine", "ejs");

// '/' meaning root
app.get("/", (req, res) => {
  // res.send('Hello World!')
  res.render("index", {
    pageName: "Home Page",
  });
});

//memanggil halaman contact
app.get("/contact", (req, res) => {
  // console.log(contact);
  // res.send('<h1> Halaman contact </h1>');
  const contact = JSON.parse(fs.readFileSync("./contacts.json", "utf-8"));
  res.render("contact", {
    contact,
    pageName: "Contact Page",
    message: req.flash("message"),
  });
});

//memanggil halaman create
app.get("/createContact", (req, res) => {
  res.render("createContact", {
    pageName: "Create Contact Page",
    message: req.flash("message"),
    oldData: req.flash("oldData"),
  });
});

//Memanggil halaman detailContact dengan ID name
app.get("/detailContact/:name", (req, res) => {
  const name = req.params.name;
  const contact = JSON.parse(fs.readFileSync("./contacts.json", "utf-8"));
  const detail = contact.find(
    (contact) => contact.name.toUpperCase() === name.toUpperCase()
  );
  res.render("detailContact", {
    pageName: "Detail Contact",
    detail,
  });
});

//memanggil halaman about
app.get("/about", (req, res) => {
  // res.send('<h1> Halaman About </h1>');
  res.render("about", {
    pageName: "About Page",
  });
});

//Memanggil Halaman Edit Berdasarkan Nama
app.get("/editContact/:name", (req, res) => {
  const contact = fungsi.getDataByName(req.params.name);
  res.render("editContact", {
    contact,
    pageName: "Edit Contact",
    message: req.flash("message"),
    oldData: req.flash("oldData"),
  });
});

//Melakukan Update
app.put("/editContact", (req, res) => {
  fungsi.update(
    req,
    res,
    req.body.oldName,
    req.body.name,
    req.body.email,
    req.body.mobile
  );
});

//Add Data Contact
app.post("/createContact", (req, res) => {
  fungsi.create(req, res, req.body.name, req.body.email, req.body.mobile);
  // console.log(req.body.name);
  res.redirect("contact");
});

//Delete Data Contact
app.get("/contact/deleted/:name", (req, res) => {
  console.log(req.params.name);
  fungsi.delData(req.params.name);
  res.redirect("/contact");
});

// app.get("/contact/delete/:name", (req, res) => {
//   // fungsi.delData(res, req.body.name);
//   // res.redirect("contact");
//   console.log(req.params.name);
// });

app.use("/", (req, res, next) => {
  res.status(404);
  res.send("Page Not Foung: 404");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
