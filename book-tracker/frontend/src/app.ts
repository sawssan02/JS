import { Book } from "./Book";
import { Status, Format } from "./enums";

const bookForm = document.getElementById("bookForm") as HTMLFormElement;
const bookList = document.getElementById("bookList")!;
const totalBooks = document.getElementById("totalBooks")!;
const totalPages = document.getElementById("totalPages")!;

let books: any[] = [];

bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const book = new Book(
        (document.getElementById("title") as HTMLInputElement).value,
        (document.getElementById("author") as HTMLInputElement).value,
        parseInt((document.getElementById("pages") as HTMLInputElement).value),
        parseInt((document.getElementById("pagesRead") as HTMLInputElement).value),
        (document.getElementById("status") as HTMLSelectElement).value as Status,
        parseFloat((document.getElementById("price") as HTMLInputElement).value),
        (document.getElementById("format") as HTMLSelectElement).value as Format,
        (document.getElementById("suggestedBy") as HTMLInputElement).value
    );

    await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
    });

    loadBooks();
});

async function loadBooks() {
    const res = await fetch("http://localhost:3000/books");
    books = await res.json();
    renderBooks();
    renderStats();
}

function renderBooks() {
    bookList.innerHTML = "";
    books.forEach(book => {
        const div = document.createElement("div");
        div.className = "p-4 bg-white shadow rounded";

        div.innerHTML = `
            <h3 class="font-bold">${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>${book.pagesRead}/${book.pages} pages</p>
            <p>${Math.floor(book.pagesRead / book.pages * 100)}%</p>
            <button class="bg-red-500 text-white px-2 py-1 rounded deleteBtn">Delete</button>
        `;

        div.querySelector(".deleteBtn")!.addEventListener("click", async () => {
            await fetch(`http://localhost:3000/books/${book._id}`, {
                method: "DELETE"
            });
            loadBooks();
        });

        bookList.appendChild(div);
    });
}

function renderStats() {
    totalBooks.textContent = "Total books: " + books.length;
    totalPages.textContent = "Total pages: " + books.reduce((s, b) => s + b.pages, 0);
}

loadBooks();
