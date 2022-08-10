const mongoose = require("mongoose")
const base64 = require('base-64')

let mongo = require('./mongo')
let connectToMongoDb = async () => {
	await mongo().then(MongoClient => {
		try{
			console.log('Connected to mongoDB!')
		} finally{
			console.log("ok")
		}
	})
}
connectToMongoDb()
//mongoose.connect("mongodb://localhost:27017/FAQ")

const Schema = mongoose.Schema
const userScheme = new Schema({
    email: String,
    login: String,
    password: String,
    token: String
})
const curseScheme = new Schema({
    text: String,
    date: String,
})
const questionScheme = new Schema({
    name: String,
    text: String,
})

const User = mongoose.model("User", userScheme)
const Curse = mongoose.model("Curse", curseScheme)
const Question = mongoose.model("Question", questionScheme)

function checkAdmin(){
    User.findOne({login: 'admin'}, (err, data)=>{
        if(err) return console.log(err)
        if(!data || data == {}){
            User.create({login: 'admin', password: base64.encode(process.env.ADMIN_PASSWORD)}, (err, res)=>{
                console.log('admin account was created.')
            })
        }
    })
}
checkAdmin()

module.exports = {
    User: User,
    Curse: Curse,
    Question: Question
}