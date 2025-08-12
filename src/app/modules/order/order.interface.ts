import { Model, Types } from "mongoose";

export type Item = {
    _id?: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
}

export type IOrder = {
    txid: string;
    name: string;
    email: string;
    contact: string;
    address: string;
    notes?: string;
    user: Types.ObjectId;
    items: [Item];
    delivery_charge: number;
    price: number;
    status: "pending" | "processing" | "OnWay" | "completed" | "cancelled";
};

export type OrderModel = Model<IOrder, Record<string, any>>