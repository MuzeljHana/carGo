const example = require('./example');
const page = require('./page');
const vehicle = require('./vehicle');
const order = require('./order');
const confirmation = require('./confirmation');
const owner = require('./owner');
const customer = require('./customer');
const user = require('./user');

module.exports = function (app) {
    app.use('/example', example)
    app.use('/', page);
    app.use('/vehicle', vehicle);
    app.use('/order', order);
    app.use('/confirmation', confirmation);
    app.use('/owner', owner);
    app.use('/customer', customer);
    app.use('/user', user);
}
