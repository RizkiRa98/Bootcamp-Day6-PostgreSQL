const fs = require("fs");
const validator = require("validator");
const session = require("express-session");
const flash = require("connect-flash");

//fungsi create
const create = (req, res, name, email, mobile) => {
  const contact = {
    name,
    email,
    mobile,
  };
  const message = [];
  const data = JSON.parse(fs.readFileSync("./contacts.json", "utf-8"));
  const cek = data.find(
    (contact) => contact.name.toUpperCase() === name.toUpperCase()
  );
  if (cek) {
    message.push({ message: "Nama Sudah Terdaftar Di Dalam Kontak" });
    // console.log("Nama Sudah Terdaftar Di Dalam Kontak");
    // return false;
  }

  if (email) {
    if (!validator.isEmail(email)) {
      message.push({
        message: "Format Email Salah!",
      });
    }
  }
  if (mobile) {
    if (!validator.isMobilePhone(mobile, "id-ID")) {
      message.push({
        message: "Format Mobile Phone Salah! Gunakan format 08",
      });
    }
  }

  const oldData = {
    name,
    email,
    mobile,
  };
  if (message.length) {
    req.flash("message", message);
    req.flash("oldData", oldData);
    res.redirect("/createContact");
    return false;
  }
  data.push(contact);
  fs.writeFileSync("./contacts.json", JSON.stringify(data));
  message.push({
    message: "Data Baru Berhasil Tersimpan",
  });
  req.flash("message", message);
  console.log("Data Baru Berhasil Tersimpan");
};

//Get Nama
function getDataByName(name) {
  const data = JSON.parse(fs.readFileSync("./contacts.json", "utf-8"));
  const contact = data.find((contact) => contact.name === name);
  return contact;
}

//Fungsi Update
function update(req, res, oldName, name, email, mobile) {
  const data = JSON.parse(fs.readFileSync("./contacts.json", "utf-8"));
  const index = data.findIndex(
    (contact) => contact.name.toUpperCase() === oldName.toUpperCase()
  );
  const cek = data.find(
    (contact) => contact.name.toUpperCase() === name.toUpperCase()
  );
  const message = [];
  if (cek) {
    // console.log("Nama Kontak Sudah Ada");
    message.push({ message: "Nama Sudah Terdaftar Di Dalam Kontak" });
    // return false;
  }
  data[index].name = name;

  //validasi email
  if (email) {
    if (!validator.isEmail(email)) {
      message.push({
        message: "Format Email Salah!",
      });
    }
    data[index].email = email;
  }

  //validasi Mobile
  if (mobile) {
    if (!validator.isMobilePhone(mobile, "id-ID")) {
      message.push({
        message: "Format Mobile Phone Salah! Gunakan format 08",
      });
    }
    data[index].mobile = mobile;
  }

  const oldData = {
    name,
    email,
    mobile,
  };

  if (message.length) {
    req.flash("message", message);
    req.flash("oldData", oldData);
    res.redirect(`/editContact/${oldName}`);
    return false;
  }
  fs.writeFileSync("./contacts.json", JSON.stringify(data));
  message.push({
    message: "Data Berhasil Di Edit",
  });
  req.flash("message", message);
  res.redirect("/contact");
}

//Fungsi Delete
function delData(name) {
  const data = JSON.parse(fs.readFileSync("./contacts.json", "utf-8"));
  const hapus = data.filter(
    (contact) => contact.name.toLowerCase() !== name.toLowerCase()
  );
  if (data.length !== hapus.length) {
    console.log(`kontak ${name} Berhasil Terhapus`);
    fs.writeFileSync("./contacts.json", JSON.stringify(hapus));
    return false;
  } else {
    console.log("Kontak tidak ada");
    return false;
  }
  // console.log(name);
}

module.exports = {
  create,
  update,
  getDataByName,
  delData,
};
