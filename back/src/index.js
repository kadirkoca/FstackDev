const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../config/.env') })
require("./db/mongoose")
const express = require("express")
const http = require("http")
const helmet = require("helmet")
const Socket = require("./socket/socket")
const cors = require("cors")
const bodyParser = require("body-parser")
//ROUTES
const authroutes = require("./routes/auth-routes")
const superroutes = require("./routes/super-routes")
const userroutes = require("./routes/user-routes")
const genericroutes = require("./routes/generic-routes")

const app = express()
const server = http.createServer(app)
new Socket({server, auth:true})

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
app.get("/", (req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    console.log("full url "+fullUrl)
    res.send("<h1>Server Running</h1>")
})


const port = process.env.PORT
app.listen(port, () => console.log(`Example app listening on port >> ${port}!`))
