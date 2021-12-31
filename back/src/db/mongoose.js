const mongoose = require('mongoose')

const dbURL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
mongoose.connect(dbURL,{})