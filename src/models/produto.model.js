const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define(
  "Produto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: "nome é obrigatório" },
        len: { args: [2, 120], msg: "nome deve ter entre 2 e 120 caracteres" },
      },
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "preço deve ser um número válido" },
        min: { args: [0], msg: "preço não pode ser negativo" },
      },
    },
  },
  {
    tableName: "produtos",
    timestamps: true,
  },
);

module.exports = Produto;
