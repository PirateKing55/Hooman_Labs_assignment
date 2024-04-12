import { Router } from "express";
import { shopify } from "../../services/shopify.js";

export const router = Router();

router.get('/', async (req, res) => {

    // Checking if the request is coming from a page or an API client
    const reqFromPage = req.headers.accept && req.headers.accept.split(",").indexOf('text/html') !== -1

    try {
        // Fetching the phone number from the query params as per RESTful API standards
        const { phone_number } = req.query;

        if (!phone_number) {
            if (reqFromPage) {
                return res.status(400).render('page', { error: 'Phone number is required' });
            } else {
                return res.status(400).json({ error: 'Phone number is required' });
            }
        }

        // Fetching the customer details from shopify by phone number
        const customers = await shopify.customer.list({ phone: phone_number });

        if (customers.length === 0) {
            if (reqFromPage) {
                return res.status(404).render('page', { error: 'Customer not found' });
            } else {
                return res.status(404).json({ error: 'Customer not found' });
            }
        }

        // Fetching the orders of the customer using customer ID
        const customerId = customers[0].id;
        const orders = await shopify.order.list({ customer_id: customerId });

        // Returning the orders as html for page requests and as JSON for API requests
        if (reqFromPage) {
            return res.render('page', { orders });
        } else {
            return res.json({ orders });
        }

    } catch (error) {
        if (reqFromPage) {
            return res.status(500).render('page', { error: 'Internal server error' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});