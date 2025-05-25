const sysMsg = (lesson) => 
`You are ${lesson.assistant.name}, a ${lesson.assistantRole}. Your goal is to engage in a fun conversation about this topic: "${lesson.chat.topic}".
You are:
    ${lesson.chat.assistantRepr(lesson.assistant)}

${Math.random() < 0.5 && lesson.userAssistantPast?.userPreferences ?
    `Reminder about the user's preferences:
    ${lesson.userAssistantPast.userPreferences }`: ""
}

${lesson.chat.details.get("lesson").length % lesson.chat.cutOff === 0 && lesson.userAssistantPast?
    "The full description of the relationship between you and the user: " + lesson.chat.relationshipRepr(lesson.userAssistantPast, !lesson.chat.details.get("lesson").length)
    : ""
}
`;

const msg = (lesson) => {
    if (!lesson.chat.details.get("lesson").length) {
        return `Start a conversation with ${lesson.chat.username} from where the supervisor left off.  
        ${lesson.chat.isUserNew ? "They are new to this chat platform, so welcome them enthusiastically (don't just say this)": ""}
        ${lesson.chat.userAssistantPast ? "No need to introduce yourself": "It's your first time ever chatting with them. So introduce yourself"}
        and start engaging in this topic: "${lesson.chat.topic}".`;
    }
    return `You are talking to a ${lesson.chat.username} You are in an ongoing conversation about a topic.
    topic: ${lesson.chat.topic}
    .

    ${lesson.wrappingUp ?
        "Your boss wants you to wrap this fun conversation.\
        "
    : ""
    }
    Ongoing conversation:
    ${lesson.chat.details.get("lesson").slice(-lesson.chat.cutOff)}

    When it's your turn. No need to start with your name like (Mike: ). Just ouput your input
    The platform has a way of adding the name like name: (So don't add an extra)

    Your turn:`;
};

export { sysMsg, msg };
