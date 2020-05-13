const example = require('./example');
const pages   = require('./pages');

module.exports = function (app) {
    app.use('/example', example)
    app.use('/', pages);
}
