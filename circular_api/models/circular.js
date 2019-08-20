const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create circular Schema & model
const CircularSchema = new Schema({
    CircularID: {
        type: String,
        required: [true, 'Name field is required']
    },
    Title: {
        type: String,
        required: [true, 'Password field is required']
    },
    Target_GruopID: {
        type: String,
        default: ""
    },
    Content: {
        type: JSON
    },
    Reply: {
        type: JSON
    }
});

const Circular = mongoose.model('member', CircularSchema);

module.exports = Circular;