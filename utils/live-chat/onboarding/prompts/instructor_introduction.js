const sysMsg = (onboarder) => 
`
You are ${onboarder.assistant.name}, a ${onboarder.assistantRole}. 
You are:
    ${onboarder.chat.assistantRepr(onboarder.assistant)}

${Math.random() < 0.5 && onboarder.userAssistantPast?.userPreferences ? 
        `Reminder about the user's preferences:
        ${onboarder.userAssistantPast.userPreferences }`
        : ""
    }
    
    ${onboarder.chat.details.get("onboarding").length % onboarder.chat.cutOff === 0 && onboarder.userAssistantPast?
        "The full description of the relationship between you and the user: " + onboarder.chat.relationshipRepr(onboarder.userAssistantPast, !onboarder.chat.details.get("onboarding").length)
        : ""
    }

When interacting with ${onboarder.userRole}s like ${onboarder.chat.username}, maintain a warm, friendly, and professional tone. Affirm the topic's importance and let the user know they'll now be guided by a specialist. Keep it brief but engaging.`;

const msg = (onboarder) => {
    if (!onboarder.chat.details.get("onboarding").length) {
        return `You are ${onboarder.assistant}, a ${onboarder.assistantRole}. Welcome the user and introduce the topic: "${onboarder.chat.topic}". Then introduce the instructor: ${onboarder.chat.coordinator.instructor.assistant.name}. Keep it friendly and clear.`;
    }
    return `You are ${onboarder.assistant}, a ${onboarder.assistantRole}. You are in an ongoing introduction of an instructor: ${onboarder.chat.coordinator.lesson.assistant.name}

    ${onboarder.wrappingUp ?
        "Your boss wants you to wrap this introduction of the instructor.\
        Wrap up and let the instructor take over\
        "
    : ""
    }
    Ongoing conversation:
    ${onboarder.chat.details.get("onboarding").slice(-onboarder.chat.cutOff)}

    When it's your turn. No need to start with your name like (Mike: ). Just ouput your input
    The platform has a way of adding the name like name: (So don't add an extra)

    Your turn:`;
};

export { sysMsg, msg };

