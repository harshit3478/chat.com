const { ChatList } = require('../mongoose/chatlist');
const { MessageList } = require('../mongoose/usermsgs');
const { encrypt, key , iv } = require('./encryption');




exports.updatemsgs = async (req, res, next) => {
  const { sender, receiver } = req.query;
  var {msg} = req.query
  const unencryptedmsg = msg;
  msg = encrypt(msg);
  console.log(msg)
  // msg = encrypt
  try {
    const msg_archive = await MessageList.findOne({ user1: sender, user2: receiver }) || await MessageList.findOne({ user1: receiver, user2: sender });
  console.log("hello updatemsgs", sender, receiver, msg);
  if (msg_archive) {
    console.log("ifcondition ");
    msg_archive.messages.push({ message: msg, sender: sender, });
    await msg_archive.save().catch((err) => { console.log(err); });
    res.status(200).send(msg_archive);
  }
  else {
    console.log("ifcondition else  ");

    const message = new MessageList(
      {
        user1: sender,
        user2: receiver,
        messages: [
          { message: msg, sender: sender, }
        ]
      }
    );
    await message.save();
    res.status(200).send(message);
  }
  // updating last message and sender in chatlist
  let i =0;
  const chatlist1 = await ChatList.findOne({user:sender})
  chatlist1.chats.map(async(chat , i)=>{
    if(chat.username === receiver){
      await chatlist1.chats.splice(i , 1)
      await chatlist1.chats.push({username : receiver , lastmsg : unencryptedmsg ,sender: sender })
    }

  })
  await chatlist1.save();
  const chatlist2 = await ChatList.findOne({user:receiver})
  chatlist2.chats.map(async(chat , i)=>{
    if(chat.username === sender){
      await chatlist2.chats.splice(i , 1)
      await chatlist2.chats.push({username : sender , lastmsg : unencryptedmsg , sender : sender })
    }

  })
  await chatlist2.save();
  
  } catch (error) {
    console.error("Error: " , error)
  }
};
