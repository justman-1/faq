const express = require('express')
const router = express.Router()

const signin = require('./signin.js')
const main = require('./main.js')
const saveCurse = require('./save_curse.js')

router.get('/', main)
router.post('/signin', signin)
router.post('/saveCurse', saveCurse)

module.exports = router