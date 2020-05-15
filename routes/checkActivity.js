const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.post('/oznaciAktivnost', async(req, res, next) => {
    try {  
        let prevozno_sredstvoDataAktivnosti= {
            aktivnost: req.body.aktivnostPrevoznega_sredstva
        }
        let tabelaAktivnosti = await new prevozno_sredstvo().save(prevozno_sredstvoDataAktivnosti)

        res.status(200).send("Aktivnost je bila uspešno označena!");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports =router;