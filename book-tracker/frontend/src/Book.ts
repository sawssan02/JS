import { Status, Format } from "./enums";

export class Book {
    constructor(
        public title: string,
        public author: string,
        public pages: number,
        public pagesRead: number,
        public status: Status,
        public price: number,
        public format: Format,
        public suggestedBy: string,
        public finished: boolean = pagesRead === pages
    ) {}

    currentlyAt(): number {
        return Math.floor((this.pagesRead / this.pages) * 100);
    }
}
