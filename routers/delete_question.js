const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')
const GoogleDrive = require('../google-drive/index.js')

async function deleteQuestion(req, res){
    const id = req.body.id
    const q = await Question.findOne({_id: id})
    Question.deleteOne({_id: id}, async (err, result)=>{
        if(q.image) await GoogleDrive.delete(id)
        if(err) return console.log(err)
        res.send('ok')
    })
}


module.exports = deleteQuestion