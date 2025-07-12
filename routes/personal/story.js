
import express from 'express'

const router = express.Router()

import { createStory, createChapter } from "../../controllers/personal/story/create.js"
import { getChapter, getStories, getStory } from '../../controllers/personal/story/get.js'
import { patchStory, patchChapter, patchEditDetails, patchDeleteDetails, patchTypeSettings, patchPageSettings } from "../../controllers/personal/story/update.js"


router.route("/").post(createStory).patch(patchStory).get(getStories)
router.route("/:id").get(getStory)
router.route("/chapter").post(createChapter).patch(patchChapter).get(getChapter)
router.route("/details").patch(patchEditDetails).delete(patchDeleteDetails)
router.route("/typeSettings").patch(patchTypeSettings)
router.route("/pageSettings").patch(patchPageSettings)


export default router