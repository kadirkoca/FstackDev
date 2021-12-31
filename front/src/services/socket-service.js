import { SocketURL } from "./url-set"
import { v4 as uuidv4 } from "uuid"

let Socket = null

//const {channel, meta, message, user}
class SocketCL {
    Connect(cb, token) {
        const token1 = "/X-Authorization=" + token
        Socket = new WebSocket(SocketURL + token1)
        Socket.onopen = () => cb({ status: true, message: "Connected" })
        Socket.onclose = () => cb({ status: false, message: "Disconnected" })
    }

    SendMessage(message) {
        if (Socket) Socket.send(JSON.stringify(message))
    }

    JoinChannel(uid, client) {
        const message = {
            meta: "join",
            uid,
            user: { id: client._id, name: client.name },
        }
        this.SendMessage(message)
    }

    LeaveChannel(uid, user) {
        if (Socket) {
            const message = {
                uid,
                meta: "leave",
                user:{ id: user._id, name: user.name}
            }

            this.SendMessage(message)
        }
    }

    CreateChannel(subject, user) {
        if (!user) return
        const uid = uuidv4()
        const channel = {
            uid,
            subject,
            creator: { id: user._id, name: user.name },
        }

        const message = {
            channel,
            meta: "create",
            user: { id: user._id, name: user.name },
            message: "",
        }

        this.SendMessage(message)
    }

    ListenMessage(cb) {
        if (Socket) {
            Socket.onmessage = (evt) => {
                try {
                    const message = JSON.parse(evt.data)
                    cb(message)
                } catch (error) {
                    //console.log(error)
                }
            }
        }
    }
}

export default new SocketCL()
