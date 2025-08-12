import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { SubscriptionController } from "./subscription.controller";
const router = express.Router();

router.route("/")
    .get(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), 
        SubscriptionController.subscriptions
    )
    .patch(
        auth(USER_ROLES.USER), 
        SubscriptionController.cancelSubscription
    )

router.get("/my-plan", 
    auth(USER_ROLES.USER), 
    SubscriptionController.subscriptionDetails
);

export const SubscriptionRoutes = router;