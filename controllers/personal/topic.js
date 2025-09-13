import Topic from '../../models/topic.js';
import getWordModel from '../../models/word/word.js'
import Story from '../../models/story/story.js';
import { fullStoryGen, aiCoEditor } from '../../utils/story/storyGenerator.js'
// import scriptGen from "../../utils/script/actingScriptGenerator.js"
import generateAudioForScript from '../../utils/script/generateAudio.js';
import Script from '../../models/script.js';
import TopicScriptGroup from '../../models/topicScriptGroup.js';
import generateTopics from '../../utils/topic/generateTopics.js';
import generateWords from '../../utils/word/executors/generateWords.js';
import createCascadingTopics from '../../utils/topic/insertTopics.js';
import orchestractor from '../../utils/script/orchestrator/index.js';
// import liveChatHandle from '../../utils/live-chat/index.js'
import LiveChat from '../../utils/live-chat/index.js'

import { Learning, newLearning, wordMasteryUpdate, patchLearningTopic, pushNewTopic } 
from '../../models/learning/learning.js'
import Agent from '../../models/live-chat/agent.js'
import { uploadImageToS3 } from '../../utils/s3Client.js'
import AgentPair from '../../models/live-chat/agentPair.js';

const createNewTopic = async (id, name, userId, language, parent, isAiGenerated) => {
    try {
        let topic;
        if (id) {
            topic = await Topic.findById(id)
        }
        else {
            topic = new Topic({
                name,
                creator: userId,
                language,
                parent,
                isAiGenerated,
                words: [],
            });
        }
        return topic

    } catch (error) {
        console.error('Error creating or retrieving topic metadata:', error);
    }
    
}

const saveTopics = async (req, res) => {
    try {
        const { parent, language, creator, topics, isAiGenerated } = req.body
        console.log( parent, language, creator, topics)
        await createCascadingTopics(creator, language, topics, parent, isAiGenerated === true)
        res.status(200).json({msg: "success"})
        // console.log(topics)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error.message})
    }
}

const getSuggestions = async(req, res) => {
    const { path, topic, number, type, excluded } = req.query
    console.log(path, topic, number)
    try {
        const { suggestions } = type === "words" ? await generateWords(path, topic, number, excluded) : await generateTopics(path, topic, number, excluded)
        // console.log(suggestions)
        res.status(200).json({suggestions})
    } catch (error) {
        console.log()
    }
}

const getTopics = async (req, res) => {
    const { user, creator, language, parent, myLearning } = req.query;

    try {
        if (myLearning) {
            const learnings = await fetchLearnings(user);

            const topicIds = learnings.map(l => l.topic.toString());
            const topics = await Topic.find({ _id: { $in: topicIds } }).lean();

            // Attach matching learning to each topic
            const topicsWithLearning = topics.map(topic => {
                const learning = learnings.find(l => l.topic.toString() === topic._id.toString());
                return { ...topic, learning };
            });

            return res.status(200).json({ topics: topicsWithLearning });
        }

        // Regular topic query
        const filters = { parent };
        if (creator) filters.creator = user;
        if (language) filters.language = language;

        const topics = await Topic.find(filters);
        res.status(200).json({ topics });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Error fetching topics" });
    }
};



const getLearning = async (req, res) => {
    try {
        const { user, topic } = req.query
        const learnings = await fetchLearnings(user, topic)
        const learning = learnings[0]
        if (!learning?.topic) return res.status(404).json("Learning plan not found")
        console.log(learning)
        res.json({learning})
    } catch (error) {
        console.log(error)
        res.status(500).json("Error retrieving learning plan")
    }
}

const fetchLearnings = async (userId, topicID = null) => {
    const query = { user: userId };
    if (topicID) query.topic = topicID;

    try {
        const learnings = await Learning.find(query);
        return learnings;
    } catch (error) {
        console.error('Error fetching learnings:', error);
        throw error;
    }
};



const createLearning = async (req, res) => {
    try {
        const { user, topic, words } = req.body
        await newLearning(topic, user, words)
        console.log("success")
        res.json("success")
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Error creating learning plan")
    }
}

const retrieveTopicInfo = async (id, userId) => {
    try {
        let topic = await Topic.findById(id);
        if (!topic) {
            throw new Error('Topic does not exist!');
        }

        topic = topic.toObject();

        const WordModel = getWordModel(topic.language);

        const [words, learning, wordMasteries] = await Promise.all([
            WordModel.find({ _id: { $in: topic.words } }),
            Learning.findOne({ user: userId }),
            // WordMastery.find({ wordId: { $in: topic.words } }),
        ]);

        console.log(words, learning, wordMasteries)
        topic.words = words
        if (learning && wordMasteries?.length) {
            topic.learning = {
                ...learning, words: words.map((word, i) => ({...word.toObject(), level: wordMasteries[i].level }))
            }
        } else {
            // newLearning(id, userId, topic.words);
        }

        return topic;

    } catch (error) {
        console.error('Error retrieving topic information:', error);
        throw error;
    }
}


