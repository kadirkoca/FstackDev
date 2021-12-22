const API_URL = process.env.API_URL

// SUPER
export const AddStackURL = API_URL + "/super/addstack"


// AUTH
export const LoginURL = API_URL + "/auth/login"
export const LogoutURL = API_URL + "/auth/logout"
export const SignupURL = API_URL + "/auth/signup"


// PUBLIC
export const GetHOMEURL = API_URL + "/gethome"


// USER
export const CreateChannelURL = API_URL + "/user/createchannel"
export const SocketURL = process.env.WEB_SOCKET_URL