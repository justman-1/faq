const User = require('../en-mongodb/index.js').User
const Curse = require('../en-mongodb/index.js').Curse
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')

async function saveCurse(req, res){
    let text = req.body.text
    const date = req.body.date1
    const id = req.body.id
    text = textParse(text)
    if(text.replace(/ /g,'') == '' || date.replace(/ /g,'') == '') res.status(410).send('Fill in all fields')
    const result = await Curse.updateOne({_id: id}, { text: text, date: date})
    res.send({ text: text, date: date })
}

module.exports = saveCurse