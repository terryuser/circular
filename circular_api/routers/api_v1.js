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

    sendJson = { message: "", loginID: "" }
    
    School.findOne({ schoolName: req.body.schoolName }, function(err, result) {
        if (result != null) {
            console.log("School Name Duplicate");
            sendJson.message = "School Name Duplicate";
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
                    var schoolAdminAccount = {"userID": adminID, "groupID":groupData, "loginName": adminID, "loginPW": "admin","email": req.body.email, "lastOnline": ""};
                    console.log(schoolAdminAccount);

                    Member.create(schoolAdminAccount).then(function(member) {
                        sendJson.message = "success";
                        sendJson.loginID = member.loginName;
                        res.send(sendJson);
                    }).catch(next);
                }).catch(next);

            })
        }
        
    });
});

//Get school info
router.post('/findGrouplist/:userID', function(req, res, next) {
    
    var sendJson;

    Member.findOne({ userID: req.params.userID }, function(err, result) {
        if (result) {
            var group = result.groupID;

            Group.findOne({ _id: group }, function(err, resultJson) {
                console.log(resultJson);
                if (resultJson) {
                    Group.find({ schoolID: resultJson.schoolID, authorityLevel: { $gte: resultJson.authorityLevel } }, function(err, groupData) {
                        if (groupData) {
                            sendJson = { "message": "", "result": groupData, "authority": resultJson.authorityLevel};
                            sendJson.message = "success";
                            res.send(sendJson);
                        } else {
                            sendJson.message = "Not found";
                            res.send(sendJson);
                        }
                    });
                }
            });
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
                sendJson.ID = result.userID;
                sendJson.message = "LoginSuccess";
                console.log(sendJson);
                res.send(sendJson);
            } else {
                sendJson.message = "Login failed";
                console.log(sendJson);
                res.send(sendJson);
            }

        } else {
            sendJson.message = "Login failed, account is not exist";
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