const table = require('../config/models');
const express = require('express');
const router = express.Router();

router.post('/editCustomer', async(req, res, next) => {
    try {
        let iskalec_prevozaData = {
            naziv: req.body.nazivIskalca_prevoza,
            davcna_st: req.body.davcna_stIskalca_prevoza,
            tk_naslov: req.body.idNaslov,
            tk_tip_iskalca: req.body.idTip_iskalca
        };
        let tabelaIskalca_prevoza = await new iskalec_prevoza().save(iskalec_prevozaData)
        
        let tip_iskalcaData = {
            naziv: req.body.nazivTipa_Iskalca
        };
        let tabelaTip_iskalca = await new tip_iskalca().save(tip_iskalcaData)

        let naslovData = {
            tk_posta: req.body.idPosta,
            ulica: req.body.ulica,
            hisna_st: req.body.hisna_st
        };
        let tabelaNaslov = await new naslov().save(naslovData);

        let postaData = {
            kraj: req.body.kraj,
            postna_st: req.body.postna_st
        };
        let tabelaPosta = await new posta().save(postaData);
           
        res.status(200).send("Customer was succesfully updated.");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;