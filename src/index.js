const express = require("express");
const router = express.Router();

router.use('/chat',require('./chat_api'));

module.exports = router;