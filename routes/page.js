const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/search', (req, res, next) => {
    res.render('search');
});

router.get('/transports', (req, res, next) => {
    res.render('transports');
});

router.get('/dashboard/vehicle', (req, res, next) => {
    res.render('vehicle');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.render('register');
});

module.exports = router;
