const auth = require('./auth');
const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.use(auth);

router.get('/:id', (req, res, next) => {
    knex.from('Ponudba as p')
        .select([
            "p.id",
            "cas_nalozitve",
            "status",
            "cas_ponudbe",
            "pripombe",
            "teza_tovora",
            "volumen_tovora",
            "st_palet",
            "teza_palet",
            "idVozilo",
            "idTip_tovora",
            "naslov_nalozitve_idNaslov",
            "naslov_dostave_idNaslov"])
        .where({
            "idUporabnik": req.session.user_id,
        })
        .join("Vozilo as v", { 'v.id': 'p.idVozilo' })
        .join("Tip_tovora as t", { 't.id': 'p.idTip_tovora' })
        .join("Naslov as n", { 'n.id': 'p.naslov_nalozitve_idNaslov' })
        .join("Naslov as n", { 'n.id': 'p.naslov_dostave_idNaslov' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/:id', (req, res, next) => {
    knex.from('Ponudba as p')
        .select([
            "p.id",
            "cas_nalozitve",
            "status",
            "cas_ponudbe",
            "pripombe",
            "teza_tovora",
            "volumen_tovora",
            "st_palet",
            "teza_palet",
            "idVozilo",
            "idTip_tovora",
            "naslov_nalozitve_idNaslov",
            "naslov_dostave_idNaslov"])
        .where({
            "idUporabnik": req.session.user_id,
            "p.id": req.params.id,
        })
        .join("Vozilo as v", { 'v.id': 'p.idVozilo' })
        .join("Tip_tovora as t", { 't.id': 'p.idTip_tovora' })
        .join("Naslov as n", { 'n.id': 'p.naslov_nalozitve_idNaslov' })
        .join("Naslov as n", { 'n.id': 'p.naslov_dostave_idNaslov' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/submit', async (req, res, next) => {
    
});

module.exports = router;
