const express = require('express');
const koalaRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');

// GET
koalaRouter.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "koalaHolla" ORDER BY "name";'
    pool.query(queryText).then(result => {
        res.send(result.rows);
    })
    .catch(error => {
        console.log('error GETing koalas', error);
        res.sendStatus(500);
    });
});


// POST
koalaRouter.post('/', (req, res) => {
    let newKoala = req.body;
    let transfer = (req.body.ready_to_transfer === 'Y') ? true : false;

    console.log(`Adding koala`, newKoala);

    let queryText = `INSERT INTO "koalaHolla" ("name", "gender", "age", "ready_to_transfer", "notes")
                   VALUES ($1, $2, $3, $4, $5);`;

    pool.query(queryText, [newKoala.name, newKoala.gender, newKoala.age, transfer, newKoala.notes])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log('Error adding new koala', error);
            res.sendStatus(500);
        });
});


// PUT
koalaRouter.put('/:id', (req, res) => {
    console.log(`Updating koala, id ${req.params.id}`);
    let updateId = req.params.id;

    // Flip ready_to_transfer value to its opposite (true / false)
    const queryText = `
        UPDATE "koalaHolla"
            SET "ready_to_transfer" = NOT "ready_to_transfer"
            WHERE "id" = $1;
    `
    pool.query(queryText, [updateId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('Error updating koala', error);
            res.sendStatus(500);
        });
});


// DELETE
koalaRouter.delete('/:id', (req, res) => {
    console.log(`Deleting koala, id ${req.params.id}`);
    let deleteId = req.params.id;
  
    const queryText = `
        DELETE from "koalaHolla"
            WHERE "id" = $1;
    `
    pool.query(queryText, [deleteId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(`Error deleting koala`, error);
            res.sendStatus(500);
        });
});

module.exports = koalaRouter;