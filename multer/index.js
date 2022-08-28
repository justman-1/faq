const multer = require('multer')
const {uid} = require('uid')

class Multer{
    constructor(){
        this.photoStorage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'images')
            },
            filename: function (req, file, cb) {
              const photoName = uid(10) + file.originalname
              req.photoName = photoName
              cb(null, photoName)
            }
          })
    }
}

module.exports = new Multer()