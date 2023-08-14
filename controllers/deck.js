const DeckMetadata = require('../models/deckMetadata');


const getDeckMetadata = async (req, res) => {
    try {
        const deckName = req.params.deckName;
        console.log(deckName);
        const deckMetadata = await DeckMetadata.findOne({ deckName: deckName });
        return res.status(200).json( { deckMetadata })
    } catch (error) {
        res.status(500).json( { msg: error })
    }
}

const updateDeckMetadata = async (req, res) => {
    try {
        const deckName = req.params.deckName;
        let deckMetadata = await DeckMetadata.findOne({ deckName: deckName });
       // console.log(deckName, req.body)
        // create deckMetadata if no exist
        if (!deckMetadata) {
            //console.log('no')
            const perform = {
                correct : [req.body.correct], performance : [req.body.performance], time : [req.body.time]
            }
            const content = { deckName, performance : perform } 
            deckMetadata = await DeckMetadata.create(content);
            return res.status(201).json( { deckMetadata } )
        }
        // insert the results if exits
        
        deckMetadata = await DeckMetadata.updateOne(
            { deckName: deckName },
            {
                $push: {
                    'performance.correct': req.body.correct,
                    'performance.performance': req.body.performance,
                    'performance.time': req.body.time
                }
            }
        )
        //console.log(deckMetadata)
        return res.status(200).json({ msg: 'Perform items pushed successfully' })

    } catch (error) {
        //console.log(error)
        return res.status(500).json( { msg: error })
    }
}


module.exports = {
    getDeckMetadata,
    updateDeckMetadata
}