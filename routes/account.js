const express = require('express');
const router = express.Router();


const account = require('../controllers/account');

router.post('/', account.getAllProducts);


module.exports = router;    