"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const order_controller_1 = __importDefault(require("../controller/order.controller"));
const orderRouter = express_1.default.Router();
const authInstance = new auth_middleware_1.default();
const orderInstance = new order_controller_1.default();
// create an order
orderRouter.post('/create/:did', authInstance.isAuthorized, orderInstance.createAnOrder);
// delete an order
orderRouter.delete('/:oid', authInstance.isAuthorized, orderInstance.deleteAnOrder);
// get all orders
orderRouter.get('/', authInstance.isAuthorized, authInstance.isAdmin, orderInstance.getAllOrders);
exports.default = orderRouter;
