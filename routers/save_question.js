const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')

async function saveCurse(req, res){
    const name = req.body.name
    let text = req.body.text
    const dot = '•'
    text = text.replace(/^/gm, '</br> ' + dot)
    console.log(text)
    Question.create({name: name, text: text}, (err, result)=>{
        if(err) return res.status(410).send('Ошибка сервера')
        res.send('ok')
    })
}


module.exports = saveCurse