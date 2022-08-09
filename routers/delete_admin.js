const User = require('../mongodb/index.js').User
const cache = require('../cache/index.js')
const base64 = require('base-64')
const jwt = require('jsonwebtoken')


async function addAdmin(req, res){
    const id = req.body.id
    if(req.login != 'admin') return res.status(410).send('У вас недостаточно прав.')
    User.deleteOne({_id: id}, (err, result)=>{
        if(err){
            console.log(err)
            return res.status(410).send('Ошибка сервера')
        }
        res.send('ok')
    })
}

module.exports = addAdmin