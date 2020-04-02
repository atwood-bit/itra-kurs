const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type:String, required: true},
    text: {type: String, required: true},
    dateAdd: {type:Date, default: Date.now},
    itemId: { type: Types.ObjectId, ref: 'Items' },
});

module.exports = model('Comments', schema);