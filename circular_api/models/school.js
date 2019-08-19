const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create school schema & model
const SchoolSchema = new Schema({
    schoolName: {
        type: String,
        required: [true, 'Name field is required']
    },
    SchoolID: {
        type: String,
        required: [true, 'ID field is required']
    }
});

const School = mongoose.model('school', SchoolSchema);

module.exports = School;