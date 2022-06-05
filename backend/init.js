import { MongoClient } from "mongodb";
import config from "./config.js";

const client = new MongoClient(config.mongoUrl)
let database = {};

const initialize = async () => {
  try {
    await client.connect();
    database = await client.db(config.dbName);
    console.log("Connection established")
    createCollection("accounts")
    createCollection("customers")
    createCollection("dailyInstallments")
    createCollection("inventory")
    createCollection("users")
  }
  catch(e){
    console.log(e);
  }
}

const collectionExist = async (collectionName) => {
  const collectionsList = await client.db("KE").listCollections({}, { nameOnly: true });
  let AllcollectionNames = []

  collectionsList.forEach(element => {
    AllcollectionNames.push(element.name);
  });

  const index = AllcollectionNames.indexOf(collectionName)
  return (index == -1) ? false : true ; 
}

const createCollection = async (collectionName) => {

  if (!collectionExist(collectionName)) {
    await database.createCollection(collectionName)
    console.log("Collection created")
  }
  else{
    console.log("Collection already exist")
  }

}

const insertDocument = async (collectionName, document) => {
  
  try{
    if(collectionExist(collectionName)){
      await database.collection(collectionName).insertOne(document);
      console.log("document inserted")
      return 200
    }
    else{
      console.log("Collection doesn't exist")
      return 503
    }
  }catch ( e ){
      console.log(e);
      return 500
  }

}

const getCollection = async (collectionName) => {
  try{
    if(collectionExist(collectionName)) {
      const col = await database.collection(collectionName).find();
      return (await col.toArray());
    }
  }catch (e){
    console.log(e)
  }

}

export default {
  initialize,
  insertDocument,
  getCollection
};