import config from "./config.js";
import express from "express";
import cors from "cors";
import functions from "./init.js"
import connectToDB from "./db/connect.js";
import Authentication from "./middlewares/Authentication.js";
import jwt from "jsonwebtoken";
import UserModel from "./models/user.model.js";

//Routers
import customerRouter from "./routes/customer.route.js";
import userRouter from "./routes/user.route.js";
import accountRouter from "./routes/account.router.js";
import installmentRouter from "./routes/installment.router.js";
import BackupRestoreRouter from "./routes/BackupRestoreRouter.js";

const app = express();
connectToDB();

await functions.initialize();

app.use(cors());
app.use(express.json());

app.listen(config.port, () => console.log(`Server listening at port ${config.port}`));

app.post("/api/login", async (req, res) => {

    const user = await UserModel.find({ userName: req.body.username })
    if (req.body.password) {
        if (req.body.password != user[0].password) {
            res.sendStatus(401);
        }
        else {
            const token = jwt.sign({ username: req.body.username }, config.ACCESS_TOKEN_KEY)
            res.status(200).send(token);
        }
    }

})

// --- Routers --- 
app.use('/api/customers/', customerRouter);
app.use('/api/users/', userRouter);
app.use('/api/accounts/', accountRouter);
app.use('/api/installments', installmentRouter);
app.use('/api', BackupRestoreRouter);

app.post("/api/update-user-credential", async (req, res) => {
    const x = await functions.updateUserCredential(req, res)
    res.sendStatus(x)
})
