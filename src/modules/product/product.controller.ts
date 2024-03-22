import { Response, Request, NextFunction } from 'express';
import { success } from '../../common/utils/response';
import ProductModel from './product.model';
import httpStatus from 'http-status';
import { HttpNotFoundException } from '../../common/exceptions';

const productModel = new ProductModel();

export const loadProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userId: string,
) => {
  const id = Number(userId);
  const product = await productModel.getById(id);
  if (!product) return next(new HttpNotFoundException('User not found'));
  req.product = product;

  return next();
};

class ProductController {
  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productModel.getAll();
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  getProductById(req: Request, res: Response) {
    return res.status(httpStatus.OK).json(success(req.product));
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productModel.create(req.body);
      return res.status(httpStatus.CREATED).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productModel.delete(Number(req.params.productId));
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.productId);
      const result = await productModel.update(productId, req.body);
      return res.status(httpStatus.OK).json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
