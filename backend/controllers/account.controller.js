import mongoose from 'mongoose';
import Account from '../models/account.model.js'

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
        res.send(customer);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.addAccount = async (req, res) => {
    
    try {
        const accountToAdd = Account(req.body);
        const addedAccount = await Account.addAccount(accountToAdd);
        res.send(json(addedAccount));
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
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