const table = require('../config/models');
const knex = require('../config/database');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res, next) => {
    try {
        let nalozitevInfo = req.body.nalozitev.split(" ");
        let nalozitevUlica = "";
        let nalozitevStevilka = "";
        let nalozitevID;

        for (let i = 0; i< nalozitevInfo.length; i++) {
            if (i == nalozitevInfo.length-1) {
                nalozitevStevilka = nalozitevInfo[i];
            } else if (i == nalozitevInfo.length-2) {
                nalozitevUlica += nalozitevInfo[i];
            } else {
                nalozitevUlica += nalozitevInfo[i] + " ";
            }
        }
        
        await knex('Naslov').where({
            'ulica': nalozitevUlica,
            'stevilka': nalozitevStevilka
        }).select('id').then((id) => {
            nalozitevID = id[0].id;
        });

        let podatki = {
            //  podatki
            cas_nalozitve: req.body.casNalozitve,
            status: req.body.status,
            cas_ponudbe: req.body.casPonudbe,
            pripombe: req.body.pripombe,
            teza_tovora: req.body.teza,
            volumen_tovora: req.body.volumen,
            st_palet: req.body.steviloPalet,
            teza_palet: req.body.tezaPalet,
            //  tuji ključi
            idUporabnik: req.body.idUporabnik,
            idVozilo: req.body.vozilo,
            idTip_tovora: req.body.tipTovora,
            naslov_nalozitve_idNaslov: nalozitevID,
            naslov_dostave_idNaslov: req.body.dostava
        }
        new table.Ponudba().save(podatki);
        res.status(200).send("Order successfully confirmed.");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;