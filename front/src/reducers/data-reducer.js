import { STACKS } from "../actions/action-types"
import { dataContext, DataOfStorage } from "../services/storage-service"

const initialState = () => {
    const auth = DataOfStorage()
    return auth ? auth : dataContext()
}

export default (state = initialState(), action) => {
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
