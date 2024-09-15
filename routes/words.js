const express = require('express');
const router = express.Router();

const {getWords, addWordToDeck, addToWishList} = require('../controllers/words');
router.route('/search/:language/:word').get(getWords)
router.route('/add-to-deck').post(addWordToDeck)
router.route('/add-to-wish-list').post(addToWishList)

module.exports = router