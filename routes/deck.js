const express = require('express');
const router = express.Router();

const { deleteDecks, getDeckMetaData, updateDeckMetaData } = require('../controllers/deck')

router.route('/deckMetaData/:deckName').get(getDeckMetaData).patch(updateDeckMetaData).delete(deleteDecks);

module.exports = router