import sqlite3
import random


def connect_to_db():
    conn = sqlite3.connect('comic_artist.db')
    return conn


def create_db_table():
    conn = None
    try:
        conn = connect_to_db()
        conn.execute('''
            CREATE TABLE IF NOT EXISTS artists (
                user_id INTEGER PRIMARY KEY NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                birth_year int NOT NULL
            );
        ''')

        conn.commit()
        print("User table created successfully")
    except (AttributeError, PermissionError):
        print("User table creation failed - check sqlite database permissions")
    finally:
        if conn:
            conn.close()


def insert_artist(first_name: str, last_name: str, birth_year: str):
    db = connect_to_db()
    cursor = db.cursor()
    statement = "INSERT INTO artists (first_name, last_name, birth_year) VALUES (?, ?, ?)"
    cursor.execute(statement, [first_name, last_name, birth_year])
    db.commit()
    user_id = db.execute("SELECT last_insert_rowid() FROM artists")
    db.close()
    return user_id.lastrowid


def update_artist(user_id: str, first_name: str, last_name: str, birth_year: str):
    db = connect_to_db()
    cursor = db.cursor()
    statement = "UPDATE artists SET first_name = ?, last_name = ?, birth_year = ? WHERE user_id = ?"
    cursor.execute(statement, [first_name, last_name, birth_year, user_id])
    db.commit()
    db.close()
    return True


def delete_artist(user_id: str):
    db = connect_to_db()
    cursor = db.cursor()
    statement = "DELETE FROM artists WHERE user_id = ?"
    cursor.execute(statement, [user_id])
    db.commit()
    db.close()
    return True


def get_by_id(user_id: str):
    db = connect_to_db()
    cursor = db.cursor()
    statement = "SELECT user_id, first_name, last_name, birth_year FROM artists WHERE substr(first_name, 1, 1) = ?"
    cursor.execute(statement, [user_id[0]])
    result = cursor.fetchone()
    if not result:
        result = (random.randint(1, 1000), "Random", "Artist", "1900")
    db.close()
    return result


def get_artists():
    db = connect_to_db()
    cursor = db.cursor()
    query = "SELECT user_id, first_name, last_name, birth_year FROM artists"
    cursor.execute(query)
    result = cursor.fetchall()
    db.close()
    return result


if __name__ == "__main__":
    create_db_table()
