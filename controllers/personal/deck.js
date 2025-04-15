import Deck from '../../models/deck.js';
import getWordModel from '../../models/word/word.js'
import Story from '../../models/story.js';
import { fullStoryGen, aiCoEditor } from '../../utils/openai-process/storyGenerator.js'
import scriptGen from "../../utils/openai-process/actingScriptGenerator.js"
import generateAudioForScript from '../../utils/openai-process/generateAudio.js';
import Script from '../../models/script.js';
import generate from '../../utils/openai-process/generateDecks.js';
import createCascadingDecks from '../../utils/insertAutoDecks.js';
import { wordProcessing } from './words.js';

import { Learning, WordMastery, newLearning, wordMasteryUpdate, patchLearningDeck, pushNewDeck } 
from '../../models/learning/learning.js'

const createNewDeck = async (deckId, deckName, userId, deckLang, parent) => {
    try {
        let deck;
        if (deckId) {
            deck = await Deck.findById(deckId)
        }
        else {
            deck = new Deck({
                deckName,
                creator: userId,
                deckLang,
                parent,
                words: [],
            });
        }
        return deck

    } catch (error) {
        console.error('Error creating or retrieving deck metadata:', error);
    }
    
}

const generateDecksWithAI = async (creator, language="english", fields) => {
    try {
        const decks = bringSample() //await generate(fields)
        return await createCascadingDecks(creator, language, Object.fromEntries(Object.entries(decks).slice(0, 30)))
        // wordProcessing({
        //     language: language, new_words_to_add: leafDecks
        // })
        console.log(decks)
        // // console.log(leafDecks)
    } catch (error) {
        console.log(error)
        return []
    }
}

