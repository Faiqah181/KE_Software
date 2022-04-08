import config from "./config.js";
import express from "express";
import cors from "cors";

const app = express();


const users = [
    {name: "Asad", username: "kamranasad7"},
    {name: "Faiqah", username: "faiqahshuaib"},
    {name: "Lallu", username: "lallu_legend"},
    {name: "Lallu222", username: "lallu_legend"},
]

app.use(cors());
app.listen(config.port,() => console.log(`Server listening at port ${config.port}`));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/users", (req, res) => {
    res.send(users);
});

app.get("/about", (req, res) => {
    res.send("About route");
});
