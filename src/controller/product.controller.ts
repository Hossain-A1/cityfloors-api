import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { handleError } from '../errors/manage.error';
import DroneModel from '../models/product.model';

export default class DronesController {
  constructor() {}

  // Get all product
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      await Promise.resolve().then(async () => {
        const drones = await DroneModel.find({});

        res.status(200).json(drones);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  // Get a product
  public async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { did } = req.params;

      if (!mongoose.Types.ObjectId.isValid(did)) {
        res.status(404).json({ message: 'Item not found' });
      }

      await Promise.resolve().then(async () => {
        const drone = await DroneModel.findById(did);

        res.status(200).json(drone);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  // Create a product
  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,

        category,
        images,
        price,
        rating,
        stock,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !images ||
        !price ||
        !rating ||
        !stock
      ) {
        throw new Error(
          'Please provide all the following fields: Title, Description, Category, Images, Price, rating ,stock'
        );
      }

      await Promise.resolve().then(async () => {
        const drone = await DroneModel.create({
          title,
          description,

          category,
          images,
          price,
          rating,
          stock,
        });

        res.status(200).json(drone);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  // Update a product
  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        category,

        images,
        price,
        rating,
        stock,
      } = req.body;
      const { did } = req.params;

      if (!mongoose.Types.ObjectId.isValid(did)) {
        res.status(404).json({ message: 'Item not found' });
      }

      await Promise.resolve().then(async () => {
        const drone = await DroneModel.findByIdAndUpdate(
          did,
          {
            title,
            description,

            category,
            images,
            price,
            rating,
            stock,
          },
          { new: true }
        );

        res.status(200).json(drone);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }

  // Delete a drone
  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { did } = req.params;

      if (!mongoose.Types.ObjectId.isValid(did)) {
        res.status(404).json({ message: 'Item not found' });
      }

      await Promise.resolve().then(async () => {
        const drone = await DroneModel.findByIdAndDelete(did);

        res.status(200).json(drone);
      });
    } catch (error: unknown) {
      await handleError(error, res);
    }
  }
}
