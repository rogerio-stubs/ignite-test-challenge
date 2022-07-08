import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be albe to create a new statement type deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@test.com.br",
      password: "123456",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "123456",
    });

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set("Authorization", `Bearer ${auth.body.token}`);

    expect(response.status).toBe(201);
  });

  it("should be albe to create a new statement type withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@test.com.br",
      password: "123456",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "123456",
    });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw test",
      })
      .set("Authorization", `Bearer ${auth.body.token}`);

    expect(response.status).toBe(201);
  });

  it("Should not be able to withdraw credits from an user account without credits", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test user",
      email: "User Supertest",
      password: "1234",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "User Supertest",
      password: "1234",
    });

    const { token } = auth.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
