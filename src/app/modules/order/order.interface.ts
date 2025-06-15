import { Model, Types } from "mongoose";

export type IOrder = {
    _id?: Types.ObjectId;
    txid: string;
    email: string;
    contact: string;
    address: string;
    notes?: string;
    user: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    delivery_charge: number;
    price: number;
    status: "pending" | "processing" | "OnWay" | "completed" | "cancelled";
};

export type OrderModel = Model<IOrder, Record<string, any>>