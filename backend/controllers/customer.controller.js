import mongoose from 'mongoose';
import CustomerModel from '../models/customer.model.js';
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

controller.getByID = async (req, res) => {
    try {
        const id = req.params.id
        const customer = await Customer.findById(mongoose.Types.ObjectId(`${id}`));
        res.send(customer);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.addCustomer = async (req, res) => {

    try {
        const customerToAdd = Customer(req.body);
        const addedCustomer = await Customer.addCustomer(customerToAdd);
        res.send(addedCustomer);
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

controller.updateCustomer = async (req, res) => {

    try {
        const customerId = req.params.id;
        const customer = req.body;
        await CustomerModel.findByIdAndUpdate(customerId, customer)
        res.sendStatus(200)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}

controller.getCurrentCustomer = async (req, res) => {
    try {
        const customer = await Customer.find({ status: "current" });
        res.send(customer);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.getInactiveCustomer = async (req, res) => {
    try {
        const customer = await Customer.find({ status: "inactive" });
        res.send(customer);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.getDefaulterCustomer = async (req, res) => {
    try {
        const customer = await Customer.find({ status: "defaulter" });
        res.send(customer);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.updateCustomerWallet = async (req, res) => {

    try {
        const customerId = req.body.customerId
        const walletAmount = req.body.walletAmount
        await CustomerModel.findByIdAndUpdate({ id: customerId }, { wallet: walletAmount })
        res.sendStatus(200)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}

controller.getCurrentCustomerAmount = async (req, res) => {
    try {
        const customer = await Customer.find({ status: "current" });
        res.send(customer.length + "");
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.getDefaulterCustomerAmount = async (req, res) => {
    try {
        const customer = await Customer.find({ status: "defaulter" });
        res.send(customer.length + "");
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

export default controller;