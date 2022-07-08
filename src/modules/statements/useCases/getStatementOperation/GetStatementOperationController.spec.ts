import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to find a user statment", async () => {
    await request(app).post("/api/v1/users").send({
      name: "teste",
      email: "teste@test.com.br",
      password: "123456",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "123456",
    });
    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "deposit test",
      })
      .set("Authorization", `Bearer ${auth.body.token}`);

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .send()
      .set("Authorization", `Bearer ${auth.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
