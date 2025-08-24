import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminZodValidationSchema } from './admin.validation';
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN),
        validateRequest(AdminZodValidationSchema),
        AdminController.createAdmin
    )
    .get(
        auth(USER_ROLES.SUPER_ADMIN),
        AdminController.getAdmin
    )

router.get('/user-statistics',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.userStatistic
);

router.get('/selling-statistics',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.sellingStatistic
);

router.get('/subscription-statistics',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    AdminController.subscriptionStatistic
);



router.delete('/:id',
    auth(USER_ROLES.SUPER_ADMIN),
    AdminController.deleteAdmin
);

export const AdminRoutes = router;
