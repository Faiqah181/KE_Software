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
  catch (e) {
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
  return (index == -1) ? false : true;
}

const createCollection = async (collectionName) => {

  if (!collectionExist(collectionName)) {
    await database.createCollection(collectionName)
    console.log("Collection created")
  }
  else {
    console.log("Collection already exist")
  }

}

const insertDocument = async (collectionName, document) => {

  try {
    if (collectionExist(collectionName)) {
      await database.collection(collectionName).insertOne(document);
      console.log("document inserted")
      return 200
    }
    else {
      console.log("Collection doesn't exist")
      return 503
    }
  } catch (e) {
    console.log(e);
    return 500
  }

}

const getCollection = async (collectionName) => {
  try {
    if (collectionExist(collectionName)) {
      const col = await database.collection(collectionName).find();
      return (await col.toArray());
    }
  } catch (e) {
    console.log(e)
  }

}

const updateDailyRecord = async (record) => {

  try {
    console.log(record)
    if (collectionExist("dailyInstallments")) {
      await database.collection("dailyInstallments").updateOne({ year: record.year },
        { $set: { [`month.${record.month}`]: record.data } },
        {
          upsert: true
        }
      );
      //console.log(record)
      return 200
    }
  } catch (e) {
    console.log(e);

  }

}

const getDailyRecord = async (y, m) => {

  try {
    const record = await database.collection("dailyInstallments").find({ "year": parseInt(y) }).toArray()
    const result = await record

    return (result[0].month[`${m}`] ? result[0].month[`${m}`] : { [`${m}`]: {} })
  }
  catch (e) {
    console.log(e)
  }
}

const getMonthlyBalance = async (customerId, y, m) => {

  try {
    let totalAmount = 0
    const monthAllRecords = await getDailyRecord(y, m)
    if (monthAllRecords) {

      const vals = Object.keys(monthAllRecords).map(key => monthAllRecords[key]);

      vals.forEach(day => {
        const dayRecords = Object.keys(day).map(key => {
          if (key === customerId) {
            return day[key];
          }
        });
        dayRecords.forEach(v => {
          if (v) {
            totalAmount += parseInt(v)
          }
        });
      });
    }

    return totalAmount

  } catch (e) {
    console.log(e)
  }


}

const monthlyUpdateAccount = async (customerId) => {
  try {
    const acc = await database.collection("accounts").find({ "customer_id": `${customerId}`, closed: false }).toArray()
    let m = new Date().toLocaleString('default', { month: 'long' });
    const b = await getMonthlyBalance(customerId, new Date().getFullYear(), m);
    let balance = b

    for (let index = 0; index < acc.length && balance != 0; index++) {
      console.log(acc[index])
      if (acc[index]['balance'] >= balance) {
        let temp = acc[index]['balance'] - balance;
        await database.collection("accounts").updateOne({ '_id': acc[index]['_id'] }, { $set: { 'balance': `${temp}` } })
        balance = 0
      }
      else {
        await database.collection("accounts").updateOne({ '_id': acc[index]['_id'] }, { $set: { 'balance': 0 } })
        balance = balance - acc[index]['balance']
      }

    }

    return acc
  }
  catch (e) {
    console.log(e)
  }
}

const getUserCredential = async (userName) => {

  try{
      const u = await database.collection("users").find({"user_name": `${userName}`}).toArray()
      if(u){
        return u[0]["password"]
      }
  }
  catch(e){
    console.log(e)
  }

}

const updatePassword = async (userName, password) => {

  try{
    await database.collection("users").updateOne({"user_name": `${userName}`}, {$set : {"password": `${password}`}})
    return 200
  }
  catch(e){
    console.log(e)
    return 401
  }

}

export default {
  initialize,
  insertDocument,
  getCollection,
  updateDailyRecord,
  getDailyRecord,
  getMonthlyBalance,
  monthlyUpdateAccount,
  getUserCredential,
  updatePassword
};