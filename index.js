require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routers = require('./routers/index')
const cookieParser = require('cookie-parser')

const server = require('http').createServer(app).listen(80)//5000 для хостинга

app.use(cookieParser(process.env.SECRET_KEY))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use('/', routers)