import { StatusCodes } from "http-status-codes";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { JwtPayload } from "jsonwebtoken";
import { FilterQuery } from "mongoose";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../../helpers/QueryBuilder";
import { Bookmark } from "../bookmark/bookmark.model";
import { checkMongooseIDValidation } from "../../../shared/checkMongooseIDValidation";
import unlinkFile from "../../../shared/unlinkFile";

const createProductToDB = async (payload: IProduct): Promise<IProduct> => {

    const product = await Product.create(payload);

    if (!product) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Product");
    }
    return product;
};

const retrievedProductsFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{ products: IProduct[], pagination: any }> => {

    const productsQuery = new QueryBuilder(
        Product.find({ status: "Active" }),
        query
    ).paginate().filter().search(["name", "color", "description"]);

    const [ products, pagination ] =  await Promise.all([
        productsQuery.queryModel.populate("category", "name").lean().exec(),
        productsQuery.getPaginationInfo()
    ]);

    const newProducts = await Promise.all(products.map(async (product: IProduct) => {
        const bookmark = await Bookmark.findOne({user: user?.id, product: product?._id});
        return {
            ...product,
            bookmark: !!bookmark
        }
    }))

    return { products: newProducts, pagination }
}

const updateProductInDB = async (id: string, payload: Partial<IProduct>): Promise<IProduct> => {

    checkMongooseIDValidation(id, "Product")


    const product: IProduct | null = await Product.findById(id).lean();

    //filter image
    const updatedImage = product?.images?.filter(
        (image) => !(payload as any)?.imageToDelete?.includes(image)
    );

    

    //remove image from the uploads folder
    if ((payload as any)?.imageToDelete?.length > 0) {
        for (let image of (payload as any)?.imageToDelete) {
            unlinkFile(image);
        }
    }

    if (payload?.images && payload?.images?.length > 0) {
        updatedImage?.push(...payload?.images);
    }

    const updateData = {
        ...payload,
        images: (updatedImage && updatedImage.length > 0) ? updatedImage : product?.images,
    };



    const updateProduct = await Product.findByIdAndUpdate(
        { _id: id },
        updateData,
        { new: true }
    )

    if (!updateProduct) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update Product");
    }

    return updateProduct;

}

const deleteProductFromDB = async (id: string): Promise<IProduct> => {
    checkMongooseIDValidation(id, "Product")
    const deletedProduct = await Product.findByIdAndUpdate(
        id,
        { status: "Deleted" },
        { new: true }
    );

    if (!deletedProduct) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete Product");
    }

    return deletedProduct;
}

const retrievedProductDetailsFromDB = async (id: string): Promise<IProduct> => {
    
    checkMongooseIDValidation(id, "Product")

    const product = await Product.findById(id).populate("category", "name").lean().exec();
    return product as IProduct;
}


export const ProductService = {
    createProductToDB,
    retrievedProductsFromDB,
    updateProductInDB,
    deleteProductFromDB,
    retrievedProductDetailsFromDB
}