import InstallmentModel from "../models/installment.model.js";
import AccountModel from '../models/account.model.js';
import CustomerModel from "../models/customer.model.js";
import mongoose from "mongoose";

const controller = {}
const localMonth = new Date().getMonth();
const localYear = new Date().getFullYear();

controller.getByMonthYear = async (req, res) => {

    try {
        const data = InstallmentModel.find({ "year": req.params.year }, { months: { $slice: [req.params.month, 1] } });
        res.send(data);
    }
    catch (e) {
        console.error(`Error: ${e}`);
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

const updateAccountsAndCustomer = async (customerId, currentAccounts, newSum) => {

    for (let a = 0; a < currentAccounts.length; a++) {

        let monthlyRecord = currentAccounts[a].monthlyPayments
        let lastMonth;
        let payment = 0;

        if (monthlyRecord.length != 0) {
            lastMonth = monthlyRecord[monthlyRecord.length - 1]
            if (lastMonth.month === localMonth && lastMonth.year === localYear) {
                payment = lastMonth.payment
            }
        }

        if (currentAccounts[a].balance > newSum) {
            const newBalance = currentAccounts[a].balance - newSum;
            payment += newSum;
            await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { balance: newBalance });
            newSum = newSum - currentAccounts[a].balance;
        }
        else {
            payment += currentAccounts[a].balance
            await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { balance: 0, closed: true });
            newSum = newSum - currentAccounts[a].balance;
        }
        if (a == (currentAccounts.length - 1) && newSum === 0) {
            await CustomerModel.findOneAndUpdate({ _id: customerId }, { status: "former" })
        }

        const currentMonthDetail = {
            year: localYear,
            month: localMonth,
            payment: payment
        }
        
        if (lastMonth.month === localMonth && lastMonth.year === localYear) {
            monthlyRecord[monthlyRecord.length - 1] = currentMonthDetail
        }
        else{
            monthlyRecord[monthlyRecord.length] = currentMonthDetail
        }
        
        await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { monthlyPayments: monthlyRecord })

    }

    if (newSum > 0) {
        const walletPrice = c.wallet + newSum;
        await CustomerModel.findOneAndUpdate({ _id: c._id }, { wallet: walletPrice, status: 'former' })
    }
}

controller.addMonthlyRecord = async (req, res) => {

    let record;
    let localMonthRecord;

    try {

        record = req.body;
        const localRecord = await InstallmentModel.find({ "year": localYear });
        const currentCustomers = await CustomerModel.find({});

        const customerFunction = async (c) => {

            const currentAccounts = await AccountModel.find({ customer: c._id, closed: false });

            //find previous received payments
            let prevSum = 0;
            if (localRecord) {
                localMonthRecord = localRecord[0].months[localMonth];
                prevSum = findMonthPayment(localMonthRecord, c._id);
            }
            //find current received payments
            let currentSum = findMonthPayment(record, c._id);

            //new Payment received this month
            let newSum = currentSum - prevSum;

            //Update Accounts and Customer balance/status/wallet
            await updateAccountsAndCustomer(c._id, currentAccounts, newSum);

        }

        const promises = currentCustomers.map(customerFunction)
        await Promise.all(promises)

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
