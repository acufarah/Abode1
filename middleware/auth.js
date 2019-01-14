var model = require('../models/index');
const sequelize = require('sequelize');
// const User = sequelize.import('./../models/users');
const jwt = require('jsonwebtoken');
const User= model.User;

let auth = (req,res,next)=>{
    let token = req.cookies.w_auth;

    jwt.verify(token, process.env.SECRET, function(err,decode){
        let user = User.findOne({where: {'uuid':decode, 'token':token }
      });
        if(err) throw err;
        if(!user) return res.json({
            isAuth: false,
            error: true
        });


        req.token = token;
        req.user = user;
       
        next();
})
};
// verifyToken = (req, res, next) => {
// 	let token =  req.cookies.w_auth;
  
// 	if (!token){
// 		return res.status(403).send({ 
// 			auth: false, message: 'No token provided.' 
// 		});
// 	}
 
// 	jwt.verify(token, process.env.SECRET, (err, decoded) => {
// 		if (err){
// 			return res.status(500).send({ 
// 					auth: false, 
// 					message: 'Fail to Authentication. Error -> ' + err 
// 				});
//         }
//         req.token = token;
// 		req.uuid = decoded.id;
// 		next();
// 	});
// }

// isAdmin = (req, res, next) => {
	
// 	User.findById(req.uuid)
// 		.then(user => {
// 			user.getRoles().then(roles => {
// 				for(let i=0; i<roles.length; i++){
// 					console.log(roles[i].name);
// 					if(roles[i].name.toUpperCase() === "ADMIN"){
// 						next();
// 						return;
// 					}
// 				}
				
// 				res.status(403).send("Require Admin Role!");
// 				return;
// 			})
// 		})
// }

module.exports = { auth };