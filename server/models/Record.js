const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	images: {
		type: [String],
		required: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Record", RecordSchema);
