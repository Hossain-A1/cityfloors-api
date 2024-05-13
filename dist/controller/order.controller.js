"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = __importDefault(require("../models/order.model"));
const manage_error_1 = require("../errors/manage.error");
const user_model_1 = __importDefault(require("../models/user.model"));
class OrderController {
    constructor() { }
    async createAnOrder(req, res) {
        var _a;
        try {
            const { did } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(did)) {
                res.status(404).json({ message: 'Product not found' });
            }
            const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).populate('orders');
            const alreadyOrdered = user === null || user === void 0 ? void 0 : user.orders.find((order) => did === order.drones._id.toString());
            if (alreadyOrdered) {
                res.status(403).json({ message: 'Order already booked' });
                return;
            }
            await Promise.resolve().then(async () => {
                var _a, _b;
                const order = await order_model_1.default.create({
                    orders: did,
                    user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                });
                await order_model_1.default.findByIdAndUpdate(did, {
                    $addToSet: {
                        orders: order._id,
                    },
                });
                await user_model_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
                    $addToSet: {
                        orders: order._id,
                    },
                });
                res.status(200).json(order);
            });
        }
        catch (error) {
            await (0, manage_error_1.handleError)(error, res);
        }
    }
    // delete an order
    async deleteAnOrder(req, res) {
        var _a;
        try {
            const { oid } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(oid)) {
                res.status(404).json({ message: 'Order not found' });
            }
            const existedOrder = await order_model_1.default.findById(oid);
            if (!existedOrder) {
                res.status(403).json({ message: "Order doesn't exist" });
                return;
            }
            const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).populate('orders');
            const matchedOrder = user === null || user === void 0 ? void 0 : user.orders.find((order) => oid === order._id.toString());
            if (!matchedOrder) {
                res.status(403).json({ message: "Order doesn't exist" });
                return;
            }
            await Promise.resolve().then(async () => {
                const order = await order_model_1.default.findByIdAndDelete(oid);
                res.status(200).json(order);
            });
        }
        catch (error) {
            await (0, manage_error_1.handleError)(error, res);
        }
    }
    async getAllOrders(req, res) {
        try {
            await Promise.resolve().then(async () => {
                const orders = await order_model_1.default.find({}).populate('drones user');
                res.status(200).json(orders);
            });
        }
        catch (error) {
            await (0, manage_error_1.handleError)(error, res);
        }
    }
}
exports.default = OrderController;
