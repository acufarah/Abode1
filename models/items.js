'use strict';
module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define('Items', {
    type: DataTypes.SMALLINT,
    name: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    description: DataTypes.TEXT,
    availDate: DataTypes.DATE
  }, {});
  Items.associate = function(models) {
    // associations can be defined here
  };
  return Items;
};