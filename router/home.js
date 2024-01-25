const express = require('express');

const home = express.Router()

home.get('/', (req, res) => {
    res.send('home');
});
home.get('/list', (req, res) => {
    res.send('list');
});
module.exports = home;