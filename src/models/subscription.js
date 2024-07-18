"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const auth_1 = __importDefault(require("./auth"));
class Subscriptions extends sequelize_1.Model {
}
Subscriptions.init({
    price_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: auth_1.default,
            key: "unique_id_key",
        },
    },
    status: { type: sequelize_1.DataTypes.ENUM, allowNull: true, defaultValue: null },
    cancel_at_period_end: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    currency: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    interval: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    interval_count: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, {
    sequelize: index_1.default,
    modelName: "subscriptions",
});
auth_1.default.hasMany(Subscriptions, { foreignKey: "user_id" });
Subscriptions.belongsTo(auth_1.default, { foreignKey: "unique_id_key" });
exports.default = Subscriptions;
