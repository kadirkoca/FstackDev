const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const SocketAuth = async (cookie) =>{
    try {
        const replaceQuery = process.env.MODE === 'development' ? 'X-Authorization=' : '/ws'
        const token = cookie.replace(replaceQuery,'')
        const decode = jwt.verify(token, process.env.APP_SECRET)
        const user = await User.findOne({_id:decode._id, 'tokens.token':token})

        if(!user){
            return {
                error : 'Non Authorized Attempt',
                code: 501
            }
        }

        const set = {
            token,
            user
        }
        return set
    } catch (e) {
        console.log(e)
        return {
            error : 'Something was wrong with cookie',
            code:404
        }
    }
}

module.exports = SocketAuth