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

router.get('/:id', async (req, res, next) => {
    let povezava;
    try{
        povezava = await new table.Povezava({tk_iskalec_prevoza: req.params.id}).fetch({columns: ['tk_tovor']});
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err });
    }
    new table.Termin().where('tk_tovor', povezava.get('tk_tovor')).fetchAll()
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
