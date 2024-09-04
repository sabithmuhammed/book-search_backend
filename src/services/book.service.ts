import { BookDocument, BookModel } from "../models/book.model";
import esClient from "../config/elasticsearch";
import { Types } from "mongoose"; // Import Types for ObjectId

export class BookService {
    async createBook(bookData: BookDocument): Promise<BookDocument> {
        const book = new BookModel(bookData);
        await book.save();

        // Indexing in Elasticsearch
        await esClient.index({
            index: "books",
            id: book._id.toString(),
            document: {
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                publishedDate: book.publishedDate,
                isbn:book.isbn,
                description: book.description,
                image: book.image,
            },
        });

        return book;
    }

    async findBookById(id: string): Promise<BookDocument | null> {
        const book = await BookModel.findById(id);
        return book;
    }

    async getAllBooks(skip: number = 0, limit: number = 4): Promise<{ books: BookDocument[], totalBooks: number }> {
        const books = await BookModel.find().skip(skip).limit(limit);
        const totalBooks = await BookModel.countDocuments(); // Total number of books
        return { books, totalBooks };
    }

    async searchBooks(query: string, skip: number = 0, limit: number = 4): Promise<{ books: BookDocument[], totalBooks: number }> {
        const { hits } = await esClient.search({
            index: "books",
            from: skip,
            size: limit,
            query: {
                multi_match: {
                    query: query,
                    fields: ["title", "author", "description", "publisher", "publishedDate","isbn"],
                    fuzziness: "AUTO",
                },
            },
        });
    
        // Convert Elasticsearch results to Mongoose documents
        const books = hits.hits.map((hit) => {
            if (hit._source) {
                // Create a new BookModel instance with _id and other fields from hit
                const bookData = {
                    ...hit._source,
                    _id: new Types.ObjectId(hit._id) // Ensure _id is converted to ObjectId
                } as unknown as BookDocument;
                return new BookModel(bookData);
            } else {
                // If _source is undefined, return an empty BookModel or handle appropriately
                return new BookModel();
            }
        });
    
        // Handle totalBooks correctly based on the structure of hits.total
        let totalBooks = 0;
        if (hits.total) {
            if (typeof hits.total === "number") {
                totalBooks = hits.total; // Elasticsearch version <7.0
            } else if (typeof hits.total === "object") {
                totalBooks = hits.total.value; // Elasticsearch version >=7.0
            }
        }
    
        return { books, totalBooks };
    }

    async deleteBookById(id: string): Promise<boolean> {
        const result = await BookModel.findByIdAndDelete(id);
        if (result) {
            return false;
        }
        await esClient.delete({
            index: "books",
            id: id,
        });
        return true;
    }

    async updateBookById(
        id: string,
        updateData: Partial<BookDocument>
    ): Promise<BookDocument | null> {
        const updatedBook = await BookModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedBook) {
            return null;
        }

        await esClient.update({
            index: "books",
            id: id,
            doc: {
                title: updatedBook.title,
                author: updatedBook.author,
                publisher: updatedBook.publisher,
                publishedDate: updatedBook.publishedDate,
                description: updatedBook.description,
                isbn:updatedBook.isbn,
                image: updatedBook.image,
            },
        });

        return updatedBook;
    }
}
