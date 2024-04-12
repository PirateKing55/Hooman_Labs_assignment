import { Router } from "express";
import { shopify } from "../../services/shopify.js";

export const router = Router();

router.get('/', async (req, res) => {

    // Checking if the request is coming from a page or an API client
    const reqFromPage = req.headers.accept && req.headers.accept.split(",").indexOf('text/html') !== -1

    try {
        // Fetching the order ID from the query params as per RESTful API standards
        const { orderId } = req.query;

        if (!orderId) {
            if (reqFromPage) {
                return res.status(400).render("page", { error: 'Order ID is required' })
            } else {
                return res.status(400).json({ error: 'Order ID is required' });
            }
        }

        // Fetching the order details from shopify by order ID
        const order = await shopify.order.get(orderId);

        if (!order) {
            if (reqFromPage) {
                return res.status(404).render("page", { error: 'Order not found' })
            } else {
                return res.status(404).json({ error: 'Order not found' });
            }
        }

        // Returning the order details as html for page requests and as JSON for API requests
        if (reqFromPage) {
            res.render("page", { order });
        } else {
            res.json({ order });
        }

    } catch (error) {
        if (reqFromPage) {
            return res.status(500).render("page", { error: 'Internal server error' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});