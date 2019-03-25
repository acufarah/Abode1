const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const formidable = require('express-formidable');
const cloudinary = require('cloudinary');
require('dotenv').config();


const app = express();

require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

cloudinary.config({
                  cloud_name: process.env.CLOUD_NAME,
                  api_key: process.env.API_KEY,
                  api_secret: process.env.API_SECRET
                  })

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
    const zip = req.body.zip;{
    let salt = bcrypt.genSaltSync(10);

    User.findAndCountAll({where:{ email: req.body.email}}).then(count =>{
      if(count > 0){
        return res.send("Fail! Error -> User with this email already exists, try again.")
      }
      else{
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
              res.send("Fail! Error -> " + error);
          });
      }
    })
  }


  
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
		
		var token = jwt.sign({uuid :user.uuid}, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
          });
        
		
		res.cookie('w_auth', token).status(200).json({
            token: token,
            loginSuccess:true
        })
		
    })
});



app.get('/api/user/logout',auth,(req,res)=>{
    res.clearCookie('w_auth')
    res.send('Logout successful')
    })


app.post('api/users/uploadimage',auth,formidable(),(req,res)=>{
    cloudinary.uploader.upload(req.files.file.path,(result)=>{
      console.log(result);
      res.status200.send({
        public_id : result.public_id,
        url: result.url
        }, {
        public_id:`${Date.now()}`,
        resource_type: 'auto'
    })
})


//-----------------------------------------------------------------------------------------------------------------
                                                    // ITEMS
//-----------------------------------------------------------------------------------------------------------------

app.post('/api/item',auth,(req,res)=>{
  const type = req.body.type;
  const name = req.body.name;
  const imgURL = req.body.imgURL;
  const description = req.body.description;
  const availDate = req.body.availDate;
  const organization = req.body.organization;

  const item = Item.create({
                            type,
                            name,
                            imgURL,
                            description,
                            availDate,
                            organization
  })
  .then(newItem => {
    console.log(`New item ${newItem.name}, of type ${newUser.type} has been created.`);
    res.status(200).json(newItem);
  })
  .catch(error => {
      res.send("Fail! Error -> " + error);
  });
})

// app.get('/api/items',(req,res)=>{
//   let order = req.query.order ? req.query.order : 'asc';
//   let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
//   let limit = req.query.limit ? parseInt(req.query.limit) : 100;

//   Item.
//   find().
//   populate('brand').
//   populate('wood').
//   sort([[sortBy,order]]).
//   limit(limit).
//   exec((err,articles)=>{
//       if(err) return res.status(400).send(err);
//       return res.send(articles);
//   })

// })

// app.get('/api/items/articles_by_id',(req,res)=>{
//   let type = req.query.type;
//   let items = req.query.id;

//   if (type==="array"){
//       let ids = req.query.id.split(",");
//       items = [];
//       items = ids.map(item =>{
//           return mongoose.Types.ObjectId(item)
//       })
//   }
//   Product.
//   find({'_id':{$in:items}}).
//   populate('brand').
//   populate('wood').
//   exec((err,docs)=>{
//       return res.status(200).send(docs)
//   })
// });




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 }) 