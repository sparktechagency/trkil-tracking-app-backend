import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ReviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { reviewZodValidationSchema } from "./review.validation";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.post("/",
    auth(USER_ROLES.USER), 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rating, ...othersData } = req.body;
            console.log(req.body);
            req.body = { ...othersData, user: (req.user as JwtPayload).id, rating: Number(rating) };
            next();

        } catch (error) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to process feedback data");
        }
    },
    validateRequest(reviewZodValidationSchema),
    ReviewController.createReview
);


export const ReviewRoutes = router;