import { JwtPayload } from "jsonwebtoken";
import { IOrder } from "./order.interface";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import mongoose from "mongoose";
import { Order } from "./order.model";
import QueryBuilder from "../../../helpers/QueryBuilder";
import { checkMongooseIDValidation } from "../../../shared/checkMongooseIDValidation";
import stripe from "../../../config/stripe";
import { Product } from "../product/product.model";
import { IProduct } from "../product/product.interface";


const createOrderToDB = async (payload: IOrder) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate product
        const isValidProduct: IProduct | null = await Product.findById(payload.product).session(session);
        if (!isValidProduct) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Product');
        }

        const totalPrice = ((Number(isValidProduct.price) * Number(payload.quantity)) + payload.delivery_charge);
        payload.price = totalPrice;

        // Create order within session
        const createdOrder = await Order.create([payload], { session });
        if (!createdOrder || createdOrder.length === 0) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Order creation failed');
        }

        // Commit DB transaction first
        await session.commitTransaction();
        session.endSession();

        // Prepare line items for Stripe checkout
        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: isValidProduct.name,
                    },
                    unit_amount: Math.ceil(totalPrice * 100), // Stripe expects amount in cents
                },
                quantity: 1,
            },
        ];

        // Create Stripe checkout session (outside Mongo transaction)
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `http://10.0.80.75:5000/order/success`,
            cancel_url: `http://10.0.80.75:5000/order/cancel`,
        });

        return checkoutSession.url;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, error instanceof Error ? error.message : 'Order creation failed');
    }
};



const retrievedOrdersFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<{ orders: IOrder[], pagination: any }> => {

    const result = new QueryBuilder(
        Order.find({user: user?.id}),
        query
    ).paginate();

    const [orders, pagination ] = await Promise.all([
        result.queryModel.populate('product', "name images quantity").lean().exec(),
        result.getPaginationInfo()
    ]);

    return { orders, pagination };
}

const orderDetailsToDB = async (id: string): Promise<IOrder> => {

    checkMongooseIDValidation(id, "Order")

    const order = await Order.findById(id).populate("product").lean().exec();
    return order as IOrder;
}

export const OrderService = {
    createOrderToDB,
    retrievedOrdersFromDB,
    orderDetailsToDB,
}