const express = require("express");

const db = require("../data/dbConfig.js");

const accountsRouter = require('../accounts/accountsRouter.js');

const server = express();

server.use(express.json());

server.use('/api/accounts', accountsRouter)

server.get('/', (req, res) => {
    res.send(`<h2>Hello! It works!!!</h2>`);
  });

module.exports = server;