const updateMastery = async (req, res) => {
    try {
        const { user } = req.query;
        const { topicLearnChunk } = req.body;

        console.log("Incoming update:", req.query, topicLearnChunk);

        const { updatedLearning } = await patchLearningTopic(user, topicLearnChunk);

        if (updatedLearning) {
            return res.status(200).json({ 
                msg: 'Mastery updated successfully',
                updatedLearning
            });            
        }

        return res.status(404).json({ msg: 'No matching learning document found' });
    } catch (error) {
        console.error("Error in updateMastery:", error);
        return res.status(500).json({ msg: 'Internal server error', error });
    }
};



const deleteTopics = async (req, res) => {
    try {
        //console.log('deleting................')
        const topicIds = req.query.topicIds.split(',');
        const deleteTopicResult = await Topic.deleteMany({ _id: { $in: topicIds } });
        //console.log(`${deleteTopicResult.deletedCount} topics deleted successfully`);

        res.status(200).json({
            msg: `${deleteTopicResult.deletedCount} topic${deleteTopicResult.deletedCount && 's'} deleted successfully`
        });
    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
};

const createStory = async (req, res) => {
    try {
        const { topicId } = req.params;
        const story = await createStoryHandler(topicId, req.body)
        res.status(200).json({story})
    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const createStoryHandler = async(topicId, body) => {
    let {userId, leadAuthor, coAuthors, details, title, words, aiAssistance, summary} = body;
    //console.log(userId, details, title, words, aiAssistance, summary, '...creating story')
    try {
        if (aiAssistance === 'Ai co-editor') {
            const genStory = await aiCoEditor(title, summary, words, details);
            //console.log(genStory)
            return genStory
        }
        else if (aiAssistance === 'Ai for you') {
            const genStory = await fullStoryGen(title, summary, words)
            //console.log(genStory);
            ({title, details} = genStory)
        }
        const storyTocreate = {details, title, words}
        if (userId) storyTocreate.leadAuthor = userId;
        if (leadAuthor) storyTocreate.leadAuthor = leadAuthor;
        if (coAuthors?.length) storyTocreate.coAuthors = coAuthors;
        if (topicId) storyTocreate.topic = topicId
        //console.log(topicId, userId, details)
    
        const createdStory = await Story.create(storyTocreate)
        // //console.log(createdStory)
        return createdStory
    } catch (error) {
        //console.log(error.message)
        throw error
    }
}

const createScript = async (req, res) => {
    try {
        const topic = req.params.topicId
        const { title, summary, words, writer, coWriters, players } = req.body
        console.log(req.body)
        const script = 2 //await scriptGen(title, summary, words, players)
        Script.create({
            writer, coWriters: coWriters || [], topic, words, title: script.title, summary: script.summary, details: script.details, characters: script.characters
        })
        res.status(201).json({script})
        generateAudioForScript(script)
        
    } catch (error) {
        console.log(error)
    }
}

const getStories = async(req, res) => {
    const { topicId } = req.params;
    try {
        const stories = await Story.find({ topic: topicId })
        // //console.log(stories)
        res.status(200).json({ stories })

    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const getScripts = async(req, res) => {
    console.log('--- fetch scripts',)
    const { topicId } = req.params;
    console.log(topicId)
    try {
        const group = await TopicScriptGroup.findOne({ topic: topicId })
            .populate({
                path: 'scripts.script',
                model: 'Script'
            })
            .populate({
                path: 'scripts.topics',
                model: 'Topic'
            })
        // //console.log(stories)
        console.log(group)
        res.status(200).json({ stories: group.scripts })

    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const prepareEpisode = async(req, res) => {
    const { scriptID, epIdx } = req.body
    try {
        orchestractor(scriptID, epIdx)
        res.status(204).json({msg: 'success'})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const liveChat = async (req, res) => {
    const { chat: message, words, topic, userID, username, agentPair, type } = req.body
    // console.log(message, words, topic, userID, username, agentPair)
    try {
        let chat = LiveChat.find(userID, topic)
        if (!chat) {
            if (type === "focused" && !(userID && username && topic && words.length)) throw new Error("Provide all the inputs")
            chat = new LiveChat({userID, username, topic, words, agentPair, type})
        }
        const response = await chat.coordinator.reply(message)
        //  = await liveChatHandle(step, chat, words, topic)
        return res.status(200).json({ reply: response, stage: chat.stage })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({ msg: error.message})
    }
}

const saveAgent = async (req, res) => {
    try {
        const { name, age, sex, role, ethnicity, shortDescription, longDescription } = req.body;
        const imageFile = req.file; // This will be handled by multer middleware
        
        if (!imageFile) {
            return res.status(400).json({ 
                message: 'Image file is required',
            });
        }
        
        // Generate a unique key for S3
        const timestamp = Date.now();
        const key = `agents/${timestamp}-${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        
        // Upload image to S3
        await uploadImageToS3(imageFile.buffer, key);
        
        // Create S3 URL
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        
        // Create new agent in MongoDB
        const agent = await Agent.create({
            name,
            age: parseInt(age),
            sex,
            role,
            ethnicity,
            shortDescription,
            longDescription,
            imageUrl
        });
        
        res.status(200).json({ 
            message: 'Agent created successfully',
        });
        
    } catch (error) {
        console.error('Error saving agent:', error);
        res.status(500).json({ 
            message: 'Failed to save agent',
            error: error.message 
        });
    }
};

const getAgents = async (req, res) => {
    try {
        const agents = await Agent.find({})
            .select('name age sex role ethnicity shortDescription longDescription imageUrl')
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.status(200).json({ 
            message: 'Agents retrieved successfully',
            agents 
        });
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ 
            message: 'Failed to fetch agents',
            error: error.message 
        });
    }
};

const saveAgentPair = async (req, res) => {
    try {
        const { agent1, agent2 } = req.body;
        
        // Create new agent pair
        const agentPair = await AgentPair.create({
            supervisor: agent1._id,
            instructor: agent2._id
        });

        // Populate the agent details
        await agentPair.populate([
            { path: 'supervisor', select: 'name age sex ethnicity shortDescription imageUrl' },
            { path: 'instructor', select: 'name age sex ethnicity shortDescription imageUrl' }
        ]);
        
        res.status(200).json({ 
            message: 'Agent pair created successfully',
            agentPair 
        });
        
    } catch (error) {
        console.error('Error saving agent pair:', error);
        
        // Handle duplicate pair error
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'This agent pair already exists',
                error: 'Duplicate pair'
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to save agent pair',
            error: error.message 
        });
    }
};

const getAgentPairs = async (req, res) => {
    try {
        const agentPairs = await AgentPair.find({})
            .populate([
                { path: 'supervisor', select: 'name age sex ethnicity shortDescription imageUrl' },
                { path: 'instructor', select: 'name age sex ethnicity shortDescription imageUrl' }
            ])
            .sort({ createdAt: -1 });
        
        res.status(200).json({ 
            message: 'Agent pairs retrieved successfully',
            agentPairs 
        });
    } catch (error) {
        console.error('Error fetching agent pairs:', error);
        res.status(500).json({ 
            message: 'Failed to fetch agent pairs',
            error: error.message 
        });
    }
};

const searchTopics = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        console.log(searchTerm)
        if (!searchTerm) {
            return res.status(400).json({ error: "Search term is required" });
        }

        // First search for topics by name
        const nameMatches = await Topic.find({
            name: { $regex: searchTerm, $options: 'i' },
            words: { $exists: true, $ne: [] }  // Ensure words array exists and is not empty
        }).populate('parent', 'name').lean();

        // If we have less than 5 results, also search by parent name
        if (nameMatches.length < 3) {
            const parentMatches = await Topic.find({
                'parent.name': { $regex: searchTerm, $options: 'i' }
            }).populate('parent', 'name').lean();

            // Combine results, ensuring no duplicates
            const combinedResults = [...nameMatches];
            parentMatches.forEach(topic => {
                if (!combinedResults.find(t => t._id.toString() === topic._id.toString())) {
                    combinedResults.push(topic);
                }
            });

            return res.status(200).json({ topics: combinedResults });
        }

        return res.status(200).json({ topics: nameMatches });

    } catch (error) {
        console.error('Error searching topics:', error);
        res.status(500).json({ error: error.message || "Error searching topics" });
    }
};

export {
    createNewTopic,
    getTopics,
    getLearning, createLearning,
    updateMastery,
    deleteTopics,
    createStory,
    createStoryHandler,
    createScript,
    getStories,
    getScripts,
    prepareEpisode,
    getSuggestions,
    saveTopics,
    liveChat, saveAgent,
    getAgents,
    saveAgentPair,
    getAgentPairs,
    searchTopics
};
