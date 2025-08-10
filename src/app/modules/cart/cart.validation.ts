import { z } from "zod";
import { checkValidID } from "../../../shared/checkValidID";

export const cartZodSchemaValidation = z.object({
    body: z.object({
        product: checkValidID("Product ID is required"),
        quantity: z.number({ required_error: "Quantity is required" }),
    })
});