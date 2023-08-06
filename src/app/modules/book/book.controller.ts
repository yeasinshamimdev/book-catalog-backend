import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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
  const result = await BookServiceWrapper.getAllBooks();

  sendResponse<IBook[]>(res, {
    statusCode: 200,
    success: true,
    message: "books retrieved successfully",
    data: result,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BookServiceWrapper.getSingleBook(id);
  sendResponse<IBook>(res, {
    statusCode: 200,
    success: true,
    message: "Single book retrive successfull",
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
