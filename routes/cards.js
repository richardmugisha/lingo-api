const express = require('express');
const router = express.Router();

const {getDeckCards, createCard, deleteCards} = require('../controllers/cards');
const { getDecks } = require('../controllers/deck')
const { updateTemporary, getTemporary, stealFromTemporary } = require('../controllers/temporary.js')
router.route('/:creator').get(getDecks)
router.route('/temporary').patch(updateTemporary).post(stealFromTemporary)
router.route('/temporary/:tempId').get(getTemporary)
router.route('/:deckName').get(getDeckCards).post(createCard).delete(deleteCards)

module.exports = router