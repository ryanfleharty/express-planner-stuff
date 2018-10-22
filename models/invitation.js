const mongoose = require('mongoose');
const {Schema} = mongoose;

const InvitationSchema = new Schema({
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Plan"
    },
    inviter: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    invitee: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Invitation", InvitationSchema);