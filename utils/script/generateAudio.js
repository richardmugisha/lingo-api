
import OpenAI from "openai";
import { uploadAudioToS3 } from "../s3Client.js";
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); 

const generateAudioForScript = async (script) => {

    const voices = {
        'F': ["alloy", "coral", "nova", "sage", "shimmer"],
        "M": ["ash", "ballad", "echo", "fable", "onyx", "verse"]
    }

    const playersObj = {}
    script.characters.map(p => {
        const pVoiceIndex = Math.floor(Math.random() * voices[sexCoarcing(p.sex)].length)
        const pVoice = voices[sexCoarcing(p.sex)][pVoiceIndex] || "ballad"
        voices[sexCoarcing(p.sex)].splice(pVoiceIndex, 1)
        playersObj[p.firstName.toLowerCase()] = {...p, voice: pVoice}
    })


    const narratorGender = Math.random() > .5 ? "F" : "M"
    const narrator = voices[narratorGender][Math.floor(Math.random() * voices[narratorGender].length)] || "alloy"
    // Iterate over script lines properly
    for (let index = 0; index < script.details.length; index++) {
        const line = script.details[index];
        const voice = playersObj[line.actor?.toLowerCase()]?.voice || narrator;
        generateAudioForLine(line, index, voice, script.title);
      }

}

const generateAudioForLine = async (lineObj, lineIndex, voice, title) => {
    try {
        const response = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: voice,
            input: lineObj.line,
            response_format: "wav",
        });
    
        const audioBuffer = Buffer.from(await response.arrayBuffer())
        const key = `script/${title}/audio/line-${lineIndex}.wav`;

        const s3Url = await uploadAudioToS3(audioBuffer, key)

        console.log(`Uploaded to: ${s3Url}`);
        return s3Url;
    
    } catch (error) {
        console.error(`Error generating audio for line ${lineIndex}:`, error);
    }

}

export default generateAudioForScript

const sexCoarcing = (sex) => {
    if (sex === "M" || sex === "F") return sex
    if (sex?.startsWith("M")) return "M"
    if (sex?.startsWith("F")) return "F"
    return "F"
}