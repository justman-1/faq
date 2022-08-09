const User = require('../mongodb/index.js').User
const cache = require('../cache/index.js')
const jwt = require('jsonwebtoken')

async function adminCheck(req, res, next){
    if(!req.cookies || !req.cookies.token) res.status(411).send('Вы не админ.')
    else{
        let login;
        try{
            login = jwt.verify(req.cookies.token, process.env.SECRET_KEY).login
        }catch(err){
            console.log(err)
            return res.status(411).send('Вы не админ.')
        }
        req.login = login
        const cacheToken = cache.get('token:' + login)
        if(cacheToken){
            if(req.cookies.token != cacheToken){
                res.clearCookie('token')
                return res.status(411).send('Вы не админ.')
            }
            next()
        }
        else{
            const admin = await User.findOne({login: login})
            cache.set('token:' + login , admin.token)
            if(!admin || admin.token != req.cookies.token){
                res.clearCookie('token')
                return res.status(411).send('Вы не админ.')
            }
            next()
        }
    }
}

module.exports = adminCheck 