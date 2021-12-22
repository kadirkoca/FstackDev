const express = require("express")
const auth = require('../middleware/auth')
const User = require('../models/user-model')

const router = new express.Router()

router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(user.error){
            return res.status(401).send(user.error)
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(401).send('Something went wrong yada yada yada .... Try again')
    }
})

router.post("/signup", async (req, res) => {
    const user = new User(req.body)    
    try {
        const userRec = await user.save()
        const token = await userRec.generateAuthToken()
        if(token.error){
            return res.send(token.error)
        }
        res.send({user, token})
    } catch (error) {
        if(error.code && error.code === 11000){
            return res.send({error: 'This email address is alread registered'})
        }
        res.status(400).send({ error: error.message })
    }
})


router.post('/logout', auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200).send('Logged Out!')
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

module.exports = router