const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')

async function loadOtherCurses(req, res){
    const curses = await Curse.find({}).skip(12)
    res.send(curses)
}

module.exports = loadOtherCurses