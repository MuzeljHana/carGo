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
    new table.Vozilo({ id: req.params.id }).save({ aktivnost: req.params.bool })
        .then(() => {
            res.json({ "message": "success" });
        })
        .catch((err) => {
            res.status(500).json({ "message": err });
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
    new table.Vozilo({ id: req.params.id }).destroy()
        .then(() => {
            res.json({ "message": "success" });
        })
        .catch((err) => {
            res.status(500).json({ "message": err });
        });
});

router.post('/editVehicle', async (req, res, next) => {
    let podjetje, tip, znamka, letnik;
    try {
        podjetje = await new table.Podjetje({ naziv: req.body.podjetje }).fetch({ columns: ['id'] });
        tip = await new table.Tip_prevoza({ naziv: req.body.tip }).fetch({ columns: ['id'] });
        znamka = await new table.Znamka({ naziv: req.body.znamka }).fetch({ columns: ['id'] });
        letnik = await new table.Letnik({ naziv: req.body.letnik }).fetch({ columns: ['id'] });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err });
    }

    let data = {
        id: req.body.vozilo,
        registracijska_st: req.body.registracijska_st,
        max_teza: req.body.max_teza_tovora,
        cena: req.body.cena_km,
        potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
        aktivnost: req.body.aktivnost,
        zasedenost: req.body.zasedenost,
        volumen: req.body.volumen,
        dolzina: req.body.dolzina,
        sirina: req.body.sirina,
        visina: req.body.visina,
        st_palet: req.body.st_pelet,
        tk_znamka: znamka.get('id'),
        tk_tip_prevoza: tip.get('id'),
        tk_letnik: letnik.get('id'),
        tk_prevozno_podjetje: podjetje.get('id')
    }
    new table.Vozilo().save(data).then(() => {
        res.json({ "message": "success" });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ "message": err });
    });
});

module.exports = router;
