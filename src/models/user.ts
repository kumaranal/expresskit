import { DataTypes, Model, Sequelize } from "sequelize";
import sequelizeInstance from "./index";

class User extends Model {
  public id!: number;
  public username!: string;
  public image!: string;
  public email!: string;
}

User.init(
  {
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  {
    sequelize: sequelizeInstance,
    modelName: "user",
  }
);

export default User;
