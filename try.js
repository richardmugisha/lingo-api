import orchestractor from "./utils/script/orchestrator/index.js";

orchestractor()

import sceneWriter from "./utils/script/scene-writer/index.js";


// import assetSaver from "./utils/script/asset-saver/index.js"
// import assetRetriever from "./utils/script/asset-retriever/index.js"


const scene = `
INT. CLIMATE OBSERVATORY - NIGHT

A whirling symphony of machines fills the air, screens flickering with charts and graphs undecipherable to the untrained eye. DR. ELENA MORALES, late 30s, an experienced climatologist, paces between massive hardware systems, her eyes darting over data like a hawk.

ELENA's assistant, KIM, a bundle of nervous energy in her early 20s, sits hunched over a computer screen, choking on the tension.

KIM
(to herself)
Come on, come on!

Elena strides over, glancing at the screen. It blares out an intimidating bar graph, numbers far higher than any previous point in time.

KIM
(whispering)
The green line... it just skyrocketed.

ELENA
That's the greenhouse gases.

A mark of dread etches itself onto Elena's face, the realisation that something was gravely wrong hitting her.

ELENA
(to herself)
This can't be... the planet can't sustain this.

KIM
(raising voice)
But I cross checked the data at least twenty times!

Continuous beeps echo from the computer, signaling the affirmation of their worst fears. Elena can't help but flinch as the numbers jump higher with each passing second.

ELENA 
(to Kim)
There's no mistake, then.

Kim stares back at her, a mirror of the dread in Elena's eyes. In silence, they both know what this implies - their research has just taken a terrifying turn.

ELENA
(hardening voice)
We have work to do. We have to share this data - everywhere, now.

With a deep breath, Elena turns back to the screen, her mind racing with the implications of their discovery. An activist is born from the comprehension of a truth too harrowing to ignore.
`
const guide = {
    "Dr. Elena Morales": "entities/people/Dr. Elena Morales",
    "Kim": "entities/people/Kim",
    "climate observatory": "entities/places/climate observatory",
    "Elena<>Kim": "relationships/Dr. Elena Morales<>Kim",
    "Elena<>climate observatory": "relationships/Dr. Elena Morales<>climate observatory",
    "greenhouse gas data": "entities/objects/greenhouse gas data",
    "discovery event": "entities/events/discovery event"
}

// assetSaver(scene, guide)

// assetRetriever(null, 0, 0, 0)

// sceneWriter(null, 0, 0, 0)
