const express = require('express');
const router = express.Router();

const { getDeckMetadata, updateDeckMetadata } = require('../controllers/deck')

router.route('/deckMetadata/:deckName').get(getDeckMetadata).patch(updateDeckMetadata);

module.exports = router