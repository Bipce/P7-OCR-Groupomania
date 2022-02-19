const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", auth, usersCtrl.getUsers);

module.exports = router;
