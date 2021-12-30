const mongoose = require('mongoose')

const env = process.env
const dbURL = `mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`
mongoose.connect(dbURL,{})