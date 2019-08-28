const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create circular Schema & model
const CircularSchema = new Schema({
    schoolID: {
        type: String,
    },
    target_GruopID: {
        type: Array
    },
    title: {
        type: String,
        required: [true, 'Password field is required']
    },
    content: {
        type: JSON
    },
    replyMethod: {
        type: String
    },
    replyOption: {
        type: Array
    },
    replyInput: {
        type: Array
    },
    authorityRequest: {
        type: Number
    },
    createDate: {
        type: Date
    },
    releaseDate: {
        type: Date
    },
    signedMember: {
        type: Array
    }
});

const Circular = mongoose.model('circular', CircularSchema);

module.exports = Circular;