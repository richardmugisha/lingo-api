
import Story, { Scene } from "../../../models/story/story.js"
import Chapter from "../../../models/story/chapter.js";
import { uploadImageToS3 } from "../../../utils/s3Client.js";
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
    let {userId, leadAuthor, imageUrl, coAuthors, details, title, words, aiAssistance, summary, outline, chapters} = body;
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
        let firstScene;
        if (chapters) storyTocreate.chapters = chapters;
        else {
            firstScene = await Scene.create({})
            storyTocreate.chapters = [{
                title: "Untitled Chapter",
                imageUrl: imageUrl || "",
                scenes: [ {
                    id: firstScene._id
                }]
            }]
        }
        if (userId) storyTocreate.leadAuthor = userId;
        if (leadAuthor) storyTocreate.leadAuthor = leadAuthor;
        if (coAuthors?.length) storyTocreate.coAuthors = coAuthors;
        // if (topicId) storyTocreate.topic = topicId
        //console.log(topicId, userId, details)
    
        const createdStory = await Story.create(storyTocreate)
        // //console.log(createdStory)
        return {...createdStory.toObject(), scene: firstScene}
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

const createScene = async(req, res) => {
    try {
        const newScene = await Scene.create({})
        res.status(200).json({scene: newScene})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const createSceneCover = async (req, res) => {
    try {
        const { id } = req.params
        const imageFile = req.file; // This will be handled by multer middleware
        if (!imageFile) {
            return res.status(400).json({ 
                message: 'Image file is required',
            });
        }
        const timestamp = Date.now();
        const key = `scene/cover/${id}.jpg`;

        // Upload image to S3
        await uploadImageToS3(imageFile.buffer, key);
        
        // Create S3 URL
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        await Scene.findByIdAndUpdate(id, { imageUrl })

        res.status(200).json({ 
            message: 'Agent created successfully',
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message })
    }
}
const createStoryCover = async (req, res) => {
    try {
        const { id } = req.params
        const imageFile = req.file; // This will be handled by multer middleware
        if (!imageFile) {
            return res.status(400).json({ 
                message: 'Image file is required',
            });
        }
        const key = `story/cover/${id}.jpg`;

        // Upload image to S3
        await uploadImageToS3(imageFile.buffer, key);
        
        // Create S3 URL
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        await Story.findByIdAndUpdate(id, { imageUrl })

        res.status(200).json({ 
            message: 'Agent created successfully',
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message })
    }
}

export {
    createStory,
    createStoryCover,
    handler,
    createChapter,
    createScene,
    createSceneCover
}