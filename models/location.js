const mongoose = require('mongoose');
const {Schema} = mongoose;
const findOrCreate = require('mongoose-findorcreate');

const LocationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    name: String,
    googleId: {type: String, unique: true},
    address: String,
    keywords: [String]
})
LocationSchema.plugin(findOrCreate, {upsert: true});
const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;