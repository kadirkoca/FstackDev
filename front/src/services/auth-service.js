import authHeader from "./auth-header"
import { authContext, WriteStorage, DestroyDestroy } from "./storage-service"
import axios from "axios"
import { LoginURL, LogoutURL, SignupURL } from "./url-set"

class AuthService {
    LoginService(email, password) {
        return new Promise((res, rej) => {
            axios.post(LoginURL, { email, password }).then((response) => {
                if (response.data.error) {
                    rej({ error: response.data.error })
                }

                const context = authContext()
                context.authenticated = true
                context.user = response.data.user
                context.token = response.data.token
                WriteStorage(context, 'auth')
                res(context)
            }).catch((e)=>{
                rej({ error: e })
            })
        })
    }

    LogoutService() {
        const headers = authHeader()
        return new Promise((res, rej) => {
            axios.post(LogoutURL, {}, { headers }).then((response) => {
                if (response.data.error) {
                    rej({ error: response.data.error })
                }

                DestroyDestroy('auth')
                const context = authContext()
                res(context)
            }).catch((e)=>{
                rej({ error: e })
            })
        })
    }
    
    SignupService(name, email, password) {
        return new Promise((res, rej) => {
            axios.post(SignupURL, {name, email, password }).then((response) => {
                if (response.data.error) {
                    rej({ error: response.data.error })
                }

                const context = authContext()
                context.authenticated = true
                context.user = response.data.user
                context.token = response.data.token
                WriteStorage(context, 'auth')
                res(context)
            }).catch((e)=>{
                rej({ error: e })
            })
        })
    }
}

export default new AuthService()
