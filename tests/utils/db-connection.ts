import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export type Artist = {
  user_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
};

export async function connectToDb(): Promise<Database> {
  return open({
    filename: "../comic_artist.db",
    driver: sqlite3.Database,
  });
}

export async function emptyArtistsTable(): Promise<void> {
  const db = await connectToDb();
  await db.run('DELETE FROM artists');
  await db.close();
}

export async function returnTables(): Promise<string[]> {
  const db = await connectToDb();
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  await db.close();
  return tables.map(table => table.name);
}

export async function returnAllArtists(): Promise<Artist[]> {
  const db = await connectToDb();
  const result = await db.all<Artist[]>("SELECT * FROM artists");
  await db.close();
  return result;
}