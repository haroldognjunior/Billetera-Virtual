const fs = require("fs");
const path = require("path");
const db = require("../db.js");

const basename = path.basename(__filename);
const models = {};

models.conn = db();

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = models.conn.import(path.join(__dirname, file));
    const name = file.split(".")[0];
    models[name] = model;
  });

const { Users, Transactions, Wallet, Merchants, Banks } = models;

// Add model relationships here
Users.hasOne(Wallet, { onDelete: "CASCADE" });
Wallet.belongsTo(Users);

module.exports = models;
