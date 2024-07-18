"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const user_1 = __importDefault(require("./user"));
class Auth extends sequelize_1.Model {
}
Auth.init({
    username: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    unique_id_key: sequelize_1.DataTypes.STRING,
    refreshToken: sequelize_1.DataTypes.STRING,
}, {
    sequelize: index_1.default,
    modelName: "auth",
    tableName: "auths",
});
Auth.hasOne(user_1.default, {
    foreignKey: "id",
    sourceKey: "unique_id_key",
    as: "user", // Alias for the associated user
});
user_1.default.belongsTo(Auth, {
    foreignKey: "id",
    targetKey: "unique_id_key",
    as: "auth", // Alias for the associated auth
});
exports.default = Auth;
