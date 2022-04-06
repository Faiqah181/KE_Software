import config from "./config.js";
import express from "express";
const app = express();


const users = [
    {name: "Asad", username: "kamranasad7"},
    {name: "Faiqah", username: "faiqahshuaib"},
    {name: "Lallu", username: "lallu_legend"},
]


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
