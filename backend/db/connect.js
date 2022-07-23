import Mongoose from 'mongoose';
import config from '../config.js'
Mongoose.Promise = global.Promise;

const connectToDB = async () => {
    try {
        await Mongoose.connect(`${config.mongoUrl}/${config.dbName}`);
        console.log('Mongoose: Connected');
    }
    catch (e) {
        console.error('Mongoose: Failed to connect');
        console.log(e);
    }
}

export default connectToDB;