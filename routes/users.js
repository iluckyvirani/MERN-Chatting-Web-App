const express = require('express');

// const UserModel = require('../models/user')
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const routes = express.Router();

// duumy api for testing
routes.get('/dummyapi', (req, res) => {
    res.send("dummy api working");
})

module.exports = routes;