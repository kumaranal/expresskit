import { DataTypes, Model, Sequelize } from "sequelize";
import sequelizeInstance from "./index";

class Auth extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public unique_id_key!: string;
  public refreshToken!: string;
}

Auth.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    unique_id_key: DataTypes.STRING,
    refreshToken: DataTypes.STRING 
  },
  {
    sequelize: sequelizeInstance,
    modelName: "auth",
  }
);

export default Auth;
