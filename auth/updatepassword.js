const { User } = require("../mongoose/userDetailSchema");
const bcrypt = require('bcryptjs');
const { salt } = require("./salt");



exports.updatePassword = async(req, res , next) =>{
    const {username , newPassword} = req.body
    console.log('update password query ', req.body)
    const user = await User.findOne({username : username}) || await User.findOne({email : username})
        console.log('in update password' , user);
        await console.log('salt in update password' ,salt)
    bcrypt.hash(newPassword ,'$2a$10$kIb4bwk/dxcJLRVUvZN2fu' ).then((hash)=>{
        user.password = hash;
        user.save();
    }).then(()=>{
        res.status(200).send(user);
    }
    ).catch((error)=>{
        console.error('Error' , error);
    })
}