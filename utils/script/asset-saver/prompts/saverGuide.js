
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

    Your job at this stage is to just point out the fields that need to be updated and the path to them to access each of them. Ignore the actual update at this state
    e.g: people


    The information that feeds the update comes from this scene:
    ${developedScene}

    typical json output:
    {
        "Kathy": "people",
        "Emily": "people",
        "studio": "places",
        ...
    }

    Rules:
        - Only the most relevant details to the story are considered
        - Only crete paths for entities that very relevant to the story
`

const guideSysMsg = `
You are a memory keeper for a story creation platfrom. Your job is to help save critical information that will be needed later throughout the story.
You are given the current memory path, and your task is to point to the entity that needs an update.
`

export {
    guide,
    guideSysMsg
}