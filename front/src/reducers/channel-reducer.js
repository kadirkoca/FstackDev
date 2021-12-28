import {
    REGISTER_CHANNEL,
    FOCUS_CHANNEL,
    EXIT_CHANNEL,
    LOAD_CHANNEL,
    REGISTER_ALL_CHANNELS,
    SET_SERVER_MESSAGE,
    REMOVE_SERVER_MESSAGE
} from "../actions/action-types"
import { channelContext, WriteStorage, DestroyDestroy } from "../services/storage-service"

export default (state = channelContext(), action) => {
    const { type, content } = action
    const fakestate = state

    switch (type) {
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
        case REGISTER_CHANNEL:
            const channels = fakestate.channels.filter((ch) => ch.uid !== content.uid)

            if (content.participants.length > 0) {
                channels.push(content)
            }

            WriteStorage(Object.assign(fakestate, { channels: channels }), "channel")
            return {
                ...fakestate,
                channels: channels,
            }
        case LOAD_CHANNEL:
            const loadedChannels = fakestate.loadedChannels.filter((ch) => ch.uid !== content.uid)

            if (content.participants.length > 0) {
                loadedChannels.push(content)
            }

            WriteStorage(Object.assign(fakestate, { loadedChannels: loadedChannels }), "channel")
            return {
                ...fakestate,
                loadedChannels: loadedChannels,
            }
        case FOCUS_CHANNEL:
            WriteStorage(Object.assign(fakestate, { currentChannel: content }), "channel")
            return {
                ...state,
                currentChannel: content,
            }
        case SET_SERVER_MESSAGE:
            const servermessages = state.server_messages ? state.server_messages : []
            return {
                ...state,
                server_messages: [...servermessages, content],
            }
        case REMOVE_SERVER_MESSAGE:
            const servermessagesRemoved = state.server_messages.filter((msg) => msg.uid !== content)
            return {
                ...state,
                server_messages: servermessagesRemoved,
            }
        case EXIT_CHANNEL:
            const clippedLoadedChannels = fakestate.loadedChannels.filter((ch) => ch.uid !== content.uid)
            const clippedChannels = []
            fakestate.channels.forEach((ch) => {
                if (ch.uid === content.uid) {
                    ch.participants = ch.participants.filter((user) => user.id !== content.user_id)
                    if (ch.participants.length > 0) {
                        clippedChannels.push(ch)
                    }
                } else {
                    clippedChannels.push(ch)
                }
            })
            WriteStorage(
                Object.assign(fakestate, { channels: clippedChannels, loadedChannels: clippedLoadedChannels }),
                "channel"
            )
            return {
                ...fakestate,
                channels: clippedChannels,
                loadedChannels: clippedLoadedChannels,
            }
        default:
            return state
    }
}

const addIfnotExist = (state, channel, cuser) => {
    let currentparts = channel.participants.find((user) => user.id === cuser.id)
    if (!currentparts) {
        channel.participants.push(cuser)
    }
}
