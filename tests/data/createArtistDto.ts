import { faker } from "@faker-js/faker";

export interface CreateArtistDto {
  first_name?: string;
  last_name?: string;
  birth_year?: string;
}

export const createArtist = (): CreateArtistDto => {
  const gender = faker.person.sexType();
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();
  const birthYear = faker.date
    .birthdate({ min: 1940, max: 2005, mode: "year" })
    .getFullYear()
    .toString();

  return {
    first_name: firstName,
    last_name: lastName,
    birth_year: birthYear,
  };
};