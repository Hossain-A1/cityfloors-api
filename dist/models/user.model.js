"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    role: {
        enum: ['user', 'admin'],
        default: 'user',
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
}, {
    timestamps: true,
});
userSchema.statics.register = async function (name, email, password, address, phoneNo) {
    if (!name || !email || !password) {
        throw new Error('Must fill name,email and password!');
    }
    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw new Error('Email already used.');
    }
    if (!validator_1.default.isEmail(email)) {
        throw new Error('Invalid email');
    }
    if (!validator_1.default.isStrongPassword(password)) {
        throw new Error('Password must be contains 8+ chars, with uppercase,lowercase and symbol');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hash = await bcrypt_1.default.hash(password, salt);
    const user = await this.create({
        name,
        email,
        password: hash,
        address,
        phoneNo,
    });
    return user;
};
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw new Error('Must fill email and password ');
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email or password ');
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        throw new Error('Incorrect email or password ');
    }
    return user;
};
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
