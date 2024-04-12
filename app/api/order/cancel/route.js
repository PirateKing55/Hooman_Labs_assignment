import { Router } from "express";
import { shopify } from "../../../services/shopify.js";

export const router = Router();

router.post('/', async (req, res) => {

    // Checking if the request is coming from a page or an API client
    const reqFromPage = req.headers.accept && req.headers.accept.split(",").indexOf('text/html') !== -1

    try {
        // Fetching the order ID from the request body as per RESTful API standards for POST requests
        const { orderId } = req.body;

        if (!orderId) {
            if (reqFromPage) {
                return res.status(400).render("page", { error: 'Order ID is required' })
            } else {
                return res.status(400).json({ error: 'Order ID is required' });
            }
        }

        // Cancelling the order
        const result = await shopify.order.cancel(orderId);

        // Checking if the order was successfully cancelled
        if (!result || !result.cancelled_at) {
            if (reqFromPage) {
                return res.status(500).render("page", { error: 'Order cancellation failed' });
            } else {
                return res.status(500).json({ error: 'Order cancellation failed' });
            }
        }

        // Returning the success message as html for page requests and as JSON for API requests
        if (reqFromPage) {
            res.render("page", { message: 'Order successfully cancelled' });
        } else {
            res.json({ message: 'Order successfully cancelled' });
        }

    } catch (error) {
        if (reqFromPage) {
            return res.status(500).render("page", { error: 'Internal server error' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});