const { MessageList } = require('../mongoose/usermsgs');
const {key, iv , decrypt } = require('./encryption.js');

// console.log(decrypt('{"iv":"0e6680faa6fee87076160ec6a17030dd","encryptedData":"8f1704aee5b40fc09ad658b55c1661e1"}'))
exports.getmsgs = async (req, res, next) => {
  const { sender, receiver } = req.query;
  try {
    const msg_archive = await MessageList.findOne({ user1: sender, user2: receiver }) || await MessageList.findOne({ user1: receiver, user2: sender });

    if (msg_archive) {

      try {
        msg_archive.messages.forEach(e => {
          const encryptedmsg = decrypt(e.message)
          e.message = encryptedmsg;
          console.log(e.message)
        });
      } catch (error) {
        console.log("error:", error)
      }
      res.status(200).send(msg_archive.messages);
    }
    else {
      res.status(200).send(msg_archive.messages);
    }

  } catch (error) {
    console.error(error);
  }

};

