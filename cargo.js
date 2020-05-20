process.chdir(__dirname);
const express = require('express');
const nunjucks = require('nunjucks');
const favicon = require('serve-favicon');
const session = require('express-session')
const cors = require('cors');

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

app.use(favicon('public/favicon.ico'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(cors());

app.use((req, res, next) => {
    console.log(`${Date()} ${req.ip} ${req.method} ${req.originalUrl}`);
    next();
});

require('./routes/_routes')(app);

const port = process.env.PORT || 3000;
app.listen(port);