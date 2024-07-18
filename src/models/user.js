"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: sequelize_1.DataTypes.STRING,
    image: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
}, {
    sequelize: index_1.default,
    modelName: "user",
    tableName: "user",
});
exports.default = User;
