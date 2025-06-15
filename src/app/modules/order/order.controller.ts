import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { OrderService } from "./order.service";
import { JwtPayload } from "jsonwebtoken";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.createOrderToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order created successfully",
        data: result
    })
}); 

const retrievedOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.retrievedOrdersFromDB(req.user as JwtPayload, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Seller Orders retrieved successfully",
        data: result
    })
}); 

const retrievedOrderDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.orderDetailsToDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order Details Retrieved successfully",
        data: result
    })
});



export const OrderController = {
    createOrder,
    retrievedOrders,
    retrievedOrderDetails
}