const example = require('./example');
const page = require('./page');
const vehicle = require('./vehicle');
const order = require('./order');
const confirmation = require('./confirmation');
const editVehicle = require('/editVehicle');
const editOwner = require('/editOwner');
const editCustomer = require('/editCustomer');
const checkActivity = require('/checkActivity');

module.exports = function (app) {
    app.use('/example', example)
    app.use('/', page);
    app.use('/vehicle', vehicle);
    app.use('/order', order);
    app.use('/confirmation', confirmation);
    app.use('/editVehicle', editVehicle);
    app.use('/editOwner', editOwner);
    app.use('/editCustomer', editCustomer);
    app.use('/checkActivity', checkActivity);
}
