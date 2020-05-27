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
            "idVozilo as vozilo",
            "t.naziv as tip_tovora",
            "naslov_nalozitve_idNaslov as nalozisce",
            "naslov_dostave_idNaslov as dostava",
            "u.ime",
            "u.priimek"
        ])
        .whereNotIn("status", ["zavrnjeno", "koncano"])
        .andWhere((qb) => {
            qb.where({ "p.idUporabnik": req.session.user_id })
                .orWhere({ "v.idUporabnik": req.session.user_id })
        })
        .join("Vozilo as v", { 'v.id': 'p.idVozilo' })
        .join("Tip_tovora as t", { 't.id': 'p.idTip_tovora' })
        .join("Naslov as nalozitev", { 'nalozitev.id': 'p.naslov_nalozitve_idNaslov' })
        .join("Naslov as dostava", { 'dostava.id': 'p.naslov_dostave_idNaslov' })
        .join("Uporabnik as u", { 'u.id': 'p.idUporabnik' })
        .then(async (data) => {
            if (data) {
                for (let order of data) {
                    vozilo = await knex.from('Vozilo as v')
                        .select([
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
                            "c.cena_na_km"
                        ])
                        .where({
                            "v.id": order.vozilo,
                            "c.datum_od": (qb) => {
                                qb.from("Cenik as c").max("datum_od")
                                    .whereRaw("datum_od <= p.cas_ponudbe", [])
                                    .andWhere({ "p.id": order.id })
                                    .join("Vozilo as v", { 'c.idVozilo': 'v.id' })
                                    .join("Ponudba as p", { 'p.idVozilo': 'v.id' });
                            }
                        })
                        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
                        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
                        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
                    order.vozilo = vozilo[0];

                    let nalozisce = await knex.from('Naslov as n')
                        .select([
                            "ulica",
                            "n.stevilka",
                            "p.kraj",
                            "p.stevilka as posta"
                        ])
                        .where({ "n.id": order.nalozisce })
                        .join("Posta as p", { 'p.id': 'n.idPosta' })
                    order.nalozisce = nalozisce[0];

                    let dostava = await knex.from('Naslov as n')
                        .select([
                            "ulica",
                            "n.stevilka",
                            "p.kraj",
                            "p.stevilka as posta"
                        ])
                        .where({ "n.id": order.dostava })
                        .join("Posta as p", { 'p.id': 'n.idPosta' })
                    order.dostava = dostava[0];

                    if (order.tip_tovora == "posamezni izdelki") {
                        let izdelki = await knex.from('Izdelek as i')
                            .select([
                                "teza",
                                "dolzina",
                                "visina",
                                "sirina",
                                "kolicina"
                            ])
                            .join("Ponudba as p", { 'p.id': 'i.idPonudba' })
                        order.izdelki = izdelki;
                    }
                }
            }
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
            "cas_nalozitve",
            "status",
            "cas_ponudbe",
            "pripombe",
            "teza_tovora",
            "volumen_tovora",
            "st_palet",
            "teza_palet",
            "idVozilo as vozilo",
            "t.naziv as tip_tovora",
            "naslov_nalozitve_idNaslov as nalozisce",
            "naslov_dostave_idNaslov as dostava"
        ])
        .whereNotIn("status", ["zavrnjeno", "koncano"])
        .andWhere({ "p.id": req.params.id })
        .andWhere((qb) => {
            qb.where({ "p.idUporabnik": req.session.user_id })
                .orWhere({ "v.idUporabnik": req.session.user_id })
        })
        .join("Vozilo as v", { 'v.id': 'p.idVozilo' })
        .join("Tip_tovora as t", { 't.id': 'p.idTip_tovora' })
        .join("Naslov as nalozitev", { 'nalozitev.id': 'p.naslov_nalozitve_idNaslov' })
        .join("Naslov as dostava", { 'dostava.id': 'p.naslov_dostave_idNaslov' })
        .then(async (data) => {
            if (data.length != 0) {
                let order = data[0];
                let vozilo = await knex.from('Vozilo as v')
                    .select([
                        "letnik",
                        "registerska",
                        "model",
                        "maks_teza_tovora",
                        "maks_volumen_tovora",
                        "maks_dolzina_tovora",
                        "maks_sirina_tovora",
                        "maks_visina_tovora",
                        "maks_st_palet",
                        "t.naziv as tip_vozila",
                        "z.naziv as znamka",
                        "c.cena_na_km"
                    ])
                    .where({
                        "idUporabnik": req.session.user_id,
                        "v.id": order.vozilo,
                        "c.datum_od": (qb) => {
                            qb.from("Cenik as c").max("datum_od")
                                .whereRaw("datum_od <= p.cas_ponudbe", [])
                                .andWhere({ "p.id": req.params.id })
                                .join("Vozilo as v", { 'c.idVozilo': 'v.id' })
                                .join("Ponudba as p", { 'p.idVozilo': 'v.id' });
                        }
                    })
                    .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
                    .join("Znamka as z", { 'z.id': 'v.idZnamka' })
                    .join("Cenik as c", { 'c.idVozilo': 'v.id' })
                order.vozilo = vozilo[0];

                let nalozisce = await knex.from('Naslov as n')
                    .select([
                        "ulica",
                        "n.stevilka",
                        "p.kraj",
                        "p.stevilka as posta"
                    ])
                    .where({ "n.id": order.nalozisce })
                    .join("Posta as p", { 'p.id': 'n.idPosta' })
                order.nalozisce = nalozisce[0];

                let dostava = await knex.from('Naslov as n')
                    .select([
                        "ulica",
                        "n.stevilka",
                        "p.kraj",
                        "p.stevilka as posta"
                    ])
                    .where({ "n.id": order.dostava })
                    .join("Posta as p", { 'p.id': 'n.idPosta' })
                order.dostava = dostava[0];

                if (order.tip_tovora == "posamezni izdelki") {
                    let izdelki = await knex.from('Izdelek as i')
                        .select([
                            "teza",
                            "dolzina",
                            "visina",
                            "sirina",
                            "kolicina"
                        ])
                        .join("Ponudba as p", { 'p.id': 'i.idPonudba' })
                    order.izdelki = izdelki;
                }
            }
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

router.put('/:id/status/:status', auth, (req, res, next) => {
    knex('Ponudba as p')
        .update({
            status: req.params.status
        })
        .where({
            "p.id": (qb) => {
                qb.from('Vozilo as v')
                    .select('p.id')
                    .join("Ponudba as p", "p.idVozilo", "=", "v.id")
                    .where({ "p.id": req.params.id, "v.idUporabnik": req.session.user_id });
            }
        })
        .then(() => { })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });

    let data;
    switch (req.params.status) {
        case "potrjeno":
            data = { zasedeno: 1 };
            break;
        case "koncano":
            data = { zasedeno: 0 };
            break;
    }
    if (data) {
        knex('Vozilo as v')
            .update(data)
            .where({
                'v.id': (qb) => {
                    qb.from('Vozilo as v')
                        .select('v.id')
                        .join("Ponudba as p", "p.idVozilo", "=", "v.id")
                        .where({ "p.id": req.params.id, "v.idUporabnik": req.session.user_id });
                }
            })
            .then(() => {
                res.json({ message: "success" });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
    } else {
        res.json({ message: "success" });
    }
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
