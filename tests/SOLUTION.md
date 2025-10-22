# Vistar Media application - local Artist database API tests

## Table of contents
1. [Installation & running of test suite](#introduction)
2. [Exploratory testing session](#explore)
3. [Bugs & Issues](#bugs)
4. [Development process](#develop)
5. [Project Structure](#structure)
6. [Further improvements](#improvements)
7. [Notes](#notes)

## Installation & running of test suite <a name="introduction"></a>

### Installation

1. Ensure you have Python and Node.js installed on your system.
2. Set up the Python API as per the README.md:
3. Set up the JavaScript test environment:
   - Open a new terminal
   - Navigate to the `tests` folder:
     ```bash
     cd tests
     ```
   - Install Node.js dependencies:
     ```bash
     npm install
     ```
   - Rename the .env.example file to .env
   - Open the .env file in a text editor and update the BASE_URL to reflect the url of the local api, including port no.

### Running the test suite

- To run all API tests, ensure the Flask API is running, then execute:
  ```bash
  npm test
  ```
- Test results will be displayed in the terminal.

## Exploratory testing session - Postman <a name="explore"></a>
I started by following the readme instructions to set up and start the API. I then reviewed the python within the python.py and database_creation.py to understand if any endpoints exist beyond those described within the readme.

The next step was to create a new collection in Postman with each of the 5 described endpoints. I added collection level variables so I could quickly alter my test data and understand how the API works, what data exists and what data I can create or request. The postman collection is included in the repo.

### results summary
- No data is prepopulated, only the table is created by the script
- Need to add test data in advance of any non-POST API tests, using either the POST or a script to insert directly into the db.
- The GET returning all artists returns data in an array instead of json, making it harder to work with the returned data
- the GET returning a single entry using user_id has a bug; the response will essentially always return a randomly generated entry instead of an actual entry from the db, unless someone somehow has a first name starting with a digit
- The PUT will return true whether the user exists or not, but not add an entry. This should produce an error that the indexed user_id is invalid, or possibly create a user.
- The POST & PUT expect the birth_year to be a string, but returns a number which is inconsistent behavior

## Bugs & issues <a name="bugs"></a>
I have found five bugs/issues without much effort:
1. The GET specific artist will never return the searched for artist unless their first name starts with the number matching their user_id
2. The PUT returns the birth_year as a number despite both the POST and PUT requiring birth_year to be a string
3. The PUT will return true & a 200 response for a non-existent user_id; this should be a 404 and an applicable error message
4. The DELETE will return true & a 200 response for a non-existent user_id; this should be a 404 and an applicable error message 
5. The DELETE will return true & a 200 response for an invalid (non-numerical) user_id; this should be a 400 and an applicable error message

## Development process <a name="develop"></a>
I start by setting up an node project, followed by the installation of the required modules Jest and Supertest, as well as code linters. I then write a simple API test to ensure the set up is correct, in this case a basic POST to create a new artist.

It's apparent to me that historical test data will quickly pollute the tests themselves unless I delete the data after each test. I could do this using the DELETE request, but it would be better to have a cleardown script that deletes data directly from the database. I add the sqlite module and create a util function to delete data on command, as well as a few other CRUD functions should I need them later.

With this util function in place I can add it as a beforeeach hook and be confident that the data is new for each test. From there I create more tests, with a set of tests for each API request; one for the happy path as well as a few which should test error states. I follow a general Arrange-Act-Assert format using existing API calls to generate the system state/test data I need. I could have used the added helper functions for the Arrange steps, but again the test framework is simple and doesn't warrant this (yet).

Since the API is fairly simple I leave all the tests in one spec file which makes it easy to run them serially and not worry about the util function deleting data during parallel tests. In total there are 16 tests. I leave in the failing tests to highlight the issues when the framework is merged and running in CI/CD; I would also create bug reports for each in a real scenario.

## API testing project structure <a name="structure"></a>

### tests folder structure

```
tests/
├── .env                # Environment variables for tests
├── .env.example        # Example environment file
├── .prettierrc.json    # Prettier config
├── SOLUTION.md         # Solution and documentation
├── data/
│   └── createArtistDto.ts
├── env.d.ts            # TypeScript environment type definitions
├── eslint.config.mjs   # ESLint config
├── jest.config.ts      # Jest config
├── node_modules/       # Node.js dependencies
├── package-lock.json   # NPM lock file
├── package.json        # NPM package config
├── postman/
│   └── Vistar Media test.postman_collection.json
├── tests/
│   └── createArtist.spec.ts
├── tsconfig.json       # TypeScript config
├── utils/
│   ├── db-connection.ts
│   └── env.ts
```

## Further improvements <a name="improvements"></a>
I have kept the framework quite simple; one spec file for all the tests. This way I can run a simple cleardown script for the artists table in the database and have the tests be independent. In practice I would have multiple spec files each with their own purpose (happy flows, correct response tests, etc) which would require a better system to control the data. I would insert data directly for some tests in the Arrange step using util functions to rely less on other API's for this task.

Further tests would include all the standard error response codes (400, 404, 500 ,etc) which this API as it is now does not return.

## Notes <a name="notes"></a>
- To reiterate, I have left in the failing tests to demonstrate the bugs found; I had thought to fix the underlying flask app in a separate PR, but that seemed overkill for the task (plus it would take a while with my limited python knowledge)
