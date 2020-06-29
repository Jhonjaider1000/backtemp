// import route from "../../Http/Router/Router";
var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: 2 });
});

module.exports = router;
