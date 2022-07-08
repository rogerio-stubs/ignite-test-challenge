import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 } from "uuid";
import { app } from "../../../../app";
let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("123456", 8);

    await connection.query(`
      INSERT INTO users (id, name, email, password, created_at)
      VALUES ('${v4()}', 'admin', 'teste@test.com.br', '${password}', NOW())`);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be return user and token", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should be validate if user email incorret", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "notexist@test.com.br",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });

  it("should be validate if user password incorrect", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "teste@test.com.br",
      password: "notexist",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });
});
