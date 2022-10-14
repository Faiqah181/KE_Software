import express from "express";
import customerController from '../controllers/customer.controller.js'

const customerRouter = express.Router();

customerRouter.get('/', (_req, res) => {
    //TODO
    //use or delete it
    res.send({})
});

customerRouter.get('/all', (req, res) => {
    customerController.getAll(req, res);
});

customerRouter.get('/:id', (req, res) => {
    customerController.getByID(req, res);
});

customerRouter.get('/type/current', (req, res) => {
    customerController.getCurrentCustomer(req, res);
});

customerRouter.get('/type/current/count', (req, res) => {
    customerController.getCurrentCustomerAmount(req, res);
});

customerRouter.get('/type/inactive', (req, res) => {
    customerController.getInactiveCustomer(req, res);
});

customerRouter.get('/type/defaulter', (req, res) => {
    customerController.getDefaulterCustomer(req, res);
});

customerRouter.get('/type/defaulter/count', (req, res) => {
    customerController.getDefaulterCustomerAmount(req, res);
});

customerRouter.post('/add', (req, res) => {
    customerController.addCustomer(req, res);
});

customerRouter.delete('/delete', (req, res) => {
    customerController.deleteCustomer(req, res);
});



export default customerRouter;