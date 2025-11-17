import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema({
    title: String,
    author: String,
    pages: Number,
    pagesRead: Number,
    status: String,
    price: Number,
    format: String,
    suggestedBy: String,
    finished: Boolean
});

export default mongoose.model("Book", BookSchema);
