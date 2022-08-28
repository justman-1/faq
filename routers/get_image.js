const User = require('../mongodb/index.js').User
const Question = require('../mongodb/index.js').Question
const cache = require('../cache/index.js')
const textParse = require('../middlewares/parseCurseText.js')
const multer = require('multer')
const Multer = require('../multer/index')
const uploadPhoto = multer({storage: Multer.photoStorage}).single("image")
const GoogleDrive = require('../google-drive/index.js')

async function saveCurse(req, res){
    console.log('get image...')
    GoogleDrive.download(req.params.id, res)
}


module.exports = saveCurse