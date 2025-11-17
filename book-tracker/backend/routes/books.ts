import express from "express";
import Book from "../models/Book";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.json(await Book.find());
});

router.post("/", async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.json(book);
});

router.delete("/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

export default router;
