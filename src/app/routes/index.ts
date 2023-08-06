import express from "express";
import { BookRouter } from "../modules/book/book.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/book",
    route: BookRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
