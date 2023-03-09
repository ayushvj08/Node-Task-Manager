const todoList = () => {
  const all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array of overdue items accordingly.

    return all.filter(
      (todo) => todo.dueDate < new Date().toISOString().split("T")[0]
    );
  };

  const dueToday = () => {
    // Write the date check condition here and return the array of todo items that are due today accordingly.

    return all.filter(
      (todo) => todo.dueDate === new Date().toISOString().split("T")[0]
    );
  };

  const dueLater = () => {
    // Write the date check condition here and return the array of todo items that are due later accordingly.

    return all.filter(
      (todo) => todo.dueDate > new Date().toISOString().split("T")[0]
    );
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string as per the format given above.
    // return OUTPUT_STRING

    return list
      .map(
        (todo) =>
          `[${todo.completed ? "x" : " "}] ${todo.title} ${
            todo.dueDate === new Date().toISOString().split("T")[0]
              ? ""
              : todo.dueDate
          }`
      )
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
