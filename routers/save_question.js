const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')
const multer = require('multer')
const { unlink } = require('fs/promises')
const Multer = require('../multer/index')
const uploadPhoto = multer({storage: Multer.photoStorage}).single("image")
const GoogleDrive = require('../google-drive/index.js')

async function saveCurse(req, res){
    const name = decodeURIComponent(req.headers['name'])
    let text = decodeURIComponent(req.headers['text'])
    let height = (req.headers['height']) ? decodeURIComponent(req.headers['height']) : null
    const dot = '•'
    text = text.replace(/^/gm, '</br> ' + dot)
    console.log(text)
    console.log(height)
    if(height && height != 'null' && height != null){
        uploadPhoto(req, res, async err=>{
            if(err) {
                console.log(err)
                console.log('IMAGE DIDNT UPLOAD')
                return res.status(410).send('Ошибка загрузки изображения')
            }
            let imageId = await GoogleDrive.upload(req.photoName)
            await unlink('images/' + req.photoName)
            console.log('uploaded')
            Question.create({name: name, text: text, image: { id: imageId, height: height }}, (err, result)=>{
                if(err) return res.status(410).send('Ошибка сервера')
                res.send('ok')
            })
        });
    }else{
        Question.create({name: name, text: text }, (err, result)=>{
            if(err) return res.status(410).send('Ошибка сервера')
            res.send('ok')
        })
    }
}


module.exports = saveCurse