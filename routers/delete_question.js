const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')

async function saveCurse(req, res){
    const id = req.body.id
    Question.deleteOne({_id: id}, (err, result)=>{
        if(err) return console.log(err)
        res.send('ok')
    })
}


module.exports = saveCurse