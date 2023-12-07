const jwt = require("jsonwebtoken");
const express = require('express');

const { User } = require("../mongoose/userDetailSchema");
const bcrypt = require("bcryptjs");
require('dotenv').config();
const app = express();





const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res, next) => {
  
  const { username, password, email } = req.body;
  console.log(username , password , email);
  if(!(username==='') && !(password==='') && !(email==='')){
  try {
    let is_user1 = User.find({ username: username });
    let is_user2 = User.find({ email: email });
    array1 = (await is_user1).length;
    array2 = (await is_user2).length;
    if (!(array1 || array2)) {
      bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
          username,
          password: hash,
          email,
        }).then((user) => {
          
          res.send({ status: "ok", user: user._id });
        });
      });
      console.log("user created : ", username, password, email);
      
    } else if (array1) {
      res.status(410).send("<h1>user already exist</h1>");
    
    } else {
      res.status(411).send("<h1>user already exist</h1>");
     
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error", err });
    //  alert("couldn't process , please retry")
  }
}
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log("login request's body:", req.body);
  if( !(username==='')&& !(password==='') ){

  
  try {
    var person =
      (await User.findOne({ username: username })) ||
      (await User.findOne({ email: username }));

    if (person) {
      bcrypt.compare(password, person.password).then((result) => {
        if (result) {
          console.log(result)
          //json web token for authorization
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: person._id, username, email: person.email },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true ,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(200).send(person);
        } else {
          res.status(410).send({ status: " error" });
        }
      });
    } else {
      res.status(411).send("user does not exist signup please");
    }
  } catch (err) {
    console.log(err);
  }
}
else{
  res.status(412).send("fields can't be blank")
}
};


