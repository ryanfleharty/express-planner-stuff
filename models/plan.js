const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlanSchema = new mongoose.Schema({
    title: String,
    date: Date,
    creator: { type: Schema.Types.ObjectId, ref: 'User'},
    joiners: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    stops: [{ type: Schema.Types.ObjectId, ref: 'Stop'}]
})

const Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;