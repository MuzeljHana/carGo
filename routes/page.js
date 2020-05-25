const auth = require('./auth');
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    req.template_data = { login: req.session.user_id != undefined };
    next();
});

router.get('/', (req, res, next) => {
    res.render('index', req.template_data);
});

router.get('/search', (req, res, next) => {
    res.render('search', req.template_data);
});

router.get('/transports', (req, res, next) => {
    res.render('transports', req.template_data);
});

router.get('/dashboard/vehicle', auth, (req, res, next) => {
    res.render('vehicle', req.template_data);
});

router.get('/login', (req, res, next) => {
    res.render('login', req.template_data);
});

router.get('/register', (req, res, next) => {
    res.render('register', req.template_data);
});

router.get('/export', (req, res, next) => {
    res.render('export', req.template_data);
})

module.exports = router;
