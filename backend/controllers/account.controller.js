import { BSONTypeError } from 'bson';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import Account from '../models/account.model.js'
import CustomerModel from '../models/customer.model.js'

const controller = {};

controller.getAll = async (_req, res) => {
    try {
        const customers = await Account.getAll();
        res.send(customers);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.getByID = async (_req, res, id) => {
    try {
        const customer = await Account.findById(mongoose.Types.ObjectId(`${id}`)).populate('customer');
        if (customer) {
            res.send(customer);
        }
        else res.sendStatus(404);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        if (e instanceof BSONTypeError) {
            res.sendStatus(404);
        }
        else res.sendStatus(500);
    }
}

controller.addAccount = async (req, res) => {

    try {
        const accountToAdd = Account(req.body.account);
        let addedAccount = await Account.addAccount(accountToAdd);
        await CustomerModel.findOneAndUpdate({ _id: accountToAdd.customer }, { status: "current", wallet: req.body.wallet })
        addedAccount = await addedAccount.populate('customer');
        res.send(addedAccount);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        if (e instanceof MongoServerError && e.code === 11000) {
            res.status(409).send({ message: "Account Number already exists. Duplicate account numbers are not allowed." })
        }
        else res.sendStatus(500);
    }
}

controller.deleteAccount = async (req, res) => {
    const account = req.body;
    try {
        await Account.deleteByID(account);
        res.sendStatus(200);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

export default controller;