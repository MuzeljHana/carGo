const table = require('../config/models');
const knex = require('../config/database');
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (!req.session.user_id) {
        res.json({ "message": "Not signed in!" });
    }
    next();
})

router.get('/', (req, res, next) => {
    knex.from('Vozilo as v')
        .select([
            "v.id",
            "letnik",
            "registerska",
            "model",
            "maks_teza_tovora",
            "aktivno",
            "zasedeno",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km"])
        .where({
            "idUporabnik": req.session.user_id,
            "c.datum_od": (qb) => {
                qb.from("Cenik as c").max("datum_od").join("Vozilo as v", { 'c.idVozilo': 'v.id' });
            }
        })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/:id', (req, res, next) => {
    knex.from('Vozilo as v')
        .select([
            "v.id",
            "letnik",
            "registerska",
            "model",
            "maks_teza_tovora",
            "aktivno",
            "zasedeno",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km"])
        .where({
            "idUporabnik": req.session.user_id,
            "v.id": req.params.id,
            "c.datum_od": (qb) => {
                qb.from("Cenik as c").max("datum_od").join("Vozilo as v", { 'c.idVozilo': 'v.id' });
            }
        })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', (req, res, next) => {
    knex.into('Vozilo')
        .insert([{
            letnik: req.body.letnik,
            registerska: req.body.registerska,
            model: req.body.model,
            maks_teza_tovora: req.body.maks_teza_tovora,
            potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
            maks_volumen_tovora: req.body.maks_volumen_tovora,
            maks_dolzina_tovora: req.body.maks_dolzina_tovora,
            maks_dolzina_tovora: req.body.maks_dolzina_tovora,
            maks_sirina_tovora: req.body.maks_sirina_tovora,
            maks_visina_tovora: req.body.maks_visina_tovora,
            maks_st_palet: req.body.maks_st_palet,

            idUporabnik: req.session.user_id,
            idZnamka: (qb) => {
                qb.from("Znamka").select("id").where({ naziv: req.body.znamka });
            },
            idTip_vozila: (qb) => {
                qb.from("Tip_vozila").select("id").where({ naziv: req.body.tip_vozila });
            }
        }])
        .then((data) => {
            res.send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.put('/:id/active/:bool', (req, res, next) => {
    knex('Vozilo')
        .update({
            aktivno: req.params.bool
        })
        .where({
            idUporabnik: req.session.user_id,
            id: req.params.id
        })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.put('/:id/occupied/:bool', (req, res, next) => {
    new table.Vozilo({ id: req.params.id }).save({ zasedenost: req.params.bool })
        .then(() => {
            res.json({ "message": "success" });
        })
        .catch((err) => {
            res.status(500).json({ "message": err });
        });
});

router.delete('/:id', (req, res, next) => {
    knex('Vozilo')
        .del()
        .where({
            idUporabnik: req.session.user_id,
            id: req.params.id
        })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
