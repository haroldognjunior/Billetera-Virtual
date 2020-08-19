const server = require("express").Router();
const { Users, Wallet } = require("../models/index.js");

//Obtener todas las Billeteras (Productos) de un Usuario, y darles formato
server.get("/myWallets/:id", (req, res) => {
  Wallet.findAll({ where: { userId: req.params.id } })
    .then((wallets) => {
      var walletArr = [];
      wallets.forEach((wallet) => {
        var type = wallet.type;
        var currency = wallet.currency;
        var balance = wallet.balance;
        var created = wallet.createdAt.toISOString().split("T")[0];
        walletArr.push({ type, currency, balance, created });
      });
      res.status(200).json(walletArr);
    })
    .catch((err) => {
      res.json({ err });
    });
});

//Obtener la Billetera de un Usuario
server.get("/:id", (req, res) => {
  Wallet.findOne({ where: { userId: req.params.id } })
    .then((wallet) => {
      res.status(200).json(wallet);
    })
    .catch((err) => {
      res.json({ err });
    });
});

module.exports = server;
