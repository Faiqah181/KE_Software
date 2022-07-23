import mongoose from 'mongoose';
import Customer from '../models/customer.model.js'

const controller = {};

controller.getAll = async (_req, res) => {
    try {
        const customers = await Customer.getAll();
        res.send(customers);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.getByID = async (_req, res, id) => {
    try {
        const customer = await Customer.findById(mongoose.Types.ObjectId(`${id}`));
        res.send(customer);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.addCustomer = async (req, res) => {
    const customerToAdd = Customer(req.body);
    try {
        const addedCustomer = await Customer.addUser(customerToAdd);
        res.send(json(addedCustomer));
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.deleteCustomer = async (req, res) => {
    const customer = req.body;
    try {
        await Customer.deleteByID(customer);
        res.sendStatus(200);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

export default controller;