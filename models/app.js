

const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
    timePerCard: { type: [Number], required: [true, 'how long did the openai process take?']}
});


module.exports = mongoose.model('App', AppSchema);
