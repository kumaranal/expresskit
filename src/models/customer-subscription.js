"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const subscription_1 = __importDefault(require("./subscription"));
const subscription_2 = __importDefault(require("./subscription"));
class CustomerSubscription extends sequelize_1.Model {
}
CustomerSubscription.init({
    customer_id: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: subscription_1.default,
            key: "unique_id_key",
        },
    },
    subscription_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: subscription_2.default,
            key: "id",
        },
    },
}, {
    sequelize: index_1.default,
    modelName: "customer-subscriptions",
});
subscription_1.default.hasMany(CustomerSubscription, { foreignKey: "user_id" });
CustomerSubscription.belongsTo(subscription_1.default, { foreignKey: "unique_id_key" });
subscription_2.default.hasMany(CustomerSubscription, { foreignKey: "subscription_id" });
CustomerSubscription.belongsTo(subscription_2.default, {
    foreignKey: "id",
});
exports.default = CustomerSubscription;
