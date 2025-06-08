
import Story from "../../../models/story/story.js"
import chapter from "../../../models/story/chapter.js";

const patchStory = async (req, res) => {
    try {
        const { id, item, update } = req.body
        switch(item) {
            case 'outline':
                const story = await outlineUpdate(id, update);
                res.status(200).json({ story });
                break;
            default:
                res.status(400).json({ msg: "Invalid update item" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}

const outlineUpdate = async (id, update) => {
    try {
        const story = await Story.findById(id);
        if (!story) throw new Error("Story not found");
        
        story.outline = update;
        await story.save();
        
        return story;
    } catch (error) {
        throw error
    }
}

const patchChapter = async (req, res) => {
    try {
        const { id, item, update } = req.body
        switch(item) {
            case 'details':
                const chapter = await detailsUpdate(id, update);
                res.status(200).json({ chapter });
                break;
            case 'words':
                const chapterWithWords = await wordsUpdate(id, update);
                res.status(200).json({ chapter: chapterWithWords });
                break;
            default:
                res.status(400).json({ msg: "Invalid update item" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}


const detailsUpdate = async(id, update) => {
    try {
        const chapterDoc = await chapter.findById(id);
        if (!chapterDoc) throw new Error("Chapter not found");
        
        chapterDoc.details.push(update);
        await chapterDoc.save();
        
        return chapterDoc;
    } catch (error) {
        throw error
    }
}

const wordsUpdate = async(id, update) => {
    try {
        const chapterDoc = await chapter.findById(id);
        if (!chapterDoc) throw new Error("Chapter not found");
        
        chapterDoc.words.push(update);
        await chapterDoc.save();
        
        return chapterDoc;
    } catch (error) {
        throw error
    }
}


export {
    patchStory,
    patchChapter
}