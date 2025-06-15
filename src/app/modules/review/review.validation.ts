import { z } from "zod"

export const reviewZodValidationSchema = z.object({
    body: z.object({
        rating: z.number({ required_error: 'Rating is required' }),
        comment: z.string({ required_error: 'Comment is required' }),
    })  
})