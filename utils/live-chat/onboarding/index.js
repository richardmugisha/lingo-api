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
        this.stage = Onboarding.stages[0];
        this.welcomeDuration = (Math.floor(Math.random() * (4)) + 2) * 2; // Random between 2-5 back-and-forths before wrapping up
        this.topicIntroDuration = (Math.floor(Math.random() * (3)) + 2) * 2;
        this.instructorIntroDuration = 2 * 2;
        this.transitioning = false;
        this.wrappingUp = false

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
        return this.stage
    }

    shouldWrapUp () {
        const historyLength = this.chat.details.get("onboarding").length
        let should = false;
        console.log(this.welcomeDuration, historyLength, '--- welcome')
        if (historyLength) {
            switch (this.stage) {
                case "welcoming":
                    should = [0, this.welcomeDuration - 1].includes(historyLength % this.welcomeDuration) ;
                    console.log('shd: ', should)
                    this.welcomeDuration -= this.welcomeDuration > 0 && should
                    break
                case "topic introduction":
                    should = [0, this.topicIntroDuration- 1].includes(historyLength % this.topicIntroDuration);
                    this.topicIntroDuration -= this.topicIntroDuration > 0 && should
                    break
                default:
                    should = [0, this.instructorIntroDuration - 1].includes(historyLength % this.instructorIntroDuration) ;
                    this.instructorIntroDuration -= this.instructorIntroDuration > 0 && should
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

    async handleMessage(message) {
        // Check if user is new
        // If new, provide introduction
        // If returning, engage in small talk
        // Return response with ready flag when appropriate
    }
}

export default Onboarding