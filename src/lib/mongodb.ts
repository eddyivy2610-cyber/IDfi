import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;
const dbName: string = process.env.MONGODB_DB_NAME || "27017";

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the NodeJS global type to include our Mongo client for dev mode
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // Use global variable in development to preserve client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // No global variable in production
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const connectDB = async (): Promise<{ client: MongoClient; db: Db }> => {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

export default clientPromise;


// **********************************

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global connection to prevent multiple connections in development
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}