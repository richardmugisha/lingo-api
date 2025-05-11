

const structure= (
    topic,
    subtopics
  ) => {
    return `
  I am giving you a topic and its subtopics, along some words on its subtopics. You are to create story outline based on that
  You pick a story that best fits this input, and a theme, tone, plots that keep the story engaging while adhering to the input

  typical json structure layout:
  {
    title
    summary
    theme
    genre
    tone
    mainCharacter (just the name)
    episodes: [
      {
        title
        topic  (lowercase)// one of the subtopics : You can use them in the best order for the story, but make sure you have one for each episode
        words: the input words in that subtopic.words in lowercase
        logline
      },
      ...
    
    ]
    
 
  Input:
    - topic: ${topic}
    - subtopics:
      ${JSON.stringify(subtopics)}
  
  `
  }

const structureSysMsg = `
You are a professional story architect skilled in applying classical narrative structures
`

export {
    structure,
    structureSysMsg
}

/*
 episode 1 (appropriate subtopic in the list): episode log line
      

  episode 2 ----
      ...
          ....
  
*/