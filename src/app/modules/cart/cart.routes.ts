import express, { NextFunction, Response, Request } from 'express';
import { CartController } from './cart.controller';
import { cartZodSchemaValidation } from './cart.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.USER),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = {
                    ...req.body,
                    user: req.user.id
                }
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to process Category Upload");
            }
        },
        validateRequest(cartZodSchemaValidation),
        CartController.makeCart
    )
    .get(
        auth(USER_ROLES.USER),
        CartController.getCart
    )
    .patch(
        auth(USER_ROLES.USER),
        CartController.decreaseCartQuantity
    )
    .put(
        auth(USER_ROLES.USER),
        CartController.increaseCartQuantity
    );

router.route('/:id')
    .delete(
        auth(USER_ROLES.USER),
        CartController.deleteCart
    );



export const CartRoutes = router;