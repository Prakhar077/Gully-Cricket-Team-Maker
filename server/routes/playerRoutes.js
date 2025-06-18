const express = require('express');
const router = express.Router();
const { createPlayer, getPlayers, generateTeams , deletePlayer} = require('../controllers/playerController');
router.post('/', createPlayer);
router.get('/', getPlayers);
router.post('/generate', generateTeams);
router.delete("/:id", deletePlayer);



module.exports = router;