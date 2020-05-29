const auth = require('./auth');
const knex = require('../config/database');
const express = require('express');
const router = express.Router();
//const fileUpload = require('express-fileupload');

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
            "v.aktivno": 1,
            "v.zasedeno": 0
        })
        .groupBy("v.id")
        .havingRaw("MAX(c.datum_od)", [])
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Uporabnik as u", { 'u.id': 'v.idUporabnik' });

    if (req.body.dodatno) {
        if (req.body.dodatno.cena) {
            query.andWhere("c.cena_na_km", "<=", req.body.dodatno.cena);
        }
        if (req.body.dodatno.prevoznik) {
            query.andWhere("u.naziv", "like", "%" + req.body.dodatno.prevoznik.trim() + "%");
        }
        if (req.body.dodatno.letnik) {
            query.andWhere("v.letnik", "<=", req.body.dodatno.letnik);
        }
        if (req.body.dodatno.tip) {
            query.andWhere("t.naziv", "=", req.body.dodatno.tip);
        }
    }

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
            "potrdilo_izpravnosti",
            "maks_volumen_tovora",
            "maks_dolzina_tovora",
            "maks_sirina_tovora",
            "maks_visina_tovora",
            "maks_st_palet",
            "t.naziv as tip_vozila",
            "z.naziv as znamka",
            "c.cena_na_km"])
        .where({ "idUporabnik": req.session.user_id })
        .groupBy("v.id")
        .havingRaw("MAX(c.datum_od)", [])
        .join("Znamka as z", { 'z.id': 'v.idZnamka' })
        .join("Tip_vozila as t", { 't.id': 'v.idTip_vozila' })
        .join("Cenik as c", { 'c.idVozilo': 'v.id' })
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
            "potrdilo_izpravnosti",
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
            "v.id": req.params.id
        })
        .groupBy("v.id")
        .havingRaw("MAX(c.datum_od)", [])
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

router.post('/', auth, async (req, res, next) => {
    try {
        datoteka = Buffer.from(req.files.slika.data);
        if (! await ZnamkaExists(req.body.znamka)) {
            await knex.into("Znamka")
                .insert([{ naziv: req.body.znamka }]);
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
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

        switch (tip_vozila) {
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
                        idTip_vozila: tip_vozila,
                        slika: datoteka
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
                        idTip_vozila: tip_vozila,
                        slika: datoteka
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
                        idTip_vozila: tip_vozila,
                        slika: datoteka
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

        let idVozilo;

        await knex('Vozilo as v').where({
            "v.letnik": req.body.letnik,
            "v.registerska": req.body.registerska,
            "v.model": req.body.model,
            "v.idZnamka": znamka,
            "v.idTip_vozila": tip_vozila
        }).select('id').then((id) => {
            idVozilo = id[0].id;
        });

        await knex.into('Cenik')
            .insert([{
                cena_na_km: req.body.cena,
                datum_od: today,
                idVozilo: idVozilo
            }])
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });

        res.status(200).send("Vehicle successfully added.");
    } catch (error) {
        console.log(error);
        res.status(400).send("Failed to add the vehicle.");
    }
});

router.post('/editVehicle', auth, async (req, res, next) => {
    try {
        let tip_vozila;
        let znamka;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        let datum_do;

        if (req.body.datum_do) {
            datum_do = req.body.datum_do;
        } else {
            datum_do = null;
        }

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

        await knex('Cenik').update({
            cena_na_km: req.body.cena,
            datum_od: today,
            datum_do: datum_do
        }).where({
            idVozilo: req.body.id
        }).catch((error) => {
            res.status(500).json(error);
        });

        switch (tip_vozila) {
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
        res.status(500).send("Failed to edit vehicle").json(error);
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

async function ZnamkaExists(naziv) {
    let znamka = await knex.from("Znamka as z")
        .select("z.id")
        .where({ naziv: naziv })
    return znamka.length != 0;
}
