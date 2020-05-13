const example = require('./example');
const page = require('./page');
const vehicle = require('./vehicle');
const order = require('./order');

module.exports = function (app) {
    app.use('/example', example)
    app.use('/', page);
    app.use('/vehicle', vehicle);
    app.use('/order', order);
}
