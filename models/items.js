'use strict';
const Sequelize = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import('./users');
  const Item = sequelize.define('Item', {
    type: DataTypes.SMALLINT,
    name: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    description: DataTypes.TEXT,
    organization: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'organization'
      }},
    availDate: DataTypes.DATE  
  }, {});
  Item.associate = function(models) {
    Item.belongsTo(models.User, {
      foreignKey: 'item_id',
    });
  };
  return Item;
};

