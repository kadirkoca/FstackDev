import { LOGIN, LOGOUT, SIGNUP } from "../actions/action-types"
import { authContext, AuthOfStorage } from "../services/storage-service"

const initialState = () => {
    const auth = AuthOfStorage()
    return auth ? auth : authContext()
}

export default (state = initialState(), action) => {
    const { type, content } = action

    switch (type) {
        case LOGIN:
            return {
                ...state,
                ...content,
            }
        case LOGOUT:
            return {
                ...state,
                ...content,
            }
        case SIGNUP:
            return {
                ...state,
                ...content,
            }
        default:
            return state
    }
}
