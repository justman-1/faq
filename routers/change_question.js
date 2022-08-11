const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')

async function saveCurse(req, res){
    const id = req.body.id
    console.log(id)
    const name = req.body.name
    let text = req.body.text
    const dot = '•'
    text = text.replace(/^/gm, '</br> ' + dot).replace(/<div>/g, '</br> ' + dot).replace(/<\/div>/g, '' + dot)
    if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == '') return res.status(410).send('Поля не должны быть пустыми')
    Question.findByIdAndUpdate(id, {name: name, text: text}, (err, result)=>{
        if(err) return console.log(err)
        console.log(result)
        res.send('ok')
    })
}


module.exports = saveCurse