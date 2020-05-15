const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.post('/checkActivity', async(req, res, next) => {
    try {  
        let prevozno_sredstvoDataAktivnosti= {
            aktivnost: req.body.aktivnostPrevoznega_sredstva
        }
        let tabelaAktivnosti = await new Vozilo().save(prevozno_sredstvoDataAktivnosti)

        res.status(200).send("Activity was successfully checked.");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports =router;