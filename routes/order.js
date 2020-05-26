const auth = require('./auth');
const knex = require('../config/database');
const express = require('express');
const router = express.Router();

router.get('/', auth, (req, res, next) => {
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
            "p.idUporabnik": req.session.user_id,
        })
        .join("Vozilo as v", { 'v.id': 'p.idVozilo' })
        .join("Tip_tovora as t", { 't.id': 'p.idTip_tovora' })
        .join("Naslov as n1", { 'n1.id': 'p.naslov_nalozitve_idNaslov' })
        .join("Naslov as n2", { 'n2.id': 'p.naslov_dostave_idNaslov' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/:id', auth, (req, res, next) => {
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
            "p.idUporabnik": req.session.user_id,
            "p.id": req.params.id
        })
        .join("Vozilo as v", { 'v.id': 'p.idVozilo' })
        .join("Tip_tovora as t", { 't.id': 'p.idTip_tovora' })
        .join("Naslov as n1", { 'n1.id': 'p.naslov_nalozitve_idNaslov' })
        .join("Naslov as n2", { 'n2.id': 'p.naslov_dostave_idNaslov' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', auth, async (req, res, next) => {
    if (! await PostaExists(req.body.nalozitev_kraj, req.body.nalozitev_postna_stevilka)) {
        await knex.into("Posta").insert([{ kraj: req.body.nalozitev_kraj, stevilka: req.body.nalozitev_postna_stevilka }]);
    }
    if (! await NaslovExists(req.body.nalozitev_ulica, req.body.nalozitev_hisna_stevilka)) {
        await knex.into("Naslov").insert([{
            ulica: req.body.nalozitev_ulica,
            stevilka: req.body.nalozitev_hisna_stevilka,
            idPosta: (qb) => {
                qb.from("Posta")
                    .select("id")
                    .where({ kraj: req.body.nalozitev_kraj })
                    .orWhere({ stevilka: req.body.nalozitev_postna_stevilka });
            }
        }]);
    }
    if (! await PostaExists(req.body.dostava_kraj, req.body.dostava_postna_stevilka)) {
        await knex.into("Posta").insert([{ kraj: req.body.dostava_kraj, stevilka: req.body.dostava_postna_stevilka }]);
    }
    if (! await NaslovExists(req.body.dostava_ulica, req.body.dostava_hisna_stevilka)) {
        await knex.into("Naslov").insert([{
            ulica: req.body.dostava_ulica,
            stevilka: req.body.dostava_hisna_stevilka,
            idPosta: (qb) => {
                qb.from("Posta")
                    .select("id")
                    .where({ kraj: req.body.dostava_kraj })
                    .orWhere({ stevilka: req.body.dostava_postna_stevilka });
            }
        }]);
    }

    let data = {
        idUporabnik: req.session.user_id,
        idVozilo: req.body.idVozilo,
        idTip_tovora: (qb) => {
            qb.from("Tip_tovora").select("id").where({ naziv: req.body.tip_tovora });
        },
        naslov_nalozitve_idNaslov: (qb) => {
            qb.from("Naslov as n").select("n.id")
                .where({ ulica: req.body.nalozitev_ulica, "n.stevilka": req.body.nalozitev_hisna_stevilka })
                .join("Posta as p", { 'n.idPosta': 'p.id' });
        },
        naslov_dostave_idNaslov: (qb) => {
            qb.from("Naslov as n").select("n.id")
                .where({ ulica: req.body.dostava_ulica, "n.stevilka": req.body.dostava_hisna_stevilka })
                .join("Posta as p", { 'n.idPosta': 'p.id' });
        },
        cas_nalozitve: req.body.cas_nalozitve
    }

    if (req.body.pripombe) {
        data.pripombe = req.body.pripombe;
    }
    if (req.body.teza_tovora) {
        data.teza_tovora = req.body.teza_tovora;
    }
    if (req.body.volumen_tovora) {
        data.volumen_tovora = req.body.volumen_tovora;
    }
    if (req.body.st_palet) {
        data.st_palet = req.body.st_palet;
        data.teza_palet = req.body.teza_palete;
    }

    knex.into('Ponudba as p')
        .insert([data])
        .returning('id')
        .then((id) => {
            if (req.body.izdelki) {
                for (let izdelek of req.body.izdelki) {
                    izdelek.idPonudba = id[0];
                }
                knex.into('Izdelek')
                    .insert(req.body.izdelki)
                    .then((data) => { })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send();
                    });
            }
            res.json({ message: "success" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;

async function PostaExists(kraj, stevilka) {
    let posta = await knex.from("Posta as p")
        .select("p.id")
        .where({ kraj: kraj })
        .orWhere({ stevilka: stevilka });
    return posta.length != 0;
}

async function NaslovExists(ulica, stevilka) {
    let naslov = await knex.from("Naslov as n")
        .select("n.id")
        .where({ ulica: ulica, "n.stevilka": stevilka })
        .join("Posta as p", { 'n.idPosta': 'p.id' });
    return naslov.length != 0;
}
