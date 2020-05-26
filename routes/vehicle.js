const auth = require('./auth');
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

router.get('/', auth, (req, res, next) => {
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
            "z.naziv as znamka"])
        .where({
            "idUporabnik": req.session.user_id,
        })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/:id', auth, (req, res, next) => {
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
            "z.naziv as znamka"])
        .where({
            "idUporabnik": req.session.user_id,
            "v.id": req.params.id
        })
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

/*
router.post('/editVehicle', auth, (req, res, next) => {
    knex('Vozilo')
        .update({
            letnik: req.body.letnik,
            registerska: req.body.registerska,
            model: req.body.model,
            maks_teza_tovora: req.body.maks_teza_tovora,
            potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
            maks_volumen_tovora: req.body.maks_volumen_tovora,
            maks_dolzina_tovora: req.body.maks_dolzina_tovora,
            maks_sirina_tovora: req.body.maks_sirina_tovora,
            maks_visina_tovora: req.body.maks_visina_tovora,
            maks_st_palet: req.body.maks_st_palet,

        })
        .where({
            idUporabnik: req.session.user_id,
            id: req.params.id
        })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .then((data) => {
            res.send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});
*/

router.post('/', auth, async(req, res, next) => {
    try {
        let tip_vozila;
        let znamka;
    
        await knex('Tip_vozila').where({
            'naziv': req.body.tip_vozila
        }).select('id').then((id) => {
            tip_vozila = id[0].id;
        });
    
        await knex('Znamka').where({
            'naziv': req.body.znamka
        }).select('id').then((id) => {
            znamka = id[0].id;
        });

        switch(tip_vozila) {
            //  KOMBI
            case 1:
                knex.into('Vozilo')
                .insert([{
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_dolzina_tovora: req.body.maks_dolzina_tovora,
                    maks_sirina_tovora: req.body.maks_sirina_tovora,
                    maks_visina_tovora: req.body.maks_visina_tovora,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                }]).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
                break;
            //  TOVORNJAK ZA RAZSUT TOVOR
            case 2:
                knex.into('Vozilo')
                .insert([{
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_volumen_tovora: req.body.maks_volumen_tovora,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                }]).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
                break;
            //  TOVORNJAK ZA BLAGO
            case 3:
                knex.into('Vozilo')
                .insert([{
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_dolzina_tovora: req.body.maks_dolzina_tovora,
                    maks_sirina_tovora: req.body.maks_sirina_tovora,
                    maks_visina_tovora: req.body.maks_visina_tovora,
                    maks_st_palet: req.body.maks_st_palet,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                }]).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });           
                break;
            //  IZREDNI PREVOZ
            case 4:
                knex.into('Vozilo')
                .insert([{
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_dolzina_tovora: req.body.maks_dolzina_tovora,
                    maks_sirina_tovora: req.body.maks_sirina_tovora,
                    maks_visina_tovora: req.body.maks_visina_tovora,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                }]).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
                break;
        }
        res.status(200).send("Vehicle successfully added.");
    } catch(error) {
        console.log(error);
        res.status(400).send("Failed to add the vehicle.");
    }
});

router.post('/editVehicle', auth, async(req, res, next) => {
    try {    
        let tip_vozila;
        let znamka;
    
        await knex('Tip_vozila').where({
            'naziv': req.body.tip_vozila
        }).select('id').then((id) => {
            tip_vozila = id[0].id;
        });
    
        await knex('Znamka').where({
            'naziv': req.body.znamka
        }).select('id').then((id) => {
            znamka = id[0].id;
        });

        switch(tip_vozila) {
            //  KOMBI
            case 1:
                knex('Vozilo')
                .update({
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_dolzina_tovora: req.body.maks_dolzina_tovora,
                    maks_sirina_tovora: req.body.maks_sirina_tovora,
                    maks_visina_tovora: req.body.maks_visina_tovora,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                })
                .where({
                    id: req.body.id
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
                break;
            //  TOVORNJAK ZA RAZSUT TOVOR
            case 2:
                knex('Vozilo')
                .update({
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_volumen_tovora: req.body.maks_volumen_tovora,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                })
                .where({
                    id: req.body.id
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
                break;
            //  TOVORNJAK ZA BLAGO
            case 3:
                knex('Vozilo')
                .update({
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_dolzina_tovora: req.body.maks_dolzina_tovora,
                    maks_sirina_tovora: req.body.maks_sirina_tovora,
                    maks_visina_tovora: req.body.maks_visina_tovora,
                    maks_st_palet: req.body.maks_st_palet,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                })
                .where({
                    id: req.body.id
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });           
                break;
            //  IZREDNI PREVOZ
            case 4:
                knex('Vozilo')
                .update({
                    letnik: req.body.letnik,
                    registerska: req.body.registerska,
                    model: req.body.model,
                    maks_teza_tovora: req.body.maks_teza_tovora,
                    potrdilo_izpravnosti: req.body.potrdilo_izpravnosti,
                    maks_dolzina_tovora: req.body.maks_dolzina_tovora,
                    maks_sirina_tovora: req.body.maks_sirina_tovora,
                    maks_visina_tovora: req.body.maks_visina_tovora,
                    idUporabnik: req.session.user_id,
                    idZnamka: znamka,
                    idTip_vozila: tip_vozila
                })
                .where({
                    id: req.body.id
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send();
                });
                break;
        }
        res.status(200).send("Vehicle successfully edited");
    } catch (error) {
        res.status(500).send("Failed to edit vehicle");
    }
});

router.put('/:id/active/:bool', auth, (req, res, next) => {
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

router.delete('/:id', auth, (req, res, next) => {
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
