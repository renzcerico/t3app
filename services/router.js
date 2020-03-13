const express = require('express');
const router = new express.Router();
const login = require('../controllers/logins.js');
const personnel = require('../controllers/personnel.js');
const header = require('../controllers/header.js');
const t3 = require('../controllers/t3.js');

router.route('/header')
  .post(header.post);

router.route('/login/:id?')
  .post(login.post);

router.route('/personnel/:search?')
  .get(personnel.get);

router.route('/store_all').post(t3.storeAll);

router.route('/get_all_by_barcode/:barcode').get(t3.getAllByBarcode);

router.route('/get_downtime_types').get(t3.getDowntimeTypes);

module.exports = router;