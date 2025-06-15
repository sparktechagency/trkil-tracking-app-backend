import { z } from "zod";
import { checkValidID } from "../../../shared/checkValidID";

export const bannerZodValidationSchema = z.object({
    body: z.object({
        product: checkValidID("Product ID is invalid"),
        name: z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        }).nonempty("Name cannot be empty"),
        
        image: z.string({
            required_error: "Image is required",
            invalid_type_error: "Image must be a string",
        }).nonempty("Image cannot be empty")
    })
});