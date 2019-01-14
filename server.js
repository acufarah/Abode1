const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();

require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const sqlite= require('sqlite3');
const db= new sqlite.Database('./database.sqlite3', (err)=> console.log(err));

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: './database.sqlite3'
});

sequelize.sync({
    force: true,
    alter: true
})
    .then( ()=>{
        console.log('Item and User table have been created with SQLite.')
    })

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//Models

var model = require('./models');
const User = sequelize.import('./models/users');
const Item = sequelize.import('./models/items');

//Middleware
const { auth } = require('./middleware/auth');
// const { admin } = require('./middleware/admin'); 

app.get('/', function (req, res) {
   res.send('Hello World');
})

//============================================================
//                       USERS
//============================================================

const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

app.get('/api/users/auth',auth,(req,res)=>{

    res.status(200).json({
            isAdmin: req.user.role === 0 ? false : true,
            isAuth: true,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            cart: req.user.cart,
            history: req.user.history
    })
})


app.post('/api/users/register',(req,res)=>{

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const organization = req.body.organization;
    const phone = req.body.phone;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    let salt = bcrypt.genSaltSync(10);

    const user = User.create({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync( password , salt),
        organization,
        phone, 
        address,
        city,
        state,
        zip
      })
        .then(newUser => {
          console.log(`New user ${newUser.lastName}, with id ${newUser.uuid} has been created.`);
          res.json(newUser);
        })
        .catch(error => {
            res.send("Fail! Error -> " + err);
        });
  
  });
  

app.post('/api/users/login',(req,res)=>{
    const email= req.body.email;
    let user = User.findOne({where: { email: email}})

    .then( user =>{
    
		if (!user) {
			return res.status(404).send('User Not Found.');
		}
 
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		
		var token = jwt.sign({id:user.uuid}, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
          });
        
        user.token= token;
		
		res.cookie('w_auth', user.token).status(200).json({
            loginSuccess:true
        })
		
    })
});

app.get('/api/users/logout',(req,res)=>{
    
    let user = User.findOne({where: { uuid: req.user.uuid}});

    user.update({ token: ''}).then((err, doc)=>{
        if(err) return res.json({ success:false,err});
        res.status(200).json({
            success:true
        })
    })

})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })