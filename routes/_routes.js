const example = require('./example');
const pages   = require('./pages');
const vehicle = require('./vehicle');

module.exports = function (app) {
    app.use('/example', example)
    app.use('/', pages);
    app.use('/vehicle', vehicle);
}
