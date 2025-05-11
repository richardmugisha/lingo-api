
import { structureRaw as structurePrompt, structure as JSONstructure, structureSysMsg } from "../prompts/structure.js";
import openaiRequest from "../../../openai-process/openaiRequest.js";

const structureBuild = async ({
    setting = "",
    tone = "epic and adventurous",
    genre = "fantasy",
    protagonistType = "",
    storyLength = "medium", // short, medium, long
    logLine = ""
  } = {}) => {
    try {
        const prompt = structurePrompt(topicData.topic, topicData.subtopics)
        const structure = await openaiRequest("gpt-4o", structureSysMsg, prompt, true)

        const toJSONprompt = JSONstructure(structure)
        const jsonStructure = await openaiRequest("gpt-4o", "You are a helpful assistant", toJSONprompt)
        console.log(jsonStructure)
        console.log("\n\n")
        return structure
    } catch (error) {
        console.log(error.message)
    }
}

export default structureBuild

const topicData = {
    topic: "Climate Change",
    subtopics: [
      {
        topic: "Causes",
        words: [
          "Greenhouse gases",
          "Fossil fuels",
          "Deforestation",
          "Carbon footprint",
          "Industrialization"
        ]
      },
      {
        topic: "Effects",
        words: [
          "Global warming",
          "Rising sea levels",
          "Extreme weather",
          "Habitat loss",
          "Ocean acidification"
        ]
      },
      {
        topic: "Solutions",
        words: [
          "Renewable energy",
          "Carbon capture",
          "Reforestation",
          "Energy efficiency",
          "Sustainable farming"
        ]
      },
      {
        topic: "International Agreements",
        words: [
          "Paris Agreement",
          "Kyoto Protocol",
          "COP conferences",
          "Emissions targets",
          "Climate diplomacy"
        ]
      },
      {
        topic: "Environmental Activism",
        words: [
          "Protest",
          "Awareness",
          "Advocacy",
          "Climate strike",
          "Grassroots"
        ]
      }
    ]
  };
  