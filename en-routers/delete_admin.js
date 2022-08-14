const User = require('../en-mongodb/index.js').User
const cache = require('../cache/index.js')
const base64 = require('base-64')
const jwt = require('jsonwebtoken')


async function addAdmin(req, res){
    const id = req.body.id
    if(req.login != 'admin') return res.status(410).send("You don't have enough rights.")
    User.deleteOne({_id: id}, (err, result)=>{
        if(result){
            let cacheToken = cache.get('token:' + result.login)
            if(cacheToken) cache.del('token:' + result.login)
        }
        if(err){
            console.log(err)
            return res.status(410).send('Server error')
        }
        res.send('ok')
    })
}

module.exports = addAdmin