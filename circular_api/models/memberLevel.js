const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create member authority level schema & model
const MemberLevelSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    authorityLevel: {
        type: Number,
        required: [true, 'Authority level is required']
    },
    groupID: {
        type: String,
        default: "null"
    },
    schoolID: {
        type: String,
        default: "null"
    }
});

const MemberLevel = mongoose.model('member', MemberLevelSchema);

module.exports = MemberLevel;