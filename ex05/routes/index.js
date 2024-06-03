var express = require('express');
var router = express.Router();

/* GET home page. */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '회사소개',pageName:'home.ejs' });
});

module.exports = router;
