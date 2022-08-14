const User = require('../en-mongodb/index.js').User
const Question = require('../en-mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')
const jwt = require('jsonwebtoken')
const base64 = require('base-64')

async function getQuestions(req, res){
    const token = req.cookies.token
    let adminIs = false
    if(token){
        let login = false
        try{
            login = jwt.verify(token, process.env.SECRET_KEY).login
        }catch(err){
            console.log(err)
        }
        if(login){
            const cacheToken = cache.get('token:' + login)
            if(cacheToken && cacheToken == token){
                adminIs = true
            }
            else if(cacheToken && cacheToken != token){
                res.clearCookie('token')
                adminIs = false
            }
            else if(!cacheToken){
                const result = await User.findOne({login: login})
                if(result == null || result == undefined){
                    adminIs = false
                    res.cookie('token', token + 'random')
                }
                else{
                    cache.set('token:', result.token)
                    if(result.token == token){
                        adminIs = true
                    }
                    else{
                        res.clearCookie('token')
                        adminIs = false
                    }
                }
            }
        }
    }
    const request = decodeURIComponent(base64.decode(req.headers.request))
    if(request && request.replace(/\s/g, '') != ''){
        let tags = request.match(/\S+/gi)
        let regStr = ''
        tags.forEach((e, i)=>{
            if(i != tags.length - 1){
                regStr = regStr + e + '|'
            }
            else{
                regStr = regStr + e
            }
        })
        const reg = new RegExp(regStr, 'gi')
        const result1 = await Question.find({name: reg})
        const result2 = await Question.find({text: reg})
        let result3 = result1.concat(result2)
        let result = []
        for(i=0;i<result3.length;i++){
            let res2 = false
            for(m=0;m<result.length;m++){
                if(base64.encode(result3[m]._id) == base64.encode(result3[i]._id)) res2 = true
            }
            if(!res2) result.push(result3[i])
        }
        res.send({questions: result, admin: adminIs})
    }
    else{
        const result = await Question.find({})
        res.send({questions: result, admin: adminIs})
    }
}

module.exports = getQuestions