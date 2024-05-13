"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}
const stripe = new stripe_1.default(stripeSecretKey);
class PaymentController {
    constructor() { }
    async createStripeCheckout(req, res) {
        try {
            const { items } = req.body;
            const transformedItems = items.map((item) => ({
                quantity: item.count,
                price_data: {
                    currency: 'USD',
                    unit_amount: +(item.price * 100).toFixed(2),
                    product_data: {
                        name: item.title,
                        images: [item.images[0]],
                    },
                },
            }));
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: transformedItems,
                success_url: `${process.env.HOST}/success`,
                cancel_url: `${process.env.HOST}`,
            });
            res.status(200).json({ id: session.id });
        }
        catch (error) {
            console.error('Error in createStripeCheckout:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
exports.default = PaymentController;
