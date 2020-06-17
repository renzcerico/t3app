const express = require('express');
const router = new express.Router();
const login = require('../controllers/logins.js');
const personnel = require('../controllers/personnel.js');
const header = require('../controllers/header.js');
const t3 = require('../controllers/t3.js');
const accounts = require('../controllers/accounts.js');

router.route('/header')
  .post(header.post);

router.route('/login')
  .post(login.post);

router.route('/personnel/:search?')
  .get(personnel.get);

router.route('/store_all').post(t3.storeAll);

router.route('/get_all_by_barcode/:barcode').get(t3.getAllByBarcode);

router.route('/get_downtime_types').get(t3.getDowntimeTypes);

router.route('/accounts')
  .post(accounts.insert);

router.route('/accounts')
  .get(accounts.all);

router.route('/accounts/:id')
  .get(accounts.getById);

router.route('/get_header_count_per_status').get(t3.getHeaderCountPerStatus);

router.route('/get_header_by_status/:status_code').get(t3.getHeaderByStatus);

router.route('/accounts/reset')
  .post(accounts.resetPassword);

module.exports = router;