const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const Question = require('../mongodb/index.js').Question
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
    const curses1 = await Curse.find({})
    const length = curses1.length
    const curses = await Curse.find({}).skip((length > 12) ? length - 12 : 0)
    let result = []
    for(let i=curses.length - 1;i>-1;i--){
        result.push(curses[i])
    }
    res.render('index', {
        curses: (adminIs) ? curses1 : result,
        cursesMore: (length > 12) ? true : false,
        admin: adminIs,
        superAdmin: superAdmin
    })

}

module.exports = main