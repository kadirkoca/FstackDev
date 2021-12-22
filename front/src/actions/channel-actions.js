import { REGISTER_CHANNEL, FOCUS_CHANNEL, EXIT_CHANNEL, LOAD_CHANNEL, REGISTER_ALL_CHANNELS } from "./action-types"

export const RegisterChannelsAction = (content) =>({
    type: REGISTER_CHANNEL,
    content,
})

export const EnterChannelAction = (content) => ({
    type: FOCUS_CHANNEL,
    content,
})

export const LoadChannelAction = (content) => ({
    type: LOAD_CHANNEL,
    content,
})

export const ExitChannelAction = (content) => ({
    type: EXIT_CHANNEL,
    content,
})

export const RegisterAllChannelsAction = (content) => ({
    type: REGISTER_ALL_CHANNELS,
    content,
})