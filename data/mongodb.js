const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL);

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String
});

const JobSchema = mongoose.Schema({
    title: String,
    description: String,
    locations: [{
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: "You must supply coordinates!"
        }],
        address: {
            type: String,
            required: "You must supply an address!"
        }
    }]
});

const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);

exports.User = User;
exports.Job = Job;