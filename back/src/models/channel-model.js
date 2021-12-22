const mongoose = require("mongoose")

const channelSchema = new mongoose.Schema({
    creator: {
        type: Map,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    messages: {
        type: Map,
    },
})

channelSchema.methods.toJSON = function () {
    const channel = this
    const channelObject = channel.toObject()
    return channelObject
}


const Channel = mongoose.model("Channel", channelSchema)

module.exports = Channel
