import { Schema, model } from "mongoose";
import { IProduct, ProductModel } from "./product.interface";
import config from "../../../config";

const productSchema = new Schema<IProduct, ProductModel>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        images: { type: [String], required: true },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            immutable: true
        },
        price: { type: Number, required: true },
        discount: { type: Number, required: false },
        status: {
            type: String,
            enum: ['Active', 'Deleted'],
            default: "Active"
        },
        color: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true

    }
);

productSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.images = obj.images.map((image: string) =>
        `http://${config.ip_address}:${config.port}${image}`
    );
    return obj;
};



export const Product = model<IProduct, ProductModel>('Product', productSchema);