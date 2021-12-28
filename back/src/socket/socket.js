const SocketBase = require("./socket-base")
const SocketAuth = require("../middleware/socket-auth")
const WebSocket = require("ws")

const Channels = new Map()
let wsock = null
let wserver = null

class Socket extends SocketBase {
    constructor(options) {
        super()
        if (!options.server) {
            throw new Error("Server is not defined")
        }
        const wss = super.CreateServer(options.server, this.VerifyClient, (wsocket, request) => {
            wsock = wsocket
            wserver = wss
            this.SendChannels(wsocket, null, true)
            wsocket.on("message", (data) => {
                try {
                    this.ProcessMessage(wsocket, data)
                } catch (error) {
                    console.log(error)
                }
            })

            // wsocket.on("disconnected", (data)=>{
            //     console.log('disconnected')
            //     for(let channel of Channels){
            //         channel.participants.map((user)=> user.socket !== wsocket)
            //     }
            // })
        })
    }

    // Handshake
    VerifyClient({ origin, req, secure }, cb) {
        const token = req.url.replace("/X-Authorization=", "")
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
        const dataJSON = JSON.parse(data.toString())
        const { meta } = dataJSON

        if (meta === "create") {
            const { channel, user } = dataJSON
            channel.participants = [user]
            channel.messages = []
            this.SendMessage(socket, { meta: "channelcreated", channel })
            channel.socket = socket
            Channels.set(channel.uid, channel)
            this.SendChannels(socket, channel)
        } else if (meta === "join") {
            const { uid, user } = dataJSON
            user.socket = socket
            this.JoinChannel(socket, uid, user)
        } else if (meta === "textmessage") {
            const { message, uid } = dataJSON
            //{ text: e.target.message.value, sender: { id: props.user._id, name: props.user.name } }
            this.PushMessage(message, uid)
        } else if (meta === "leave") {
            const { uid, user } = dataJSON
            const ch = Channels.get(uid)
            if(!ch || !ch.participants || ch.participants.length < 2){
                Channels.delete(uid)
            }else{
                ch.participants = ch.participants.filter((client) => user.id !== client.id)
            }
            const message = {
                text: `${user.name} has left the channel`,
                sender: "server",
                meta: "leave",
                user,
            }
            const data = JSON.stringify({ meta: "newmessage", uid, message })
            this.BroadcastMessage(socket, data, false, false)
        }
    }

    PushMessage(message, uid) {
        const channel = Channels.get(uid)
        const data = JSON.stringify({ meta: "newmessage", uid, message })
        this.BroadcastMessage(null, data, false, true)
        channel.messages.push(message)
    }

    JoinChannel(socket, uid, user) {
        const channel = Channels.get(uid)
        if (!channel) return
        const person = channel.participants.find((person) => person.id === user.id)
        if (!person) {
            channel.participants.push(user)
        }

        const msg = {
            meta: "joinchannel",
            joint_channel: channel,
            user: { id: user.id, name: user.name },
        }
        const data = JSON.stringify(msg)
        socket.send(data)
        const message = {
            text: `${user.name} has joint the channel`,
            sender: "server",
            meta: "join",
            user: { id: user.id, name: user.name },
        }
        const bcast = JSON.stringify({ meta: "newmessage", uid, message })
        this.BroadcastMessage(socket, bcast, false, false)
    }

    SendChannels(socket, channel = null, sendtosocket = false, toAll = false) {
        if (!wserver) return
        let channels = null
        const msg = {}

        if (channel !== null) {
            channels = this.GetChannels(channel)
            if (channels === null) return
            msg.meta = "newchannel"
            msg.message = channels
        } else {
            channels = this.GetChannels()
            msg.meta = "channellist"
            msg.message = channels
            if (channels === null) msg.message = []
        }
        
        const data = JSON.stringify(msg)
        this.BroadcastMessage(socket, data, sendtosocket, toAll)
    }

    GetChannels(specifiChannel = null) {
        if (specifiChannel !== null) {
            const { socket, ...channelNew } = specifiChannel
            for (let user of channelNew.participants) {
                delete user["socket"]
            }
            return channelNew
        }
        if (Channels.size === 0) return null

        let dummyChannels = []
        for (let channel of Channels.values()) {
            delete channel["socket"]
            dummyChannels.push(channel)
        }
        return dummyChannels
    }

    BroadcastMessage(socket, data, toOne = false, toAll = false) {
        if (toOne === true) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data)
            }
            return
        }

        wserver.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                if ((toAll === false && client !== socket) || toAll === true) {
                    client.send(data)
                }
            }
        })
    }
}

module.exports = Socket
