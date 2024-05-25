const mongoose = require('mongoose');

const DescriptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Description', DescriptionSchema);
