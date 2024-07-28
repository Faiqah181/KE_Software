import Mongoose from 'mongoose';
Mongoose.Promise = global.Promise;

const connectToDB = async () => {
    try {
        await Mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log('Mongoose: Connected');
    }
    catch (e) {
        console.error('Mongoose: Failed to connect');
        console.log(e);
        process.exit(-1);
    }
}

export default connectToDB;