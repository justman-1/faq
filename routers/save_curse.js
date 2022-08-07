const User = require('../mongodb/index.js').User
const Curse = require('../mongodb/index.js').Curse
const cache = require('../cache/index.js')

async function saveCurse(req, res){
    const text = req.body.text
    const date = req.body.date1
    console.log(text)
    console.log(date)
    if(text.replace(/ /g,'') == '' || date.replace(/ /g,'') == '') res.status(410).send('Заполните все поля')
    else if(!req.cookies || !req.cookies.token) return res.status(411).send('Вы не админ.')
    else{
        const cacheToken = cache.get('token')
        if(cacheToken){
            if(req.cookies.token != cacheToken){
                res.clearCookie('token')
                return res.status(411).send('Вы не админ.')
            }
        }
        else{
            const admin = await User.findOne({login: 'admin'})
            if(admin.token != req.cookies.token){
                res.clearCookie('token')
                return res.status(411).send('Вы не админ.')
            }
        }
    }
    const result = await Curse.create({ text: text, date: date})
    res.send({ id: result._id, text: text, date: date })
}

module.exports = saveCurse