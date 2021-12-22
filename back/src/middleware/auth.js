const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const auth = async (req, res, next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.APP_SECRET)
        const user = await User.findOne({_id:decode._id, 'tokens.token':token})

        if(!user){
            return res.status(501).send('Non Authorized Attempt')
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(501).send('Non Authorized Attempt')
    }
}

module.exports = auth