const User = require('../mongodb/index.js').User
const cache = require('../cache/index.js')
const base64 = require('base-64')
const jwt = require('jsonwebtoken')
User.findOne({login: 'admin'}, (e, result)=>{
    console.log(base64.decode(result.password))
})


async function addAdmin(req, res){
    console.log(req.login)
    if(req.login != 'admin') return res.status(410).send('У вас недостаточно прав.')
    const login = req.body.login
    const password = req.body.password
    if(login.replace(/ /g,'') == '' || password.replace(/ /g,'') == '') return res.status(410).send('Поля не должны быть пустыми')
    const admins = await User.find({})
    const found = admins.find(e=>{ return e.login == login})
    if(found) return res.status(410).send('Логин занят')
    let result = await User.create({ login: login, password: base64.encode(password) })
    console.log(result)
    res.send({ login: login, password: password, id: result._id })
}

module.exports = addAdmin