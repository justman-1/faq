const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')
const jwt = require('jsonwebtoken')

async function main(req, res){
    const token = req.cookies.token
    let adminIs = false
    let superAdmin = false
    if(token){
        let login = false
        try{
            login = jwt.verify(token, process.env.SECRET_KEY).login
        }catch(err){
            console.log(err)
        }
        console.log(login)
        if(login){
            if(login == 'admin') superAdmin = true
            const cacheToken = cache.get('token:' + login)
            if(cacheToken && cacheToken == token){
                adminIs = true
            }
            else if(cacheToken && cacheToken != token){
                res.clearCookie('token')
                adminIs = false
            }
            else if(!cacheToken){
                const result = await User.findOne({login: 'admin'})
                cache.set('token', result.token)
                console.log(result)
                if(result.token == token){
                    adminIs = true
                }
                else{
                    res.clearCookie('token')
                    adminIs = false
                }
            }
        }
    }
    const curses = await Curse.find({})
    res.render('index', {
        curses: curses,
        admin: adminIs,
        superAdmin: superAdmin
    })

}

module.exports = main