import express from "express"
import { upload } from "../../utils/s3Client.js";
const router = express.Router();

import { 
    deleteTopics, updateMastery, 
    createStory, createScript, getStories, 
    getTopics, getScripts, getSuggestions, 
    saveTopics, getLearning, createLearning,
    prepareEpisode,
    liveChat, saveAgent, getAgents,
    saveAgentPair, getAgentPairs,
    searchTopics,
    updateTopic
} from "../../controllers/personal/topic.js"



// router.route('/topic').get(getTopic).patch(updateMastery).delete(deleteTopics)
router.route('/topics').get(getTopics).delete(deleteTopics).post(saveTopics)
router.route('/topics/search').get(searchTopics)
router.route('/topics/:id').patch(updateTopic)
router.route("/topic").get(getLearning).post(createLearning).patch(updateMastery)
router.route("/topic/suggestions").get(getSuggestions)
router.route('/story-time/:topicId').post(createStory).get(getStories);
router.route('/chat-time/:topicId').post(createScript).get(getScripts)
router.route('/chat-time/episode').patch(prepareEpisode)
router.route('/live-chat').post(liveChat)
router.route('/live-chat/agents')
    .post(upload.single('image'), saveAgent)
    .get(getAgents)
router.route('/live-chat/agent-pairs')
    .post(saveAgentPair)
    .get(getAgentPairs);

export default router