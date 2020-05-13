const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.get('/termini', (req, res, next) => {
    new table.Termin().fetchAll()
        .then((termini) => {
            res.json(termini);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;
