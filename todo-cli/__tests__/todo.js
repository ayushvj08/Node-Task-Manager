/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, add, markAsComplete } = todoList();

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
      dueDate: new Date(),
      completed: false,
    });
    expect(all.length).toBe(todosCount + 1);
  });
  //   2. Mark todo as completed
  test("MArk a todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(all[0]);
    expect(all[0].completed).toBe(true);
  });
});
