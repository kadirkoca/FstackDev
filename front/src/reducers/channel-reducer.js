import { REGISTER_CHANNEL, FOCUS_CHANNEL, EXIT_CHANNEL, LOAD_CHANNEL, REGISTER_ALL_CHANNELS } from "../actions/action-types"
import { channelContext, AuthOfStorage } from "../services/storage-service"

const initialState = () => {
    //const auth = AuthOfStorage()
    return channelContext() //auth ? auth : authContext()
}

export default (state = initialState(), action) => {
    const { type, content } = action

    switch (type) {
        case REGISTER_CHANNEL:
            return {
                ...state,
                channels: [...state.channels, content],
            }
        case REGISTER_ALL_CHANNELS:
            return {
                ...state,
                channels: [...state.channels, ...content],
            }
        case LOAD_CHANNEL:
            return {
                ...state,
                loadedChannels: [...state.loadedChannels, content],
            }
        case FOCUS_CHANNEL:
            return {
                ...state,
                currentchannelID: content,
            }
        case EXIT_CHANNEL:
            return {
                ...state,
                ...content,
            }
        default:
            return state
    }
}
