import axios from "axios"
import authHeader from "./auth-header"
import { AddStackURL, GetHOMEURL, CreateChannelURL } from "./url-set"

class DataService {
    AddStack(stackData) {
        const headers = authHeader()
        return new Promise((res, rej) => {
            axios
                .post(AddStackURL, stackData, { headers })
                .then((response) => {
                    if (response.data.error) {
                        rej({ error: response.data.error })
                    }
                    res(response.data)
                })
                .catch((e) => {
                    rej({ error: e })
                })
        })
    }

    GetHOME() {
        return new Promise((res, rej) => {
            axios
                .get(GetHOMEURL)
                .then((response) => {
                    if (response.data.error) {
                        rej({ error: response.data.error })
                    }
                    res(response.data)
                })
                .catch((e) => {
                    rej({ error: e })
                })
        })
    }

    CreateChannel(channel) {
        const headers = authHeader()
        return new Promise((res, rej) => {
            axios
                .post(CreateChannelURL, channel, { headers })
                .then((response) => {
                    if (response.data.error) {
                        rej({ error: response.data.error })
                    }
                    res(response.data)
                })
                .catch((e) => {
                    rej({ error: e })
                })
        })
    }
}

export default new DataService()
