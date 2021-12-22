const express = require("express")
const auth = require('../middleware/auth')
const Channel = require('../models/channel-model')
const User = require('../models/user-model')

const router = new express.Router()

router.post('/createchannel', auth, async (req, res)=>{
    const channel = new Channel()
    const creator = new Map()
    creator.set('name', req.user.name)
    channel.creator = creator
    channel.subject = req.body.subject
    
    await channel.save().then((channel)=>{
        res.status(201).send(channel)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})


module.exports = router