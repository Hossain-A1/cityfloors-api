import mongoose, { Schema, model } from 'mongoose';
import { orderType } from '../types/order.type';

const OrderSchema = new Schema<orderType>(
  {
    drones: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model<orderType>('Order', OrderSchema);

export default OrderModel;
