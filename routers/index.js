const express = require('express')
const router = express.Router()

const checkAdmin = require('../middlewares/admin_check.js')
const signin = require('./signin.js')
const main = require('./main.js')
const saveCurse = require('./save_curse.js')
const changeAdminPassword = require('./change_admin_password.js')
const admin = require('./admin.js')
const deleteCurse = require('./delete_curse.js')

router.get('/', main)
router.post('/signin', signin)
router.post('/saveCurse', checkAdmin, saveCurse)
router.post('/changeAdminPassword', checkAdmin, changeAdminPassword)
//router.get('/admin', admin)
router.post('/deleteCurse', checkAdmin, deleteCurse)

module.exports = router