const Curse = require('../en-mongodb/index.js').Curse
const cache = require('../cache/index.js')

async function saveCurse(req, res){
    const id = req.body.id
    Curse.deleteOne({_id: id}, (err, result)=>{
        if(err) return console.log(err)
        res.send('ok')
    })
}

module.exports = saveCurse