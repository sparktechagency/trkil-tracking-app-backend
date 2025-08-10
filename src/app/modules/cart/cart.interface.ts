import { Model, Types } from "mongoose";

export type ICart = {
    _id?: Types.ObjectId;
    quantity: number;
    product: Types.ObjectId;
    user: Types.ObjectId;
}

export type CartModel = Model<ICart, Record<string, any>>;