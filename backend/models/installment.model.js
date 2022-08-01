import mongoose from "mongoose";

const customerRecordSchema = mongoose.Schema({
    date: Date,
    customerRecord: [{
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        amount: { type: Number, min: 0 }
    }]
})

const monthlyRecordSchema = mongoose.Schema({
    dailyRecord: {
        type: [customerRecordSchema]
    }
})

const InstallmentSchema = mongoose.Schema({
    year: Number,
    months: {
        type: [monthlyRecordSchema]
    }
}, { collections: 'InstallmentRecord' });

const InstallmentModel = mongoose.model('InstallmentRecord', InstallmentSchema)


export default InstallmentModel