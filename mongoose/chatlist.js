const mongoose = require('mongoose')



const ChatsSchema = new mongoose.Schema({
    user: { type: String, required: true , unique:true },

    chats: [
      {
        username : { type: String, required: true ,},
        timestamp: {
          type: String, default: () => {
            const time = new Date();
            const ct = (time.getDate() < 10 ? '0' : '') + time.getDate() + "-" + (time.getMonth()+1 < 10 ? '0' : '') + (time.getMonth() + 1) + " " + (time.getHours() < 10 ? '0' : '') + time.getHours() + ":" +(time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
            return ct;
          }
        },
        lastmsg :{type: mongoose.SchemaTypes.Mixed} ,
        sender : {type:String},
      },
    ],
  })

const ChatList = mongoose.model("chats", ChatsSchema)





module.exports = {ChatList }

