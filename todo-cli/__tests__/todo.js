/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("Todo Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Go To GYM",
      dueDate: new Date(),
      completed: false,
    });
  });

  // 1. Add A new Todo
  test("Add a new Todo", () => {
    const todosCount = all.length;
    add({
      title: "Adding a New Todo Item",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(all.length).toBe(todosCount + 1);
  });
  //   2. Mark todo as completed
  test("Mark a todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  // 3.  Retrieval of overdue todos
  test("Retrieval of overdue todos", () => {
    const overdueTodosCount = overdue().length;
    const oneday = 24 * 60 * 60 * 1000;

    add({
      title: "Add an overdue todo item",
      dueDate: new Date(Number(new Date()) - oneday)
        .toISOString()
        .split("T")[0],
      completed: false,
    });
    expect(overdue().length).toBe(overdueTodosCount + 1);
  });
  // 4.  Retrieval of due today todos
  test("Retrieval of due today todos", () => {
    const dueTodayTodosCount = dueToday().length;
    add({
      title: "Add an overdue todo item",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(dueToday().length).toBe(dueTodayTodosCount + 1);
  });
  // 5.  Retrieval of due later todos
  test("Retrieval of due later todos", () => {
    const dueLaterTodosCount = dueLater().length;
    const oneday = 24 * 60 * 60 * 1000;

    add({
      title: "Add an overdue todo item",
      dueDate: new Date(Number(new Date()) + oneday)
        .toISOString()
        .split("T")[0],
      completed: false,
    });
    console.log(dueLater().length);
    expect(dueLater().length).toBe(dueLaterTodosCount + 1);
  });
});
