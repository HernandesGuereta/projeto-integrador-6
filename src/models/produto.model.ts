import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/database";

export default class Produto extends Model<
  InferAttributes<Produto>,
  InferCreationAttributes<Produto>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare preco: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Produto.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Produto",
    tableName: "produtos",
    timestamps: true,
  },
);

