const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create reply schema & model
const ReplySchema = new Schema({
    memberID: {
        type: String
    },
    circularID: {
        type: String
    },
    replyOption: {
        type: Array,
        default: null
    },
    replyInput: {
        type: Array,
        default: null
    }
});

const Reply = mongoose.model('reply', ReplySchema);

module.exports = Reply;