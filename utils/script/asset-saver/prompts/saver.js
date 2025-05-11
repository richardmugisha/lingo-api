
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
    }

    For new items to add to the log, this is the structure: They values are all bullet-points form strings (not list) and we keep the details to <= 5 because no need for trivial information
    {
        "identity": captures the core identity of the item (things that are less subject to change throughout the story) e.g: sex, ethnicity, age (may be updated if need be), and more
        "summary": this is regularly re-summarized on each scene to reflect the general/global information about someone, something, or...
        "history":  It reflects the major events, activities, transformations that happened to or surround this item
        "recent": It captures the recent information, and is usually rich in detail because it mimics the working memory
        "relationships": It captures the relationships this item has with other (if any) and updates them if necessary (think the protagonist's friend turns out to be the antagonist at some point)
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