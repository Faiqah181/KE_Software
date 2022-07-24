import config from "./config.js";
import express from "express";
import cors from "cors";
import functions from "./init.js"
import connectToDB from "./db/connect.js";
import Authentication from "./middlewares/Authentication.js"
import jwt from "jsonwebtoken"

//Routers
import customerRouter from "./routes/customer.route.js";
import userRouter from "./routes/user.route.js";
import accountRouter from "./routes/account.router.js";

const app = express();

await functions.initialize();

app.use(cors());
app.use(express.json());

app.listen(config.port, () => console.log(`Server listening at port ${config.port}`));

app.post("/api/login", async (req, res) => {

    const pass = await functions.getUserCredential(req.body.username)
    if (req.body.password) {
        if (req.body.password != pass) {
            res.sendStatus(401);
        }
        else {
            const token = jwt.sign({ username: req.body.username }, config.ACCESS_TOKEN_KEY)
            res.status(200).send(token);
        }
    }

})

app.use(Authentication)

// --- Routers --- 
app.use('/api/customers/', customerRouter);
app.use('/api/users/', userRouter);
app.use('/api/accounts/', accountRouter);


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

app.get("/api/dailyInstallments", async (req, res) => {
    const dailyInstallments = await functions.getCollection("dailyInstallments");
    res.send(dailyInstallments);
});

app.post("/api/customers", async (req, res) => {
    let statusCode = await functions.insertDocument("customers", req.body)
    res.sendStatus(statusCode)
});

app.post("/api/accounts", async (req, res) => {
    let statusCode = await functions.insertDocument("accounts", req.body)
    console.log(statusCode)
    res.sendStatus(statusCode)
});

app.post("/api/daily-records", async (req, res) => {
    let statusCode = await functions.updateDailyRecord(req.body)
    console.log(statusCode)
    res.sendStatus(statusCode)
})

app.get("/api/daily-records/:year/:month", async (req, res) => {
    const records = await functions.getDailyRecord(req.params.year, req.params.month)
    res.send(records)
})

app.get("/api/monthly-records/:year/:month/:customerId", async (req, res) => {
    const amount = await functions.getMonthlyBalance(req.params.customerId, req.params.year, req.params.month)
    res.send(String(amount))
})

app.get("/api/update-monthly-record/:customerId", async (req, res) => {
    const x = await functions.monthlyUpdateAccount(req.params.customerId)
    res.send(x)
})

app.get("/api/user-credential/:username", async (req, res) => {
    const x = await functions.getUserCredential(req.params.username)
    res.send(x)
})

app.post("/api/user-credential/:username/:password", async (req, res) => {
    let statusCode = await functions.updatePassword(req.params.username, req.params.password)
    res.sendStatus(statusCode)
})

connectToDB();
