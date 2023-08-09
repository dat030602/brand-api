const express = require('express');
const router = express.Router();

const AuthenticationController = require('../controllers/AuthenticationController');

router.post('/login', AuthenticationController.Login);
router.post('/register', AuthenticationController.Register);
router.get('/', AuthenticationController.Profile);
router.put('/edit-profile', AuthenticationController.EditProfile);

module.exports = router;