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

router.route('/get-all-accounts')
  .post(accounts.all);

router.route('/accounts/:id')
  .get(accounts.getById);

router.route('/get-manpower-list').get(accounts.getManpowerList);

router.route('/get_header_count_per_status').get(t3.getHeaderCountPerStatus);

router.route('/get_header_by_status').post(t3.getHeaderByStatus);

router.route('/accounts/reset')
  .post(accounts.resetPassword);

router.route('/auth')
  .get(login.authenticate);

router.route('/logout')
  .get(login.logout);

router.route('/forward-list')
  .get(login.forwardList);

router.route('/set-user')
  .get(login.setUser);

router.route('/get-server-time')
  .get(t3.getServerTime);
module.exports = router;