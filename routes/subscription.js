const express = require('express');
const router = express.Router();

// Mock database for subscription management
let subscriptions = [];

// Endpoint to create a new subscription
router.post('/subscribe', (req, res) => {
    const { email, plan } = req.body;
    if (!email || !plan) {
        return res.status(400).json({ message: 'Email and plan are required' });
    }
    const newSubscription = { email, plan, date: new Date() };
    subscriptions.push(newSubscription);
    res.status(201).json(newSubscription);
});

// Endpoint to get all subscriptions
router.get('/subscriptions', (req, res) => {
    res.json(subscriptions);
});

// Endpoint to unsubscribe
router.delete('/unsubscribe', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    subscriptions = subscriptions.filter(sub => sub.email !== email);
    res.status(200).json({ message: 'Successfully unsubscribed', email });
});

module.exports = router;