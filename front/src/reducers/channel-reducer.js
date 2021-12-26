import {
    REGISTER_CHANNEL,
    FOCUS_CHANNEL,
    EXIT_CHANNEL,
    LOAD_CHANNEL,
    REGISTER_ALL_CHANNELS,
    SET_SERVER_MESSAGE,
    REGISTER_MESSAGE,
    REGISTER_USER,
} from "../actions/action-types"
import { channelContext, WriteStorage, DestroyDestroy } from "../services/storage-service"

export default (state = channelContext(), action) => {
    const { type, content } = action
    const fakestate = state

    switch (type) {
        case REGISTER_CHANNEL:
            let channels = [content]
            
            if (fakestate.channels.length > 0) {
                channels = fakestate.channels.filter((ch) => ch.uid !== content.uid)
                channels.push(content)
            }

            WriteStorage(Object.assign(fakestate, { channels: channels }), "channel")
            return {
                ...state,
                channels,
            }
        case REGISTER_ALL_CHANNELS:
            if (content.length === 0) {
                DestroyDestroy("channel")
                return channelContext(true)
            } else if (fakestate.currentChannel.hasOwnProperty("uid")) {
                const isexist = content.find((ch) => ch.uid === fakestate.currentChannel.uid)
                if (!isexist) {
                    Object.assign(fakestate, { currentChannel: {} })
                }
            }
            const allchannels = [...content]
            WriteStorage(Object.assign(fakestate, { channels: allchannels }), "channel")
            return {
                ...state,
                channels: allchannels,
            }
        case LOAD_CHANNEL:
            let loadedchannels = [content]
            
            if (fakestate.loadedChannels.length > 0) {
                loadedchannels = fakestate.loadedChannels.filter((ch) => ch.uid !== content.uid)
                loadedchannels.push(content)
            }
            WriteStorage(Object.assign(fakestate, { loadedChannels: loadedchannels }), "channel")
            return {
                ...state,
                loadedChannels: loadedchannels,
            }
        case FOCUS_CHANNEL:
            WriteStorage(Object.assign(fakestate, { currentChannel: content }), "channel")
            return {
                ...state,
                currentChannel: content,
            }
        case SET_SERVER_MESSAGE:
            return {
                ...state,
                server_message: content,
            }
        case EXIT_CHANNEL:
            const clippedLoadedChannels = clipLoadedChannel(content, fakestate.loadedChannels)
            fakestate.loadedChannels = [...clippedLoadedChannels]
            WriteStorage(fakestate, "channel")
            return { ...state, ...fakestate }
        case REGISTER_MESSAGE:
            let messageFound = fakestate.currentChannel.messages.find(
                (msg) => msg.sender.id === content.sender.id && msg.text === content.text
            )
            if (!messageFound) {
                fakestate.currentChannel.messages.push(content)
            }

            WriteStorage(fakestate, "channel")
            return {
                ...state,
                currentChannel: fakestate.currentChannel,
            }
        case REGISTER_USER: // expected {uid, user}
            addIfnotExist(fakestate, fakestate.currentChannel, content.user)
            let updchannel = fakestate.channels.forEach((ch) => ch.uid === content.uid)
            if (updchannel) {
                addIfnotExist(fakestate, updchannel, content.user)
            }
            let updloadchannel = fakestate.loadedChannels.forEach((ch) => ch.uid === content.uid)
            if (updloadchannel) {
                addIfnotExist(fakestate, updloadchannel, content.user)
            }

            WriteStorage(fakestate, "channel")
            return {
                ...fakestate,
            }
        default:
            return state
    }
}

const clipLoadedChannel = (channel, loadedChannels) => {
    return loadedChannels.filter((ch) => ch.uid !== channel.uid)
}

const addIfnotExist = (state, channel, cuser) => {
    let currentparts = channel.participants.find((user) => user.id === cuser.id)
    if (!currentparts) {
        channel.participants.push(cuser)
    }
}
