const jwt = require('jsonwebtoken')
const User = require('../mongodb/index.js').User
const base64 = require('base-64')

function adminBreak(res){
    res.render('en-admin', {
        permission: false
    })
}
async function adminNext(res){
    const admins = await User.find({}, ['login', 'password', '_id'])
    admins.forEach(e => e.password = base64.decode(e.password))
    let result = []
    for(let i=admins.length - 1;i>-1;i--){
        result.push(admins[i])
    }
    res.render('en-admin', {
        permission: true,
        admins: result
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