const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.post('/editOwner', async(req, res, next) => {
    try {
        let prevozno_podjetjeData = {
            naziv: req.body.nazivPrevoznega_podjetja,
            davcna_st: req.body.davcna_stPrevoznega_podjetja,
            zacetek_delovanja: req.body.zacetek_delovanjaPrevoznega_podjetja,
            uspesnost_poslovanja: req.body.uspesnost_poslovanjaPrevoznega_podjetja,
            tk_naslov: req.body.idNaslov
        };
        let tabelaPrevoznega_podjetja = await new Podjetje().save(prevozno_podjetjeData)
        
        let naslovData = {
            tk_posta: req.body.idPosta,
            ulica: req.body.ulica,
            hisna_st: req.body.hisna_st
        };
        let tabelaNaslov = await new Naslov().save(naslovData);

        let postaData = {
            kraj: req.body.kraj,
            postna_st: req.body.postna_st
        };
        let tabelaPosta = await new Posta().save(postaData);
           
        res.status(200).send("Owner was successfully edited.");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
