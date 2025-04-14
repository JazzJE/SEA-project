# 📚 Book Randomizer and Discovery

## 🥅 Project Goal
- Enable user to discover books of different genres that will also provide them a link to purchase said book
  - Also provide user with related information about the book

## 🗺️ Overview of General Features
- Parse all of the books as objects and the indices that are displayed within arrays
  - **Adding books/cards:** Push a new book index and a card node to the array of displayed indices (that is not already inside of the array)
  - **Removing books/cards:** Pop the last index in the array of displayed indices, then re-render cards
  - **Filtering books/cards:** Store only the categories that the displayed cards can be, input them as options to the datalist, then use a linear search to remove elements that are not of the category, and finally re-render cards
  - **Sorting books/cards:** Use a linear sort to reorder the displayed object indices that are smallest in price to greatest

## 🗃️ Dataset Used
- Refer to this repo of >2000 books: [Amazon-popular-books-dataset](https://github.com/luminati-io/Amazon-popular-books-dataset)
