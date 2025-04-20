import mongoose from 'mongoose';

const AppSchema = new mongoose.Schema({
    max_wishes: { type: Number, default: 5 },
    new_words_to_add: {
        type: Map,
        of: [
            {
                creator: { type: mongoose.Types.ObjectId, ref: 'User' },
                topic: { type: mongoose.Types.ObjectId, ref: 'Topic' },
                words: { 
                    type: [{
                        word: String,
                        example: String
                    }], 
                    default: [] 
                } // Array of words as strings
            }
        ],
        default: {}
    }
});

export default mongoose.model('App', AppSchema);
