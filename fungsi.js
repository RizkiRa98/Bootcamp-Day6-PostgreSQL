const fs = require("fs");
const validator = require("validator");
const session = require("express-session");
const flash = require("connect-flash");
const pool = require("./db");

//fungsi create
const create = async (req, res, name, email, mobile) => {
  const message = [];
  //validasi nama
  const cek = await pool.query(
    `SELECT * FROM contacts WHERE name = '${name}' `
  );
  if (cek.rows.length) {
    message.push({ message: "Nama Sudah Terdaftar Di Dalam Kontak" });
  }

  //validasi email
  if (email) {
    if (!validator.isEmail(email)) {
      message.push({
        message: "Format Email Salah!",
      });
    }
  }
  //Validasi mobile phone
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

  //query insert ke database
  await pool.query(
    `INSERT INTO contacts(name, email, mobile) VALUES('${name.toLowerCase()}', '${email.toLowerCase()}', '${mobile.toLowerCase()}')`
  );
  message.push({
    message: "Data Baru Berhasil Tersimpan",
  });
  req.flash("message", message);
  console.log("Data Baru Berhasil Tersimpan");
  res.redirect("contact");
};

//Get Nama
async function getDataByName(name) {
  const contact = await pool.query(
    `SELECT * FROM contacts WHERE name = '${name}' `
  );
  return contact.rows[0];
}

//Fungsi Update
async function update(req, res, oldName, name, email, mobile) {
  const message = [];

  // validasi cek nama
  if (name !== oldName) {
    const cek = await pool.query(
      `SELECT * FROM contacts WHERE name = '${name}'`
    );
    if (cek.rows.length) {
      message.push({ message: "Nama Sudah Ada" });
    }
    console.log(cek);
  }

  //validasi email
  if (email) {
    if (!validator.isEmail(email)) {
      message.push({
        message: "Format Email Salah!",
      });
    }
  }

  //validasi Mobile
  if (mobile) {
    if (!validator.isMobilePhone(mobile, "id-ID")) {
      message.push({
        message: "Format Mobile Phone Salah! Gunakan format 08",
      });
    }
  }

  //Jika data salah, agar isi input tidak hilang
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

  //query update database
  await pool.query(
    `UPDATE contacts SET name='${name.toLowerCase()}', email='${email.toLowerCase()}', mobile='${mobile.toLowerCase()}' WHERE name = '${oldName}' `
  );
  message.push({
    message: "Data Berhasil Di Edit",
  });
  req.flash("message", message);
  res.redirect("/contact");
}

//Fungsi Delete
async function delData(req, res, name) {
  const message = [];
  const cek = await pool.query(`SELECT * FROM contacts WHERE name = '${name}'`);
  if (!cek) {
    message.push({
      message: `Data '${name} Tidak Ada'`,
    });
  }

  //query delete data
  await pool.query(`DELETE FROM contacts WHERE name='${name}'`);
  message.push({
    message: `Data '${name}' Berhasil Dihapus`,
  });
  req.flash("message", message);
  res.redirect("/contact");
}

module.exports = {
  create,
  update,
  getDataByName,
  delData,
};
