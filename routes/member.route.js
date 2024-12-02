const express = require(`express`) // load library express
const app = express() // initiate object that instance of express
app.use(express.json()) // allow to read 'request' with json type
const memberController = require(`../controllers/member.controller`) // load member's controller
let { validateMember } = require(`../middleware/member-validation`) // load middleware for validation request
module.exports = app // export app in order to load in another file

// create route to get data with method "GET"
app.get("/", memberController.getAllMember)

// create route to add new member using method "POST"
app.post("/", [validateMember], memberController.addMember)

// create route to find member using method "POST" and path "find"
app.post("/find", memberController.findMember)

// create route to update member using method "PUT" and define parameter for "id"
app.put("/:idMember", [validateMember], memberController.updateMember)

// create route to delete member using method "DELETE" and define parameter for "id"
app.delete("/:id", memberController.deleteMember)