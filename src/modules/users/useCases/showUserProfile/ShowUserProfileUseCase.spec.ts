import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserService: CreateUserUseCase;
let showUserProfileService: ShowUserProfileUseCase;

describe("show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserService = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileService = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const user = await createUserService.execute({
      name: "test_user",
      email: "test@test.com",
      password: "test",
    });
    const response = await showUserProfileService.execute(user.id);

    expect(response.email).toBe(user.email);
  });
});
