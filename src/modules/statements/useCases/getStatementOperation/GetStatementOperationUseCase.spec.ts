import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
const testUser: ICreateUserDTO = {
  email: "user@test.com",
  password: "1234",
  name: "User Test",
};
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("get a statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to find a user statment", async () => {
    const user = await inMemoryUsersRepository.create(testUser);

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: user.id,
    });

    const response = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: user.id,
    });

    expect(response).toHaveProperty("id", statement.id);
  });

  it("Shouldn't be able to find a statment if user doesn't exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "nonexistent_user",
        statement_id: "nonexistent_statement",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Shouldn't be able to find a nonexistent statement", async () => {
    const user = await inMemoryUsersRepository.create(testUser);

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "nonexistent_statement",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
