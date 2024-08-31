import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    accountNum: { type: String, required: true, unique: true },
    item: { type: String, required: true },
    cost: { type: Number, min: 0 },
    retailPrice: { type: Number, min: 0 },
    installmentPrice: { type: Number, min: 0 },
    advance: { type: Number, min: 0 },
    discount: { type: Number, min: 0 },
    openingBalance: Number,
    balance: Number,
    dateOfSale: Date,
    closed: Boolean,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    monthlyPayments: [{
        year: Number,
        month: Number,
        payment: Number
    }]
}, { collection: 'accounts' });

const AccountModel = mongoose.model('Account', accountSchema);

AccountModel.getAll = () => {
    return AccountModel.find({}).populate('customer');
}

AccountModel.addAccount = account => {
    return account.save();
}

AccountModel.deleteByID = account => {
    return AccountModel.findOneAndDelete({ _id: account._id }).then(obj => {
        console.log("Account deleted:", obj.id);
    });
}


export default AccountModel;
