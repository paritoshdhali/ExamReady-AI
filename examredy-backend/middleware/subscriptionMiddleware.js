// subscriptionMiddleware.js

const verifySubscriptionStatus = (req, res, next) => {
    const { user } = req;

    // Check if the user has a valid subscription
    if (!user || !user.subscriptionActive) {
        return res.status(403).json({ message: 'Access denied. Subscription required.' });
    }

    // Continue to the next middleware
    next();
};

module.exports = verifySubscriptionStatus;
