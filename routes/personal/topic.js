import express from "express"
const router = express.Router();

import  { 
    deleteTopics, updateMastery, 
    createStory, createScript, getStories, 
    getTopics, getScripts, getSuggestions, 
    saveTopics, getLearning, createLearning
} from "../../controllers/personal/topic.js"

// router.route('/topic').get(getTopic).patch(updateMastery).delete(deleteTopics)
router.route('/topics').get(getTopics).delete(deleteTopics).post(saveTopics)
router.route("/topic").get(getLearning).post(createLearning).patch(updateMastery)
router.route("/topic/suggestions").get(getSuggestions)
router.route('/story-time/:topicId').post(createStory).get(getStories);
router.route('/chat-time/:topicId').post(createScript).get(getScripts)

export default router