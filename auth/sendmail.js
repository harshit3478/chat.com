const sgMail = require('@sendgrid/mail')
const jwt = require("jsonwebtoken");
const { User } = require('../mongoose/userDetailSchema')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

exports.sendMail = async(req, res, next) => {
    const { to, username } = req.query
    sgMail.setApiKey(process.env.API_KEY)
    const otp = Math.floor(Math.random() * 1000000)
    console.log(otp)
    if(username){
        const user = await User.findOne({username : username}) || await User.findOne({email : username})
        console.log(user);
        if(user){
            const message = {
                to: user.email,
                from: {
                    name: 'Kgp-connect',
                    email: 'harshit@kgpian.iitkgp.ac.in',
                },
                subject: "Reset Your Password  ",
                text: `This mail is sent you to reset your password  , your reset password link  is  : https://kgpconnect-9684280cf43d.herokuapp.com/resetpassword?user=${user.username}  `,
                html: `<div class='shadow-sm shado-black w-auto h-auto ><p class='text-black font-bold' > This mail is sent you to reset your password  ,click on this link to reset your password  : https://kgpconnect-9684280cf43d.herokuapp.com/resetpassword?user=${user.username} </p></div>`
            }
            sgMail.send(message).then((res) => {
                console.log('message sent ....')
            }).catch((err) => { console.log(err) })
            const maxAge =  10 * 60 ;
          const token = jwt.sign(
            { id: user._id, username : user.username , email: user.email },
            jwtSecret,
            {
              expiresIn: maxAge, 
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true ,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
            res.status(200).send({message : true})
        }
        else {
            res.status(400).send({message: "user doesn't exist"})
        }
    }
    else{

        const message = {
            to: to,
            from: {
                name: 'Kgp-connect',
                email: 'harshit@kgpian.iitkgp.ac.in',
            },
            subject: "Confirm your registration  ",
            text: `This mail is to confirm your mail id for registration on website kgp-connect , your otp is  :${otp}  `,
            html: `<p> this mail is to confirm your mail id for registration on website kgp-connect , your otp is : ${otp} </p>`
        }
        sgMail.send(message).then((res) => {
            console.log('message sent ....')
        }).catch((err) => { console.log(err) })
        res.status(200).send({otp : otp});
    }
}