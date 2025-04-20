
import getWordModel from '../../models/word/word.js'
import { createNewTopic } from './topic.js'
import wordDefinition from '../../utils/openai-process/wordDefinition.js'
import Topic from '../../models/topic.js'

import { searchThrough } from '../../utils/stringCompare.js'


const searchWords = async (req, res) => {
    try {
        const { language, word } = req.query;
        //console.log(language, word)
        const WordModel = getWordModel(language);
        const searchWords = await WordModel.find({ word: new RegExp(`^${word}`, 'i') });
        res.json({searchWords});

    } catch (error) {
        res.json({ message: 'Error', error: error.message})
    }
}

const getWords = async (req, res) => {
    try {
        const wordList = req.query.words.split(",")
        const language = req.query.language || "english"
        const WordModel = getWordModel(language);
        console.log(wordList)
        const words =  await WordModel.find({ _id: { $in: wordList } })
        res.json({ words })
    } catch (error) {
        console.log(error.message)
        res.json({ message: 'Error', error: error.message})
    }
}

const addWordToTopic = async (body) => {
    try {
        // ! Need to clearn these console.logs
        // TODO: make sure you remove those
        //console.log('........................add to word topic')
        const { name, id, userId, language, words } = body
        const topic = await createNewTopic(id, name, userId, language);
        if (!topic) throw new Error(`The topic with id: ${name} doesn't exist!`)
        const WordModel = getWordModel(language);
        const query = words.map(w => ({ word: w.word, example: w.context }));
        const wordsToSave = await WordModel.find({ $or: query });
        // const wordsToSave = await WordModel.find({ word: {$in: words}})
        topic.words = topic.words.concat(wordsToSave)
        // //topic.words = topic.words.concat(words)
        //console.log(topic, '........different issue')
        await topic.save()
        //console.log('......................success with add to word topic')
        return {msg: 'success', topic: {name: topic.name, id: topic._id}}
    } catch (error) {
        //console.log(error.message)
        return { msg: 'error', error: error.message}
    }
}

const addToWishList = async (body, app) => {
    try {
        console.log('...................... add to wish')
        const { name, id, userId, language, words } = body
        const topic = await createNewTopic(id, name, userId, language);
        if (!topic) throw new Error(`The topic with id: ${name} doesn't exist!`)
        await topic.save()
        if (!app.new_words_to_add.has(language)) app.new_words_to_add.set(language, [])

        app.new_words_to_add.get(language).push({ creator: userId, topic: topic._id, words: words.map(w => ({ word: w.word, example: w.context })) })
        await app.save()
        console.log('....................success with add to wish', app)
        return {msg: 'success', topic: topic._id}
    } catch (error) {
        console.log(error.message)
        return {msg: 'error', error: error.message}
    }
}

//if (app.new_words_to_add.length >= app.max_wishes) 
const wordProcessing = async (app) => {
    try {
        if (app.new_words_to_add?.length > 20) return console.log("T..........oo many words. max is 20")
        const wordsToProcess = app.new_words_to_add.reduce((wordList, wordGroup) => [ ...wordList, ...wordGroup.words], [])
        console.log('...........................openai process', wordsToProcess.length)
        const definitions = await wordDefinition(wordsToProcess, 'regular topic')
        // console.log(processedWords.length, 'xxxxxxxxxxxxxxxxxxxxxxxx processed words')
        const savedWords = await dictionaryPopulating(definitions, app.language)
        // let rangeStart = 0
        // const ranges = app.new_words_to_add.map(curr => { const rangeEnd = rangeStart + curr.words.length; const newRange = [rangeStart, rangeEnd]; rangeStart = rangeEnd; return newRange})
        console.log(savedWords)
        if (!savedWords?.length) return
        const eachTopic = async (wordObj, savedWords) => {
            try {
                const topicNewWords = wordObj.words.map((inputWordObj) => {
                    return searchThrough(inputWordObj, savedWords);
                });
        
                // Use $push with $each to add the new words
                await Topic.findByIdAndUpdate(
                    wordObj.topic,
                    { $push: { words: { $each: topicNewWords } } },
                    { new: true }
                );
            } catch (error) {
                throw new Error(`\n-----error with adding words to topic: ${wordObj.topic} \n${error}`);
            }
        };
        
        await Promise.all(app.new_words_to_add.map(async (wordObj, i) => eachTopic(wordObj, savedWords )))
        return {msg: 'success'}
    }
    catch (error) {
        //console.log(error)
        throw new Error(`\n-----Error with word processing: ${error}`)
        return {msg: 'error', error: error.message}
    }
}

const dictionaryPopulating = async (processedWords, language) => {
    //console.log('........................................processing: saving words');
    try {
        const WordModel = getWordModel(language);
        const savedWords = await Promise.all(processedWords.map( async (word) => {
                                try {
                                    const savedWord = await WordModel.create({...word, language});
                                    return savedWord;
                                } catch (error) {
                                    if (error.name === 'MongoServerError' && error.code === 11000 && error.duplicatedDoc) {
                                        // Handle the duplicate by using the duplicatedDoc attached in middleware
                                        return error.duplicatedDoc;
                                    } else {
                                        console.log('An unexpected error occurred:', error.message);
                                    }
                                }
                            }));
        
        return savedWords;
    } catch (error) {
        console.log('An error occurred during DB operation:', error.message);
    }
};


export {
    searchWords,
    getWords,
    addWordToTopic,
    addToWishList,
    wordProcessing
}