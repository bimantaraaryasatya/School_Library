const express = require(`express`) // load library express
const app = express() // initiate object that instance of express
app.use(express.json()) // allow to read 'request' with json type
const bookController = require(`../controllers/book.controller`) // load book's controller
const { midOne } = require(`../middleware/simple-middleware`)

// create route to get data with method "GET"
app.get("/", [midOne], bookController.getAllBooks)

// create route to find book
app.post("/find", bookController.findBook)

// create route to add new book using method "POST"
app.post("/", bookController.addBook)

// create route to update book
app.put("/:id", bookController.updateBook)

// create route to delete book
app.delete("/:id", bookController.deleteBook)

module.exports = app