import AgentUser from "../../../../models/live-chat/agent-user.js"

// Get the relationship between user and assistant
export const getRelationship = async (user, assistant) => {
    try {
        const relationship = await AgentUser.findOne({user, agent: assistant})

        const isUserNew = !( await AgentUser.findOne({user}) )

        return {relationship, isUserNew};
        
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

// Create a new relationship between user and assistant
export const createRelationship = async (user, assistant, details, userFacts, userPreferences) => {
    try {
        const newRelationship = await AgentUser.create({
            user,
            agent: assistant,
            lastInteraction: {
                time: new Date(),
                details
            },
            userFacts,
            userPreferences
        });
        
        return newRelationship;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

// Update an existing relationship between user and assistant
export const updateRelationship = async (user, assistant, details, userFacts, userPreferences) => {
    try {
        const updatedRelationship = await AgentUser.findOneAndUpdate(
            { user, agent: assistant },
            {
                lastInteraction: {
                    time: new Date(),
                    details
                },
                userFacts,
                userPreferences
            },
            { new: true } // Return the updated document
        );
        
        if (!updatedRelationship) {
            throw new Error('Relationship not found');
        }
        
        return updatedRelationship;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};
