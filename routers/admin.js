const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')
const jwt = require('jsonwebtoken')

function adminBreak(res){
    res.render('admin', {
        permission: false
    })
}
function adminNext(res){
    res.render('admin', {
        permission: true
    })
}

async function admin(req, res){
    if(!req.cookies || !req.cookies.token){
        return adminBreak(res)
    }
    let login;
    try{
        login = jwt.verify(req.cookies.token, process.env.SECRET_KEY).login
    }catch(err){
        console.log(err)
        return adminBreak(res)
    }
    console.log(3)
    if(login && login == 'admin'){
        return adminNext(res)
    }
    adminBreak(res)
}

module.exports = admin