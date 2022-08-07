const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')

async function main(req, res){
    const token = req.cookies.token
    let adminIs = false
    if(token){
        const cacheToken = cache.get('token')
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
    const curses = await Curse.find({})
    res.render('index', {
        curses: curses,
        admin: adminIs
    })

}

module.exports = main