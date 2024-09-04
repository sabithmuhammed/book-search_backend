import { Request, Response } from "express";
import { BookService } from "../services/book.service";
import { BookDocument } from "../models/book.model";
import Cloudinary from "../utils/cloudinary";
import FileOperations from "../utils/fileOperations";

const bookService = new BookService();
const cloudinary = new Cloudinary();
const fileOperations = new FileOperations();

export class BookController {
    static async createBook(req: Request, res: Response) {
        try {
            const uploadedImage = req.file;
            let image = "";
            if (uploadedImage) {
                image = await cloudinary.saveToCloudinary(uploadedImage);
                await fileOperations.deleteFile(uploadedImage.path);
            }
            const book = await bookService.createBook({ ...req.body, image });
            res.status(201).json(book);
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Error creating book" });
        }
    }

    static async getBookById(req: Request, res: Response) {
        try {
            const book = await bookService.findBookById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({ error: "Error fetching book" });
        }
    }

    static async searchBooks(req: Request, res: Response) {
        try {
            const query = req.query.q as string;
            const page = parseInt(req.query.page as string) || 1; // Default to page 1
            const limit = parseInt(req.query.limit as string) || 4; // Default to 10 books per page
            const skip = (page - 1) * limit;

            let result;
            if (query) {
                result = await bookService.searchBooks(query, skip, limit);
            } else {
                result = await bookService.getAllBooks(skip, limit);
            }

            const { books, totalBooks } = result;
            const pageCount = Math.ceil(totalBooks / limit); // Total number of pages

            res.json({
                books,
                totalBooks,
                pageCount,
                currentPage: page,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error searching books" });
        }
    }

    static async deleteBookById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const isDeleted = await bookService.deleteBookById(id);
            if (isDeleted) {
                return res
                    .status(200)
                    .json({ message: "Book deleted successfully" });
            } else {
                return res.status(404).json({ message: "Book not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error deleting book" });
        }
    }

    static async updateBookById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const uploadedImage = req.file;
            const updateData: Partial<BookDocument> = req.body;
            if (uploadedImage) {
                updateData.image = await cloudinary.saveToCloudinary(
                    uploadedImage
                );
                await fileOperations.deleteFile(uploadedImage.path);
            }
            const updatedBook = await bookService.updateBookById(
                id,
                updateData
            );
            if (!updatedBook) {
                return res.status(404).json({ message: "Book not found" });
            }
            return res.status(200).json({
                message: "Book updated successfully",
                data: updatedBook,
            });
        } catch (error) {
            res.status(500).json({ error: "Error updating book" });
        }
    }
}
