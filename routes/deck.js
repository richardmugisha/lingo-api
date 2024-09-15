const express = require('express');
const router = express.Router();

const { deleteDecks, getDeck, updateDeck, createStory, getStories, getDecks } = require('../controllers/deck')

router.route('/deck/:deckId').get(getDeck).patch(updateDeck).delete(deleteDecks)
router.route('/decks/:creator/:language').get(getDecks)
router.route('/story-time/:deckId').post(createStory).get(getStories);

module.exports = router