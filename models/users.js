const Sequelize = require('sequelize');
const crypto = require('crypto');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    }
  } 
});
  User.associate = function(models) {
    // associations can be defined here
    this.hasMany(Item);
  };
  return User;
};

module.exports= {User};