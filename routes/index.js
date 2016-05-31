var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function(req, res, next) {
  console.log(req);
  console.log(req.files.uploadFile.name);
});

module.exports = router;
