import Story, { Scene} from "../../../models/story/story.js"
import User from "../../../models/user.js"
import Chapter from "../../../models/story/chapter.js"
import UserContributionDay, { userWritingGoal} from "../../../models/story/user-contribution.js"

const getStories = async (req, res) => {
    const filters = req.query
    try {
        // Only select lightweight fields to avoid memory issues
        const stories = await Story.find(filters).select('_id title summary imageUrl author outline typeSettings chapters createdAt updatedAt');
        const storiesWithAuthors = await Promise.all(stories.map(async (story) => {
            const author = await User.findById(story.author).select('username');
            return { ...story.toObject(), author: author || "Unknown" };
        }));
        res.status(200).json({ stories: storiesWithAuthors })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getStory = async (req, res) => {
    const { id } = req.params;
    console.log(req)
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

const getScene = async (req, res) => {
    const { id } = req.params
    try {
        const scene = await Scene.findById(id)

        res.status(200).json({ scene: scene })

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}



async function getUserContributions(req, res) {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const userId = req.query.userID

    const startDate = new Date(Date.UTC(year, 0, 1)); // Jan 1, 00:00:00 UTC
    const endDate = new Date(Date.UTC(year + 1, 0, 1)); // Jan 1 next year

    const contributions = await UserContributionDay.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    }).select('date count -_id');
    console.log(contributions)
    res.json(contributions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
}

const getUserGoal = async (req, res) => {
    try {
        const userId = req.query.userID

        const goal = await userWritingGoal.findOne({ userId })

        res.json({ goal })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch writing goal' });
    }
}

export {
    getStories,
    getStory,
    getChapter,
    getScene,
    getUserContributions,
    getUserGoal
}