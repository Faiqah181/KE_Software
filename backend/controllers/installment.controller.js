import InstallmentModel from "../models/installment.model.js";
import AccountModel from '../models/account.model.js';
import CustomerModel from "../models/customer.model.js";
import mongoose from "mongoose";

const controller = {}

controller.getByMonthYear = async (req, res) => {

    try {
        const data = InstallmentModel.find({ "year": req.params.year }, { month: { $slice: [localMonth, 1] } });
        res.send(data);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

controller.getByCustomer = async (req, res) => {

    try {
        //
    }
    catch (e) {
        console.error(`Error: ${e}`)
        res.sendStatus(500);
    }
}

function findMonthPayment(monthRecord, customerId) {

    let sum = 0;
    (monthRecord.dailyRecord).forEach(r => {
        (r.customerRecord).forEach(p => {

            const x = mongoose.Types.ObjectId(p.customer);
            if (x.equals(customerId)) {
                sum = sum + p.amount
            }
        })
    })

    return sum;
}

controller.addMonthlyRecord = async (req, res) => {
    let record;
    try {

        record = req.body;

        const localMonth = new Date().getMonth();
        const localYear = new Date().getFullYear();

        const localRecord = await InstallmentModel.find({ "year": localYear });

        let localMonthRecord;
        if (localRecord) {
            localMonthRecord = localRecord[0].months[localMonth];
        }
        const currentCustomers = await CustomerModel.find({});

        (currentCustomers).forEach(async (c) => {

            const currentAccounts = await AccountModel.find({ customer: c._id, closed: false });

            let prevSum = 0;
            if (localMonthRecord != null || localMonthRecord != undefined) {
                prevSum = findMonthPayment(localMonthRecord, c._id);
            }
            let currentSum = findMonthPayment(record, c._id);
            let newSum = currentSum - prevSum;


            //update account balance, change close status, update customer status
            for (let a = 0; a < currentAccounts.length; a++) {

                if (currentAccounts[a].balance > newSum) {
                    const newBalance = currentAccounts[a].balance - newSum;
                    await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { balance: newBalance });
                    newSum = newSum - currentAccounts[a].balance;
                }
                else if (currentAccounts[a].balance <= newSum) {
                    await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { balance: 0, closed: true });
                    newSum = newSum - currentAccounts[a].balance;
                }
                if (a == (currentAccounts.length - 1) && newSum == 0) {
                    await CustomerModel.findOneAndUpdate({ _id: c._id }, { status: "former" })
                }

            }

            //update wallet
            if (newSum > 0) {
                const walletPrice = c.wallet + newSum;
                await CustomerModel.findOneAndUpdate({ _id: c._id }, { wallet: walletPrice, status: 'former' })
            }

        })

        //save record
        localRecord[0].months[localMonth] = record
        const r = await InstallmentModel.findOneAndUpdate({ "year": localYear }, { "months": localRecord[0].months })
        res.send(r)
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

export default controller;
