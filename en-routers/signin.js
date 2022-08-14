const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../en-mongodb/index.js').User
const cache = require('../cache/index.js')
const base64 = require('base-64')
const {uid} = require('uid')

function signin(req, res){
    const login = req.body.login
    const password = req.body.password
    console.log(req.cookies)
    User.findOne({login: login}, (err, result)=>{
        if(!result) return res.status('410').send('There are no users with this username')
        console.log(result)
        if(base64.encode(password) != result.password) res.status(410).send('Incorrect password')
        else if(!result.token){
            const token = jwt.sign({login: login, num: uid(10)}, process.env.SECRET_KEY)
            User.updateOne({login: login}, {token: token}, ()=>{
                cache.set('token:' + login, token)
                res.send({token: token})
            })
        }
        else{
            cache.set('token:' + login, result.token)
            res.cookie('token', result.token)
            res.send({token: result.token})
        }
    })
}

module.exports = signin