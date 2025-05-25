import welcome from "./executors/welcome.js";
import topicIntroduction from "./executors/topic_introduction.js"
import instructorIntroduction from "./executors/instructor_introduction.js"

class Onboarding {
    static stages = ["welcoming", "topic introduction", "instructor introduction"]
    constructor(chat) {
        this.chat = chat;
        this.assistant = chat.supervisor;
        this.assistantRole = "onboarding assistant";
        this.userRole = "student";
        this.userAssistantPast = null;
        this.stage = Onboarding.stages[0];
        this.welcomeDuration = (Math.floor(Math.random() * 4) + 2) * 2; // Random between 2-5 back-and-forths before wrapping up
        this.topicIntroDuration = 2;
        this.instructorIntroDuration = 2;
        this.transitioning = false;
        this.wrappingUp = false
        this.checkpoint = 0

        // Bind methods once
        this.start = this.start.bind(this);
        this.topic = this.topic.bind(this);
        this.instructor = this.instructor.bind(this);


        this.steps = {
            [Onboarding.stages[0]]: this.start,
            [Onboarding.stages[1]]: this.topic,
            [Onboarding.stages[2]]: this.instructor
        }
    }

    moveUp () {
        const indexOfCurrentStage = Onboarding.stages.indexOf(this.stage)
        this.stage = Onboarding.stages[indexOfCurrentStage + 1]
        this.checkpoint = this.chat.details.get("onboarding").length
        console.log('hhahahahah ----- transitioning')
        return this.stage
    }

    shouldWrapUp () {
        const historyLength = this.chat.details.get("onboarding").length
        let should = false;
        console.log(this.welcomeDuration, historyLength, '--- welcome')
        console.log(this.topicIntroDuration, historyLength, '--- topic')
        console.log(this.instructorIntroDuration, historyLength, '--- isntrcut')
    
        if (historyLength) {
            switch (this.stage) {
                case "welcoming":
                    should = [0, this.welcomeDuration - 1].includes(historyLength % this.welcomeDuration) ;
                    const newT = this.welcomeDuration - (should * 2)
                    this.welcomeDuration = newT >= 0 ? newT : 0
                    break
                case "topic introduction":
                    should = [0, this.topicIntroDuration- 1].includes((historyLength - this.checkpoint) % this.topicIntroDuration);
                    const newTT = this.topicIntroDuration - (should * 2)
                    this.topicIntroDuration = newTT >= 0 ? newTT : 0
                    break
                default:
                    should = [0, this.instructorIntroDuration - 1].includes((historyLength - this.checkpoint) % this.instructorIntroDuration) ;
                    const newTTT = this.instructorIntroDuration - (should * 2)
                    this.instructorIntroDuration = newTTT >= 0 ? newTTT : 0
            }
        }
        this.wrappingUp = should
        return should
    }

    async start () {
        const response = await welcome(this)
        return response
    }

    async topic () {
        const response = await topicIntroduction(this)
        return response
    }

    async instructor() {
        const response = await instructorIntroduction(this)
        return response
    }
}

export default Onboarding