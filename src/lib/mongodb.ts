import { MongoClient } from "mongodb";

const g = globalThis as unknown as { _fixmateMongo?: MongoClient };

function client(): MongoClient {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!g._fixmateMongo) g._fixmateMongo = new MongoClient(uri);
  return g._fixmateMongo;
}

export const mongoClient = client();
export const db = mongoClient.db(process.env.DB_NAME || "fixmate");
