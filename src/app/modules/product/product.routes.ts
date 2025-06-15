import express, { NextFunction, Response, Request } from 'express';
import { ProductController } from './product.controller';
import { ProductZodValidationSchema } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getMultipleFilesPath } from '../../../shared/getFilePath';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { price, discount, ...othersPayload } = req.body;
                const images = getMultipleFilesPath(req.files, "image");
                req.body = {
                    price: Number(price),
                    discount: discount ? Number(discount) : undefined,
                    images,
                    ...othersPayload
                }
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to process Product Upload");
            }
        },
        validateRequest(ProductZodValidationSchema),
        ProductController.createProduct
    )
    .get(
        auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        ProductController.retrievedProducts
    );


router.route("/:id")
    .get(
        ProductController.retrievedProductDetails
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { price, discount, ...othersPayload } = req.body;
                const images = getMultipleFilesPath(req.files, "image");
                req.body = {
                    price: price ? Number(price) : undefined,
                    discount: discount ? Number(discount) : undefined,
                    images,
                    ...othersPayload
                }
                next();
            } catch (error) {
               throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to process Product Update");
            }
        },
        ProductController.updateProduct
    )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        ProductController.deleteProduct
    );


export const ProductRoutes = router;