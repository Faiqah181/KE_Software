import mongoose from "mongoose";
import User from "../models/user.model.js";

const controller = {}


controller.addUser = async (req, res) => {
    
    try {
        const userToAdd = User(req.body);
        const addedUser = await User.addUser(userToAdd);
        res.send(json(addedUser));
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.deleteUser = async (req, res) => {
    
    try {
        const user = req.body;
        await User.deleteByID(user);
        res.sendStatus(200);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.updatePassword = async(req, res) => {
    try {
        const user = await User.find({userName: req.params.username});
        if (user.password === req.body.currentPassword) {
            user.password = req.body.newPassword;
            await user.save();
            res.sendStatus(200);
        }
        else{
            res.sendStatus(403);
        }
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

export default controller;