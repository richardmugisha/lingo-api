
import express from 'express'

const router = express.Router()

import { createStory, createChapter, createScene } from "../../controllers/personal/story/create.js"
import { getChapter, getStories, getStory, getScene } from '../../controllers/personal/story/get.js'
import { patchStory, patchChapter, patchEditDetails, patchDeleteDetails, patchTypeSettings, patchChapterLog } from "../../controllers/personal/story/update.js"


router.route("/").post(createStory).patch(patchStory).get(getStories)
router.route("/:id").get(getStory)
router.route("/chapter").post(createChapter).patch(patchChapter).get(getChapter)
router.route("/scene/:id").get(getScene)
router.route("/scene").post(createScene)
router.route("/details").patch(patchEditDetails).delete(patchDeleteDetails)
router.route("/typeSettings").patch(patchTypeSettings)
router.route("/chapterLog").patch(patchChapterLog)


export default router