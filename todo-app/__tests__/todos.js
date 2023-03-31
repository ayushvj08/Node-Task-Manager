const request = require("supertest");
const db = require("../models/index");

const app = require("../app");
let server, agent;

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a todo as complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Go Gardening",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const parsedResponse = JSON.parse(response.text);
    const todoId = parsedResponse.id;
    expect(parsedResponse.completed).toBe(false);

    const markCompletedResponse = await agent
      .put(`/todos/${todoId}/markAsCompleted`)
      .send();
    const parsedUpdatedResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(true);
  });

  test("Deleting a Todo", async () => {
    const response = await agent.post("/todos").send({
      title: "Go Green",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoId = parsedResponse.id;

    const deletedResponse = await agent.delete(`/todos/${todoId}`).send();
    const parsedDeleteReponse = JSON.parse(deletedResponse.text);

    expect(parsedDeleteReponse).toBe(true);
  });
});
