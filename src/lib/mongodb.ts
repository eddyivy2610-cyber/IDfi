import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientUri: string | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise || global._mongoClientUri !== uri) {
      const client = new MongoClient(uri);
      global._mongoClientUri = uri;
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    return client.connect();
  }
}

export const connectDB = async (): Promise<{ client: MongoClient; db: Db }> => {
  try {
    const client = await getClientPromise();
    const dbName = process.env.MONGODB_DB_NAME || "eid_card_db";
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

export async function connectToDatabase() {
  return await connectDB();
}

export default getClientPromise;