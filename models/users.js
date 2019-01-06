const Sequelize = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    organization: DataTypes.STRING,
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    token: {
      type: DataTypes.STRING,
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    fullAddress: DataTypes.STRING,
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT
  }, 
  {
    hooks: {
    beforeCreate: (user) => {
        const createPasswordHash= (password) =>{
          const salt = crypto.randomBytes(16).toString('hex');
          const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
          user.password= [salt, hash].join('$');
        }    
    }
  },
  instanceMethods: {
    validPassword: function(password,cb) {
      var user = this;
      const originalHash = user.password.split('$')[1];
      const salt = user.password.split('$')[0];
      const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
      if(hash === originalHash){
        cb(null,isMatch);
      }
      else return cb(err);
    },
    generateToken: function(cb) {
      var user = this;
      var token = jwt.sign(user.uuid.toHexString(), process.env.SECRET)
      user.token = token;
      user.save().then(function(err,user){
          if(err) return cb(err);
          cb(null,user);
    })
    },
    findByToken: function(token,cb) {
      var user = this;

      jwt.verify(token, process.env.SECRET, function(err,decode){
        user.findOne({where: {'uuid':decode, 'token':token }}, function(err,user){
          if(err) return cb(err);
          cb(null, user);
        })
      })
    }
  } 
});
  User.associate = function(models) {
    // associations can be defined here
    this.hasMany(models.Item);
  };
  return User;
};



