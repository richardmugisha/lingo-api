import express from "express"
const router = express.Router();

import {searchWords, addWordToTopic, addToWishList, getWords, createNewWord} from'../../controllers/personal/words.js';

router.route('/').get(getWords)
router.route('/search').get(searchWords)
router.route('/add-to-topic').post(addWordToTopic)
router.route('/create-new-word/:id').post(createNewWord)
router.route('/add-to-wish-list').post(addToWishList)

export default router