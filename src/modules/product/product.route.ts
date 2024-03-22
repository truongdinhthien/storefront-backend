import { Router } from 'express';
import ProductController, { loadProduct } from './product.controller';
import { verifyAuth } from '../auth/auth.middleware';

const productRouter = Router();
const productController = new ProductController();

productRouter.get('/products', productController.getProduct);
productRouter.get('/products/:productId', productController.getProductById);
productRouter.post('/products', verifyAuth, productController.createProduct);
productRouter.delete(
  '/products/:productId',
  verifyAuth,
  productController.deleteProduct,
);
productRouter.put(
  '/products/:productId',
  verifyAuth,
  productController.updateProduct,
);

productRouter.param('productId', loadProduct);

export default productRouter;
