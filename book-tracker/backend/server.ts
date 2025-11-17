import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookRoutes from "./routes/books";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/booktracker")
    .then(() => console.log("📌 MongoDB connected"))
    .catch(err => console.error(err));

// Routes
app.use("/books", bookRoutes);

app.listen(3000, () => {
    console.log("🚀 Backend running on port 3000");
});
