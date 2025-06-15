import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { CategoryService } from './category.service'

const createCategory = catchAsync(async (req: Request, res: Response) => {

  const result = await CategoryService.createCategoryToDB(req.body)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category create successfully',
    data: result,
  })
})

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: result,
  })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {

  const result = await CategoryService.updateCategoryToDB(req.params.id, req.body)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category updated successfully',
    data: result,
  })
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await CategoryService.deleteCategoryToDB(id)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category delete successfully',
    data: result,
  })
})


export const CategoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
}
