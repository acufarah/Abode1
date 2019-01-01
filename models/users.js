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
      allowNull: false,
      validate: {
        len: {
          args: [0, 50],
          msg: 'Cannot exceed 50 characters'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Cannot exceed 50 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Not the correct email format.'
        },
        isUnique: connection.validateIsUnique(
          'email',
          'This email already exists.'
        )
      }
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
    validPassword: function(password) {
      const originalHash = this.password.split('$')[1];
      const salt = this.password.split('$')[0];
      const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
      return hash === originalHash;
    },
    generateToken: function(cb) {
      var user = this;
      var token = jwt.sign(user.uuid.toHexString(), process.env.SECRET)
      user.token = token;
      user.save(function(err,user){
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
    this.hasMany(Item);
  };
  return User;
};

