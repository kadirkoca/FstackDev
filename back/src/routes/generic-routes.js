const express = require("express")
const Stack =  require('../models/stack-model')

const router = new express.Router()

router.get("/gethome", async (req, res) => {
    try {
        const stacks = await Stack.find()
        res.send({
            stacks
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

module.exports = router