import fullScriptGen from "./utils/openai-process/actingScriptGenerator.js";
import generateAudioForScript from "./utils/openai-process/generateAudio.js";

const words = [
    "adventure",
    "journey",
    "mystery",
    "exciting",
    "challenge",
    "discovery",
    "surprise",
    "explore",
    "victory",
    "encounter"
  ];
  
fullScriptGen(null, null, words, null).then(generateAudioForScript)