import { AuthOfStorage } from "./storage-service"

export default function authHeader() {
    const token = AuthOfStorage("token")
    if (token) {
        return { Authorization: `Bearer ${token}` }
    } else {
        return {}
    }
}
