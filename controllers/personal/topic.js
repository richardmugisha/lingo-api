import Topic from '../../models/topic.js';
import getWordModel from '../../models/word/word.js'
import Story from '../../models/story.js';
import { fullStoryGen, aiCoEditor } from '../../utils/story/storyGenerator.js'
// import scriptGen from "../../utils/script/actingScriptGenerator.js"
import generateAudioForScript from '../../utils/script/generateAudio.js';
import Script from '../../models/script.js';
import TopicScriptGroup from '../../models/topicScriptGroup.js';
import generateTopics from '../../utils/topic/generateTopics.js';
import generateWords from '../../utils/word/executors/generateWords.js';
import createCascadingTopics from '../../utils/topic/insertTopics.js';
import orchestractor from '../../utils/script/orchestrator/index.js';
import liveChatHandle from '../../utils/live-chat/index.js'

import { Learning, newLearning, wordMasteryUpdate, patchLearningTopic, pushNewTopic } 
from '../../models/learning/learning.js'

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
        const { parent, language, creator, topics } = req.body
        console.log( parent, language, creator, topics)
        await createCascadingTopics(creator, language, topics, parent)
        res.status(200).json({msg: "success"})
        // console.log(topics)
    } catch (error) {
        console.log(error)
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
    const { chat, step, words, topic } = req.body
    try {
        const response = await liveChatHandle(step, chat, words, topic)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

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
    liveChat
};

const bringSample = () => (
    {
        "life_skills": {
          "communication": [
            "public speaking",
            "negotiation",
            "persuasion",
            "debate",
            "conflict resolution",
            "nonverbal communication"
          ],
          "emotions_and_relationships": [
            "friendship",
            "romantic relationships",
            "family",
            "empathy",
            "apologies and forgiveness",
            "gratitude and compliments"
          ],
          "critical_thinking": [
            "reasoning",
            "decision-making",
            "problem-solving",
            "evaluating arguments"
          ],
          "financial_literacy": [
            "budgeting",
            "saving and investing",
            "credit and loans",
            "financial planning",
            "insurance",
            "taxes"
          ],
          "personal_development": [
            "goal setting",
            "self-discipline",
            "confidence and self-esteem",
            "productivity",
            "time management"
          ]
        },
        "career_and_professional_life": {
          "job_search_and_interviews": [
            "resumes and cover letters",
            "job interviews",
            "networking",
            "salary negotiation"
          ],
          "workplace_vocabulary": [
            "teamwork",
            "leadership",
            "project management",
            "conflict at work",
            "meetings and presentations",
            "corporate jargon"
          ],
          "entrepreneurship": [
            "startups",
            "pitching ideas",
            "fundraising",
            "business plans",
            "customer development"
          ],
          "business_and_management": {
            "finance": [
              "accounting",
              "investments",
              "banking",
              "economics"
            ],
            "marketing": [
              "branding",
              "advertising",
              "market research",
              "social media"
            ],
            "operations": [
              "supply chain",
              "logistics",
              "quality control"
            ],
            "human_resources": [
              "recruitment",
              "training and development",
              "performance review"
            ]
          }
        },
        // "industries_and_domains": {
        //   "engineering": {
        //     "software_engineering": [
        //       "coding",
        //       "debugging",
        //       "agile methodologies",
        //       "version control"
        //     ],
        //     "mechanical_engineering": [
        //       "thermodynamics",
        //       "machine design",
        //       "manufacturing processes"
        //     ],
        //     "civil_engineering": [
        //       "construction vocabulary",
        //       "materials",
        //       "urban planning"
        //     ],
        //     "electrical_and_electronics": [
        //       "circuits",
        //       "power systems",
        //       "semiconductors"
        //     ],
        //     "aerospace": [
        //       "aerodynamics",
        //       "spacecraft",
        //       "navigation"
        //     ]
        //   },
        //   "health_and_medicine": {
        //     "general_health": [
        //       "body parts",
        //       "illnesses and symptoms",
        //       "medications",
        //       "first aid"
        //     ],
        //     "hospital_and_clinic": [
        //       "check-ups",
        //       "emergency",
        //       "appointments",
        //       "surgery"
        //     ],
        //     "mental_health": [
        //       "stress",
        //       "therapy",
        //       "emotions"
        //     ],
        //     "healthcare_professions": [
        //       "doctor-patient communication",
        //       "nurses",
        //       "medical research"
        //     ]
        //   },
        //   "law_and_government": {
        //     "legal_basics": [
        //       "contracts",
        //       "lawsuits",
        //       "rights and obligations"
        //     ],
        //     "politics": [
        //       "elections",
        //       "policies",
        //       "debates",
        //       "parties"
        //     ],
        //     "international_relations": [
        //       "diplomacy",
        //       "treaties",
        //       "conflict resolution"
        //     ]
        //   },
        //   "education": {
        //     "academic_skills": [
        //       "reading comprehension",
        //       "writing essays",
        //       "note-taking",
        //       "research methods"
        //     ],
        //     "teaching_and_learning": [
        //       "classroom language",
        //       "instruction methods",
        //       "student-teacher interaction"
        //     ],
        //     "fields_of_study": {
        //       "science": [
        //         "biology",
        //         "physics",
        //         "chemistry",
        //         "earth science"
        //       ],
        //       "humanities": [
        //         "history",
        //         "philosophy",
        //         "literature"
        //       ],
        //       "mathematics": [
        //         "algebra",
        //         "geometry",
        //         "statistics"
        //       ]
        //     }
        //   },
        //   "technology": {
        //     "computing_basics": [
        //       "hardware",
        //       "software",
        //       "networks",
        //       "internet"
        //     ],
        //     "data_science_and_ai": [
        //       "machine learning",
        //       "data analysis",
        //       "big data"
        //     ],
        //     "cybersecurity": [
        //       "threats",
        //       "protection methods",
        //       "encryption"
        //     ],
        //     "web_and_mobile_development": [
        //       "frontend",
        //       "backend",
        //       "UI/UX",
        //       "apps"
        //     ]
        //   },
        //   "media_and_entertainment": {
        //     "film_and_tv": [
        //       "genres",
        //       "production terms",
        //       "criticism"
        //     ],
        //     "music": [
        //       "genres",
        //       "instruments",
        //       "performance terms"
        //     ],
        //     "journalism": [
        //       "reporting",
        //       "editorials",
        //       "interviews"
        //     ],
        //     "literature_and_poetry": [
        //       "literary devices",
        //       "genres",
        //       "analysis terms"
        //     ]
        //   },
        //   "travel_and_transport": {
        //     "air_travel": [
        //       "boarding",
        //       "customs",
        //       "in-flight experience"
        //     ],
        //     "urban_transport": [
        //       "buses",
        //       "trains",
        //       "ride-hailing apps"
        //     ],
        //     "hospitality": [
        //       "hotels",
        //       "reservations",
        //       "customer service"
        //     ],
        //     "tourism": [
        //       "sightseeing",
        //       "itineraries",
        //       "cultural etiquette"
        //     ]
        //   },
        //   "environment_and_sustainability": [
        //     "climate change",
        //     "renewable energy",
        //     "pollution",
        //     "conservation",
        //     "green technology"
        //   ]
        // },
        // "culture_and_society": {
        //   "religion_and_philosophy": [
        //     "belief systems",
        //     "moral values",
        //     "life and death"
        //   ],
        //   "traditions_and_customs": [
        //     "weddings",
        //     "funerals",
        //     "holidays",
        //     "rites of passage"
        //   ],
        //   "diversity_and_inclusion": [
        //     "equality",
        //     "bias",
        //     "representation"
        //   ],
        //   "slang_and_informal_speech": [
        //     "teen slang",
        //     "regional dialects",
        //     "pop culture references"
        //   ]
        // }
      }
      
)