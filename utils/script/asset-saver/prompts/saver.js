
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
    ${developedScene}

    typical json output:
    {
        "Kathy": info about Kathy,
        "Emily": info about Emily,
        "studio": info about the studio,
        "Kathy<>Emily": info about Kathy and Emily relationshhip,
        "Emily<>studio": info about the relationship between Emily and the studio (Is she the owner?)
    }

    Each info about somone, something or... takes this form:
    {
        "key aspects": <array>// key aspects this is always kept to 5 or less, and is regulary updated to reflect the most important aspects of the entity across the entire story so up to the current scene. (no borrowing from the future unless really necessary)
            [
                - key info 1
                - key info 2
                - 3
                - 4
                - 5
            ]
        "short memory": <str>// short memory - reflects the most recent information about someone, something or ...
        "summary": <str>// this is regularly re-summarized on each scene to reflect the general/global information about someone, something, or...
    }

    Rules:
        - if the existing info is empty or null, that means you have a blank slate to fill with the ONLY the important info from the current scene.
        - Respect the keys given to you in the memory graph, and return them as such
        - Provide the info string for each key
`

const saverSysMsg = `
You are a memory keeper for a story creation platfrom. Your job is to help save critical information that will be needed later throughout the story.
You are given the current memory graph, and update it ONLY using the information from the new scene (only the info that is relevant to the story in general).
`

export {
    saver,
    saverSysMsg
}