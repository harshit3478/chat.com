
const mongoose = require("mongoose");
const {Mongo_url} = require("./userDetailSchema.js")


 const mongoconnect = ()=>{
 	
mongoose
.connect(Mongo_url )
.then(()=>{
	console.log("succesfully connected to database")
})
.catch((err)=>{
	console.log(err)
})
}


module.exports = {mongoconnect }