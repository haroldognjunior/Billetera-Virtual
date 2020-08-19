const server = require("express").Router();
const { Banks } = require("../models/index.js");

server.post('/new', async (req, res) => {
  let bank = await Banks.create(req.body)
  res.status(200).json(bank);
});

server.get('/', async (req, res) => {
  let banks = await Banks.findAll();
  res.status(200).json(banks);
});

module.exports = server;