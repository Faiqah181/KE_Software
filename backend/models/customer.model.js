import mongoose from 'mongoose';
import AccountModel from './account.model.js';

const customerSchema = mongoose.Schema({
    name: { type: String, required: true },
    fatherName: { type: String },
    cnic: { type: String },
    address: { type: String },
    mobile: { type: String },
    wallet: { type: Number },
    status: { type: String },
}, { collection: 'customers' });

const CustomerModel = mongoose.model('Customer', customerSchema);

CustomerModel.getAll = () => {
    return CustomerModel.find({});
}

CustomerModel.addCustomer = customer => {
    return customer.save();
}

CustomerModel.deleteByID = customer => {
            
    AccountModel.deleteMany({ customer: customer._id }).then(obj => {
        console.log("No. of Accounts deleted:", obj.deletedCount);
    });
    
    CustomerModel.findOneAndDelete({ _id: customer._id }).then(obj => {
        console.log("obj: ", obj);
        return 200;
    });
    return 500;
}

export default CustomerModel;