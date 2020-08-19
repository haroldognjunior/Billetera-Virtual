const server = require("express").Router();
const { Merchants } = require("../models/index.js");

server.post('/new', async (req, res) => {
  let merchant = await Merchants.create(req.body)
  res.status(200).json(merchant);
});

server.get('/', async (req, res) => {
  let merchants = await Merchants.findAll();
  res.status(200).json(merchants);
});

module.exports = server;