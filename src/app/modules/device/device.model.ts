import { Schema, model } from 'mongoose';
import { IDevice, DeviceModel } from './device.interface';

const deviceSchema = new Schema<IDevice, DeviceModel>(
    {

        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
        serial: { type: String, required: true },
        status: {
            type: String,
            enum: ["Active", "Deactivated"],
            default: "Active"
        }
    },
    {
        timestamps: true,
    }
);

export const Device = model<IDevice, DeviceModel>('Device', deviceSchema);