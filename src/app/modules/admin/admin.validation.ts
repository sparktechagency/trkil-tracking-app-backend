import { z } from 'zod';

export const AdminZodValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z.string({ required_error: 'Email is required' }),
        password: z.string({ required_error: 'Password is required' })
    })
});