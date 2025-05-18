const guide = (memoryGraph, structure, currentEp, currentAct, currentScenes, developedScene) => `
    You are given a skeleton of the story being created. The current memory graph that you need to update, and the just created scene that potentially contains the information you need to update the memory graph

    Context:
    - story theme: ${structure.theme}
    - episodes: ${structure.episodes.map(ep => ep.logline)}
    - current episode: ${currentEp}
    - current act log line: ${currentAct}
    - current act scenes: ${currentScenes}
    
    current memory path:
        ${JSON.stringify(memoryGraph)}

    Your job at this stage is to identify ALL entities from the scene that are relevant to the story and map them to their correct categories.
    This includes:
    - All characters that appear or are mentioned
    - All locations that are important
    - All objects that are significant
    - All events that occur or are planned
    - All abstract concepts that are relevant

    The information that feeds the update comes from this scene:
    ${developedScene}

    typical json output:
    {
        "Kathy": "people",
        "Emily": "people",
        "studio": "places",
        "conference": "events",
        "climate change": "abstract"
    }

    Rules:
    - Identify ALL entities that appear in the scene, not just the main ones
    - Map each entity to its correct category (people, places, objects, events, abstract)
    - Only exclude entities that are completely irrelevant to the story
    - Be thorough - it's better to include an entity than to miss it
`

const guideSysMsg = `
You are a memory keeper for a story creation platfrom. Your job is to help save critical information that will be needed later throughout the story.
You are given the current memory path, and your task is to point to the entity that needs an update.
`

export {
    guide,
    guideSysMsg
}