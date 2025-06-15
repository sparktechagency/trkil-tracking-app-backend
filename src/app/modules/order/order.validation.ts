import { z } from "zod";
import { checkValidID } from "../../../shared/checkValidID";

export const orderZodValidationSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string"
        }).nonempty("Email must be provided").email("Invalid email address"),

        contact: z.string({
            required_error: "Contact is required",
            invalid_type_error: "Contact must be a string"
        }).nonempty("Contact must be provided"),

        address: z.string({
            required_error: "Address is required",
            invalid_type_error: "Address must be a string"
        }).nonempty("Address must be provided"),

        notes: z.string().optional(),

        product: checkValidID("Product ID is invalid"),
        delivery_charge: z.number({
            required_error: "Delivery Charge is required",
            invalid_type_error: "Delivery Charge must be a number"
        }),

        quantity: z.number({
            required_error: "Quantity is required",
            invalid_type_error: "Quantity must be a number"
        }).nonnegative("Quantity must be a non-negative number"),

        txid: z.string({
            required_error: "Transaction ID is required",
            invalid_type_error: "Transaction ID must be a string"
        }).nonempty("Transaction ID must be provided"),
    })
});