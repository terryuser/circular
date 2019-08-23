const express = require('express');
const router = express.Router();
const Circular = require('../models/circular');
const School = require('../models/school');
const Group = require('../models/group');
const Member = require('../models/member')

const path = require('path');

var sendJson;

//Add school
router.post('/create/school', function(req, res, next) {

    sendJson = { message: "" }
    
    School.findOne({ schoolName: req.body.schoolName }, function(err, result) {
        if (result != null) {
            console.log("Duplicate");
            sendJson.message = "Duplicate";
            res.send(sendJson);
        } else {
            School.create(req.body).then(function(school) {
                console.log(school);

                var groupData;

                //Create admin group
                var schoolAdmin = {"name":"admin","authorityLevel":1,"schoolID":school._id};

                Group.create(schoolAdmin).then(function(group) {
                    groupData = group._id;
                    console.log(groupData);

                    //Create member for login
                    var adminID = "admin_" + school._id;
                    var schoolAdminAccount = {"userID": adminID, "groupID":groupData, "loginName": adminID, "loginPW": "admin", "lastOnline": ""};
                    console.log(schoolAdminAccount);

                    Member.create(schoolAdminAccount).then(function(member) {
                        sendJson.message = "success";
                        res.send(sendJson);
                    }).catch(next);
                }).catch(next);

            })
        }
        
    });
});

//Get school info
router.post('/school/:loginID', function(req, res, next) {

    sendJson = { message: "", id: "" }

    School.findOne({ loginID: req.params.loginID }, function(err, result) {
        if (result) {
            res.send(result);
        }
    });
    
});

//Get school group
router.post('/group/:schoolID', async function(req, res, next) {

    Group.find({ schoolID: req.params.schoolID }, function(err, groupData) {
        if (groupData) {
            sendJson = { "message": "", "result": groupData};
            sendJson.message = "success";
            res.send(sendJson);
        } else {
            sendJson.message = "Not found";
            res.send(sendJson);
        }
    });

});

//Add member
router.post('/create/circular', function(req, res, next) {

    sendJson = { message: "" }

    Circular.create(req.body).then(function(member) {
        sendJson.message = "success";
        console.log(sendJson);
        res.send(sendJson);
    }).catch(next);
    
});

//Login
router.post('/login', function(req, res, next) {

    sendJson = { message: "", name: "", ID: "" }

    Member.findOne({ loginName: req.body.loginName }, function(err, result) {

        if (result != null) {

            console.log("Password on DB: " + result.loginName + "      Input PW: " + req.body.loginPW);

            if (req.body.loginPW == result.loginPW) {
                sendJson.name = result.loginName;
                sendJson.ID = result._id;
                sendJson.message = "LoginSuccess";
                console.log(sendJson);
                res.send(sendJson);
            } else {
                sendJson.message = "LoginFailed";
                console.log(sendJson);
                res.send(sendJson);
            }

        } else {
            sendJson.message = "LoginFailed";
            console.log("request account is not exist");
            res.send(sendJson);
        }
    });
    
});

//Add circular
router.post('/create/circular', function(req, res, next) {

    sendJson = { message: "" }

    Circular.create(req.body).then(function(circular) {
        sendJson.message = "success";
        console.log(sendJson);
        res.send(sendJson);
    }).catch(next);
    
});



module.exports = router;