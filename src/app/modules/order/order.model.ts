import { Schema, model } from "mongoose";
import { IOrder, Item, OrderModel } from "./order.interface";



const itemSchema = new Schema<Item>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder, OrderModel>(
    {
        email: { type: String, required: true },
        name : { type: String, required: true},
        contact: { type: String, required: true },
        address: { type: String, required: true },
        notes: { type: String, required: false },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [itemSchema],
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