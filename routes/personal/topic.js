import express from "express"
import multer from 'multer';

const router = express.Router();

import { 
    deleteTopics, updateMastery, 
    createStory, createScript, getStories, 
    getTopics, getScripts, getSuggestions, 
    saveTopics, getLearning, createLearning,
    prepareEpisode,
    liveChat, saveAgent, getAgents,
    saveAgentPair, getAgentPairs,
    searchTopics
} from "../../controllers/personal/topic.js"

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// router.route('/topic').get(getTopic).patch(updateMastery).delete(deleteTopics)
router.route('/topics').get(getTopics).delete(deleteTopics).post(saveTopics)
router.route('/topics/search').get(searchTopics)
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