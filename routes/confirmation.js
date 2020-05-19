const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res, next) => {
    try {
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
            idVozilo: req.body.vozilo,
            idTip_tovora: req.body.tipTovora,
            naslov_nalozitve_idNaslov: req.body.nalozitev,
            naslov_dostave_idNaslov: req.body.dostava,
            idUporabnik: req.body.idUporabnik,
        }
        new table.Ponudba().save(podatki);
        res.status(200).send("Order successfully confirmed.");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;