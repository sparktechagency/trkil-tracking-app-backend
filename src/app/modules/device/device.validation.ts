import { z } from 'zod';
import { checkValidID } from '../../../shared/checkValidID';

export const deviceZodValidationSchema = z.object({
    body: z.object({

        name: z.string({
            required_error: 'name is required',
            invalid_type_error: 'Invalid type: name must be a string'
        }).nonempty('name cannot be empty'),

        category: checkValidID('Category Object ID is required'),

        serial: z.string({
            required_error: 'serial is required',
            invalid_type_error: 'Invalid type: serial must be a string'
        }).nonempty('serial cannot be empty')
    })
});