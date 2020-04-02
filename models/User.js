const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    dateReg: {type: Date, default: Date.now},
    dateLog: {type: Date, required: false, default: Date.now},
    status: {type: String, default: 'not blocked'},
    role: {type: String, default: 'user'},
});

module.exports = model('User', schema);