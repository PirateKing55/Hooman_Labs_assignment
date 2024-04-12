import Shopify from 'shopify-api-node';
import { config } from "dotenv";
config()

// Fetching the environment variables from .env file
const { API_KEY, API_SECRET_KEY, API_ACCESS_TOKEN, SHOP_NAME } = process.env

// Creating a new Shopify instance
export const shopify = new Shopify({
  shopName: SHOP_NAME,
  apiKey: API_KEY,
  password: API_ACCESS_TOKEN,
  autoLimit: true
});



