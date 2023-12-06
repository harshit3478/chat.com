const { MessageList } = require('../mongoose/usermsgs');

exports.getmsgs = async (req, res, next) => {
  const { sender, receiver } = req.query;
  try {
    const msg_archive = await MessageList.findOne({ user1: sender, user2: receiver }) || await MessageList.findOne({ user1: receiver, user2: sender });

    if (msg_archive) {
      res.status(200).send(msg_archive.messages);
    }
    else {
      res.status(401).send({ message: "NO such chat exists " });
    }

  } catch (error) {
    console.error(error);
  }

};

exports.searchmsgs = async (req, res, next) => {
  const { sender, receiver, msg } = req.query;
  const msg_archive = await MessageList.findOne({ user1: sender, user2: receiver }) || await MessageList.findOne({ user1: receiver, user2: sender });

}