import { orderType } from './../types/order.type';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import OrderModel from '../models/order.model';
import { handleError } from '../errors/manage.error';
import UserModel from '../models/user.model';

export default class OrderController {
  constructor() {}

  public async createAnOrder(req: Request, res: Response): Promise<void> {
    try {
      const { did } = req.params;

      if (!mongoose.Types.ObjectId.isValid(did)) {
        res.status(404).json({ message: 'Product not found' });
      }

      const user = await UserModel.findById(req.user?._id).populate('orders');

      const alreadyOrdered = user?.orders.find(
        (order: orderType) => did === order.drones._id.toString()
      );

      if (alreadyOrdered) {
        res.status(403).json({ message: 'Order already booked' });
        return;
      }

      await Promise.resolve().then(async () => {
        const order = await OrderModel.create({
          orders: did,
          user: req.user?._id,
        });

        await OrderModel.findByIdAndUpdate(did, {
          $addToSet: {
            orders: order._id,
          },
        });

        await UserModel.findByIdAndUpdate(req.user?._id, {
          $addToSet: {
            orders: order._id,
          },
        });

        res.status(200).json(order);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  // delete an order
  public async deleteAnOrder(req: Request, res: Response): Promise<void> {
    try {
      const { oid } = req.params;

      if (!mongoose.Types.ObjectId.isValid(oid)) {
        res.status(404).json({ message: 'Order not found' });
      }

      const existedOrder = await OrderModel.findById(oid);

      if (!existedOrder) {
        res.status(403).json({ message: "Order doesn't exist" });
        return;
      }

      const user = await UserModel.findById(req.user?._id).populate('orders');

      const matchedOrder = user?.orders.find(
        (order: orderType) => oid === order._id.toString()
      );

      if (!matchedOrder) {
        res.status(403).json({ message: "Order doesn't exist" });
        return;
      }

      await Promise.resolve().then(async () => {
        const order = await OrderModel.findByIdAndDelete(oid);

        res.status(200).json(order);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  public async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      await Promise.resolve().then(async () => {
        const orders = await OrderModel.find({}).populate('drones user');

        res.status(200).json(orders);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }
}
