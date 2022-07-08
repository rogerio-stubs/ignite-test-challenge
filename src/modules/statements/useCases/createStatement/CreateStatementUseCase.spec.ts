import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "@modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
describe("Create Statement Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const fakeUser = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "test@email.com",
      password: "123456",
    });
    const statement: ICreateStatementDTO = {
      user_id: fakeUser.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit",
    };

    const statementOperation = await createStatementUseCase.execute(statement);

    expect(statementOperation).toHaveProperty("id");
  });
});
