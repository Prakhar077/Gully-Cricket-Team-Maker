const express = require('express');
const router = express.Router();
const { createAdmin, getAdmins, deleteAdmin } = require('../controllers/adminController');
router.post('/', createAdmin);
router.get('/', getAdmins);
router.delete('/:id', deleteAdmin);
module.exports = router;