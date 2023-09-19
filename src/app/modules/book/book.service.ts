import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import CustomApiError from "../../../error/CustomError";
import { paginationHelpers } from "../../../helper/paginationHelper";
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOptions } from "../../../interface/pagination";
import { bookSearchableFields } from "./book.constants";
import { IBook, IBookFilters } from "./book.interface";
import { Book } from "./book.model";

const createBook = async (data: IBook): Promise<IBook> => {
  const result = await Book.create(data);
  return result;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic sort needs  fields to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const isExist = await Book.findOne({ id });

  if (!isExist) {
    throw new CustomApiError(httpStatus.NOT_FOUND, "Book id not found !");
  }
  const result = await Book.findById(id);
  return result;
};

const updateSingleBook = async (id: string, payload: Partial<IBook>) => {
  const isExist = await Book.findOne({ id });

  if (!isExist) {
    throw new CustomApiError(httpStatus.NOT_FOUND, "Book id not found !");
  }
  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteBook = async (id: string) => {
  const isExist = await Book.findOne({ id });

  if (!isExist) {
    throw new CustomApiError(httpStatus.NOT_FOUND, "Book id not found !");
  }

  const result = await Book.findByIdAndDelete(id);
  return result;
};

export const BookServiceWrapper = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  updateSingleBook,
};
