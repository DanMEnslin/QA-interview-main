from flask import Flask, jsonify, request
import database_creation

app = Flask(__name__)


def validate_payload(payload, required_keys):
    if not payload or not isinstance(payload, dict):
        return "Invalid JSON payload"
    missing_keys = [key for key in required_keys if key not in payload]
    if missing_keys:
        return f"Missing keys: {', '.join(missing_keys)}"
    if not all(isinstance(payload.get(key, None), str) and payload[key] for key in required_keys):
        return "All fields must be non-empty strings"
    return None


@app.route('/artists', methods=["GET"])
def get_artists():
    artists = database_creation.get_artists()
    return jsonify(artists)


@app.route("/artists", methods=["POST"])
def insert_artist():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        artist_details = request.get_json()
        if not artist_details:
            return jsonify({"error": "Invalid JSON payload"}), 400

        required_keys = ["first_name", "birth_year"]
        validation_error = validate_payload(artist_details, required_keys)
        if validation_error:
            return jsonify({"error": validation_error}), 400

        first_name = artist_details.get("first_name", "")
        last_name = artist_details.get("last_name", "")
        birth_year = artist_details.get("birth_year", "")
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    result = database_creation.insert_artist(first_name, last_name, birth_year)
    return jsonify(result)


@app.route("/artists", methods=["PUT"])
def update_artist():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        artist_details = request.get_json()
        if not artist_details or not isinstance(artist_details, dict):
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        required_keys = ["user_id", "first_name", "last_name", "birth_year"]
        missing_keys = [key for key in required_keys if key not in artist_details]
        if missing_keys:
            return jsonify({"error": f"Missing keys: {', '.join(missing_keys)}"}), 400
        
        user_id = artist_details.get("user_id", "")
        first_name = artist_details.get("first_name", "")
        last_name = artist_details.get("last_name", "")
        birth_year = artist_details.get("birth_year", "")

        if not all(isinstance(value, str) and value for value in [user_id, first_name, last_name, birth_year]):
            return jsonify({"error": "All fields must be non-empty strings"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    result = database_creation.update_artist(user_id, first_name, last_name, birth_year)
    return jsonify(result)


@app.route("/artists/<user_id>", methods=["DELETE"])
def delete_artist(user_id: str):
    try:
        if not user_id or not isinstance(user_id, str):
            return jsonify({"error": "Invalid user_id"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    result = database_creation.delete_artist(user_id)
    return jsonify(result)


@app.route("/artists/<user_id>", methods=["GET"])
def get_artist_by_id(user_id: str):
    try:
        if not user_id or not isinstance(user_id, str):
            return jsonify({"error": "Invalid user_id"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    result = database_creation.get_by_id(user_id)
    return jsonify(result)


if __name__ == "__main__":
    database_creation.create_db_table()
    app.run(host='127.0.0.1', debug=True)
