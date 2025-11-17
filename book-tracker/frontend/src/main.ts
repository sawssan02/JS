const form = document.getElementById("bookForm") as HTMLFormElement;
const list = document.getElementById("booksList") as HTMLElement;

form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    title: (document.getElementById("title") as HTMLInputElement).value,
    author: (document.getElementById("author") as HTMLInputElement).value,
    pages: Number((document.getElementById("pages") as HTMLInputElement).value),
    pagesRead: Number((document.getElementById("pagesRead") as HTMLInputElement).value),
    price: Number((document.getElementById("price") as HTMLInputElement).value),
    suggestedBy: (document.getElementById("suggestedBy") as HTMLInputElement).value,
    status: (document.getElementById("status") as HTMLSelectElement).value,
    format: (document.getElementById("format") as HTMLSelectElement).value
  };

  await fetch("http://localhost:5000/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  loadBooks();
});

async function loadBooks() {
  const res = await fetch("http://localhost:5000/books");
  const books = await res.json();

  list.innerHTML = books
    .map(
      (b: any) =>
        `<div class="p-3 border my-2 rounded bg-gray-50">
          <p class="font-bold">${b.title} - ${b.author}</p>
          <p>${b.pagesRead} / ${b.pages} pages</p>
          <p class="text-green-700 font-semibold">${Math.floor(
            (b.pagesRead / b.pages) * 100
          )}%</p>
        </div>`
    )
    .join("");
}

loadBooks();
