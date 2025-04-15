import express from "express"
const router = express.Router();

import  { deleteDecks, getDeck, updateMastery, createStory, createScript, getStories, getDecks, getScripts } from "../../controllers/personal/deck.js"

router.route('/deck').get(getDeck).patch(updateMastery).delete(deleteDecks)
router.route('/decks').get(getDecks)
router.route('/story-time/:deckId').post(createStory).get(getStories);
router.route('/chat-time/:deckId').post(createScript).get(getScripts)

export default router