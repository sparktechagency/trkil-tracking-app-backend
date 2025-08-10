import mongoose from "mongoose";
import { ICart } from "./cart.interface";
import { Product } from "../product/product.model";
import { JwtPayload } from "jsonwebtoken";
import { Cart } from "./cart.model";
import { IProduct } from "../product/product.interface";

const makeCartToDB = async (payload: ICart): Promise<ICart> => {

    if (!mongoose.Types.ObjectId.isValid(payload.product)) {
        throw new Error('Invalid product id');
    }

    const isExistProduct: IProduct | null = await Product.findById(payload.product).lean();
    if (!isExistProduct) {
        throw new Error('Product not found');
    }

    const isExistCart = await Cart.findOne({
        product: payload.product,
        user : payload.user
    });

    if (isExistCart) {
        await Cart.findByIdAndUpdate(
            { _id: isExistCart?._id },
            {
                $inc: { quantity: Number(payload.quantity) }
            },
            { new: true }
        );
        return isExistCart;
    }

    const cart: ICart = await Cart.create(payload);
    if (!cart) {
        throw new Error('Failed to add product to cart');
    }

    return cart;
}

const deleteCartFromDB = async (user: JwtPayload, cartId: string): Promise<ICart | null> => {

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid Cart id');
    }

    const cartExist = await Cart.findByIdAndDelete(cartId);

    if (!cartExist) {
        throw new Error('Failed to delete product from cart');
    }

    return cartExist;
}

const decreaseCartQuantityFromDB = async (user: JwtPayload, cartId: string): Promise<ICart | null> => {

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid Cart id');
    }

    const cartExist = await Cart.findById(cartId);

    if (!cartExist) {
        throw new Error('Product not found in cart');
    }

    if (cartExist.quantity <= 1) {
        await Cart.findByIdAndDelete(cartId);
        return null;
    }


    const updatedCart = await Cart.findByIdAndUpdate(
        { _id: cartId },
        {
            $inc: {
                quantity: -1
            }
        },
        { new: true }
    );

    return updatedCart;
};

const increaseCartQuantityFromDB = async (user: JwtPayload, cartId: string): Promise<ICart | null> => {

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid Cart id');
    }

    const cartExist = await Cart.findById(cartId);

    if (!cartExist) {
        throw new Error('Product not found in cart');
    }

    const updatedCart = await Cart.findByIdAndUpdate(
        { _id: cartId },
        {
            $inc: {
                quantity: + 1
            }
        },
        { new: true }
    );

    return updatedCart;
};


const getCartFromDB = async (user: JwtPayload): Promise<ICart[]> => {

    const cart = await Cart.find({ user: user.id })
        .select("product quantity")
        .populate("product", "name price images color")
        .lean();

    if (!cart) {
        throw new Error('No Data Found');
    }

    return cart;
}

export const CartService = {
    makeCartToDB,
    deleteCartFromDB,
    decreaseCartQuantityFromDB,
    getCartFromDB,
    increaseCartQuantityFromDB
};