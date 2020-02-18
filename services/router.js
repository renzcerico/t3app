const express = require('express');
const router = new express.Router();
const login = require('../controllers/logins.js');
const personnel = require('../controllers/personnel.js');

router.route('/login/:id?')
  .post(login.post);

router.route('/personnel/:search?')
  .get(personnel.get);

module.exports = router;