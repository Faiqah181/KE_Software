import express from "express";
import userController from '../controllers/user.controller.js'

const userRouter = express.Router();


userRouter.post('/add', (req, res) => {
    userController.addUser(req, res);
});

userRouter.delete('/delete', (req, res) => {
    userController.deleteUser(req, res);
});

userRouter.patch('/:username', (req, res) => {
    userController.updatePassword(req, res);
});

export default userRouter;