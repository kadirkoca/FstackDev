const SocketBase = require("./socket-base")
const SocketAuth = require("../middleware/socket-auth")

const Channels = new Map()
const Clients = []
let wsock = null
let wserver = null

class Socket extends SocketBase {
    constructor(options) {
        super()
        if (!options.server) {
            throw new Error("Server is not defined")
        }
        const wss = super.CreateServer(options.server, this.VerifyClient, (wsocket) => {
            wsock = wsocket
            this.SendChannels(wsocket)
            Clients.push(wsocket)
            wsocket.on("message", (data) => {
                this.ProcessMessage(wsocket, data)
            })
        })
        if (wss) wserver = wss
    }

    // Handshake
    #VerifyClient(info, cb) {
        const token = info.req.headers.cookie
        if (!token) {
            cb(false, 501, "Unauthorized")
            return
        }
        SocketAuth(token)
            .then((response) => {
                if (response.error) {
                    cb(false, 401, "Unauthorized")
                    return
                }
                cb(true)
            })
            .catch((e) => {
                cb(false, 401, "Unauthorized")
            })
    }

    SendMessage(socket, message) {
        if (socket !== null) {
            const data = typeof message === "object" ? JSON.stringify(message) : message
            socket.send(data)
            return "sent"
        } else {
            return "Socket not ready"
        }
    }

    ProcessMessage(socket, data) {
        if (!data) {
            return "Message not ready"
        }

        const { channel, meta, user } = JSON.parse(data.toString())
        if (meta === "create") {
            channel.participants = [user]
            channel.socket = socket
            this.SendMessage(socket, { meta: "channelcreated", channel })
            Clients.forEach((client, i) => {
                if (socket !== client) {
                    this.SendChannels(client)
                }
            })
            Channels.set(channel.uid, channel)
        } else {
            this.SendMessage(socket, { message })
        }
    }

    JoinChannel(channelUID, user) {
        const channel = Channels.get(channelUID)
        channel.participants.push(user)
    }

    SendChannels(socket) {
        if (!socket.readyState) return
        const msg = {
            message: Object.fromEntries(Channels),
            meta: "channellist",
        }
        const data = JSON.stringify(msg)
        if (Channels.size > 0) {
            socket.send(data)
        }
    }

    BroadcastNewChannel(socket, channel) {
        if (!wserver) return
        wserver.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN && client !== socket) {
                client.send(data, { binary: isBinary })
            }
        })
    }
}

module.exports = Socket
