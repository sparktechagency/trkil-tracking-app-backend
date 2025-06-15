import { model, Schema } from "mongoose";
import { BannerModel, IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner, BannerModel>(
    {
        name: { type: String, required: true },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

export const Banner = model<IBanner, BannerModel>("Banner", bannerSchema);