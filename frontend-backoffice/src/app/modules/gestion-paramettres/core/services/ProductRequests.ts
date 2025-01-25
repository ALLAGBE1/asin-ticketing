import axios from 'axios';
import { ProductModel } from '../models/Product';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const PRODUCT_URL = `${API_URL}/api/v1/product`;

export class ProductRequest {
  addProduct(Product: ProductModel) {
    return axios.post(PRODUCT_URL, Product);
  }

  updateProduct(Product: ProductModel) {
    return axios.put(PRODUCT_URL + `/${Product.id}`, Product);
  }

  getProductList(page = 1, size = 200) {
    return axios.get<ProductModel>(PRODUCT_URL + `?page=${page}&size=${size}`);
  }

  deleteProduct(ProductId: number) {
    return axios.delete(PRODUCT_URL + `/${ProductId}`);
  }
}
