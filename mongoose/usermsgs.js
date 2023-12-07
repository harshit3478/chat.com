const mongoose = require('mongoose')


const UserMessages = new mongoose.Schema({
  user1: { type: String, required: true },
  user2: { type: String, required: true },
  messages: [
    {
      message: { type: mongoose.SchemaTypes.Mixed, required: true },
      timestamp: {
        type: String, default: () => {
          const time = new Date();
          const ct = (time.getDate() < 10 ? '0' : '') + time.getDate() + "-" + (time.getMonth()+1 < 10 ? '0' : '') + (time.getMonth() + 1) + " " + (time.getHours() < 10 ? '0' : '') + time.getHours() + ":" +(time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
          return ct;
        }
      },
      sender: { type: String, required: true },
    },
  ],
})

const MessageList = mongoose.model("messagelists", UserMessages)



module.exports = { MessageList }


