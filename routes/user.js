const auth = require('./auth');
const knex = require('../config/database');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res, next) => {
    if (! await UserExists(req.body.email, req.body.davcna)) {
        const regex = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S{6,20})$/; //Uppercase, lowercase, number, 6 - 20 characters
        if (!regex.test(req.body.geslo.trim())) {
            res.json({ message: "password format incorrect" });
            return;
        }
        if (! await PostaExists(req.body.kraj, req.body.postna_stevilka)) {
            await knex.into("Posta").insert([{ kraj: req.body.kraj, stevilka: req.body.postna_stevilka }]);
        }
        if (! await NaslovExists(req.body.ulica, req.body.hisna_stevilka)) {
            await knex.into("Naslov").insert([{
                ulica: req.body.ulica,
                stevilka: req.body.hisna_stevilka,
                idPosta: (qb) => {
                    qb.from("Posta")
                        .select("id")
                        .where({ kraj: req.body.kraj })
                        .orWhere({ stevilka: req.body.postna_stevilka });
                }
            }]);
        }
        let data = {
            ime: req.body.ime,
            priimek: req.body.priimek,
            email: req.body.email,
            geslo: bcrypt.hashSync(req.body.geslo.trim(), 10),
            idNaslov: (qb) => {
                qb.from("Naslov").select("id").where({ ulica: req.body.ulica, stevilka: req.body.hisna_stevilka });
            }
        };
        if (req.body.naziv_podjetja) {
            let podjetje_data = {
                naziv_podjetja: req.body.naziv_podjetja,
                davcna: req.body.davcna,
                zacetek_delovanja: req.body.zacetek_delovanja,
                uspesnost_poslovanja: req.body.uspesnost_poslovanja
            }
            data = Object.assign(data, podjetje_data);
        }
        knex.into("Uporabnik")
            .insert([data])
            .then((data) => {
                res.json({ message: "success" });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
    } else {
        res.json({ message: "User exists" });
    }
});

router.post("/login", (req, res, next) => {
    knex.from("Uporabnik")
        .select("id", "geslo", "naziv_podjetja")
        .where({ email: req.body.email })
        .then((user) => {
            if (user.length != 0 && bcrypt.compareSync(req.body.geslo.trim(), user[0].geslo)) {
                req.session.user_id = user[0].id;
                req.session.provider = user[0].naziv_podjetja;
                res.json({ message: "success" });
            } else {
                res.json({ message: "login failed" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get("/logout", (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.redirect("/");
    } else {
        res.json({ message: "user not logged in" });
    }
});

router.put('/edit', async(req, res, next) => {
    try {
        let novoGeslo, idNaslov, idPosta, shranjenoGeslo;

        if (req.body.geslo) {
            novoGeslo = req.body.geslo;
        } else {
            novoGeslo = req.body.staro_geslo;
        }

        await knex.from('Uporabnik').where({
            id: req.session.user_id
        }).select('geslo').then((geslo) => {
            shranjenoGeslo = geslo[0].geslo;
        });

        if (await PostaExists(req.body.kraj, req.body.postna_st)) {
            knex.from('Posta').where({
                kraj: req.body.kraj,
                stevilka: req.body.postna_st
            }).select('id').then((id) => {
                idPosta = id[0].id;
            }).catch((error) => {
                res.json(error);
            });
        } else if (bcrypt.compareSync(req.body.staro_geslo.trim(), shranjenoGeslo)) {
            if (req.body.kraj && req.body.postna_st && req.body.ulica && req.body.hisna_st) {
                await knex.into("Posta").insert([{
                    kraj: req.body.kraj,
                    stevilka: req.body.postna_st
                }]);
                await knex.from('Posta').where({
                    kraj: req.body.kraj,
                    stevilka: req.body.postna_st
                }).select('id').then((id) => {
                    idPosta = id[0].id;
                }).catch((error) => {
                    res.json(error);
                });
            }
        }

        if (await NaslovExists(req.body.ulica, req.body.hisna_st)) {
            knex.from('Naslov').where({
                ulica: req.body.ulica,
                stevilka: req.body.hisna_st
            }).select('id').then((id) => {
                idNaslov = id[0].id;
            }).catch((error) => {
                res.json(error);
            });
        } else if (bcrypt.compareSync(req.body.staro_geslo.trim(), shranjenoGeslo)) {
            if (req.body.kraj && req.body.postna_st && req.body.ulica && req.body.hisna_st) {
                await knex.into("Naslov").insert([{
                    ulica: req.body.ulica,
                    stevilka: req.body.hisna_st,
                    idPosta: idPosta
                }]);
                await knex.from('Naslov').where({
                    ulica: req.body.ulica,
                    stevilka: req.body.hisna_st
                }).select('id').then((id) => {
                    idNaslov = id[0].id;
                }).catch((error) => {
                    res.json(error);
                });
            }
        }

        await knex.from('Uporabnik').where({
            id: req.session.user_id
        }).select('geslo').then((geslo) => {
            if (bcrypt.compareSync(req.body.staro_geslo.trim(), geslo[0].geslo)) {
                if (req.body.naziv_podjetja) {
                    knex('Uporabnik').update({
                        ime: req.body.ime,
                        priimek: req.body.priimek,
                        email: req.body.email,
                        geslo: bcrypt.hashSync(novoGeslo.trim(), 10),
                        idNaslov: idNaslov,
                        naziv_podjetja: req.body.naziv_podjetja,
                        davcna: req.body.davcna,
                        zacetek_delovanja: req.body.zacetek_delovanja,
                        uspesnost_poslovanja: req.body.uspesnost_poslovanja
                    }).where({
                        id: req.session.user_id
                    }).catch((error) => {
                        res.json(error);
                    });
                } else {
                    knex('Uporabnik').update({
                        ime: req.body.ime,
                        priimek: req.body.priimek,
                        email: req.body.email,
                        geslo: bcrypt.hashSync(novoGeslo.trim(), 10),
                        idNaslov: idNaslov
                    }).where({
                        id: req.session.user_id
                    }).catch((error) => {
                        res.json(error);
                    });
                }
            } else {
                res.send("Password mismatch").status(500);
            }
            res.status(200).json({'Message': 'Success'});
        }).catch((error) => {
            res.json(error);
        });
    } catch (error) {
        res.json(error);
    }
});

router.get('/', auth, (req, res, next) => {
    knex.from('Uporabnik as u')
        .select([
            "ime",
            "priimek",
            "email",
            "naziv_podjetja",
            "davcna",
            "zacetek_delovanja",
            "uspesnost_poslovanja",
            "n.ulica as naslov",
            "n.stevilka as stevilka",
            "p.kraj as kraj",
            "p.stevilka as postna_st"])
        .where({ "u.id": req.session.user_id })
        .join("Naslov as n", { 'n.id': 'u.idNaslov'  })
        .join("Posta as p", { 'p.id': 'n.idPosta' })
        .then((data) => {
            res.json(data);
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

async function UserExists(email, davcna) {
    let user = await knex.from("Uporabnik")
        .select("id")
        .where({ email: email })
        .orWhere({ davcna: davcna || 0 });
    return user.length != 0;
}
