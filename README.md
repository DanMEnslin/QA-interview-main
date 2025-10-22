# Toy Testing Example

This project is a simple web API example designed to help you learn and practice testing methods. It includes a Flask application and a database setup.

## Getting Started

Follow these steps to set up and run the project:

1. **Set up a Python environment**
   - Create a virtual environment using `venv` or `conda`.
   - Activate your virtual environment.

2. **Install dependencies**
   - Run the following command to install the required libraries:
     ```bash
     pip install -r requirements.txt
     ```

3. **Set up the database**
   - Open the `database_creation.py` file.
   - Run the `create_db_table` function to create the necessary database tables.

4. **Run the Flask application**
   - Open the `app.py` file.
   - Start the Flask app by running:
     ```bash
     python app.py
     ```

5. **Write and run tests**
   - Navigate to the `tests` folder (you may need to create it).
   - Write end-to-end tests to verify the functionality of the API. These should include basic CRUD operations.
   - You can use tools like Postman or `curl` to manually test the API endpoints and identify areas to focus on.
   - Write repeatable tests in code using any language you are comfortable with (Python is preferred).
   - Use PyTest or equivalent tools to run the test files:
     ```bash
     pytest
     ```

## Endpoints overview

Summary of the API routes implemented in `app.py`. This is intentionally concise — candidates should explore details and design tests that verify the behaviors below.

- GET `/artists`
  - Returns the list of all artists (JSON list).
  - No input required.

- POST `/artists`
  - Creates a new artist.
  - Expects a JSON body. Keys: `first_name`, `last_name`,`birth_year` .
  - Validation: request must be JSON; required fields must be present and non-empty strings.

- PUT `/artists`
  - Updates an existing artist.
  - Expects a JSON body. Required keys: `user_id`, `first_name`, `last_name`, `birth_year`.
  - Validation: request must be JSON; all required values must be non-empty strings (including `user_id`).

- GET `/artists/<user_id>`
  - Fetch a single artist by `user_id` (path parameter).
  - Validation: `user_id` must be a non-empty string.

- DELETE `/artists/<user_id>`
  - Delete an artist by `user_id` (path parameter).
  - Validation: `user_id` must be a non-empty string.

## Additional Notes

- Make sure your virtual environment is activated before running any commands.
- The database file `comic_artist.db` will be created in the project directory after running the `create_db_table` function.
- The Flask app will run locally, and you can access it with any method that returns values, there is no UI so a browser will be of limited use.

Feel free to explore and modify the project to suit your learning needs.
