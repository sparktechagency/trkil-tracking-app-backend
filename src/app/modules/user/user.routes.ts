import express, { NextFunction, Response, Request } from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import { UserValidation,  } from './user.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getSingleFilePath } from '../../../shared/getFilePath';
const router = express.Router();

router.get(
    '/profile',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    UserController.getUserProfile
);

router.get('/all-users',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    UserController.users
);

router
    .route('/')
    .post(
        UserController.createUser
    )
    .patch(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                
                const profile = await getSingleFilePath(req.files, "image");
                req.body = { ...req.body, profile };
                next();

            } catch (error) {
                console.log(error)
                res.status(500).json({ message: "Failed to Convert string to number" });
            }
        },
        UserController.updateProfile
    );

router.post(
    '/change-password',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
    // validateRequest(createChangePasswordZodValidationSchema),
    UserController.changePassword
);

router.delete(
    '/delete-account',
    auth(USER_ROLES.USER),
    UserController.deleteUser
);

export const UserRoutes = router;