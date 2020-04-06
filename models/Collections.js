const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type:String, required: true},
    topic: {type:String, required: true},
    text: {type: String, required: true},
    dateCreate: { type: Date, default: Date.now },
    image: {type: String},
    custom_fields: [{ name: {type: String}, type: { type: String } }],
    owner: { type: Types.ObjectId, ref: 'User' },
    countItems: {type: Number, default: 0}
});

schema.index({name: "text", text: "text", topic: "text"});
module.exports = model('Collections', schema);