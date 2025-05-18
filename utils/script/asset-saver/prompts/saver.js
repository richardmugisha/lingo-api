
const saver = (memoryGraph, structure, currentEp, currentAct, currentScenes, developedScene) => `
 You are given a skeleton of the story being created. The current memory graph that you need to update, and the just created scene that potentially contains the information you need to update the memory graph

    Context:
    - story theme: ${structure.theme}
    - episodes: ${structure.episodes.map(ep => ep.logline)}
    - current episode: ${currentEp}
    - current act log line: ${currentAct}
    - current act scenes: ${currentScenes}
    
    current memory graph:
        ${JSON.stringify(memoryGraph)}

    The information that feeds the update comes from this scene:
    ${JSON.stringify(developedScene)}

    You must return a JSON object where each key is an entity name and each value is an object with the following structure:
    {
        "name": "name of the asset",
        "identity": "bullet points about core identity",
        "summary": "bullet points about general information",
        "history": "bullet points about major events",
        "recent": "bullet points about recent information",
        "relationships": "bullet points about relationships"
    }

    Example output:
    {
        "Kathy": {
            "name": "Kathy",
            "identity": "• Female\n• 35 years old\n• Environmental scientist",
            "summary": "• Lead researcher at the observatory\n• Passionate about climate change",
            "history": "• Discovered the greenhouse gas anomaly\n• Started the research project",
            "recent": "• Found new evidence of illegal logging\n• Planning community meeting",
            "relationships": "• Works closely with Tom\n• Mentors young scientists"
        }
    }

    Rules:
    - Each field must be a bullet-pointed string (not a list)
    - Keep details to <= 5 bullet points per field
    - Only use the information from the current scene (meaning don't fetch from the future scenes)
    - Respect the keys given to you in the memory graph
`

const saverSysMsg = `
You are a memory keeper for a story creation platfrom. Your job is to help save critical information that will be needed later throughout the story.
You are given the current memory graph, and update it ONLY using the information from the new scene (only the info that is relevant to the story in general).
`

export {
    saver,
    saverSysMsg
}