import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
    name: {type: String, required: true},
    fatherName: {type: String},
    cnic: {type: String},
    address: {type: String},
    mobile: {type: String},
    wallet: {type: Number},
    status: {type: String},
}, {collection: 'customers'});

const CustomerModel = mongoose.model('Customer', customerSchema);

CustomerModel.getAll = () => {
    return CustomerModel.find({});
}

CustomerModel.addUser = customer => {
    return customer.save();
}

CustomerModel.deleteByID = customer => {
    return CustomerModel.remove({_id: customer._id});
}

export default CustomerModel;