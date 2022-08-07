const User = require('../mongodb/index.js').User
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
    res.render('index', {
        curses: [
            {text: 'Unreal Engine для архитектурной визуализации', date: '09.08.2022'},
            {text: 'Unreal Engine для архитектурной визуализации', date: '09.08.2022'},
            {text: 'Unreal Engine для архитектурной визуализации', date: '09.08.2022'},
            {text: 'Unreal Engine для архитектурной визуализации', date: '09.08.2022'},
            {text: 'Unreal Engine для архитектурной визуализации', date: '09.08.2022'},
            {text: 'Unreal Engine для архитектурной визуализации', date: '09.08.2022'},
        ],
        admin: adminIs
    })

}

module.exports = main