import {
    REGISTER_CHANNEL,
    FOCUS_CHANNEL,
    EXIT_CHANNEL,
    LOAD_CHANNEL,
    REGISTER_ALL_CHANNELS,
    SET_SERVER_MESSAGE,
    REGISTER_MESSAGE,
    REGISTER_USER
} from "./action-types"

export const RegisterChannelsAction = (content) => ({
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

export const SetServerMessageAction = (content) => ({
    type: SET_SERVER_MESSAGE,
    content,
})

export const RegisterUserAction = (content) => ({
    type: REGISTER_USER,
    content,
})

export const RegisterMessageAction = (content) => ({
    type: REGISTER_MESSAGE,
    content,
})
