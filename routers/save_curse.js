const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')

async function saveCurse(req, res){
    let text = req.body.text
    const date = req.body.date1
    text = text.replace(/(http:\/\/[^\s]+)/g, "<a href='$1'>$1</a>").replace(/(https:\/\/[^\s]+)/g, "<a href='$1'>$1</a>")
    console.log(text)
    if(text.replace(/ /g,'') == '' || date.replace(/ /g,'') == '') res.status(410).send('Заполните все поля')
    const result = await Curse.create({ text: text, date: date})
    res.send({ id: result._id, text: text, date: date })
}

module.exports = saveCurse