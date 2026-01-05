const express = require('express');
const { registerUser, loginUser, logOut } = require('../controllers/authController');
const router = express.Router();


router.get('/', function (req, res) {
  res.send('hey!');
});

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout',logOut);

module.exports = router;