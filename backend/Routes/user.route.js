const experss = require('express');
const router = experss.Router();

const userController = require('../Controller/user.controller');

router.post('/signup', userController.signup);


router.post('/login', userController.login);
        
module.exports = router;