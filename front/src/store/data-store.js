import { createStore, combineReducers } from "redux"
import data from "../reducers/data-reducer"
import auth from "../reducers/auth-reducer"
import channel from "../reducers/channel-reducer"


const isDev = process.env.MODE === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : {}
export default createStore(combineReducers({
    data,
    auth,
    channel
}), isDev)
 