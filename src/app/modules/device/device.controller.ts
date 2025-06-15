import { Request, Response, NextFunction } from 'express';
import { DeviceService } from './device.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const insertDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DeviceService.insertDeviceToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Device Created Successfully',
        data: result
    });
});

const retrievedDevices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DeviceService.retrievedDevicesToDB(req.user, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Retrieved Devices Successfully',
        data: result
    });
});

const deactivatedDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DeviceService.deactivatedDeviceToDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Deactivated Device Successfully',
        data: result
    });
});

const editDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await DeviceService.editDeviceToDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Device Edited Successfully',
        data: result
    });
});

export const DeviceController = {
    insertDevice,
    retrievedDevices,
    deactivatedDevice,
    editDevice
};