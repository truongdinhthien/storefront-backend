import { Router } from 'express';
import ProductController from './product.controller';

const productRouter = Router();
const productController = new ProductController();

productRouter.get('/products', productController.getProduct);
productRouter.get('/products/:productId', productController.getProductById);
productRouter.post('/products', productController.createProduct);
productRouter.delete('/products/:productId', productController.deleteProduct);
productRouter.put('/products/:productId', productController.updateProduct);

export default productRouter;
