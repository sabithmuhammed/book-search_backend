import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface AdminDocument extends Document {
    _id:ObjectId
    name: string;
    email: string;
    password: string;
}

const AdminSchema = new Schema<AdminDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

export const AdminModel = mongoose.model<AdminDocument>("Admin", AdminSchema);