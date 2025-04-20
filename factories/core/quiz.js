
class Quiz {
    constructor(setup) {
        this.step = "onboarding"
        this.topic = setup.topic || {}
    }
}

export default Quiz