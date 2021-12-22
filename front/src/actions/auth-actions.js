import { LOGIN, LOGOUT, SIGNUP } from "./action-types"

export const LoginAction = (content) =>({
    type: LOGIN,
    content,
})

export const LogoutAction = (content) => ({
    type: LOGOUT,
    content,
})

export const SignupAction = (content) => ({
    type: SIGNUP,
    content,
})