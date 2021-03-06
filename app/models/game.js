var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
	identifier: { year: Number, month: String, testno: Number, gameno: Number },
	goal: { minutes: Number, seconds: Number },
	questions: Number,
	gametype: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
	typename: String
});

module.exports = mongoose.model('Game', GameSchema);