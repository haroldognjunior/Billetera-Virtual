const { Router } = require("express");
const router = Router();
const passport = require("passport");
const session = require("express-session");

// import all routers;
const authPath = require("./auth.js");
const usersPath = require("./users.js");
const transactionsPath = require("./transactions.js");
const contactsPath = require("./contacts.js");
const merchantsPath = require("./merchants.js");
const walletPath = require("./wallet.js");
const banksPath = require("./banks.js");

router.use("/auth", authPath);
router.use("/users", usersPath);
router.use("/transactions", transactionsPath);
router.use("/contacts", contactsPath);
router.use("/merchants", merchantsPath);
router.use("/wallet", walletPath);
router.use("/banks", banksPath);

module.exports = router;