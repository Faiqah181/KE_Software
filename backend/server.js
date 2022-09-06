import config from "./config.js";
import express from "express";
import cors from "cors";
import functions from "./init.js"
import connectToDB from "./db/connect.js";
import Authentication from "./middlewares/Authentication.js";
import jwt from "jsonwebtoken";
import backupDB from "./db/backupDB.js";
import restoreDb from "./db/restoreDb.js";
import MongoBackup from "./db/MongoBackup.js";
//Routers
import customerRouter from "./routes/customer.route.js";
import userRouter from "./routes/user.route.js";
import accountRouter from "./routes/account.router.js";
import installmentRouter from "./routes/installment.router.js";

const app = express();
connectToDB();

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

//app.use(Authentication)

// --- Routers --- 
app.use('/api/customers/', customerRouter);
app.use('/api/users/', userRouter);
app.use('/api/accounts/', accountRouter);
app.use('/api/installments', installmentRouter);

app.post("/api/backup", async (req, res) => {
    //new Date().toISOString().split('T')[0]; TODO....allow multiple backups using date of backup
    const mongoBackup = new MongoBackup("KE");
    mongoBackup.backup("./backups", "new-backup", res);
})

app.post("/api/restore", async (req, res) => {
    const mongoBackup = new MongoBackup("KE");
    mongoBackup.restore("./backups", "new-backup", res);
})

app.get("/api/user-credential/:username", async (req, res) => {
    const x = await functions.getUserCredential(req.params.username)
    res.send(x)
})