const getDecks = async(req, res) => {
    const { user, creator, language: deckLang } = req.query;
    try {
        const filters = {};
        if (creator) filters.creator = user;
        if (deckLang) filters.deckLang = deckLang;
        let decks = await Deck.find(filters);
        console.log(filters, decks, creator)
        if (!Object.keys(filters).length && !decks.length) {
            decks = await generateDecksWithAI(user, deckLang)
        } 
        try {
            const existingLearning = (await Learning.findOne({ user }))?.toObject()
            res.status(200).json({decks, userLearning: existingLearning || {}})
        } catch (error) {
            res.status(404).json({ message: "Error with fetching the learning plan for this user"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
    
}

const getDeck = async (req, res) => {
    const { deckId, userId } = req.query;
    try {
        const deck = await retrieveDeckInfo(deckId, userId)
        return res.status(200).json( { deck })
    } catch (error) {
        res.status(500).json( { msg: error })
    }
}
const retrieveDeckInfo = async (deckId, userId) => {
    // //console.log('deckId', deckId)
    try {
        let deck = (await Deck.findById(deckId));
        if (!deck) throw new Error('deck does not exist!')
        deck = deck.toObject()
        const WordModel = getWordModel(deck.deckLang)
        const deckWordIdList = deck.words
        deck.words = await WordModel.find( {'_id': {$in: deckWordIdList} })
        const existingLearning = (await Learning.findOne({ user: userId }))?.toObject()
        let createdLearning, wordMasteries, updatedLearning;
        if (!existingLearning) {
            ( { createdLearning, wordMasteries} = await newLearning(deckId, userId, deckWordIdList) )
        }
        else if (!existingLearning.decks.find(deck => deck.deckId.toString() === deckId)) {
            ( { updatedLearning, wordMasteries} = await pushNewDeck(deckId, userId, deckWordIdList) )
        }

        const learning = updatedLearning || existingLearning || createdLearning
        const learningDeck = learning?.decks?.find(deckHere => {if (deckHere.deckId.toString() === deckId) return {words: deckHere.words, performance: deckHere.performance, chunkIndex: deckHere.chunkIndex } }) || {}
        const learningWords = deck.words.filter( word => learningDeck.words?.some(wordId => wordId?.equals(word._id)) )
        const learningWordMasteries = wordMasteries || await WordMastery.find({'wordId': {$in: learningDeck.words } })

        // //console.log(learningWords?.length, learningWordMasteries?.length, wordMasteries, await WordMastery.find({'wordId': {$in: learningDeck.words } }), '....end')
        deck.learning = {
            ...learningDeck,
            words: learningWords?.map((word, i) => ({...word.toObject(), level: learningWordMasteries[i] }) )
        }
        // //console.log(deck.learning)
        return deck
    } catch (error) {
        //console.log(error, '---------------85')
        throw error
    }
}

const updateMastery = async (req, res) => {
    //console.log(req.query)
    try {
        const { deckId, userId } = req.query
        const { wordsMasteriesList, deckLearnChunk } = req.body
        //console.log(req.query, deckLearnChunk._id)
        const updatedMasteries = await wordMasteryUpdate(wordsMasteriesList)
        const { updatedLearning, newWordMasteries } = await patchLearningDeck(userId, deckLearnChunk)
        if (newWordMasteries && updatedLearning && updatedMasteries ) {
            const deck = await retrieveDeckInfo(deckId, userId)
            return res.status(200).json({ deck, msg: 'Mastery updated successfully, and user leveled up' })            
        }
        if (updatedMasteries && updatedLearning) {
            const deck = await retrieveDeckInfo(deckId, userId)
            return res.status(200).json({ deck, msg: 'Mastery updated successfully' })
        }
    } catch (error) {
        //console.log(error)
        return res.status(500).json( { msg: error })
    }
}

const deleteDecks = async (req, res) => {
    try {
        //console.log('deleting................')
        const deckIds = req.query.deckIds.split(',');
        const deleteDeckResult = await Deck.deleteMany({ _id: { $in: deckIds } });
        //console.log(`${deleteDeckResult.deletedCount} decks deleted successfully`);

        res.status(200).json({
            msg: `${deleteDeckResult.deletedCount} deck${deleteDeckResult.deletedCount && 's'} deleted successfully`
        });
    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
};

const createStory = async (req, res) => {
    try {
        const { deckId } = req.params;
        const story = await createStoryHandler(deckId, req.body)
        res.status(200).json({story})
    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const createStoryHandler = async(deckId, body) => {
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
        if (deckId) storyTocreate.deck = deckId
        //console.log(deckId, userId, details)
    
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
        const deck = req.params.deckId
        const { title, summary, words, players, writer, coWriters } = req.body
        console.log(req.body)
        const script = await scriptGen(title, summary, words, players)
        Script.create({
            writer, coWriters: coWriters || [], deck, words, title: script.title, summary: script.summary, details: script.details
        })
        res.status(201).json({script})
        generateAudioForScript(script, players)
        
    } catch (error) {
        console.log(error)
    }
}

const getStories = async(req, res) => {
    const { deckId } = req.params;
    try {
        const stories = await Story.find({ deck: deckId })
        // //console.log(stories)
        res.status(200).json({ stories })

    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const getScripts = async(req, res) => {
    const { deckId } = req.params;
    try {
        const stories = await Script.find({ deck: deckId })
        // //console.log(stories)
        res.status(200).json({ stories })

    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

export {
    createNewDeck,
    getDecks,
    getDeck,
    updateMastery,
    deleteDecks,
    createStory,
    createStoryHandler,
    createScript,
    getStories,
    getScripts
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
        "industries_and_domains": {
          "engineering": {
            "software_engineering": [
              "coding",
              "debugging",
              "agile methodologies",
              "version control"
            ],
            "mechanical_engineering": [
              "thermodynamics",
              "machine design",
              "manufacturing processes"
            ],
            "civil_engineering": [
              "construction vocabulary",
              "materials",
              "urban planning"
            ],
            "electrical_and_electronics": [
              "circuits",
              "power systems",
              "semiconductors"
            ],
            "aerospace": [
              "aerodynamics",
              "spacecraft",
              "navigation"
            ]
          },
          "health_and_medicine": {
            "general_health": [
              "body parts",
              "illnesses and symptoms",
              "medications",
              "first aid"
            ],
            "hospital_and_clinic": [
              "check-ups",
              "emergency",
              "appointments",
              "surgery"
            ],
            "mental_health": [
              "stress",
              "therapy",
              "emotions"
            ],
            "healthcare_professions": [
              "doctor-patient communication",
              "nurses",
              "medical research"
            ]
          },
          "law_and_government": {
            "legal_basics": [
              "contracts",
              "lawsuits",
              "rights and obligations"
            ],
            "politics": [
              "elections",
              "policies",
              "debates",
              "parties"
            ],
            "international_relations": [
              "diplomacy",
              "treaties",
              "conflict resolution"
            ]
          },
          "education": {
            "academic_skills": [
              "reading comprehension",
              "writing essays",
              "note-taking",
              "research methods"
            ],
            "teaching_and_learning": [
              "classroom language",
              "instruction methods",
              "student-teacher interaction"
            ],
            "fields_of_study": {
              "science": [
                "biology",
                "physics",
                "chemistry",
                "earth science"
              ],
              "humanities": [
                "history",
                "philosophy",
                "literature"
              ],
              "mathematics": [
                "algebra",
                "geometry",
                "statistics"
              ]
            }
          },
          "technology": {
            "computing_basics": [
              "hardware",
              "software",
              "networks",
              "internet"
            ],
            "data_science_and_ai": [
              "machine learning",
              "data analysis",
              "big data"
            ],
            "cybersecurity": [
              "threats",
              "protection methods",
              "encryption"
            ],
            "web_and_mobile_development": [
              "frontend",
              "backend",
              "UI/UX",
              "apps"
            ]
          },
          "media_and_entertainment": {
            "film_and_tv": [
              "genres",
              "production terms",
              "criticism"
            ],
            "music": [
              "genres",
              "instruments",
              "performance terms"
            ],
            "journalism": [
              "reporting",
              "editorials",
              "interviews"
            ],
            "literature_and_poetry": [
              "literary devices",
              "genres",
              "analysis terms"
            ]
          },
          "travel_and_transport": {
            "air_travel": [
              "boarding",
              "customs",
              "in-flight experience"
            ],
            "urban_transport": [
              "buses",
              "trains",
              "ride-hailing apps"
            ],
            "hospitality": [
              "hotels",
              "reservations",
              "customer service"
            ],
            "tourism": [
              "sightseeing",
              "itineraries",
              "cultural etiquette"
            ]
          },
          "environment_and_sustainability": [
            "climate change",
            "renewable energy",
            "pollution",
            "conservation",
            "green technology"
          ]
        },
        "culture_and_society": {
          "religion_and_philosophy": [
            "belief systems",
            "moral values",
            "life and death"
          ],
          "traditions_and_customs": [
            "weddings",
            "funerals",
            "holidays",
            "rites of passage"
          ],
          "diversity_and_inclusion": [
            "equality",
            "bias",
            "representation"
          ],
          "slang_and_informal_speech": [
            "teen slang",
            "regional dialects",
            "pop culture references"
          ]
        }
      }
      
)