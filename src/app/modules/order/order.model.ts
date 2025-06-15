import { Schema, model } from "mongoose";
import { IOrder, OrderModel } from "./order.interface";

const orderSchema = new Schema<IOrder, OrderModel>(
    {
        email: { type: String, required: true },
        contact: { type: String, required: true },
        address: { type: String, required: true },
        notes: { type: String, required: false },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        delivery_charge: { type: Number, required: true },
        txid: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "processing", "OnWay", "completed", "cancelled"],
            default: "pending",
        }
    },
    { timestamps: true }
);

export const Order = model<IOrder, OrderModel>("Order", orderSchema);