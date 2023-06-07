const express = require('express');
const router = express.Router();
const Contacts = require('../controllers/ContactController');

router.post('/', Contacts.getContacts);
module.exports = router;