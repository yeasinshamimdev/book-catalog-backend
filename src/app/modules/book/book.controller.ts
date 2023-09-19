import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { bookFilterableFields, paginationFields } from "./book.constants";
import { IBook } from "./book.interface";
import { BookServiceWrapper } from "./book.service";

const createBook = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await BookServiceWrapper.createBook(data);

  sendResponse<IBook>(res, {
    statusCode: 200,
    success: true,
    message: "books created successfully",
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookServiceWrapper.getAllBooks(
    filters,
    paginationOptions
  );

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "all books fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BookServiceWrapper.getSingleBook(id);
  sendResponse<IBook>(res, {
    statusCode: 200,
    success: true,
    message: "Single book retrieve successful",
    data: result,
  });
});

const updateSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BookServiceWrapper.updateSingleBook(id, data);
  if (!result) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "book not found",
      data: null,
    });
  }

  sendResponse<IBook>(res, {
    statusCode: 200,
    success: true,
    message: "Update single book successfull",
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const book = await BookServiceWrapper.deleteBook(id);
  if (!book) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "book not found",
      data: null,
    });
  }
  sendResponse<IBook>(res, {
    statusCode: 200,
    success: true,
    message: "Delete book successfull",
  });
});

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateSingleBook,
  deleteBook,
};
