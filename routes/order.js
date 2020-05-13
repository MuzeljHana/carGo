const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    new table.Termin().fetchAll()
        .then((termini) => {
            res.json(termini);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res, next) => {
    new table.Termin({ id: req.params.id }).fetch()
        .then((termin) => {
            res.json(termin);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post('/submit', async (req, res, next) => {
    
});

module.exports = router;
