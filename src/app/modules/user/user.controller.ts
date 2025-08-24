import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

// register user
const createUser = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUserToDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Your account has been successfully created. Verify Your Email By OTP. Check your email',
    })
});

// retrieved user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getUserProfileFromDB(req.user as JwtPayload,);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result
    });
});

//update profile
const updateProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.updateProfileToDB(req.user as JwtPayload, req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result
    });
});

// delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.deleteUserFromDB(req.user as JwtPayload, req.body.password);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Account Deleted successfully',
        data: result
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    await UserService.changePasswordToDB(req.user as JwtPayload, req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password changed successfully',
    });
});

const users = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.usersFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Users retrieved successfully',
        data: result,
        pagination: result.pagination
    });
});

export const UserController = { 
    createUser, 
    getUserProfile, 
    updateProfile,
    deleteUser,
    changePassword,
    users
};