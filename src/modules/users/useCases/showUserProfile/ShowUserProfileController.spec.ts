import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@test.com.br",
      password: "123456",
    });

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "123456",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });
});
