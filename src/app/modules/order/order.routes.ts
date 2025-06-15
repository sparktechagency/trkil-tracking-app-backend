import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { OrderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { JwtPayload } from "jsonwebtoken";
import { generateTxid } from "../../../util/generateTxid";
import { orderZodValidationSchema } from "./order.validation";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.USER),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { quantity, delivery_charge, ...otherPayload } = req.body;
                const txid = generateTxid();
                req.body = {
                    ...otherPayload,
                    user: (req.user as JwtPayload).id,
                    txid,
                    quantity: Number(quantity),
                    delivery_charge: Number(delivery_charge),
                };
                next();

            } catch (error) {
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