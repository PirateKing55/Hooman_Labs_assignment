import { Router } from "express";
import { shopify } from "../../services/shopify.js";

export const router = Router();

router.get('/', async (req, res) => {

    // Checking if the request is coming from a page or an API client
    const reqFromPage = req.headers.accept && req.headers.accept.split(",").indexOf('text/html') !== -1;

    try {
        // Fetching the phone number from the query params as per RESTful API standards
        const phoneNumber = req.query.phone_number;

        if (!phoneNumber) {
            if (reqFromPage) {
                return res.status(422).render('page', { error: 'Phone number is required' });
            } else {
                return res.status(422).json({ error: 'Phone number is required' });
            }
        }

        // Fetching the customer from shopify by phone number
        const customers = await shopify.customer.list({ phone: phoneNumber });

        if (customers.length === 0) {
            if (reqFromPage) {
                return res.status(404).render('page', { error: 'Customer not found' });
            } else {
                return res.status(404).json({ error: 'Customer not found' });
            }
        }

        // Fetching the addresses of the customer using customer ID
        const customerId = customers[0].id;
        const addresses = await shopify.customerAddress.list(customerId);

        // Returning the addresses as html for page requests and as JSON for API requests
        if (reqFromPage) {
            res.render('page', { addresses });
        } else {
            res.json({ addresses });
        }

    } catch (error) {
        if (reqFromPage) {
            res.status(500).render('page', { error: 'Internal server error' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});