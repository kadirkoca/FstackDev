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
        const wss = super.CreateServer(options.server, this.VerifyClient, (wsocket) => {
            wsock = wsocket           
            wserver = wss
            this.SendChannels(wsocket, null, true)
            wsocket.on("message", (data) => {
                this.ProcessMessage(wsocket, data)
            })

            wsocket.on("disconnected", (data)=>{
                console.log('disconnected')
                for(let channel of Channels){
                    channel.participants.map((user)=> user.socket !== wsocket)
                }
            })
        })
    }

    // Handshake
    VerifyClient(info, cb) {
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
        const dataJSON = JSON.parse(data.toString())
        const {meta} = dataJSON

        if (meta === "create") {
            const { channel, user } = dataJSON
            channel.participants = [user]
            channel.messages = []
            this.SendMessage(socket, { meta: "channelcreated", channel })
            
            user.socket = socket
            channel.socket = socket
            Channels.set(channel.uid, channel)   
            this.SendChannels(socket, channel)
        }else if(meta === 'join'){
            const { message, user } = dataJSON
            const {uid, count} = message
            user.socket = socket
            this.JoinChannel(socket, uid, count, user)
        }else if(meta === 'textmessage'){
            const { message, cuid } = dataJSON
            this.PushMessage(message, cuid)
        }
    }

    PushMessage(msg, cuid){
        const channel = Channels.get(cuid)
        for(let user of channel.participants){
            if(user.id !== msg.sender){                
                msg.direction = 'left'
                user.socket.send(JSON.stringify({meta: 'newmessage', cuid, message: msg}))
            }
        }
        channel.messages.push(msg)
    }

    JoinChannel(socket, channelUID, count, user) {
        const channel = Channels.get(channelUID)
        if(!channel)return
        const person = channel.participants.find((person) => person.id === user.id)
        if (!person) {
            channel.participants.push(user)
        }
        
        let messageBatch = []
        if(count !== channel.messages.length){
            for(let i = count; i<channel.messages.length; i++){
                messageBatch.push(channel.messages[i])
            }
        }

        const msg = {
            messages: messageBatch,
            meta: "joinchannel",
            uid:channelUID,
            user
        }
        const data = JSON.stringify(msg)
        socket.send(data)
        this.SendChannels(socket, channel, false, true)
        const message = { text: `${user.name} has joint the channel`, sender: 'server', meta: 'join' ,sender_id: user.id }
        const bcast = JSON.stringify({meta: 'newmessage', channelUID, message})
        this.BroadcastMessage(socket, bcast, false, true)
    }

    SendChannels(socket, channel = null, sendtosocket = false, toAll = false) {
        if (!wserver) return
        let channels = null

        if(channel !== null){
            channels = this.GetChannels(channel)
        }else{
            channels = this.GetChannels()
        }

        if(channels === null) return
        const msg = {
            message: channels,
            meta: "channellist",
        }
        const data = JSON.stringify(msg)
        this.BroadcastMessage(socket, data, sendtosocket, toAll)
    }

    GetChannels(specifiChannel = null){
        if(specifiChannel !== null){
            const {socket, ...channelNew} = specifiChannel
            for(let user of channelNew.participants){
                delete user['socket']
            }
            return [channelNew]
        }
        if(Channels.size === 0)return null

        let dummyChannels = []
        for (let channel of Channels.values()) {
            delete channel['socket']
            dummyChannels.push(channel)
        }
        return dummyChannels
    }

    BroadcastMessage(socket, data, toOne = false, toAll = false){
        if(toOne === true){
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data)
            }
            return
        }

        wserver.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                if((toAll === false && client !== socket) || toAll === true){
                    client.send(data)
                }
            }
        })
    }
}

module.exports = Socket
