import { z } from "zod";
import { checkValidID } from "../../../shared/checkValidID";

export const ProductZodValidationSchema = z.object({
    body: z.object({
        name: z.string().nonempty({ message: "Name is required" }),
        images: z.array(z.string({ required_error: "Image is Required" })).nonempty({ message: "Images is required" }),
        description: z.string({required_error: "Description is Required"}).nonempty({ message: "Description not be Empty" }),
        color: z.string({required_error: "Color is Required"}).nonempty({ message: "Color not be empty" }),
        category: checkValidID("Category Object ID is required"),
        price: z.number({ required_error: "Price is Required" })
    })
});