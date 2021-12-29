const express = require("express")
const http = require("http")
const helmet = require("helmet")
const Socket = require('./socket/socket') 
const cors = require("cors")
const bodyParser = require("body-parser")
const authroutes = require("./routes/auth-routes")
const superroutes = require("./routes/super-routes")
const userroutes = require("./routes/user-routes")
const genericroutes = require("./routes/generic-routes")
require("./db/mongoose")


const port = process.env.PORT
console.log(process.env)
const app = express()
const server = http.createServer(app)
const socket = new Socket({server, auth:false})

app.use(helmet())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(cors())
app.use("/api/auth", authroutes)
app.use("/api/super", superroutes)
app.use("/api/user", userroutes)
app.use("/api", genericroutes)
app.get("/test", (req, res)=>{
    res.send('<h1>Server Running</h1>')
})

server.listen(port, "127.0.0.1", () => console.log(`Example app listening on port ${port}!`))
