process.chdir(__dirname);
const express = require('express');
const nunjucks = require('nunjucks');
const favicon = require('serve-favicon');

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

app.use(favicon('public/favicon.ico'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

require('./routes/_routes')(app);

const port = process.env.PORT || 3000;
app.listen(port);
