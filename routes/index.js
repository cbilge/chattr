var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer'); // v1.0.5
var upload = multer({dest: 'public/files/'}); // for parsing multipart/form-data

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('uploadFile'), function(req, res, next) {
  var rename = fs.rename(req.file.path, "public\\files\\" + req.file.originalname, function(err){
    if (err) {
      return (false);
    } else {
      return (true);
    }
  });
  res.send(rename);
});

router.get('/uploads',  function(req, res, next) {
  var files = fs.readdir("public/files/", function(err, files){
    if (err) {
      return (false);
    } else {
      res.send(files);
    }
  });
});

module.exports = router;
