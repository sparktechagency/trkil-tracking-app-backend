import { Schema, model } from "mongoose";
import { CartModel, ICart } from "./cart.interface";

const cartSchema = new Schema<ICart>({
    quantity: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Cart = model<ICart, CartModel>('Cart', cartSchema);