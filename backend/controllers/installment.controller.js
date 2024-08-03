import InstallmentModel from "../models/installment.model.js";
import AccountModel from '../models/account.model.js';
import CustomerModel from "../models/customer.model.js";
import mongoose from "mongoose";
import functions from  "../init.js"

const controller = {}

controller.getByMonthYear = async (req, res) => {

    try {
        const y = req.params.year
        const data = await InstallmentModel.find({ year: y });
        res.send(data[0]?.months[req.params.month]);
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.sendStatus(500);
    }
}

function findMonthPayment(monthRecord, customerId) {

    let sum = 0;

    for (const r of monthRecord.dailyRecord) {
        for (const p of r.customerRecord) {

            const x = new mongoose.Types.ObjectId(p.customer);
            if (x.equals(customerId)) {
                sum += p.amount
            }
        }
    }

    return sum;
}

const updateAccountsAndCustomer = async (customer, currentAccounts, newSum) => {

    if (customer.status === "defaulter") {
        await CustomerModel.findOneAndUpdate({ _id: customer._id }, { status: "current" })
    }
    for (let a = 0; a < currentAccounts.length; a++) {

        let monthlyRecord = currentAccounts[a].monthlyPayments
        let lastMonth;
        let payment = 0;

        if (monthlyRecord.length != 0) {
            lastMonth = monthlyRecord[monthlyRecord.length - 1]
        }

        if (currentAccounts[a].balance > newSum) {
            const newBalance = currentAccounts[a].balance - newSum;
            payment += newSum;
            await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { balance: newBalance });
            newSum = 0;
        }
        else {
            payment += currentAccounts[a].balance
            await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { balance: 0, closed: true });
            newSum = newSum - currentAccounts[a].balance;
            currentAccounts[a].balance = 0
        }
        if (a == (currentAccounts.length - 1) && currentAccounts[a].balance === 0) {
            await CustomerModel.findOneAndUpdate({ _id: customer._id }, { status: "inactive" })
        }

        const currentMonthDetail = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            payment: payment
        }

        if (lastMonth?.month === new Date().getMonth()) {
            currentMonthDetail.payment += lastMonth.payment
            monthlyRecord[monthlyRecord.length - 1] = currentMonthDetail
        }
        else {
            monthlyRecord[monthlyRecord.length] = currentMonthDetail
        }

        await AccountModel.findOneAndUpdate({ _id: currentAccounts[a]._id }, { monthlyPayments: monthlyRecord })

    }

    if (newSum > 0) {
        const walletPrice = customer.wallet + newSum;
        await CustomerModel.findOneAndUpdate({ _id: customer._id }, { wallet: walletPrice, status: 'inactive' })
    }
}

controller.addMonthlyRecord = async (req, res) => {

    try {

        const record = req.body;
        const localRecord = await InstallmentModel.find({ "year": new Date().getFullYear() });
        const currentCustomers = await CustomerModel.find({});

        const customerFunction = async (c) => {

            const currentAccounts = await AccountModel.find({ customer: c._id, closed: false });

            //find previous received payments
            let prevSum = 0;
            if (localRecord.length) {
                const localMonthRecord = localRecord[0].months[new Date().getMonth()];
                prevSum = localMonthRecord ? findMonthPayment(localMonthRecord, c._id) : 0;
            }
            //find current received payments
            let currentSum = findMonthPayment(record, c._id);

            //new Payment received this month
            let newSum = currentSum - prevSum;

            //Update Accounts and Customer balance/status/wallet
            if (newSum > 0) {
                await updateAccountsAndCustomer(c, currentAccounts, newSum);
            }

        }

        const promises = currentCustomers.map(customerFunction)
        await Promise.all(promises)

        //save record
        if(!localRecord[0]){
            localRecord[0] = {
                year: new Date().getFullYear(),
                months: []
            }
            localRecord[0].months = Array.apply(null,Array(12)).map(a=>null) 
            localRecord[0].months[new Date().getMonth()] = record
            let r = await InstallmentModel(localRecord[0])
            res.send(await r.save())
        }
        else {
            localRecord[0].months[new Date().getMonth()] = record
            const r = await InstallmentModel.findOneAndUpdate({ "year": new Date().getFullYear() }, { "months": localRecord[0].months })
            res.send(r)
        }
        
        //update customers status
        await functions.updateCustomerStatus();
    }
    catch (e) {

        console.error(`Error: ${e}`);
        res.sendStatus(500);

    }
}

export default controller;
