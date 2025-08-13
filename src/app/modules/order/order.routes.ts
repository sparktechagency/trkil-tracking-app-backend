import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { OrderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { JwtPayload } from "jsonwebtoken";
import { generateTxid } from "../../../util/generateTxid";
import { orderZodValidationSchema } from "./order.validation";
import { Cart } from "../cart/cart.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.USER),
        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const { delivery_charge, price, ...otherPayload } = req.body;
                const txid = generateTxid();


                const cart = await Cart.find({ user: req.user.id });

                if (!cart || cart.length === 0) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, "No cart found for this user");
                }

                const items = Array.isArray(cart) && cart?.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                }));

                req.body = {
                    ...otherPayload,
                    user: req.user.id,
                    txid,
                    items,
                    price: Number(delivery_charge) + Number(price),
                    delivery_charge: Number(delivery_charge),
                };
                next();

            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Failed to Make Order" });
            }
        },
        validateRequest(orderZodValidationSchema),
        OrderController.createOrder
    )
    .get(
        auth(USER_ROLES.USER),
        OrderController.retrievedOrders
    );


router.route("/:id")
    .get(
        auth(USER_ROLES.USER),
        OrderController.retrievedOrderDetails
    );

export const OrderRoutes = router;