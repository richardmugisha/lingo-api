
import express from 'express'

const router = express.Router()

import { createStory, createChapter } from "../../controllers/personal/story/create.js"
import { getChapter, getStories } from '../../controllers/personal/story/get.js'
import { patchStory, patchChapter } from "../../controllers/personal/story/update.js"


router.route("/").post(createStory).patch(patchStory).get(getStories)
router.route("/chapter").post(createChapter).patch(patchChapter).get(getChapter)


export default router