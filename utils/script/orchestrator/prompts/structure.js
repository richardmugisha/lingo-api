

const structureRaw = (
    topic,
    subtopics
  ) => {
    return `
  I am giving you a topic and its subtopics, along some words on its subtopics. You are to create story outline based on that
  You pick a story that best fits this input, and a theme, tone, plots that keep the story engaging while adhering to the input

  typical structure layout:
  episode 1 (appropriate subtopic in the list): episode log line
      - act 1: act log line
          - scene 1 (chosen one or few words from the subtopic word lsit): scene log line
          - scene 2 (chosen words): scene log line
          - scene 3 (chosen words): scene log line

      - act 2: act log line
          ...
          ...
  episode 2 ----
      ...
          ....
  
  Input:
    - topic: ${topic}
    - subtopics:
      ${JSON.stringify(subtopics)}
  
  `
  }

const structureSysMsg = `
You are a professional story architect skilled in applying classical narrative structures
`
const structure = (raw) => `
A draft story structure was created. You just need to structure it well in a json

Here is a typical output:
  structure: {
    title: "The Fifth Season",
    theme: "Humanity’s struggle between industrial progress and planetary survival",
    tone: "Serious, emotional, inspiring",
    mainCharacter: "Liana, a young climate scientist",
    topic: "Climate Change",
    episodes: [
      {
        title: "The Smokestack Mirage",
        subtopic: "Causes",
        logline: "A mysterious pollutant spike in Liana's city leads her to question everything she knows about clean energy in her country.",
        acts: [
          {
            title: "The Invisible Cloud",
            logline: "Liana investigates an unexplained rise in emissions despite government reports claiming reductions.",
            scenes: [
              {
                title: "Greenhouse gases",
                logline: "A new sensor network detects surges in methane and CO₂ levels across industrial zones.",
                words: ["Greenhouse gases"]
              },
              {
                title: "Fossil fuels",
                logline: "Liana visits a supposedly decommissioned coal plant that’s secretly back in operation.",
                words: ["Fossil fuels"]
              },
              {
                title: "Industrialization",
                logline: "Flashbacks reveal how her country rushed industrial growth without proper environmental checks.",
                words: ["Industrialization"]
              }
            ]
          },
          {
            title: "Beneath the Canopy",
            logline: "Following a trail of corruption, Liana uncovers links between illegal deforestation and shadow corporations.",
            scenes: [
              {
                title: "Deforestation",
                logline: "In a satellite lab, Liana analyzes vanishing tree cover in protected areas.",
                words: ["Deforestation"]
              },
              {
                title: "Carbon footprint",
                logline: "A tech exposé reveals top corporations masking their real emissions.",
                words: ["Carbon footprint"]
              },
              {
                title: "Greenhouse gases",
                logline: "A whistleblower hints that the pollution isn’t an accident—it's a cover-up.",
                words: ["Greenhouse gases"]
              }
            ]
          }
        ]
      },
      {
        title: "The Drowning Sky",
        subtopic: "Effects",
        logline: "As climate disasters 
    ....
  }

  Here is the raw structure: ${raw}
  json output:
`

export {
    structureRaw,
    structure,
    structureSysMsg
}