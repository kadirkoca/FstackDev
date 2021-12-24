import { STACKS } from "../actions/action-types"
import { dataContext } from "../services/storage-service"

export default (state = dataContext(), action) => {
    const { type, content } = action

    switch (type) {
        case STACKS:
            return {
                ...state,
                ...content,
            }
        default:
            return state
    }
}
