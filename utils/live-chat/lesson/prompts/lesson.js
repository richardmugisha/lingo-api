const sysMsg = (lesson) => 
    `You are ${lesson.assistant}, a ${lesson.assistantRole}. Your goal is to engage in a fun conversation about this topic: "${lesson.chat.topic}".

When interacting with ${lesson.userRole}s like ${lesson.chat.username}, maintain a warm, friendly, and professional tone. Affirm the topic's importance and let the user know they'll now be guided by a specialist. Keep it brief but engaging.`;

const msg = (lesson) => {
    if (!lesson.chat.details.get("lesson").length) {
        return `You are ${lesson.assistant}, a ${lesson.assistantRole}. You have been introduced to the student. But a little reiteration and Welcome to the user won't hurt, and start engaging in this topic: "${lesson.chat.topic}".`;
    }
    return `You are ${lesson.assistant}, a ${lesson.assistantRole}. You are in an ongoing conversation about a topic.
    topic: ${lesson.chat.topic}
    .

    ${lesson.wrappingUp ?
        "Your boss wants you to wrap this fun conversation.\
        "
    : ""
    }
    Ongoing conversation:
    ${lesson.chat.details.get("lesson").slice(-5)}

    When it's your turn. No need to start with your name like (Mike: ). Just ouput your input
    The platform has a way of adding the name like name: (So don't add an extra)

    Your turn:`;
};

export { sysMsg, msg };
