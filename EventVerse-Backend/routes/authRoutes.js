const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');

//jb frontend se POST request /register par aayegi, toh controller ka register function chalega
router.post('/register', register);

//jb frontend se POST request /login par aayegi , toh controller ka login function chalega
router.post('/login', login);

module.exports = router;