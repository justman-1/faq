const mongoose = require("mongoose")
const hash = require('md5')

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

const User = mongoose.model("User", userScheme)
const Curse = mongoose.model("Curse", curseScheme)

function checkAdmin(){
    User.findOne({login: 'admin'}, (err, data)=>{
        if(err) return console.log(err)
        if(!data || data == {}){
            User.create({login: 'admin', password: hash(process.env.ADMIN_PASSWORD)}, (err, res)=>{
                console.log('admin account was created.')
            })
        }
    })
}
checkAdmin()

module.exports = {
    User: User,
    Curse: Curse
}