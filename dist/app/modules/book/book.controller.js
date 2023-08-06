"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const book_service_1 = require("./book.service");
const createBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield book_service_1.BookServiceWrapper.createBook(data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "books created successfully",
        data: result,
    });
}));
const getAllBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookServiceWrapper.getAllBooks();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "books retrieved successfully",
        data: result,
    });
}));
const getSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield book_service_1.BookServiceWrapper.getSingleBook(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Single book retrive successfull",
        data: result,
    });
}));
const updateSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const result = yield book_service_1.BookServiceWrapper.updateSingleBook(id, data);
    if (!result) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "book not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Update single book successfull",
        data: result,
    });
}));
const deleteBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const book = yield book_service_1.BookServiceWrapper.deleteBook(id);
    if (!book) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "book not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Delete book successfull",
    });
}));
exports.BookController = {
    createBook,
    getAllBooks,
    getSingleBook,
    updateSingleBook,
    deleteBook,
};
