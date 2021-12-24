import { LOGIN, LOGOUT, SIGNUP } from "../actions/action-types"
import { authContext } from "../services/storage-service"

export default (state = authContext(), action) => {
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
