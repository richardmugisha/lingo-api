import Story from "../../../models/story/story.js"
import Chapter from "../../../models/story/chapter.js"

const getStories = async (req, res) => {
    const filters = req.query
    try {
        // Only select lightweight fields to avoid memory issues
        const stories = await Story.find(filters).select('_id title summary author outline typeSettings pageSettings createdAt updatedAt');
        res.status(200).json({ stories })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getStory = async (req, res) => {
    const { id } = req.params;
    const { start, end } = req.query.page
    
    try {
    // Get the story by id
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ msg: "Story not found" });
        }

        // If no page info, return the whole story
        if (typeof start === "undefined" || typeof end === "undefined") {
            return res.status(200).json({ story });
        }

        // Get details from start to end+1
        const s = parseInt(start);
        const e = parseInt(end);

        // Defensive: if details is not an array, return as is
        if (!Array.isArray(story.details)) {
            return res.status(200).json({ story });
        }

        // Shallow copy story and slice details
        const storyObj = story.toObject();
        storyObj.details = story.details.slice(s, e + 1);

        res.status(200).json({ story: storyObj });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const getChapter = async (req, res) => {
    const { index, storyID } = req.query
    try {
    if (!storyID) return res.status(404).json({msg: "invalid story id"})
    if (typeof index === 'undefined') return res.status(404).json({msg: "invalid chapter index"})

    const chapter = await Chapter.find({ story: storyID })
        .sort({ createdAt: 1 })
        .skip(parseInt(index))
        .limit(1)

    if (!chapter.length) return res.status(404).json({msg: "chapter not found"})
    res.status(200).json({ chapter: chapter[0] })
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export {
    getStories,
    getStory,
    getChapter
}