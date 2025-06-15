import { Model, Types } from "mongoose";

export type IProduct = {
    _id?: Types.ObjectId;
    name: string;
    images: string[];
    description: string;
    color: string;
    category: Types.ObjectId;
    price: number;
    discount?: number;
    status: "Active" | "Deleted";
}

export type ProductModel = Model<IProduct, Record<string, unknown>>;