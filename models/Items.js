const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type:String, required: true},
    tags: [{type:String}],
    dateAdd: {type:Date, default: Date.now},
    likes: [{type: String}],
    custom_fields: [{ name: {type: String}, type: {type: String}, value: {type: String, default: ""} }],
    ownCol: { type: Types.ObjectId, ref: 'Collections', required: true },
});

schema.index({tags: "text", name: "text"});
module.exports = model('Items', schema);