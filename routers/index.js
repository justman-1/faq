const express = require('express')
const router = express.Router()

const signin = require('./signin.js')
const main = require('./main.js')

router.get('/', main)
router.post('/signin', signin)

module.exports = router