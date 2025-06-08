
import Story from "../../../models/story/story.js"
import Chapter from "../../../models/story/chapter.js";
// import { fullStoryGen, aiCoEditor } from "../../../utils/story/storyGenerator";

const createStory = async (req, res) => {
    try {
        const { topicId } = req.params;
        const story = await handler(topicId, req.body)
        res.status(200).json({story})
    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const handler = async(topicId, body) => {
    let {userId, leadAuthor, coAuthors, details, title, words, aiAssistance, summary, outline} = body;
    //console.log(userId, details, title, words, aiAssistance, summary, '...creating story')
    try {
        // if (aiAssistance === 'Ai co-editor') {
        //     const genStory = await aiCoEditor(title, summary, words, details);
        //     //console.log(genStory)
        //     return genStory
        // }
        // else if (aiAssistance === 'Ai for you') {
        //     const genStory = await fullStoryGen(title, summary, words)
        //     //console.log(genStory);
        //     ({title, details} = genStory)
        // }

        const storyTocreate = {details, title, words}
        if (userId) storyTocreate.leadAuthor = userId;
        if (leadAuthor) storyTocreate.leadAuthor = leadAuthor;
        if (coAuthors?.length) storyTocreate.coAuthors = coAuthors;
        storyTocreate.outline = outline || ""
        // if (topicId) storyTocreate.topic = topicId
        //console.log(topicId, userId, details)
    
        const createdStory = await Story.create(storyTocreate)
        // //console.log(createdStory)
        return createdStory
    } catch (error) {
        //console.log(error.message)
        throw error
    }
}


const createChapter = async(req, res) => {
    const { storyID } = req.body
    try {
        if (!storyID) return res.status(404).json({msg: "invalid story id"})
        const chapter = await Chapter.create({
            story: storyID
        })
        res.status(200).json({ chapter })
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export {
    createStory,
    handler,
    createChapter
}