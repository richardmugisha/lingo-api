

const parser = (rawScript) => `
You are an AI trained to extract structured data from unstructured film or TV scripts. Given a story script (with no clear structure), analyze and convert it into the following structured JSON format.

The format:
{
  title: String,
  summary: String,
  theme: String,
  genre: String,
  tone: String,
  mainCharacter: String,
  episodes: [
    {
      title: String,
      topic: String,
      logline: String,
      acts: [
        {
          title: String,
          logline: String,
          scenes: [
            {
              title: String,
              logline: String,
              words: [String], / the words in () in front of the scene, e.g: scene 1 (ambiguous)
              details: []
            }
          ]
        }
      ]
    }
  ]
}

Use the story context to infer missing elements if necessary. If a scene or act doesn’t clearly mention a title or logline, derive a concise one based on the events described. 
Leave the scene details array empty, because it is empty at this stage

Now, parse the following script into the structure above:

${rawScript}

`

export default parser