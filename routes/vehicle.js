const session = require('./auth');
const knex = require('../config/database');
const express = require('express');
const router = express.Router();

router.post('/search', (req, res, next) => {
    const query = knex.from('Vozilo as v')
        .select([
            "v.id",
            "letnik",
            "model",
            "maks_teza_tovora",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km",
            "u.naziv_podjetja"
        ])
        .where({
            "c.datum_od": (qb) => {
                qb.from("Cenik as c").max("datum_od").join("Vozilo as v", { 'c.idVozilo': 'v.id' });
            },
            "v.aktivno": 1,
            "v.zasedeno": 0,
        })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Uporabnik as u", { 'u.id': 'v.idUporabnik' })

    let tip_tovora = req.body.tip_tovora;
    let teza_tovora;
    switch (tip_tovora) {
        case "posamezni izdelki":
            let izdelki = req.body.izdelki;
            teza_tovora = 0;
            let volumen = 0;
            for (const izdelek of izdelki) {
                teza_tovora += izdelek.teza * izdelek.kolicina;
                volumen += izdelek.dolzina * izdelek.visina * izdelek.sirina;
            }
            query.andWhere("v.maks_teza_tovora", ">=", teza_tovora)
                .whereRaw("v.maks_dolzina_tovora * v.maks_sirina_tovora * v.maks_visina_tovora >= ?", [volumen])
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
            break;
        case "palete":
            let st_palet = req.body.st_palet;
            teza_tovora = req.body.teza_palete * st_palet;
            query.andWhere("v.maks_teza_tovora", ">=", teza_tovora)
                .andWhere("v.maks_st_palet", ">=", st_palet)
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
            break;
        case "razsut tovor":
            let volumen_tovora = req.body.volumen_tovora;
            teza_tovora = req.body.teza_tovora;
            query.andWhere("v.maks_teza_tovora", ">=", teza_tovora)
                .andWhere("v.maks_volumen_tovora", ">=", volumen_tovora)
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
            break;
        default:
            res.status(400).send();
    }
});

// Use session from here on
router.use(session);

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
