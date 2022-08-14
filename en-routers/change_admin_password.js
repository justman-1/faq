const User = require('../en-mongodb/index.js').User
const cache = require('../cache/index.js')
const {uid} = require('uid')
const base64 = require('base-64')
const jwt = require('jsonwebtoken')


async function changeAdminPassword(req, res){
    const password1 = req.body.password1
    const password2 = req.body.password2
    const token = req.cookies.token
    const login = jwt.verify(req.cookies.token, process.env.SECRET_KEY).login
    if(password1 != password2) return res.status(410).send(`Passwords don't match`)
    else if(login != 'admin') return res.status(410).send("You don't have enough rights to change your password")
    const newToken = jwt.sign({login: login, num: uid(10)}, process.env.SECRET_KEY)
    User.updateOne({login: login}, {password: base64.encode(password1), token: newToken}, (err, result)=>{
        cache.set('token:' + login, newToken)
        res.cookie('token', newToken)
        res.send({token: newToken})
    })
}

module.exports = changeAdminPassword