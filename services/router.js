const express = require('express');
const router = new express.Router();
const login = require('../controllers/logins.js');
const personnel = require('../controllers/personnel.js');
const header = require('../controllers/header.js');

router.route('/header')
  .post(header.post);

router.route('/login/:id?')
  .post(login.post);

router.route('/personnel/:search?')
  .get(personnel.get);

module.exports = router;