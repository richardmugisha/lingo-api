
const openaiRequest = require('./openaiRequest')


const debugOpenai = async() => {
    const res = await openaiRequest("gpt-3.5-turbo", 'tell me a story as a json. like { story: the story }')
    console.log(res)
}

debugOpenai()