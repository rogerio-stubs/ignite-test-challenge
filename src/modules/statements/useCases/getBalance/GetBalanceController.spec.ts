import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get the balance of a user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@test.com.br",
      password: "123456",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "123456",
    });
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set("Authorization", `Bearer ${auth.body.token}`);

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set("Authorization", `Bearer ${auth.body.token}`);

    expect(response.body.statement.length).toBe(1);
    expect(response.body.balance).toBe(100);
    expect(response.status).toBe(200);
  });
});
