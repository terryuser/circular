const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create circular Schema & model
const CircularSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Password field is required']
    },
    target_GruopID: {
        type: Array,
        default: ""
    },
    content: {
        type: JSON
    },
    replyMethod: {
        type: String
    },
    replyOption: {
        type: Array
    }
});

const Circular = mongoose.model('circular', CircularSchema);

module.exports = Circular;