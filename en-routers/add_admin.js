const User = require('../en-mongodb/index.js').User
const cache = require('../cache/index.js')
const base64 = require('base-64')
const jwt = require('jsonwebtoken')

async function addAdmin(req, res){
    console.log(req.login)
    if(req.login != 'admin') return res.status(410).send(`You don't have enough rights.`)
    const login = req.body.login
    const password = req.body.password
    if(login.replace(/ /g,'') == '' || password.replace(/ /g,'') == '') return res.status(410).send('Fields should not be empty')
    const admins = await User.find({})
    const found = admins.find(e=>{ return e.login == login})
    if(found) return res.status(410).send('The login is already occupied')
    let result = await User.create({ login: login, password: base64.encode(password) })
    console.log(result)
    res.send({ login: login, password: password, id: result._id })
}

module.exports = addAdmin