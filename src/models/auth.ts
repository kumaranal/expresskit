import { DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";

class Auth extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public unique_id_key!: string;
}

Auth.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    unique_id_key: DataTypes.STRING,
  },
  {
    sequelize: sequelizeInstance,
    modelName: "myauths",
  }
);

export default Auth;
