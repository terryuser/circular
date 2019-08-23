const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create member Schema & model
const MemberSchema = new Schema({
    userID: {
        type: String,
        required: [true, 'User ID field is required']
    },
    groupID: {
        type: String,
        default: "null"
    },
    loginName: {
        type: String,
        default: "null"
    },
    loginPW: {
        type: String,
        default: "null"
    },
    email: {
        type: String
    },
    lastOnline: {
        type: Date
    }
});

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;