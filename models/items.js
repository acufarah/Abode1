'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    type: DataTypes.SMALLINT,
    name: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    description: DataTypes.TEXT,
    availDate: DataTypes.DATE
  }, {});
  Item.associate = function(models) {
    Item.belongsTo(models.User, {
      foreignKey: 'item_id',
    });
  };
  return Item;
};

