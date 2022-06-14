import config from "./config.js";
import express from "express";
import cors from "cors";
import functions from "./init.js"

const app = express();

await functions.initialize();

app.use(cors());
app.use(express.json());
app.listen(config.port,() => console.log(`Server listening at port ${config.port}`));


app.get("/api/users", async (req, res) => {
    const users = await functions.getCollection("users");
    console.log(users);
    res.send(users);
});

app.get("/api/customers", async (req, res) => {
    const customers = await functions.getCollection("customers");
    res.send(customers);
});

app.get("/api/accounts", async (req, res) => {
    const accounts = await functions.getCollection("accounts");
    res.send(accounts);
});

app.get("/api/inventory", async (req, res) => {
    const inventory = await functions.getCollection("inventory");
    res.send(inventory);
});

app.get("/api/dailyInstallments", async (req, res) => {
    const dailyInstallments = await functions.getCollection("dailyInstallments");
    res.send(dailyInstallments);
});

app.post("/api/customers", async (req, res) => {
    let statusCode = await functions.insertDocument("customers", req.body)
    res.sendStatus(statusCode)
});

app.post("/api/accounts", async (req, res)=>{
    let statusCode = await functions.insertDocument("accounts", req.body)
    console.log(statusCode)
    res.sendStatus(statusCode)
});

app.post("/api/daily-records", async (req, res)=>{
    let statusCode = await functions.updateDailyRecord(req.body)
    console.log(statusCode)
    res.sendStatus(statusCode)
})

app.get("/api/daily-records/:year/:month", async (req, res)=>{
    const records = await functions.getDailyRecord(req.params.year, req.params.month)
    res.send(records)
})

app.get("/api/monthly-records/:year/:month/:customerId", async (req, res)=>{
    const amount = await functions.getMonthlyBalance(req.params.customerId,req.params.year, req.params.month)
    res.send(String(amount))
})

app.get("/api/update-monthly-record/:customerId", async (req, res)=>{
    const x = await functions.monthlyUpdateAccount(req.params.customerId)
    res.send(x)
})
