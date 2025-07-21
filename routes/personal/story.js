
import express from 'express'

const router = express.Router()

import { createStory, createChapter, createScene } from "../../controllers/personal/story/create.js"
import { getChapter, getStories, getStory, getScene, getUserContributions, getUserGoal } from '../../controllers/personal/story/get.js'
import { patchStory, patchChapter, patchEditDetails, patchDeleteDetails, patchTypeSettings, patchChapterLog, updateWriterLog, updateWritingGoal } from "../../controllers/personal/story/update.js"


// 1. Static routes (most specific)
router.route("/contributions").get(getUserContributions).patch(updateWriterLog)
router.route("/goal").get(getUserGoal).patch(updateWritingGoal)

// 2. Root path operations
router.route("/").post(createStory).patch(patchStory).get(getStories)

// 3. Nested resource operations (still specific)
router.route("/chapter").post(createChapter).patch(patchChapter).get(getChapter)
router.route("/scene").post(createScene)
router.route("/details").patch(patchEditDetails).delete(patchDeleteDetails)
router.route("/typeSettings").patch(patchTypeSettings)
router.route("/chapterLog").patch(patchChapterLog)

// 4. Parameterized routes (least specific - should come LAST)
router.route("/scene/:id").get(getScene)
router.route("/:id").get(getStory)


export default router