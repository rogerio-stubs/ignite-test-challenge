import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be albe to create a new user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "teste",
        email: "teste@test.com.br",
        password: "123456",
      })
      .expect(201);
  });

  it("should validate if user email has unique", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@test.com.br",
      password: "123456",
    });
    expect(response.body.message).toBe("User already exists");
    expect(response.status).toBe(400);
  });
});
