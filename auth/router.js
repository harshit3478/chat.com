const express = require('express')
const router = express.Router();

const {signup , login, }  =require('./auth');
const { getchats, ischat } = require("./getchats");
const { search } = require("./search");
const {getmsgs} = require('./getmsgs')
const { updatemsgs } = require('./updatemsgs.1');
const {userAuth} = require('../middleware/auth');
const { updatechats } = require('./updateChats');
const { sendMail } = require('./sendmail');
const { updatePassword } = require('./updatepassword');

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/search').get(search);
router.route('/updatemsgs').put(updatemsgs);
router.route('/getmsgs').get(getmsgs)
router.route("/updatechats").put(updatechats)
router.route("/getchats").get(getchats)
router.route("/ischat").get(ischat)
router.route('/sendmail').get(sendMail)
router.route('/updatepassword').put(userAuth , updatePassword)
module.exports  = router;
