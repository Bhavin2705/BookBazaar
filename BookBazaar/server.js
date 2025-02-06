const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

let books = [];
let nextId = 1;

const validateBook = (book) => {
    if (!book.title || !book.author || book.price === undefined) {
        return { valid: false, error: "All fields are required" };
    }
    if (typeof book.price !== "number" || book.price <= 0) {
        return { valid: false, error: "Price must be a positive number" };
    }
    return { valid: true };
};

app.post("/books", (req, res) => {
    const { title, author, price } = req.body;
    const validation = validateBook({ title, author, price });

    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const newBook = {
        id: nextId++,
        title,
        author,
        price,
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.get("/books", (req, res) => {
    res.status(200).json(books);
});

app.get("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
});

app.put("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, price } = req.body;
    const validation = validateBook({ title, author, price });

    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const bookIndex = books.findIndex((b) => b.id === bookId);
    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    books[bookIndex] = { ...books[bookIndex], title, author, price };
    res.status(200).json(books[bookIndex]);
});

app.delete("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    books.splice(bookIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
