import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IDevice } from './device.interface';
import { Device } from './device.model';
import { FilterQuery } from 'mongoose';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';

const insertDeviceToDB = async (payload: IDevice): Promise<IDevice> => {

    // Check if the device already exists for the user
    const existingDevice = await Device.findOne({ serial: payload.serial }).lean().exec();
    if (existingDevice) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "This Device already Registered");
    }

    const device = await Device.create(payload);
    if (!device) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Device");
    }
    return device;
}

const retrievedDevicesToDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{ devices: IDevice, pagination: any }> => {

    const devicesQuery = new QueryBuilder(
        Device.find({ user: user.id }),
        query
    );

    const [devices, pagination] = await Promise.all([
        devicesQuery.queryModel.populate("category", "name image").lean().exec(),
        devicesQuery.getPaginationInfo()
    ]);

    return { devices, pagination };
}

const deactivatedDeviceToDB = async (id: string): Promise<IDevice> => {

    checkMongooseIDValidation(id, "Device")

    const device = await Device.findByIdAndUpdate(
        id,
        { $set: { status: "Deactivated" } },
        { new: true }
    )
    if (!device) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Device not Found");
    }
    return device;
}

const editDeviceToDB = async (id: string, payload: IDevice): Promise<IDevice> => {

    checkMongooseIDValidation(id, "Device")

    const device = await Device.findByIdAndUpdate(
        id,
        { payload },
        { new: true }
    )
    if (!device) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Device not Found");
    }
    return device;
}


export const DeviceService = {
    insertDeviceToDB,
    retrievedDevicesToDB,
    deactivatedDeviceToDB,
    editDeviceToDB
};