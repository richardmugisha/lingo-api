
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
                Don't feel this list with unecessary details. But you can replace the existing ones if the new scene has some new critical facts about something or someone. If they facts are not that important, just use them to update the short memory or summary
            [
                - a string description of a key aspect of this entity (emphasis: This fact has to come from the scene)
                - don't feel this key aspects list with trivial facts
                - better empty or 1 fact than trivial facts
                - 
                - 
            ]
        "short memory": <str>// short memory - reflects the most recent information about someone, something or ...
        "summary": <str>// this is regularly re-summarized on each scene to reflect the general/global information about someone, something, or...
    }

    Rules:
        - if the existing info is empty or null, that means you have a blank slate to fill with the ONLYnd ONLY a the important info from the current scene.
        - Respect the keys given to you in the memory graph, and return them as such
        - Provide the info for each key
`

const saverSysMsg = `
You are a memory keeper for a story creation platfrom. Your job is to help save critical information that will be needed later throughout the story.
You are given the current memory graph, and update it ONLY using the information from the new scene (only the info that is relevant to the story in general).
`

export {
    saver,
    saverSysMsg
}