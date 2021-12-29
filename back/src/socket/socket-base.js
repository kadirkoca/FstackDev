const SocketAuth = require("../middleware/socket-auth")
const WebSocket = require("ws")

class SocketBase {
    constructor() {
        if (this.constructor === SocketBase) {
            throw new Error("Abstract classes can't be instantiated.")
        }
        this.WebSocketServer = WebSocket.Server
    }

    CreateServer(server, verificationCallback, ConnectionCallBack) {
        const wss = new this.WebSocketServer({
            server,
            verifyClient: verificationCallback
        })
        wss.on("connection", ConnectionCallBack)
        return wss
    }
}

module.exports = SocketBase
