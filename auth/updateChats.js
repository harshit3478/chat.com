const { ChatList } = require("../mongoose/chatlist");

exports.updatechats = async (req, res, next) => {
  const { user, username, lastmsg } = req.query;
  const chatArchive = await ChatList.findOne({ user: user });
var flag = false
  if (chatArchive) {
    chatArchive.chats.map((chat)=>{
      if(chat.username === username){
        flag = true
      }
    })
    if(!flag){

      chatArchive.chats.push({ username: username, lastmsg: lastmsg });
      chatArchive.save().then((data) => { console.log("succesfully saved to database", data); }).catch((err) => { console.error("Error:", err); });
      res.status(200).send(chatArchive);
    }
    else{
      res.status(401).send({message: " chat already exist"})
    }
  }
  else {
    const chat = new ChatList(
      {
        user: user,
        chats: [
          { username: username, lastmsg: lastmsg },
        ]
      }
    );
    await chat.save();
    res.status(200).send(chat);
  }
};
