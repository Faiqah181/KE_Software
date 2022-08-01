import express from "express";
import installmentController from '../controllers/installment.controller.js'

const installmentRouter = express.Router();

installmentRouter.get('/:year/:month', (req, res) => {
    installmentController.getByMonthYear(req, res);
});

installmentRouter.post('/add', (req, res) => {
    installmentController.addMonthlyRecord(req, res);
});

export default installmentRouter;