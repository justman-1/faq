const User = require('../mongodb/index.js').User
const cache = require('../cache/index.js')
const base64 = require('base-64')
const {uid} = require('uid')
const jwt = require('jsonwebtoken')

async function changeAdmin(req, res){
    const id = req.body.id
    const login = req.body.login
    const password = req.body.password
    if(req.login != 'admin') return res.status(410).send("You don't have enough rights.")
    if(login.replace(/ /g,'') == '' || password.replace(/ /g,'') == '') return res.status(410).send('Fill in all fields')
    const admins = await User.find({})
    const found = admins.find(e=>{ return e.login == login && e._id != id })
    if(found) return res.status(410).send('The login is already occupied')
    const admin = User.findOne({_id: id})
    if(admin.password != base64.encode(password)){
        const token = jwt.sign({login: login, num: uid(10)}, process.env.SECRET_KEY)
        User.updateOne({_id: id}, {login: login, password: base64.encode(password), token: token}, (err, result)=>{
            cache.set('token:' + login, token)
            if(err) return res.status(410).send('Server error')
            res.send({login: login, password: password})
        })
    }
    else{
        User.updateOne({_id: id}, {login: login, password: base64.encode(password)}, (err, result)=>{
            if(err) return res.status(410).send('Server error')
            res.send({login: login, password: password})
        })
    }
}

module.exports = changeAdmin