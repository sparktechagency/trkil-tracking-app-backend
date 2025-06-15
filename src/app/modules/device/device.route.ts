import express from 'express';
import { DeviceController } from './device.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { deviceZodValidationSchema } from './device.validation';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';

const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.USER),
        async (req, res, next) => {
            try {
                req.body = {user: req.user.id, ...req.body};
                next();
            }
            catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to process Device Upload");
            }
        },
        validateRequest(deviceZodValidationSchema),
        DeviceController.insertDevice
    )
    .get(
        auth(USER_ROLES.USER),
        DeviceController.retrievedDevices
    );


router.route('/:id')
    .patch(
        auth(USER_ROLES.USER),
        DeviceController.editDevice
    )
    .delete(
        auth(USER_ROLES.USER),
        DeviceController.deactivatedDevice
    );

export const DeviceRoutes = router;