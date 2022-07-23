import express from "express";
import accountController from '../controllers/account.controller.js'

const accountRouter = express.Router();


accountRouter.get('/all', (req, res) => {
    accountController.getAll(req, res);
});

accountRouter.get('/:id', (req, res) => {
    accountController.getByID(req, res, req.params.id);
});

accountRouter.post('/add', (req, res) => {
    accountController.addAccount(req, res);
});

accountRouter.delete('/delete', (req, res) => {
    accountController.deleteAccount(req, res);
});


export default accountRouter;