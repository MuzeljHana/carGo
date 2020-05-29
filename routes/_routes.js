const page = require('./page');
const vehicle = require('./vehicle');
const order = require('./order');
const user = require('./user');

module.exports = (app) => {
    app.use('/', page);
    app.use('/vehicle', vehicle);
    app.use('/order', order);
    app.use('/user', user);
}
