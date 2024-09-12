import { faker } from "@faker-js/faker";

export const generateUser = () => {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const fullName = firstName.concat(" ", lastName);
  const email = faker.internet.email({
    firstName,
    lastName,
  });

  return {
    email,
    name: fullName,
    password: faker.internet.password(),
  };
};
