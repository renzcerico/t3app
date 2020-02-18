const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');
const database = require('./database.js');
const morgan = require('morgan');
var path = require("path");
var bodyParser = require("body-parser");

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();

    app.use(function (req, res, next) {
      //Enabling CORS
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
      next();
    });

    httpServer = http.createServer(app);

    app.use(morgan('combined'));

    app.use(bodyParser.json());

    app.use('/api', router);

    app.get('/', (req, res) => {
      res.redirect('production.html');
    });

    app.use(express.static('./www'));

    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
 
      resolve();
    });
  });
}
 
module.exports.close = close;