import { createNewDeck } from "../controllers/personal/deck.js"

const createCascadingDecks = async (creator, deckLang, structure) => {
    const decks = []  // ✅ Now correctly scoped and accessible

    try {
        const handleCascadeCreation = async (structure, parent = null) => {
            if (Array.isArray(structure)) {
                // Leaf array: ["chemistry", "physics"]
                await Promise.all(
                    structure.map(async (node) => {
                        const deck = await createNewDeck(null, node, creator, deckLang, parent)
                        await deck.save()
                        decks.push(deck)
                    })
                )
            } else if (typeof structure === "object") {
                // Branch object: { science: ["chemistry", "physics"] }
                await Promise.all(
                    Object.entries(structure).map(async ([node, children]) => {
                        try {
                            const deck = await createNewDeck(null, node, creator, deckLang, parent)
                            await deck.save()
                            // decks.push(deck)  We are only sending back the leaf nodes.
                            // Recursively handle children
                            await handleCascadeCreation(children, deck._id)
                        } catch (error) {
                            console.error(`Error creating deck "${node}":`, error)
                            throw error
                        }
                    })
                )
            }
        }

        await handleCascadeCreation(structure)
        return decks // ✅ All created decks returned (including leaves and branches)

    } catch (error) {
        console.error("Error in createCascadingDecks:", error)
        throw error
    }
}

export default createCascadingDecks
