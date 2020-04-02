const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type:String, required: true},
    tags: [{type:String, required: false}],
    dateAdd: {type:Date, default: Date.now},
    likes: [{userId: {type: String}}],
    custom_fields: [{ name: {type: String}, type: {type: String}, value: {type: String} }],
    ownCol: { type: Types.ObjectId, ref: 'Collections', required: true },
});

module.exports = model('Items', schema);