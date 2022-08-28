const User = require('../en-mongodb/index.js').User
const Question = require('../en-mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')
const multer = require('multer')
const { unlink } = require('fs/promises')
const Multer = require('../multer/index')
const uploadPhoto = multer({storage: Multer.photoStorage}).single("image")
const GoogleDrive = require('../google-drive/index.js')

async function saveCurse(req, res){
    const id = decodeURIComponent(req.headers['id'])
    console.log(id)
    const name = decodeURIComponent(req.headers['name'])
    let height = (req.headers['height']) ? decodeURIComponent(req.headers['height']) : null
    console.log(height)
    let text = decodeURIComponent(req.headers['text'])
    const dot = '•'
    text = text.replace(/^/gm, '</br> ' + dot).replace(/<div>/g, '</br> ' + dot).replace(/<\/div>/g, '' + dot)
    if(text.replace(/ /g,'') == '' || name.replace(/ /g,'') == '') return res.status(410).send('Fields should not be empty')
    if(height && height != 'null' && height != null){
        uploadPhoto(req, res, async err=>{
            if(err) {
                console.log(err)
                console.log('IMAGE DIDNT UPLOAD')
                return res.status(410).send('Image loading error')
            }
            var q = await Question.findOne({_id: id})
            console.log(q)
            if(q.image) await GoogleDrive.delete(q.image.id)
            let imageId = await GoogleDrive.upload(req.photoName)
            await unlink('images/' + req.photoName)
            console.log('uploaded')
            Question.findByIdAndUpdate(id, {name: name, text: text, image: { id: imageId, height: height }}, (err, result)=>{
                if(err) return console.log(err)
                res.send('ok')
            })
        });
    }
    else{
        Question.findByIdAndUpdate(id, {name: name, text: text}, (err, result)=>{
            if(err) return console.log(err)
            console.log(result)
            res.send('ok')
        })
    }
}


module.exports = saveCurse