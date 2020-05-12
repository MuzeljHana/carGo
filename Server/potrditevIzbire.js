var express = require('express');
var app = express();

app.post('/potrdiIzbiro', async(req, res, next) => {
    try {
        
    } catch (error) {
        res.status(500).json(error);
    }
});