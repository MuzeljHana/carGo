const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/search', function (req, res, next) {
    res.render('search');
});

module.exports = router;
