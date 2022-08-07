const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../mongodb/index.js').User
const cache = require('../cache/index.js')
const hash = require('md5')

function signin(req, res){
    const login = req.body.login
    const password = req.body.password
    console.log(req.cookies)
    if(login != 'admin') return res.status(410).send('Нет пользователей с таким логином')
    User.findOne({login: login}, (err, result)=>{
        console.log(result)
        if(hash(password) != result.password) res.status(410).send('Неправильный пароль')
        else if(!result.token){
            const token = jwt.sign({login: 'admin'}, process.env.SECRET_KEY)
            User.updateOne({login: 'admin'}, {token: token}, ()=>{
                res.send({token: token})
            })
        }
        else{
            cache.set('token', result.token)
            res.cookie('token', result.token)
            res.send({token: result.token})
        }
    })
}

module.exports = signin