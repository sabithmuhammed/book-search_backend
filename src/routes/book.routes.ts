import express from "express";
import { BookController } from "../controllers/book.controller";
import adminAuth from "../middlewares/auth.middleware";
import { Multer } from "../middlewares/multer.middleware";

const router = express.Router();

router.post(
    "/addBook",
    adminAuth,
    Multer.single("image"),
    BookController.createBook
);
router.get("/book/:id", BookController.getBookById);
router.get("/books", BookController.searchBooks);
router.patch(
    "/updateBook/:id",
    adminAuth,
    Multer.single("image"),
    BookController.updateBookById
);
router.delete("/deleteBook/:id", adminAuth, BookController.deleteBookById);

export default router;
