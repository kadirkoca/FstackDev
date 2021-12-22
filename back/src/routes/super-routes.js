const express = require("express")
const auth = require('../middleware/auth')
const Stack = require('../models/stack-model')

const router = new express.Router()

/// SUPER
router.post("/addstack", auth, async (req, res)=>{
    try {
        if(req.user.level !== 'super'){
            return res.status(501).send('You are nobody')
        }
        const stack = new Stack(req.body)   

        await stack.save()
        res.status(200).send('saved')
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

module.exports = router