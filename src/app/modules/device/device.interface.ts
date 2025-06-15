import { Model, Types } from 'mongoose';

export type IDevice = {
    _id?:Types.ObjectId;
    user:Types.ObjectId;
    name: string;
    category: Types.ObjectId;
    serial: string;
    status: "Active" | "Deactivated"
};

export type DeviceModel = Model<IDevice>;