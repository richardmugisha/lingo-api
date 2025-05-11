import { createNewTopic } from "../../controllers/personal/topic.js"

const createCascadingTopics = async (creator, language, structure, parent) => {
    // const topics = []  // ✅ Now correctly scoped and accessible

    try {
        const handleCascadeCreation = async (structure, parent = null) => {
            if (Array.isArray(structure)) {
                // Leaf array: ["chemistry", "physics"]
                await Promise.all(
                    structure.map(async (node) => {
                        const topic = await createNewTopic(null, node, creator, language, parent, true)
                        await topic.save()
                        // topics.push(topic)
                    })
                )
            } else if (typeof structure === "object") {
                // Branch object: { science: ["chemistry", "physics"] }
                await Promise.all(
                    Object.entries(structure).map(async ([node, children]) => {
                        try {
                            const topic = await createNewTopic(null, node, creator, language, parent)
                            await topic.save()
                            // if (!parent) topics.push(topic)  //We are only sending back the 0th layer topics.
                            // Recursively handle children
                            await handleCascadeCreation(children, topic._id)
                        } catch (error) {
                            console.error(`Error creating topic "${node}":`, error)
                            throw error
                        }
                    })
                )
            }
        }

        await handleCascadeCreation(structure, parent) 

    } catch (error) {
        console.error("Error in createCascadingtopics:", error)
        throw error
    }
}

export default createCascadingTopics
