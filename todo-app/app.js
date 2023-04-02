/* eslint-disable no-unused-vars */
const express = require("express");
const db = require("./models/index");
const app = express();
var bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", async (request, response) => {
  const allTodos = await db.Todos.getTodos();
  if (request.accepts("html")) {
    return response.render("index", { allTodos });
  } else {
    return response.json(allTodos);
  }
});

app.get("/todos", async (request, response) => {
  console.log("Todo List");
  const todoItems = await db.Todos.getTodos();
  response.json(todoItems);
});

app.post("/todos", async (request, response) => {
  console.log("Creating a new Todo ...");
  try {
    await db.Todos.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("Updating Todo with ID: ");
  const todo = await db.Todos.findByPk(request.params.id);

  try {
    const updatedTodo = request.accepts("html")
      ? await todo.toggleMarkAsCompleted()
      : await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleting todo with ID: ", request.params.id);
  try {
    const todo = await db.Todos.findByPk(request.params.id);
    if (todo) {
      await db.Todos.remove(request.params.id);
      return response.json(true);
    } else {
      return response.json(false);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(false);
  }
});

module.exports = app;
