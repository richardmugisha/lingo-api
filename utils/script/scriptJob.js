import mongoose from 'mongoose';
import Topic from '../../models/topic.js';
import TopicScriptGroup from '../../models/topicScriptGroup.js';
import structureBuild from './structure-writer/index.js';
import getWordModel from  "../../models/word/word.js"
import orchestractor from './orchestrator/index.js';

async function scriptJob() {
    try {
        // 1. Find topics that have parent and words
        const topicsWithParent = await Topic.find({
            parent: { $ne: null },
            words: { $exists: true, $not: { $size: 0 } }
        }).populate('parent');

        // 2. Group topics by their parent and language
        const topicsByParent = topicsWithParent.reduce((acc, topic) => {
            const parentId = topic.parent._id.toString();
            if (!acc[parentId]) {
                acc[parentId] = {
                    parent: topic.parent,
                    language: topic.language,
                    topics: []
                };
            }
            acc[parentId].topics.push(topic);
            return acc;
        }, {});

        // 3. Convert to array and filter groups with enough topics
        const parentGroups = Object.values(topicsByParent)
            .filter(group => group.topics.length >= 3);

        if (parentGroups.length === 0) {
            console.log('No valid parent groups found with enough topics');
            return;
        }

        // 4. Randomly select one parent group
        const selectedGroup = parentGroups[Math.floor(Math.random() * parentGroups.length)];
        const parentTopic = selectedGroup.parent;
        const language = selectedGroup.language;

        // 5. Find or create TopicScriptGroup
        let topicScriptGroup = await TopicScriptGroup.findOne({ topic: parentTopic._id });
        
        if (!topicScriptGroup) {
            topicScriptGroup = new TopicScriptGroup({
                topic: parentTopic._id,
                scripts: [],
                usedTopics: []
            });
        }

        // 6. Add new topics to usedTopics if they don't exist
        const newTopics = selectedGroup.topics.filter(topic => 
            !topicScriptGroup.usedTopics.includes(topic._id)
        );
        
        if (newTopics.length > 0) {
            topicScriptGroup.usedTopics.push(...newTopics.map(t => t._id));
        }

        // 7. Select 3-5 random topics from usedTopics
        const numTopicsToUse = Math.floor(Math.random() * 3) + 3; // Random number between 3-5
        const selectedTopics = [];
        
        for (let i = 0; i < numTopicsToUse && topicScriptGroup.usedTopics.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * topicScriptGroup.usedTopics.length);
            selectedTopics.push(topicScriptGroup.usedTopics.splice(randomIndex, 1)[0]);
        }

        if (selectedTopics.length === 0) {
            console.log('No topics available for script creation');
            return;
        }

        // 8. Get the appropriate word model for the language
        const WordModel = getWordModel(language);

        // 9. Create topicData structure for structureBuild
        const selectedTopicsWithWords = await Topic.find({
            _id: { $in: selectedTopics }
        });

        // 10. Get words for each topic using the correct word model
        const topicsWithWords = await Promise.all(
            selectedTopicsWithWords.map(async (topic) => {
                const words = await WordModel.find({
                    _id: { $in: topic.words }
                });
                return {
                    topic: topic.name,
                    words: words.map(word => word.word)
                };
            })
        );

        const topicData = {
            topic: parentTopic.name,
            subtopics: topicsWithWords
        };

        // return console.log(JSON.stringify(topicData))

        // 11. Generate script structure
        const newScript = await structureBuild(topicData);
        
        // 13. Add script to TopicScriptGroup
        topicScriptGroup.scripts.push({
            script: newScript._id,
            topics: selectedTopics,
            done: false,
            createdAt: new Date()
        });

        // 14. Add selected topics back to the beginning of usedTopics
        topicScriptGroup.usedTopics.unshift(...selectedTopics);

        // 15. Save the TopicScriptGroup
        await topicScriptGroup.save();

        await orchestractor(newScript._id, 0)

        console.log(`Successfully created script for parent topic: ${parentTopic.name}`);
        return topicScriptGroup;

    } catch (error) {
        console.error('Error in scriptJob:', error);
        throw error;
    }
}

export default scriptJob;
