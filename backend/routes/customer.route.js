import express from "express";
import customerController from '../controllers/customer.controller.js'

const customerRouter = express.Router();

customerRouter.get('/', (_req, res) => {
    //TODO
    //use or delete it
    res.send({ })
});

customerRouter.get('/all', (req, res) => {
    customerController.getAll(req, res);
});

customerRouter.get('/:id', (req, res) => {
    customerController.getByID(req, res, req.params.id);
});

customerRouter.post('/add', (req, res) => {
    customerController.addCustomer(req, res);
});

customerRouter.delete('/delete', (req, res) => {
    customerController.deleteCustomer(req, res);
});


export default customerRouter;