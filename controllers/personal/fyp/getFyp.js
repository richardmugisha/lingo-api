
import getWords from "./getWords.js"

const getFyp = async (req, res) => {
    console.log("haapp.....")
    try {

        const {user} = req.query
        
        const fyp = await getWords(user)

        console.log(fyp)

        res.status(200).json({ fyp })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to load FYP" });
    }
};

export default getFyp