const { ChatList } = require("../mongoose/chatlist");

exports.getchats = async (req, res, next) => {
  const chat = await ChatList.findOne({ user: req.query.user });
  if (chat) {
    chat.chats = chat.chats.reverse();
    console.log(chat)
    res.status(200).send(chat);
  }
  else {
    res.status(200).send(chat);
  }

};

exports.ischat = async ( req ,res , next)=>{
 try {
  const {user , username} = req.query;
  const chat = await ChatList.findOne({user : user});
  console.log(chat)
  if (chat) {
    
    if(chat.chats.username === username){
      res.status(200).send({message:true})
    }
    else{
      res.status(200).send({message:false})
    }
  } else {
    res.status(200).send({message:'userdontexist'})
    
  }
 } catch (error) {
  console.error("Error" , error)
  
 }
  
}