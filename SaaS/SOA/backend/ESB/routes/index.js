const express = require('express');
const router = express.Router();
const axios = require('axios');
const redis = require('redis');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hello-world");
  //res.render('index', { title: 'Express' });
});

module.exports = router;
