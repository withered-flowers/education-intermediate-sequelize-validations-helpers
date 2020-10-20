'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mining extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mining.belongsTo(models.Region);
    }
  };
  Mining.init({
    // tambahkan validasi di sini
    name: { 
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          // Apabila ingin menggunakan custom message !
          args: [[ 'Oculus', 'Minerals', 'Plants' ]],
          msg: "Harus salah satu dari 3 pilihan ini oi !"
        }
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        min: 1,
        max: 150,
        habisDibagiLima(value) {
          if(value % 5 !== 0) {
            throw new Error("Tidak habis dibagi lima oi !");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Mining',
  });
  return Mining;
};