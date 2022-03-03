const express = require("express");
const router = express.Router();

const auth = require("../helpers/auth");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.get("/verifyToken", auth.verifyToken, auth.successLogin);

module.exports = router;