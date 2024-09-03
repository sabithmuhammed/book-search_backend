import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface BookDocument extends Document {
    _id: ObjectId | string;
    title: string;
    author: string;
    publisher: string;
    publishedDate: string;
    isbn:string
    description: string;
    image: string;
}

const BookSchema = new Schema<BookDocument>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    isbn: { type: String, required: true },
    publishedDate: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});

export const BookModel = mongoose.model<BookDocument>("Book", BookSchema);
