const express = require('express');
const router = express.Router();

const { deleteDecks, getDeckMetaData, updateDeckMetaData, createStory, getStories } = require('../controllers/deck')

router.route('/deckMetaData/:deckName').get(getDeckMetaData).patch(updateDeckMetaData).delete(deleteDecks)
router.route('/story-time/:deckId').post(createStory).get(getStories);

module.exports = router