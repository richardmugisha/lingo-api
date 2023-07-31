const express = require('express');
const router = express.Router();

const {getDecks, getDeckCards, createCard, deleteCards} = require('../controllers/cards')

router.route('/').get(getDecks)
router.route('/:deckName').get(getDeckCards).post(createCard).delete(deleteCards)

module.exports = router