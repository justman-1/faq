const User = require('../en-mongodb/index.js').User
const Curse = require('../en-mongodb/index.js').Curse
const Question = require('../en-mongodb/index.js').Question
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
                const result = await User.findOne({login: login})
                if(result == null || result == undefined){
                    adminIs = false
                    res.cookie('token', token + 'random')
                }
                else{
                    cache.set('token:', result.token)
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
    }
    res.render('en-faq', {
        admin: adminIs,
        superAdmin: superAdmin
    })

}

module.exports = main