const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')
const base64 = require('base-64')

async function getQuestions(req, res){
    const request = decodeURIComponent(base64.decode(req.headers.request))
    console.log(request)
    if(request && request.replace(/\s/g, '') != ''){
        let tags = request.match(/\S+/gi)
        console.log(tags)
        let regStr = ''
        tags.forEach((e, i)=>{
            if(i != tags.length - 1){
                regStr = regStr + e + '|'
            }
            else{
                regStr = regStr + e
            }
        })
        console.log(regStr)
        const reg = new RegExp(regStr)
        const result = await Question.find({name: reg})
        console.log(result)
        console.log(1)
        res.send({questions: result})
    }
    else{
        const result = await Question.find({})
        res.send({questions: result})
    }
}

module.exports = getQuestions