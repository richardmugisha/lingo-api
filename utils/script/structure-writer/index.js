
import structureBuild from "./executors/structure.js"
import Script from "../../../models/script.js"

const cleanStructure = async (topicData) => {
    try {
        const structure = await structureBuild(topicData)

        const script = await Script.create(structure)

        return script
        
    } catch (error) {
        console.log(error.message)
    }
}

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
  
export default cleanStructure