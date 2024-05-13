"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const authInstance = new auth_middleware_1.default();
const droneRouter = express_1.default.Router();
const dronesInstance = new product_controller_1.default();
// get all drones
droneRouter.get('/', dronesInstance.getAllProducts);
// get a drone
droneRouter.get('/:did', dronesInstance.getProduct);
// create a drone
droneRouter.post('/', authInstance.isAuthorized, authInstance.isAdmin, dronesInstance.createProduct);
// update a drone
droneRouter.put('/:did', authInstance.isAuthorized, authInstance.isAdmin, dronesInstance.updateProduct);
// deleted a drone
droneRouter.delete('/:did', authInstance.isAuthorized, authInstance.isAdmin, dronesInstance.deleteProduct);
exports.default = droneRouter;
