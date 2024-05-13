"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const isAuthorized = new auth_middleware_1.default();
const userInstance = new user_controller_1.default();
const userRouter = express_1.default.Router();
// get an user
userRouter.get('/:uid', isAuthorized.isAuthorized, userInstance.getAnUser);
exports.default = userRouter;
