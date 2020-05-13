const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.get('/termini', function (req, res, next) {
    table.Termin.fetchAll()
        .then((termini) => {
            res.json(termini);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;
