import * as supertest from "supertest";
import ENV from "../utils/env";
import { faker } from "@faker-js/faker";
import { createArtist, CreateArtistDto } from "../data/createArtistDto";
import { emptyArtistsTable } from '../utils/db-connection';

const baseUrl: string = ENV.BASE_URL;
const request = supertest(baseUrl);
const userIdArray: number[] = [];
let user: CreateArtistDto;

describe("POST Artist API Tests", () => {

  beforeEach(async () => {
    console.log("Starting a new test...");
    await emptyArtistsTable();
  });

  test("POST Artist - Valid artist data", async () => {
    user = createArtist();
    const response = await request
      .post("/artists")
      .send(user)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toBe(1);
  });

  test("POST Artist - Missing required field first_name", async () => {
    user = createArtist();
    delete user.first_name;
    const response = await request
      .post("/artists")
      .send(user)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    });

  test("POST Artist - invalid json", async () => {
      user = createArtist();

      const invalidJson = JSON.stringify(user).slice(0, -1); // remove last character to make it invalid

      const response = await request
        .post("/artists")
        .set("Content-Type", "application/json")
        .send(invalidJson)
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("POST Artist - Extra field in request body", async () => {
      user = createArtist();
      const requestBodyWithExtraField = {
        ...user,
        extra_field: "extra_value"
      };

      const response = await request
        .post("/artists")
        .send(requestBodyWithExtraField)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toBe(1);
    });

    test("POST Artist - Empty request body", async () => {
      const response = await request
        .post("/artists")
        .send({})
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("POST Artist - duplicate artists allowed", async () => {
      user = createArtist();
      const response1 = await request
        .post("/artists")
        .send(user)
        .set("Accept", "application/json");

      expect(response1.status).toBe(200);
      expect(response1.body).toBe(1);

      const response2 = await request
        .post("/artists")
        .send(user)
        .set("Accept", "application/json");

      expect(response2.status).toBe(200);
      expect(response2.body).toBe(2);
    });
});

describe("GET Created Artists API Tests", () => {

  beforeEach(async () => {
    console.log("Starting a new test...");
    await emptyArtistsTable();
  });

  test("GET Artists - all created Artists", async () => {
    const numberOfArtists = 5;
      for (let i = 0; i < numberOfArtists; i++) {
        user = createArtist();
        const response = await request
          .post("/artists")
          .send(user)
          .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toBeGreaterThan(0);
        userIdArray.push(response.body);
      }

      const response = await request
        .get("/artists")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(numberOfArtists);
    });

    test("GET Artists - no Artists exist", async () => {
      const response = await request
        .get("/artists")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

});

describe("PUT existing Artist API tests", () => {

    beforeEach(async () => {
    console.log("Starting a new test...");
    await emptyArtistsTable();
  });

  test("PUT Artist - Valid artist data", async () => {
    user = createArtist();
    let responsePost = await request
      .post("/artists")
      .send(user)
      .set("Accept", "application/json");
    expect(responsePost.status).toBe(200);

    const newLastName = faker.person.lastName();
    user.last_name = newLastName;
    const artistId = responsePost.body;
    const updatedRequestBody = {
      user_id: `${artistId}`,
      ...user
    };

    let responsePut = await request
      .put("/artists")
      .send(updatedRequestBody)
      .set("Accept", "application/json");

    expect(responsePut.status).toBe(200);

    let responseGet = await request
      .get("/artists")
      .set("Accept", "application/json");

    expect(responseGet.status).toBe(200);
    const updatedArtist = responseGet.body.filter((artist: any[]) => artist[0] === artistId);
    expect(updatedArtist[0][1]).toBe(user.first_name);
    expect(updatedArtist[0][2]).toBe(newLastName);
    expect(updatedArtist[0][3]).toBe(user.birth_year);
  });

  test("PUT Artist - Non-existing artist ID", async () => {
    user = createArtist();
    const nonExistingArtistId = 9999;
    const updatedRequestBody = {
      user_id: `${nonExistingArtistId}`,
      ...user
    };

    let responsePut = await request
      .put("/artists")
      .send(updatedRequestBody)
      .set("Accept", "application/json");

    expect(responsePut.status).toBe(404);
    expect(responsePut.body).toHaveProperty("error");
  });

  test("PUT Artist - Missing required field first_name", async () => {
    user = createArtist();

    let responsePost = await request
      .post("/artists")
      .send(user)
      .set("Accept", "application/json");
    expect(responsePost.status).toBe(200);

    const artistId = responsePost.body;
    delete user.first_name;
    const updatedRequestBody = {
      user_id: `${artistId}`,
      ...user
    };

    let responsePut = await request
      .put("/artists")
      .send(updatedRequestBody)
      .set("Accept", "application/json");

    expect(responsePut.status).toBe(400);
    expect(responsePut.body).toHaveProperty("error");
    expect(responsePut.body.error).toMatch("Missing keys: first_name");
  });
  
});

describe("DELETE Artist API tests", () => {

    beforeEach(async () => {
    console.log("Starting a new test...");
    await emptyArtistsTable();
  });

  test("DELETE Artist - existing Artist", async () => {
    user = createArtist();
    let responsePost = await request
      .post("/artists")
      .send(user)
      .set("Accept", "application/json");
    expect(responsePost.status).toBe(200);

    const artistId = responsePost.body;

    let responseDelete = await request
      .delete(`/artists/${artistId}`)
      .set("Accept", "application/json");

    expect(responseDelete.status).toBe(200);

    let responseGet = await request
      .get("/artists")
      .set("Accept", "application/json");

    expect(responseGet.status).toBe(200);
    const deletedArtist = responseGet.body.filter((artist: any[]) => artist[0] === artistId);
    expect(deletedArtist.length).toBe(0);
  });

  test("DELETE Artist - non-existing Artist", async () => {
    const nonExistingArtistId = 9999;

    let responseDelete = await request
      .delete(`/artists/${nonExistingArtistId}`)
      .set("Accept", "application/json");

    expect(responseDelete.status).toBe(404);
    expect(responseDelete.body).toHaveProperty("error");
  });

  test("DELETE Artist - invalid Artist ID", async () => {
    const invalidArtistId = "invalid_id";

    let responseDelete = await request
      .delete(`/artists/${invalidArtistId}`)
      .set("Accept", "application/json");

    console.log(responseDelete.body);
    expect(responseDelete.status).toBe(400);
    expect(responseDelete.body).toHaveProperty("error");
  });

});

describe("GET specific Artist API tests", () => {

    beforeEach(async () => {
    console.log("Starting a new test...");
    await emptyArtistsTable();
  });

  test("GET specific Artist - existing Artist", async () => {
    user = createArtist();
    let responsePost = await request
      .post("/artists")
      .send(user)
      .set("Accept", "application/json");
    expect(responsePost.status).toBe(200);

    const artistId = responsePost.body;

    let responseGet = await request
      .get(`/artists/${artistId}`)
      .set("Accept", "application/json");

      console.log(responseGet.body);
    expect(responseGet.status).toBe(200);
    expect(responseGet.body[0]).toBe(artistId);
    expect(responseGet.body[1]).toBe(user.first_name);
    expect(responseGet.body[2]).toBe(user.last_name);
    expect(responseGet.body[3]).toBe(user.birth_year);
  });

  test("GET specific Artist - non-existing Artist", async () => {
    const nonExistingArtistId = 9999;

    let responseGet = await request
      .get(`/artists/${nonExistingArtistId}`)
      .set("Accept", "application/json");

    expect(responseGet.status).toBe(200);
    console.log(responseGet.body);
    expect(responseGet.body[1]).toBe("Random");
    expect(responseGet.body[2]).toBe("Artist");
    expect(responseGet.body[3]).toBe("1900");
  });
});