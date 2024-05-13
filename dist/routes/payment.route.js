"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = __importDefault(require("../controller/payment.controller"));
const paymentInstance = new payment_controller_1.default();
const paymentRouter = express_1.default.Router();
// user route
paymentRouter.post('/create-checkout-session', paymentInstance.createStripeCheckout);
// drone route
exports.default = paymentRouter;
