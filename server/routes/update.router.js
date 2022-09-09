const express = require('express');
const updateRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');


// PUT FOR UPDATE 
updateRouter.put('/:updateId', (req, res) => {
    console.log(`Updating koala, id ${req.params.updateId}`);
    let updateId = req.params.updateId;

    // Edit Koala
    const queryText = `
        UPDATE "koalaHolla"
            SET 
                "name" = $1,
                "gender" = $2,
                "age" = $3,
                "ready_to_transfer" = $4,
                "notes" = $5
            WHERE "id" = $6;
    `
    pool.query(queryText, [req.body.name, req.body.gender, Number(req.body.age), req.body.ready_to_transfer, req.body.notes, updateId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('Error updating Koala', error);
            res.sendStatus(500);
        });
});


module.exports = updateRouter;