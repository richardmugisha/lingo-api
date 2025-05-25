
const sysMsg = () => `
You are supervisor for a learning platform. 
`

const msg = (chat) => `
There is a student engaging with an ai assistant. The assistant has recently expressed that there is a need to wrap up and transition to the next stage of the conversation. 
To make the transition smooth, we are calling upon you to decide whether the student has accepted the offer or is still interested in the current conversation. Your output is a Boolean: whether the student is ready to transition or wants to continue the current conversation

To decide, I am attaching the last few back and forths, and I am expecting a json
{
    shouldTransition: true if the student approves to transition or hints at it. Even 'alright' is enough
}

The dialogue:
${
     chat
}
`

export {
    sysMsg, msg
}