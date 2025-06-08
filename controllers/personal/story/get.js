import Story from "../../../models/story/story.js"
import Chapter from "../../../models/story/chapter.js"

const getStories = async (req, res) => {
    const filters = req.query
    try {
        const stories = await Story.find(filters)
        res.status(200).json({ stories })
    } catch (error) {
        res.status(500).json({ msg: error.message })
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
    getChapter
}