const express = require(`express`);
const app = express();
const { authroize } = require(`../controllers/auth.controller`) 
app.use(express.json());

const adminController = require(`../controllers/admin.controller`);

app.get("/", [authroize], adminController.getAllAdmin);
app.post("/", [authroize], adminController.addAdmin);
app.post("/find", [authroize], adminController.findAdmin)
app.put("/:id", [authroize], adminController.updateAdmin);
app.delete("/:id", [authroize], adminController.deleteAdmin);

module.exports = app;