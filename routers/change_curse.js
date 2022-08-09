const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')

async function saveCurse(req, res){
    let text = req.body.text
    const date = req.body.date1
    const id = req.body.id
    text = text.replace(/</g, ' <').replace(/>/g, '> ')
    console.log(text)
    text = text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>").replace(/(https:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
    console.log(text)
    if(text.replace(/ /g,'') == '' || date.replace(/ /g,'') == '') res.status(410).send('Заполните все поля')
    const result = await Curse.updateOne({_id: id}, { text: text, date: date})
    if(result.modifiedCount == 0) return res.status(410).send('Произошла ошибка')
    console.log(result)
    res.send({ text: text, date: date })
}

module.exports = saveCurse