
import Story, { Scene } from "../../../models/story/story.js"
import { logWritingProgress } from "../../../models/story/log_goal.js";
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
            case 'scene':
                story = await sceneUpdate(id, update);
                res.status(200).json({ message: "Updated Scene successfully" });
                break;
            case 'title':
                story = await titleUpdate(id, update)
                res.status(200).json({message: "Updated title successfully"})
                break;
            default:
                res.status(400).json({ msg: "Invalid update item" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}

const titleUpdate = async (id, update) => {
    try {
        const story = await Story.findByIdAndUpdate(id, {title: update})
        if (!story) {
            return res.status(404).json({ msg: "Story not found" });
        }
        return true
    } catch (error) {
        res.status(500).json({msg: error.message})
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
                const chapter = await sceneUpdate(id, update);
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


const sceneUpdate = async(id, update) => {
    try {
        // Validate that update._id exists and is a valid ObjectId
        if (!update._id) {
            throw new Error("Scene ID is required");
        }
        
        // Check if the scene exists first
        const existingScene = await Scene.findById(update._id);
        if (!existingScene) {
            throw new Error("Scene not found");
        }
        
        // Update the scene
        const updatedScene = await Scene.findByIdAndUpdate(
            update._id,
            update,
            { new: true, runValidators: true }
        );

        if (!updatedScene) {
            throw new Error("Failed to update scene");
        }
        
        return updatedScene;
    } catch (error) {
        console.error('Scene update error:', error);
        throw error;
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

const patchTypeSettings = async(req, res) => {
    const { id, typeSettings } = req.body
    try {
        // Find and update the story's typeSettings in one operation
        const story = await Story.findByIdAndUpdate(
            id, 
            { typeSettings: typeSettings },
            { new: true }
        );
        
        if (!story) {
            return res.status(404).json({ msg: "Story not found" });
        }

        res.status(200).json({ message: "typeSettings updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}

const patchChapterLog = async(req, res) => {
    const { id, chapterLog } = req.body
    try {
        const story = await Story.findByIdAndUpdate(
            id,
            { chapters: chapterLog},
            { new: true}
        )
        if (!story) {
            return res.status(404).json({ msg: "Story not found" });
        }

        res.status(200).json({ message: "pageSettings updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
}


const updateWriterLog = async (req, res) => {
  try {
    const {userID, date, words} = req.body

    if (!words || typeof words !== 'number' || words <= 0) {
      return res.status(400).json({ error: 'Invalid word count' });
    }

    const logDate = date ? new Date(date) : new Date();
    console.log(userID)
    const result = await logWritingProgress({userId: userID, date: logDate, words});

    return res.status(200).json({
      message: 'Writer log updated successfully',
      data: result,
    });

  } catch (error) {
    console.error('updateWriterLog error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export {
    patchStory,
    patchChapter,
    patchEditDetails,
    patchDeleteDetails,
    patchTypeSettings,
    patchChapterLog,
    updateWriterLog
}