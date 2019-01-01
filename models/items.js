'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Items', {
    type: DataTypes.SMALLINT,
    name: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    description: DataTypes.TEXT,
    availDate: DataTypes.DATE
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
    this.belongsTo(User)
  };
  return Item;
};

module.exports= {Item};