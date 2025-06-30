
import Story from "../../../models/story/story.js"
import chapter from "../../../models/story/chapter.js";

const patchStory = async (req, res) => {
    try {
        const { id, item, update } = req.body
        let story;
        switch(item) {
            case 'outline':
                story = await outlineUpdate(id, update);
                res.status(200).json({ story });
                break;
            case 'details':
                story = await detailsUpdate(id, update);
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
        const storyDoc = await Story.findById(id);
        if (!storyDoc) throw new Error("Chapter not found");
        
        storyDoc.details.push(update);
        await storyDoc.save();
        
        return storyDoc;
    } catch (error) {
        throw error
    }
}

// const wordsUpdate = async(id, update) => {
//     try {
//         const chapterDoc = await chapter.findById(id);
//         if (!chapterDoc) throw new Error("Chapter not found");
        
//         chapterDoc.words.push(update);
//         await chapterDoc.save();
        
//         return chapterDoc;
//     } catch (error) {
//         throw error
//     }
// }

const patchEditDetails = async(req, res) => {
    try {
        const { id, list, edit } = req.body
        // Find the story by id
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ msg: "Story not found" });
        }

        // Remove details at the specified indices
        // Sort indices descending so splicing doesn't affect subsequent indices
        const sortedIndices = [...list].sort((a, b) => b - a);
        for (const idx of sortedIndices) {
            story.details.splice(idx, 1);
        }

        // Insert the new edit at list[0]
        const insertIndex = list[0];
        story.details.splice(insertIndex, 0, edit);

        await story.save();

        res.status(200).json({ message: "edited successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}

const patchDeleteDetails = async(req, res) => {
    const { id, list: theList } = req.query
    const list = theList
    try {
        // INSERT_YOUR_CODE
        // Find the story by id
        console.log(id)
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ msg: "Story not found" });
        }

        // Sort indices descending so splicing doesn't affect subsequent indices
        const sortedIndices = [...list].sort((a, b) => b - a);
        for (const idx of sortedIndices) {
            story.details.splice(idx, 1);
        }

        await story.save();

        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}

export {
    patchStory,
    patchChapter,
    patchEditDetails,
    patchDeleteDetails
}