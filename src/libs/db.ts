const { MongoClient } = require("mongodb");
require("dotenv").config();
import { Document } from "./types";

const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI);

export async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to DB");
    } catch (err) {
        console.log(err.stack);
    }
}

function createShortURL(): string {
    return Math.floor(Math.random() * 100000).toString();
}

export async function insertURL(url: string): Promise<Document> {
    try {
        const shortURL = createShortURL();
        const db = client.db("url-shortener");
        const collection = db.collection("urls");
        const doc: Document = { original_url: url, short_url: shortURL };
        await collection.insertOne(doc);

        console.log("Inserted document: ", doc);
        return doc;
    } catch (err) {
        console.log(err.stack);
    }
}

export async function findURL(shortURL: string): Promise<Document> {
    try {
        const db = client.db("url-shortener");
        const collection = db.collection("urls");
        const doc = await collection.findOne({ short_url: shortURL });
        return doc;
    } catch (err) {
        console.log(err.stack);
    }
}
