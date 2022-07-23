import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {collection: 'users'});

const UserModel = mongoose.model('User', userSchema);


UserModel.getAll = () => {
    return UserModel.find({});
}

UserModel.addUser = user => {
    return user.save();
}

UserModel.deleteByID = user => {
    return UserModel.remove({_id: user._id});
}

export default UserModel;