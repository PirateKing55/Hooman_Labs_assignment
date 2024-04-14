import { Router } from "express";
import { shopify } from "../../../services/shopify.js";

export const router = Router();

router.put('/', async (req, res) => {
    try {
        // Fetching the address ID, customer ID and address data from the request body as per RESTful API standards for POST requests
        const { address_id, customer_id, address_data } = req.body;

        if (!address_id || !customer_id) {
            return res.status(400).json({ error: 'Address ID and Customer ID are required' });
        }
        if (!address_data) {
            return res.status(400).json({ error: 'Address data is required' });
        }

        // Updating the address
        const address = await shopify.customerAddress.update(customer_id, address_id, address_data);

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Setting the updated address as default
        const updatedAddress = await shopify.customerAddress.default(customer_id, address_id);

        res.json({ updatedAddress, message: "Address updated and set to default" });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});