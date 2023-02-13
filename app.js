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

//call database
const pool = require("./db");

//membuat req body diterima dalam bentuk data JSON
app.use(express.json());

//insert data ke database
app.get("/addasync", async (req, res) => {
  try {
    const name = "Rizki";
    const email = "rizkir@gmail.com";
    const mobile = "081563965621";
    const newCont = await pool.query(
      `INSERT INTO contacts values ('${name}','${email}' , '${mobile}') RETURNING *`
    );
    res.json(newCont);
  } catch (err) {
    console.log(err.message);
  }
});

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
  res.render("index", {
    pageName: "Home Page",
  });
});

//memanggil halaman contact
app.get("/contact", async (req, res) => {
  const contact = await pool.query("SELECT * FROM contacts ORDER BY name ASC");
  res.render("contact", {
    contact: contact.rows,
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
app.get("/detailContact/:name", async (req, res) => {
  const name = req.params.name;
  const detail = await pool.query(
    `SELECT * FROM contacts WHERE name = '${name.toLowerCase()}' `
  );

  res.render("detailContact", {
    pageName: "Detail Contact",
    detail: detail.rows[0],
  });
});

//memanggil halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    pageName: "About Page",
  });
});

//Memanggil Halaman Edit Berdasarkan Nama
app.get("/editContact/:name", async (req, res) => {
  const contact = await fungsi.getDataByName(req.params.name);
  res.render("editContact", {
    contact: contact,
    pageName: "Edit Contact",
    message: req.flash("message"),
    oldData: req.flash("oldData"),
  });
});

//Melakukan Update
app.put("/editContact", async (req, res) => {
  await fungsi.update(
    req,
    res,
    req.body.oldName,
    req.body.name,
    req.body.email,
    req.body.mobile
  );
});

//Add Data Contact
app.post("/createContact", async (req, res) => {
  fungsi.create(req, res, req.body.name, req.body.email, req.body.mobile);
});

//Delete Data Contact
app.get("/contact/deleted/:name", async (req, res) => {
  await fungsi.delData(req, res, req.params.name);
});

app.use("/", (req, res, next) => {
  res.status(404);
  res.send("Page Not Foung: 404");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
