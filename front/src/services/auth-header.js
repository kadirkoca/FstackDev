import { AuthOfStorage } from "./storage-service"

export default function authHeader() {
    const token = ReadStorage("token", "auth")
    if (token) {
        return { Authorization: `Bearer ${token}` }
    } else {
        return {}
    }
}
