import mongoose, { Schema, model } from 'mongoose';
import { userType } from '../types/user.type';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { userModelInterface } from '../interface/user.interface';

const userSchema = new Schema<userType>(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.register = async function (
  name,
  email,
  password,
  address,
  phoneNo
): Promise<userType> {
  if (!name || !email || !password) {
    throw new Error(
      'Must fill name,email and password!'
    );
  }

  const existingUser = await this.findOne({ email });

  if (existingUser) {
    throw new Error('Email already used.');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be contains 8+ chars, with uppercase,lowercase and symbol'
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
    address,
    phoneNo,
  });

  return user;
};

userSchema.statics.login = async function (email, password): Promise<userType> {
  if (!email || !password) {
    throw new Error('Must fill email and password ');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Incorrect email or password ');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Incorrect email or password ');
  }

  return user;
};

const userModel = model<userType, userModelInterface>('User', userSchema);

export default userModel;
