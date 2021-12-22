const mongoose = require("mongoose")

const stackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    summary: {
        type: String,
        required: true,
        trim: true,
    },
    developer: {
        type: String,
        required: true,
        trim: true,
    },
    trendchannel: {
        type: String,
        required: true,
        trim: true,
    },
    releasechannel: {
        type: String,
        required: true,
        trim: true,
    },
    weburl: {
        type: String,
        required: true,
        trim: true,
    },
    giturl: {
        type: String,
        required: true,
        trim: true,
    },
})

stackSchema.methods.toJSON = function () {
    const stack = this
    const stackObject = stack.toObject()
    return stackObject
}


const Stack = mongoose.model("Stack", stackSchema)

module.exports = Stack
