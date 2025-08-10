import { z } from "zod";

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
        
        delivery_charge: z.number({
            required_error: "Delivery Charge is required",
            invalid_type_error: "Delivery Charge must be a number"
        }),
        price: z.number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number"
        }).nonnegative("Price must be a non-negative number"),

        txid: z.string({
            required_error: "Transaction ID is required",
            invalid_type_error: "Transaction ID must be a string"
        }).nonempty("Transaction ID must be provided"),
    })
});