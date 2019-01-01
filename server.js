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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//Models
const { User } = require('./models/users');
const { Item } = require('./models/items');

//Middleware
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin'); 

app.get('/', function (req, res) {
   res.send('Hello World');
})

//============================================================
//                       USERS
//============================================================

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

    User.create({
      firstName,
      lastName,
      email,
      password,
      organization,
      phone,
      address,
      city,
      state,
      zip
    })
      .then(newUser => {
        res.json(newUser);
      }).end(function(err, res){
        if (err) {
          // handle error
          return res.json({registerSuccess: false, err});
        } else {
          // handle success
          res.status(200).json({registerSuccess: true});
        }
    })

});


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })