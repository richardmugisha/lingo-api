import Story from "../../../models/story/story.js"

export default async (req, res) => {
    try {
        const ids = req.params.id
        await Story.deleteMany({ _id: { $in: ids.split(",") }})
        res.status(200).json({
            msg: ids.length + " stories deleted succesfully!"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: error.message})
    }
}