/* eslint-disable no-unused-vars */
const express = require("express");
const db = require("./models/index");
const app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/todos", async (request, response) => {
  console.log("Todo List");
  const todoItems = await db.Todos.getTodo();
  response.json(todoItems);
});

app.post("/todos", async (request, response) => {
  console.log("Creating a new Todo ...");
  try {
    const todo = await db.Todos.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("Updating Todo with ID: ");
  const todo = await db.Todos.findByPk(request.params.id);

  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleted todo with ID: ", request.params.id);
  try {
    await db.Todos.destroy({ where: { id: request.params.id } });
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
