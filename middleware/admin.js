const { User } = require('./../models/users');

let admin = (req,res,next)=>{
    if(req.user.role===0){
        return res.send('You are not allowed, get out.')
    };
    next();
}

module.exports = { admin }