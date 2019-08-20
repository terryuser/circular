const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create member authority level schema & model
const GroupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    authorityLevel: {
        type: Number,
        required: [true, 'Authority level is required']
    },
    schoolID: {
        type: String,
        default: "null"
    }
});

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;