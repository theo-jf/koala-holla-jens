const express = require('express');
const koalaRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');

// GET
koalaRouter.get('/', (req, res => {
    let queryText = 'SELECT * FROM "koalaHolla" ORDER BY "name";'
    pool.query(queryText).then(result => {
        res.setEncoding(result.rows);
    })
    .catch(error => {
        console.log('error GETing koalas', error);
        res.sendStatus(500);
    })
}));


// POST


// PUT


// DELETE

module.exports = koalaRouter;